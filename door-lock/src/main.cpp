#include <Arduino.h>
#include <WiFi.h>
#include <SPI.h>
#include "database.h"
#include "ota.h"

const char *ssid = "Livebox-8261";
const char *password = "E7859199A22A53F068F66F94FE";
char *doorId = "9d1d68a3-83b0-469b-a33b-db0eba69cc59";
Database database;
Ota ota;

char rfid[512];
tm currentTime;
unsigned long lastTimeUpdate = 0;
// time between two updates of the database (in secondes)
const unsigned long refreshFrequency= 3600;

void setupSerial(){
  Serial.begin(9600);
  while (!Serial)
  {
    ;
  }
}
void refreshSystem(bool force = false){
  // time_t now;
  // time(&now);
  // if (now - lastTimeUpdate < refreshFrequency && !force)
  //   return;
  // configTime(3600, 0, "pool.ntp.org");
  // database.downloadDatabase(doorId);
  // lastTimeUpdate = now;
  ota.checkForUpdates();
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

void connectWifi(){
  if (WiFi.status() == WL_CONNECTED) return;
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
      delay(500);
  }
}

void setup(){
  setupSerial();
  SPI.begin(18,19,23);
  database.setupDatabase();
  connectWifi();
  ota.setup();
  refreshSystem(true);
  strcpy(rfid, "badges1");
  // bool a = database.authorizeRFID(rfid);

  Serial.println("Coucou ");
  // Serial.println(a);
  // requestAccess(doorId, "badges1");
}

void loop(){
  // make sure wifi is connected
  connectWifi();
  refreshSystem();
  ota.loop();
}