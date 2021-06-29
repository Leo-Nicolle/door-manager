#include "RFID.h"

RFID::RFID()
{
  mfrc522 = MFRC522(CS_PIN, RST_PIN);
}

bool RFID::setup(Database *database)
{
  this->database = database;
  mfrc522.PCD_Init();
  mfrc522.PCD_DumpVersionToSerial();
  mfrc522.PCD_DumpVersionToSerial();
  return true;
}

void RFID::loop()
{
  time_t now;
  time(&now);
  if (now - lastTimeUpdate < refreshFrequency)
  {
    return;
  }
  lastTimeUpdate = now;

  mfrc522.PCD_AntennaOn();
  if (!mfrc522.PICC_IsNewCardPresent())
  {
    return;
  }
  if (!mfrc522.PICC_ReadCardSerial())
  {
    // Serial.println("Bad read (was card removed too quickly?)");
    return;
  }
  if (mfrc522.uid.size == 0)
  {
    Serial.println("Bad card (size = 0)");
  }
  else
  {
    readType();
    readCard(database->rfid); 
    Serial.print("read card ");
    Serial.println(database->rfid);
    bool authorized = database->authorize();
    if(strlen(database->newId)){
      Serial.print("NEW ID ");
      Serial.println(database->newId);
      writeData(database->newId);
      database->newId[0] = 0;
    }
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
    Serial.print("Authorized: ");
    Serial.println(authorized);
  };
}

bool RFID::readType()
{
  if (piccType != MFRC522::PICC_TYPE_MIFARE_MINI && piccType != MFRC522::PICC_TYPE_MIFARE_1K && piccType != MFRC522::PICC_TYPE_MIFARE_4K)
  {
    Serial.println(F("This sample only works with MIFARE Classic cards."));
    return false;
  }
  piccType = mfrc522.PICC_GetType(mfrc522.uid.sak);
  return true;
}

bool RFID::authenticate(bool A = true)
{
  for (byte i = 0; i < 6; i++)
  {
    key.keyByte[i] = 0xFF;
  }

  MFRC522::StatusCode status;
  byte trailerBlock = 7;
  status = (MFRC522::StatusCode)mfrc522
               .PCD_Authenticate(
                   A ? MFRC522::PICC_CMD_MF_AUTH_KEY_A : MFRC522::PICC_CMD_MF_AUTH_KEY_B,
                   trailerBlock,
                   &key,
                   &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK)
  {
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return false;
  }
  return true;
}

bool RFID::readCard(char *dst)
{
  MFRC522::StatusCode status;
  byte buffer[18];
  byte size = sizeof(buffer);

  if (!authenticate(true))
  {
    return false;
  }

  byte startBlock = 4;
  byte NB_BLOCKS = 2;

  for(byte i = 0; i < NB_BLOCKS; i++){
    status = (MFRC522::StatusCode)mfrc522.MIFARE_Read(startBlock + i, buffer, &size);
      if (status != MFRC522::STATUS_OK)
      {
        Serial.print(F("MIFARE_Read() failed: "));
        Serial.println(mfrc522.GetStatusCodeName(status));
        return false;
      }
      for (int j = 0; j < 16; j++)
      {
        dst[16 *  i + j] = buffer[j];
      }
  }
  return true;
}

bool RFID::writeData(const char *data)
{
  // In this sample we use the second sector,
  // that is: sector #1, covering block #4 up to and including block #7
  byte dataBlock[16];
  MFRC522::StatusCode status;

  if (!authenticate(false))
  {
    return false;
  }
  byte startBlock = 4;
  byte NB_BLOCKS = 2;

  for(byte i = 0; i < NB_BLOCKS; i++){
    // Write data to the block
    for (int j = 0; j < 16; j++)
    {
      dataBlock[j] = data[i * 16 + j];
    }
    status = (MFRC522::StatusCode)mfrc522.MIFARE_Write(startBlock + i,  dataBlock, 16);
    if (status != MFRC522::STATUS_OK)
    {
      Serial.print(F("MIFARE_Write() failed: "));
      Serial.println(mfrc522.GetStatusCodeName(status));
      return false;
    }
  }
  return true;
}