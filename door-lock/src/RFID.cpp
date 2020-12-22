#include "RFID.h"


RFID::RFID(){
  mfrc522 = MFRC522(25,16);
}

void RFID::setup(){
  mfrc522.PCD_Init();
}

void RFID::loop(){
  if (!mfrc522.PICC_IsNewCardPresent())
  {
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
    char tag[sizeof(mfrc522.uid.uidByte) * 4] = {0};
    for (int i = 0; i < mfrc522.uid.size; i++)
    {
      char buff[5]; // 3 digits, dash and \0.
      snprintf(buff, sizeof(buff), "%s%d", i ? "-" : "", mfrc522.uid.uidByte[i]);
      strncat(tag, buff, sizeof(tag));
    };
    Serial.println("Good scan: ");
    Serial.println(tag);
  };

  // disengage with the card.
  //
  mfrc522.PICC_HaltA();
}