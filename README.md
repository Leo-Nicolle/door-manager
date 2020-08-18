# labaux - RFID door manager

labaux is an opensource door manager system. It handles RFID door locks, users, schedules, groups....

### Getting started

```
cd server
npm i
npm run start
```

```
cd client
npm i
npm run serve
```

## ROADMAP

### server

- [x] provide API for user, door, group, accessRights, schedule,login
- [x] store things in a database
- [x] handle basic data validation
- [ ] better data validation (check joints are valid ...)
- [ ] add DELETE API
- [ ] handle DELETE API
- [ ] add door ESP32 API

### client

- [x] provide ui to display user, door, group, accessRights, schedule
- [x] provide forms
- [x] searchbar
- [ ] add RFID
- [ ] add door ESP32 UI

### ESP32

- [ ] connect to server and request access
- [ ] assign doorId to ESP
- [ ] read RFID and lookup in the DB
- [ ] store access locally

### MISC

- [ ] deployment scripts
- [ ] update scripts + UI
- [ ] build pipeline
- [ ] unit tests ?
- [ ] better security ?
- [ ] RGPD ?
