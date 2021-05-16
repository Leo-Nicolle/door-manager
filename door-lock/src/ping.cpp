#include "ping.h"

Ping::Ping()
{
  strcpy(url, baseUrl);
  strcat(url, "ping/");
  strcat(url, doorId);
}

void Ping::loop()
{
  time_t now;
  time(&now);
  if (now - lastTimeUpdate < (pingFrequency * 60))
  {
    return;
  }
  lastTimeUpdate = now;
  http.begin(url);
  int httpResponseCode = http.GET();
  bool ping = false;
  if (httpResponseCode == 200)
  {
    ping = true;
  }
  http.end();
  // Serial.print("PING: ");
  // Serial.println(ping);

}
