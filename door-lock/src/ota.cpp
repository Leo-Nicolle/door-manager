#include "ota.h"

Ota::Ota(){

}

void Ota::setup(){

  ArduinoOTA.setPort(3232);
  ArduinoOTA.setHostname(doorId);
  ArduinoOTA.setPassword(passwordOTA);

  ArduinoOTA.onStart([&]() {
    // updating = true;
    String type;
    if (ArduinoOTA.getCommand() == U_FLASH)
      type = "sketch";
    else // U_SPIFFS
      type = "filesystem";
    Serial.println("Start updating " + type);
  });
  ArduinoOTA.onEnd([&]() {
    updating = false;
    Serial.println("\nEnd");
  });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
  });
  ArduinoOTA.onError([&](ota_error_t error) {
    updating = false;
    Serial.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR)
      Serial.println("Auth Failed");
    else if (error == OTA_BEGIN_ERROR)
      Serial.println("Begin Failed");
    else if (error == OTA_CONNECT_ERROR)
      Serial.println("Connect Failed");
    else if (error == OTA_RECEIVE_ERROR)
      Serial.println("Receive Failed");
    else if (error == OTA_END_ERROR)
      Serial.println("End Failed");
  });
  ArduinoOTA.begin();
  Serial.println("OTA Ready");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void Ota::loop(){
  ArduinoOTA.handle();
}

void Ota::checkForUpdates(){
  if(updating) return;
  Serial.println('check for update');
  strcpy(url, baseUrl);
  strcat(url, "code-update/");
  strcat(url, WiFi.localIP().toString().c_str());
  strcat(url, "/");
  strcat(url, codeDate);
  strcat(url, "/");
  strcat(url, doorId);

  http.begin(url);
  Serial.print("request code update ");
  Serial.println(url);

  int httpResponseCode = http.GET();

  if (httpResponseCode == 200){
    Serial.println("There are code updates to download");
  }else{
    Serial.print("There are no code updates to download ");
  }
  http.end();
}
