#ifndef OTA_H
#define OTA_H

#include <WiFi.h>
#include <ESPmDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include <HTTPClient.h>
#include "config.h"

class Ota{
  HTTPClient http;
  char url[356];
  public:
  Ota();
  void setup();
  void loop();
  void checkForUpdates();
};

#endif /*OTA_H*/