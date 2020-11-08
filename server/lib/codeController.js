// import { v4 as uuid } from "uuid";
import EspOTA from "esp-ota";
import fs from "fs";
import { exec } from "child_process";

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

function compile(options){
  // generate config file:
  const codeDate = Date.now().toString();
  const configFile = jsonToHFile({
    passwordOTA: "coucou",
    baseUrl: "http://192.168.1.34:5051/",
    ssid: "Livebox-8261",
    wifiPassword: "E7859199A22A53F068F66F94FE",
    codeDate,
    doorId: "9d1d68a3-83b0-469b-a33b-db0eba69cc59"
  });

  fs.writeFileSync('../door-lock/src/config.h', configFile);
  return new Promise((resolve, reject) => {
    const child = exec("~/.platformio/penv/bin/platformio run -d ../door-lock/");

    child.stdout.on("data", function (data) {
    });
    child.stderr.on("data", function (data) {
      if(data.match('error: ')){
        reject(data);
      }
    });
    child.on("close", function (code) {
      resolve(codeDate);
    });
  })
}

export default function doorController({ app, db }) {
  app.get("/code-compile", (req,res) => {
    compile().then((date) => {
      // update the date of the code in the database
      if (db.get("code").find({ id: 1 }).value()){
        db.get("code").find({ id: 1 }).assign({ date }).write();
      }else{
        db.get("code").push({id: 1, date}).write();
      }
      res.send(200)
    })
    .catch(e => {
      console.log('error on compile ', e);
      res.status(400).json({e});
    })
  });

  app.get("/code-update/:ip/:date", (req, res) => {
    const date = +req.params.date;
    const ip = req.params.ip;
    const mostRecentCodeDate = db.get("code").find({ id: 1 }).value().date;
    console.log("request code update", ip, date, mostRecentCodeDate);

    if(mostRecentCodeDate <= date){
      // code is already updated
      res.send(400);
      return;
    }
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

    transfer
      .then(function () {
        console.log("Done");
      })
      .catch(function (error) {
        console.error("Transfer error: ", error);
      });
  });
}
