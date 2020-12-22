#ifndef RFIDHANDLER_H
#define RFIDHANDLER_H
#include <MFRC522.h>

class RFID
{
public: 
  MFRC522 mfrc522;
  MFRC522::MIFARE_Key key;
  char rfid[512];
  RFID();
  void setup();
  void loop();
};

#endif /* RFIDHANDLER_H */