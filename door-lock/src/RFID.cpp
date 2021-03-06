#include "RFID.h"

RFID::RFID(){
  mfrc522 = MFRC522(25,16);
}

void RFID::setup(Database* database){
  this->database = database;
  mfrc522.PCD_Init();
}

void RFID::loop(){
  time_t now;
  time(&now);
  if (now - lastTimeUpdate < refreshFrequency){
    return;
  }
  lastTimeUpdate = now;
  if (!mfrc522.PICC_IsNewCardPresent()){
    return;
  }

  // Select one of the cards
  if (!mfrc522.PICC_ReadCardSerial())
  {
    Serial.println("Bad read (was card removed too quickly?)");
    return;
  }

  if (mfrc522.uid.size == 0)
  {
    Serial.println("Bad card (size = 0)");
  }
  else
  {
    database->rfid[0] = 0;
    for (int i = 0; i < mfrc522.uid.size; i++)
    {
      char buff[5]; // 3 digits, dash and \0.
      snprintf(buff, sizeof(buff), "%s%d", i ? "-" : "", mfrc522.uid.uidByte[i]);
      strncat(database->rfid, buff, sizeof(database->rfid));
    };
    database->rfid[mfrc522.uid.size] = 0;
    database->authorize();
  };
  mfrc522.PICC_HaltA();
}