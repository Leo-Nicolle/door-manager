#ifndef PING_H
#define PING_H
#include <HTTPClient.h>
#include "config.h"

class Ping
{

public:
  HTTPClient http;
  unsigned long lastTimeUpdate = 0;

  char url[512];

  Ping();
  void loop();
};

#endif /* PING_H */