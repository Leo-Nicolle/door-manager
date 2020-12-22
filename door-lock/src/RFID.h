#ifndef RFIDHANDLER_H
#define RFIDHANDLER_H
#include <MFRC522.h>
#include "database.h"

class RFID
{
public: 
  MFRC522 mfrc522;
  MFRC522::MIFARE_Key key;
  Database* database;
  unsigned long lastTimeUpdate = 0;
  unsigned long refreshFrequency = 0.1;

  tm currentTime;
  RFID();
  void setup(Database* database);
  void loop();
};

#endif /* RFIDHANDLER_H */