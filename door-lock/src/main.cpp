#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char *ssid = "frebaux";
const char *password = "labaux0r";
const char *baseUrl = "http://192.168.1.106:5050/";

char url[512];

HTTPClient http;

// Inside the brackets, 200 is the size of the pool in bytes.
// Don't forget to change this value to match your JSON document.
// Use arduinojson.org/assistant to compute the capacity.
StaticJsonBuffer<200> jsonBuffer;

bool requestAccess(char *doorId, char *rfid)
{

  strcpy(url, baseUrl);
  strcat(url, 'access');
  strcat(url, doorId);
  strcat(url, "/");
  strcat(url, rfid);
  strcat(url, "/");

  Serial.prinln(url);
  http.begin(url);

  int httpResponseCode = http.GET();
  bool access = false;
  if (httpResponseCode > 0)
  {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String payload = http.getString();
    Serial.println(payload);
  }
  else
  {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
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
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");
}

void loop()
{
  // put your main code here, to run repeatedly:
}