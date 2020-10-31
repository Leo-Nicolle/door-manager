#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <SD.h>

#define SD_CS 27

const char *ssid = "";
const char *password = "";
const char *baseUrl = "";
char *doorId = "";
char url[512];
char rfid[512];
char fileLine[1024];
HTTPClient http;
File database;
DynamicJsonDocument jsonBuffer(4096);
StaticJsonDocument<256> filter;
tm currentTime;

void readFiles(){
  // re-open the file for reading:
  database = SD.open("/badge.csv");
  if (database){
    Serial.println("badge:");
    while (database.available()){
      Serial.write(database.read());
    }
    database.close();
  }else{
    Serial.println("No badge file found");
  }
  database = SD.open("/schedule.json");
  if (database){
    Serial.println("/schedule.json");
    while (database.available()){
      Serial.write(database.read());
    }
    database.close();
  }
  else{
    Serial.println("No schedule file found");
  }
}
bool requestAccess(char *doorId, char *rfid){
  strcpy(url, baseUrl);
  strcat(url, "access/");
  strcat(url, doorId);
  strcat(url, "/");
  strcat(url, rfid);

  http.begin(url);

  int httpResponseCode = http.GET();
  bool access = false;
  if (httpResponseCode == 200){
    access = true;
  }
  http.end();
  return access;
}
void setupSerial(){
  Serial.begin(9600);
  while (!Serial)
  {
    ;
  }
}
void setupSD(){
  Serial.print("Initializing SD card...");
  pinMode(SD_CS, OUTPUT);
  if (!SD.begin(SD_CS))
  {
    Serial.println("Card failed, or not present");
    return;
  }
  Serial.println("card initialized.");
}
void downloadDatabase(){
  strcpy(url, baseUrl);
  strcat(url, "access/download/badge/");
  strcat(url, doorId);
  http.begin(url);
  http.GET();
  database = SD.open(F("/badge.csv"), FILE_WRITE);
  http.writeToStream(&database);
  database << EOF;
  database.close();
  http.end();

  strcpy(url, baseUrl);
  strcat(url, "access/download/schedule/");
  strcat(url, doorId);
  http.begin(url);
  http.GET();
  database = SD.open(F("/schedule.json"), FILE_WRITE);
  http.writeToStream(&database);
  database << EOF;
  database.close();
  http.end();
}
int compareHours(int hourA, int minA, int hourB, int minB){
  return hourA == hourB ? minA - minB : hourA - hourB;
}

bool authorizeRFID(){
  Serial.print("authorize RFID ");
  Serial.println(rfid);
  int badgeLength = strlen(rfid);
  if(!badgeLength) return false;
  database = SD.open(F("/badge.csv"), FILE_READ);
  bool lineFound;
  // finds the right line
  while(database.available()){
    lineFound = true;
    memset(fileLine, 0, sizeof(fileLine));
    database.readBytesUntil('\n', fileLine, 1024);
    if(strlen(fileLine) < badgeLength) continue; 
    // checks if we are on the right line
    for(int i =0; i< badgeLength; i++){
      if(fileLine[i] != rfid[i]){
        lineFound = false;
        break;
      }
    }
    if(lineFound) break;
  }
  database.close();
  // we did not find the badge in the database
  if(!lineFound) return false;

  char* scheduleId = strchr(fileLine, ',')+1;
  // read the schedule to authorize or not
  database = SD.open(F("/schedule.json"), FILE_READ);
  deserializeJson(jsonBuffer, database);
  bool authorize = false;
  getLocalTime(&currentTime);
  int day = (currentTime.tm_wday + 5)%6;
  int hour = currentTime.tm_hour;
  int minute = currentTime.tm_min;
  JsonObject schedule = jsonBuffer[scheduleId]["days"][day];
  if (schedule["allDay"]) {
    authorize = true;
  }
  JsonArray intervals = schedule["intervals"];
  for (JsonVariant interval : intervals) {
    int startHour = interval["start"]["HH"].as<int>();
    int endHour = interval["end"]["HH"].as<int>();
    int startMinute = interval["start"]["mm"].as<int>();
    int endMinute = interval["end"]["mm"].as<int>();

    authorize = authorize 
      || (compareHours(startHour, startMinute, hour, minute) <= 0 
      && compareHours(hour, minute, endHour, endMinute) <= 0);
  }
  database.close();
  return authorize;
}

void printLocalTime()
{
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo))
  {
    Serial.println("Failed to obtain time");
    return;
  }
  Serial.println(&timeinfo, "%A, %B %d %Y %H:%M:%S");
}

void setup(){
  setupSerial();
  SPI.begin(18,19,23);
  setupSD();
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
  }
  Serial.println("connected");
  configTime(3600, 0, "pool.ntp.org");
  printLocalTime();
  downloadDatabase();
  strcpy(rfid, "badges1");
  bool a = authorizeRFID();

  Serial.print("Authorize values ");
  Serial.println(a);
  // requestAccess(doorId, "badges1");
}

void loop(){
  // put your main code here, to run repeatedly:
}