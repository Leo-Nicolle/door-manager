#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char *ssid = "";
const char *password = "";
const char *baseUrl = "http://192.168.43.129:5050/";
char *doorId = "9d1d68a3-83b0-469b-a33b-db0eba69cc59";
char url[512];
char rfid[512];


HTTPClient http;

// Inside the brackets, 200 is the size of the pool in bytes.
// Don't forget to change this value to match your JSON document.
// Use arduinojson.org/assistant to compute the capacity.
StaticJsonBuffer<200> jsonBuffer;

bool requestAccess(char *doorId, char *rfid)
{

  strcpy(url, baseUrl);
  strcat(url, "access/");
  strcat(url, doorId);
  strcat(url, "/");
  strcat(url, rfid);

  http.begin(url);

  int httpResponseCode = http.GET();
  bool access = false;
  if (httpResponseCode == 200)
  {
    // success
    access = true;
  }
  // Free resources
  http.end();
  return access;
}

void setup()
{
  // put your setup code here, to run once:
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
  }
  requestAccess(doorId, "badges1");
}

void loop()
{
  // put your main code here, to run repeatedly:
}