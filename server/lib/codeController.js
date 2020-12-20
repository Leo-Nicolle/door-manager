// import { v4 as uuid } from "uuid";
import EspOTA from "esp-ota";
import fs from "fs";
import { exec } from "child_process";
let compileLock = false;

function jsonToHFile(json){
  let file = "#ifndef LABAUX_CONFIG_H\n"
  file += "#define LABAUX_CONFIG_H\n"
  return Object.entries(json).reduce((hFile, [key, value], i, array) => {
    console.log('la', hFile)
    if(typeof value === 'string'){
      hFile += `static const char* ${key} = "${value}";\n`;
    }else{
      hFile+= `#define ${key} ${value}\n`
    }
    if(i === array.length -1){
      hFile+= `#endif // config\n`
    }
    console.log(hFile);
    return hFile;
  }, file);
}

function compile(options, db){
  // generate config file:
  console.log('compile');
  if(compileLock) throw new Error('Compiler busy');
  compileLock = true;
  const codeDate = Date.now().toString();
  const configFile = jsonToHFile({
    passwordOTA: "coucou",
    baseUrl: "http://192.168.1.34:5051/",
    ssid: "Livebox-8261",
    wifiPassword: "E7859199A22A53F068F66F94FE",
    codeDate,
    doorId: "unassigned",
    ...options
  });

  fs.writeFileSync('../door-lock/src/config.h', configFile);
  return new Promise((resolve, reject) => {
    const child = exec("~/.platformio/penv/bin/platformio run -d ../door-lock/");
    child.stdout.on("data", function (data) {
    });
    child.stderr.on("data", function (data) {
      if(data.match('error: ')){
        compileLock = false;
        reject(data);
      }
    });
    child.on("close", function (code) {
      compileLock = false;
      resolve(codeDate);
    });
  }).then((date) => {
    const doorId = options.doorId;
    // update the date of the code in the database
    if (db.get("code").find({ doorId }).value()){
      db.get("code").find({ doorId }).assign({ date }).write();
    }else{
      db.get("code").push({doorId, date}).write();
    }
    return true;
  });
}

function transferCode({ip, doorId, res, db}){
  return compile({doorId}, db )
     .then(() => {
       res.send(200);
       var esp = new EspOTA();
       // Optional arguments in this order: (bindAddress, bindPort, chunkSize, secondsTimeout)

       esp.on("state", function (state) {
         console.log("Current state of transfer: ", state);
       });

       esp.on("progress", function (current, total) {
         console.log(
           "Transfer progress: " + Math.round((current / total) * 100) + "%"
         );
       });

       // If you need to authenticate, uncomment the following and change the password
       esp.setPassword("coucou");
       const transfer = esp.uploadFirmware(
         "../door-lock/.pio/build/featheresp32/firmware.bin",
         ip,
         3232
       );
        return transfer;
     })
     .catch((e) => {
       console.error(e);
       res.send(400);
     });
}

function handleUnassigned({ip, res, db}){
   //cleanup too old requests (more than one day):
   const now = Date.now();
   db.get("locks")
     .value()
     .filter(({ date }) => (now - date) / (1000 * 3600 * 24) < 1);
   // check if there is an unassigned lock with this ip:
   const lock = db.get("locks").find({ ip }).value();
   if (!lock) {
     db.get("locks").push({ ip, date: Date.now() }).write();
     return res.send(400);
   }
   if(!lock.doorId){
     return res.send(400);
   }
   console.log('compiling', lock, lock.doorId);
   // if there is already a lock with this ip, check if a doorId has been assigned to it
   // and start a transfer
   transferCode({ db, ip, doorId: lock.doorId, res })
   .then(() => {
     db.set(
       "locks",
       db
         .get("locks")
         .filter((lock) => lock.ip !== ip)
         .value()
     ).write();
   });
}

export default function doorController({ app, db, authMiddleware }) {
  app.get("/code-compile", (req,res) => {
    compile({}, db).then(() => {
      res.send(200);
    })
    .catch(e => {
      console.log('error on compile ', e);
      res.status(400).json({e});
    })
  });

  app.get("/code-update/:ip/:date/:doorId", (req, res) => {
    const date = +req.params.date;
    const ip = req.params.ip;
    const doorId = req.params.doorId;

    if(doorId === 'unassigned'){
      return handleUnassigned({ip, res, db});
    }
    const mostRecentCode = db.get("code").find({ doorId }).value();
    const mostRecentCodeDate = mostRecentCode ? mostRecentCode.date : 0;
    console.log("request code update", ip, date, doorId);

    if(mostRecentCodeDate <= date){
      // code is already updated
      res.send(400);
      return;
    }
    transferCode({db, ip, doorId,res});
  });

  app.post("/lock", authMiddleware, (req,res) => {
    const lock = db.get("locks").find({ ip: req.body.ip }).value();
    if(!lock){
      res.send(400);
      return;
    }
    db.get("locks").find({ ip: req.body.ip }).assign(req.body).write();
    res.send(db.get("locks").value());
  });
    
  app.get("/lock", (req, res) => {
    const locks = db.get("locks").value();
    res.send(locks);
  });

}
