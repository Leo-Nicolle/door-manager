#ifndef RFIDHANDLER_H
#define RFIDHANDLER_H
#include "database.h"
#include <MFRC522.h>

class RFID
{
public: 
  static const int CS_PIN = 16;
  static const int IRQ_PIN =  33;
  static const int RST_PIN = 34;

  MFRC522 mfrc522;
  MFRC522::MIFARE_Key key;
  MFRC522::PICC_Type piccType;
  Database* database;
  unsigned long lastTimeUpdate = 0;
  unsigned long refreshFrequency = 1;
  byte buffer[256];
  tm currentTime;
  RFID();
  bool setup(Database* database);
  bool writeData(const char* data);
  bool readCard(char* dst);
  bool authenticate(bool A);
  bool readType();

  void loop();
};

#endif /* RFIDHANDLER_H */