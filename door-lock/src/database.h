#ifndef DATABASE_H 
#define DATABASE_H
#include <SD.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "config.h"

#define SD_CS 4
class Database {

  public:
  HTTPClient http;
  File file;
  char url[512];
  char fileLine[1024];
  StaticJsonDocument<256> filter;
  char rfid[512];

  Database();
  void readFiles();
  bool setupSD();
  bool setupDatabase();
  void assignIdToBadge();
  void downloadDatabase();
  int compareHours(int hourA, int minA, int hourB, int minB);
  bool authorizeRFID(char *rfid);
  bool requestAccess(char *rfid);
  bool authorize();
};

#endif /* DATABASE_H */