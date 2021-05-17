#include "database.h"

Database::Database()
{
}

void Database::readFiles()
{
  if (SD.cardType() == CARD_NONE)
    return;
  // re-open the file for reading:
  file = SD.open("/badge.csv");
  if (file)
  {
    Serial.println("badge:");
    while (file.available())
    {
      Serial.write(file.read());
    }
    file.close();
  }
  else
  {
    Serial.println("No badge file found");
  }
  file = SD.open("/schedule.json");
  if (file)
  {
    Serial.println("/schedule.json");
    while (file.available())
    {
      Serial.write(file.read());
    }
    file.close();
  }
  else
  {
    Serial.println("No schedule file found");
  }
}

bool Database::authorize()
{
  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("By wifi");
    return requestAccess(rfid);
  }
  Serial.println("By Card");
  return authorizeRFID(rfid);
}

bool Database::requestAccess(char *rfid)
{
  strcpy(url, baseUrl);
  strcat(url, "access/");
  strcat(url, doorId);
  strcat(url, "/");
  strcat(url, rfid);

  http.begin(url);

  int httpResponseCode = http.GET();
  bool access = false;
  bool shouldAssignAccess = false;
  if (httpResponseCode == 200)
  {
    access = true;
  }
  else if (httpResponseCode == 128)
  {
    // response is to assign ID to badge:
    shouldAssignAccess = true;
  }
  http.end();
  if (shouldAssignAccess)
  {
    assignIdToBadge();
  }
  Serial.print("URL ");
  Serial.println(url);

  return access;
}
void Database::assignIdToBadge()
{
  strcpy(url, baseUrl);
  strcat(url, "access/add-badge");

  int httpResponseCode = http.GET();
  if (httpResponseCode == 200)
  {
    strcpy(rfid, http.getString().c_str());
    // TODO: write into RFID badge
  }
  http.end();
}

bool Database::setupDatabase()
{
  return setupSD();
  // return false;
}

bool Database::setupSD()
{
  Serial.print("Initializing SD card...");
  pinMode(SD_CS, OUTPUT);
  if (!SD.begin(SD_CS))
  {
    Serial.println("Card failed, or not present");
    return false;
  }

  Serial.println("card initialized.");
  return true;
}

void Database::downloadDatabase()
{
  Serial.println("Download");
  Serial.print(SD.cardType() == CARD_NONE);
  if (SD.cardType() == CARD_NONE)
    return;
  strcpy(url, baseUrl);
  strcat(url, "access/download/badge/");
  strcat(url, doorId);
  http.begin(url);
  http.GET();
  file = SD.open(F("/badge.csv"), FILE_WRITE);
  int status = http.writeToStream(&file);
  file << EOF;
  file.close();
  http.end();

  Serial.print("Downloaded badge status ");
  Serial.println(status);
  strcpy(url, baseUrl);
  strcat(url, "access/download/schedule/");
  strcat(url, doorId);
  http.begin(url);
  http.GET();
  file = SD.open(F("/schedule.json"), FILE_WRITE);
  status = http.writeToStream(&file);
  Serial.print("Downloaded schedules status ");
  Serial.println(status);

  file << EOF;
  file.close();
  http.end();
}

int Database::compareHours(int hourA, int minA, int hourB, int minB)
{
  return hourA == hourB ? minA - minB : hourA - hourB;
}

bool Database::authorizeRFID(char *rfid)
{
  int badgeLength = strlen(rfid);
  if (!badgeLength)
    return false;
  if (SD.cardType() == CARD_NONE)
    return false;

  file = SD.open(F("/badge.csv"), FILE_READ);
  bool lineFound;
  // finds the right line
  while (file.available())
  {
    lineFound = true;
    memset(fileLine, 0, sizeof(fileLine));
    file.readBytesUntil('\n', fileLine, 1024);
    if (strlen(fileLine) < badgeLength)
      continue;
    // checks if we are on the right line
    for (int i = 0; i < badgeLength; i++)
    {
      if (fileLine[i] != rfid[i])
      {
        lineFound = false;
        break;
      }
    }
    if (lineFound)
      break;
  }
  file.close();
  // we did not find the badge in the file
  if (!lineFound)
    return false;

  char *scheduleId = strchr(fileLine, ',') + 1;
  // read the schedule to authorize or not
  file = SD.open(F("/schedule.json"), FILE_READ);
  StaticJsonDocument<4048> jsonBuffer;
  deserializeJson(jsonBuffer, file);
  bool authorize = false;
  tm currentTime;
  getLocalTime(&currentTime);
  int day = (currentTime.tm_wday + 6) % 7;
  int hour = currentTime.tm_hour;
  int minute = currentTime.tm_min;
  JsonObject schedule = jsonBuffer[scheduleId]["days"][day];
  if (schedule["allDay"])
  {
    authorize = true;
  }
  JsonArray intervals = schedule["intervals"];
  for (JsonVariant interval : intervals)
  {
    int startHour = interval["start"]["HH"].as<int>();
    int endHour = interval["end"]["HH"].as<int>();
    int startMinute = interval["start"]["mm"].as<int>();
    int endMinute = interval["end"]["mm"].as<int>();

    authorize = authorize || (compareHours(startHour, startMinute, hour, minute) <= 0 && compareHours(hour, minute, endHour, endMinute) <= 0);
  }
  file.close();
  return authorize;
}