#ifndef RFIDHANDLER_H
#define RFIDHANDLER_H
#include <MFRC522.h>
#include "database.h"

class RFID
{
public: 
  static const int CS_PIN = 16;
  static const int IRQ_PIN =  33;
  static const int RST_PIN = 34;

  MFRC522 mfrc522;
  MFRC522::MIFARE_Key key;
  Database* database;
  unsigned long lastTimeUpdate = 0;
  unsigned long refreshFrequency = 1;

  tm currentTime;
  RFID();
  bool setup(Database* database);
  void loop();
};

#endif /* RFIDHANDLER_H */