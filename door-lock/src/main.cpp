#include <Arduino.h>
#include <WiFi.h>
#include <SPI.h>
#include "config.h"
#include "database.h"
#include "ota.h"
#include "RFID.h"
#include "ping.h"

Database database;
Ota ota;
RFID rfid;
Ping ping;

bool isAssigned = false;
tm currentTime;
unsigned long lastTimeUpdate = 0;
// time between two updates of the database (in secondes)
const unsigned long refreshFrequency = 3600;
const unsigned long refreshFrequencyFast = 2;

bool checkAssigned()
{
  isAssigned = strcmp("unassigned", doorId);
  return isAssigned;
}

void setupSerial()
{
  Serial.begin(9600);
  // while (!Serial)
  // {
  //   ;
  // }
  Serial.println("STARTED SERIAL");
}
void refreshSystem(bool force = false)
{
  time_t now;
  time(&now);

  if (!force && now - lastTimeUpdate <  (isAssigned ? refreshFrequency : refreshFrequencyFast) )
    return;
    Serial.println("Refresh system");
    Serial.println(isAssigned);


  lastTimeUpdate = now;
  if (isAssigned)
  {
    configTime(3600, 0, "pool.ntp.org");
    database.downloadDatabase();
  }else if(checkAssigned()){
    database.downloadDatabase();
  }
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

void connectWifi()
{
  if (WiFi.status() == WL_CONNECTED)
    return;
  WiFi.begin(ssid, wifiPassword);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
  }
}

void setup()
{
  setupSerial();
  SPI.begin(18, 19, 23);
  Serial.println("SPI BEGIN");
  checkAssigned();
  database.setupDatabase();
  delay(1000);
  rfid.setup(&database);
  connectWifi();
  Serial.println("WIFI Conected");
  // ota.setup();
  Serial.println("OTA Initialized");
  refreshSystem(false);
  Serial.println("Initialisation done.");
}

void loop()
{
  if (!ota.updating)
  {
    // make sure wifi is connected
    connectWifi();
    refreshSystem();
    rfid.loop();
    ping.loop();
  }
  // ota.loop();
}