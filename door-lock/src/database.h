#ifndef DATABASE_H 
#define DATABASE_H
#include <SD.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "config.h"

#define SD_CS 27
class Database {

  public:
  HTTPClient http;
  File file;
  char url[512];
  char fileLine[1024];
  StaticJsonDocument<256> filter;

  Database();
  void readFiles();
  void setupSD();
  void setupDatabase();
  void downloadDatabase(char* doorId);
  int compareHours(int hourA, int minA, int hourB, int minB);
  bool authorizeRFID(char *rfid);
  bool requestAccess(char *doorId, char *rfid);
};

#endif /* DATABASE_H */