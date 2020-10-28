# Door manager

Door Manager is an opensource system to handle RFID door locks, users, schedules, groups....

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
- [x] better data validation (check joints are valid ...)
- [x] add DELETE API
- [x] handle DELETE API
- [x] add log door open
- [x] add proper logout
- [ ] add door ESP32 API

### client

- [x] provide ui to display user, door, group, accessRights, schedule
- [x] provide forms
- [x] searchbar
- [x] add RFID
- [x] add log
- [x] add proper logout
- [x] sort entries by column
- [ ] add door ESP32 UI

### ESP32

- [x] connect to server and request access
- [ ] assign doorId to ESP
- [ ] read RFID and lookup in the DB
- [ ] store access locally
- [ ] remote update ?

### MISC

- [ ] deployment scripts
- [ ] update scripts + UI
- [ ] build pipeline
- [ ] unit tests ?
- [ ] better security ?
- [ ] RGPD ?
