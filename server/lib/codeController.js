import { v4 as uuid } from 'uuid';
import EspOTA from 'esp-ota';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import config from './config';

let compileLock = false;

function jsonToHFile(json) {
  let file = '#ifndef LABAUX_CONFIG_H\n';
  file += '#define LABAUX_CONFIG_H\n';
  return Object.entries(json).reduce((hFile, [key, value], i, array) => {
    if (typeof value === 'string') {
      hFile += `static const char* ${key} = "${value}";\n`;
    } else {
      hFile += `#define ${key} ${value}\n`;
    }
    if (i === array.length - 1) {
      hFile += '#endif // config\n';
    }
    return hFile;
  }, file);
}

function compile(options, db) {
  // generate config file:
  if (compileLock) throw new Error('Compiler busy');
  compileLock = true;
  const codeDate = Date.now().toString();

  return Promise.all([
    config
      .getValue('doorDefaults'),
    config
      .getValue('doorLockPath'),
    config
      .getValue('platformioPath'),
  ])
    .then(([doorDefaults, doorLockPath, platformioPath]) => {
      const configFile = jsonToHFile({
        ...doorDefaults,
        codeDate,
        doorId: 'unassigned',
        ...options,
      });
      fs.writeFileSync(path.resolve(doorLockPath, 'src/config.h'), configFile);
      return { platformioPath, doorLockPath };
    })
    .then(({ platformioPath, doorLockPath }) => new Promise((resolve, reject) => {
      const child = exec(`${platformioPath} run -d ${doorLockPath}`);
      child.stdout.on('data', (data) => {
      });
      child.stderr.on('data', (data) => {
        if (data.match('error: ')) {
          compileLock = false;
          reject(data);
        }
      });
      child.on('close', (code) => {
        compileLock = false;
        resolve(codeDate);
      });
    }))
    .then((date) => {
      const { doorId } = options;
      // update the date of the code in the database
      const door = db.get('doors').find({ doorId }).value();
      if (door) {
        db.get('doors').find({ doorId }).assign({
          ...door,
          codeDate:
           date,
        }).write();
      } else {
        // db.get('doors').push({ doorId, date }).write();
      }
      return true;
    });
}

function transferCode({
  ip, doorId, res, db,
}) {
  return compile({ doorId }, db)
    .then(() => config
      .getValue('doorLockPath'))
    .then((doorLockPath) => {
      res.send(200);
      const esp = new EspOTA();
      // Optional arguments in this order: (bindAddress, bindPort, chunkSize, secondsTimeout)

      esp.on('state', (state) => {
        console.log('Current state of transfer: ', state);
      });

      esp.on('progress', (current, total) => {
        console.log(
          `Transfer progress: ${Math.round((current / total) * 100)}%`,
        );
      });

      // If you need to authenticate, uncomment the following and change the password
      esp.setPassword('coucou');
      const transfer = esp.uploadFirmware(path.resolve(
        doorLockPath, '.pio/build/featheresp32/firmware.bin',
      ),
      ip,
      3232);
      return transfer;
    })
    .catch((e) => {
      console.error(e);
      res.send(400);
    });
}

function handleUnassigned({ ip, res, db }) {
  // cleanup too old requests (more than one day):
  const now = Date.now();
  db.set('locks', db
    .get('locks')
    .value()
    .filter(({ date }) => (now - date) / (1000 * 3600 * 24) < 1));
  const lock = db.get('locks').find({ ip }).value();
  // if the lock was not created, create it
  if (!lock) {
    db.get('locks').push({ ip, date: Date.now() }).write();
    return res.send(400);
  }
  // if the lock was not assigned yet, just return
  if (!lock.doorId) {
    return res.send(400);
  }
  // if the lock was assigned to a door, tranfer it code.
  const id = uuid();
  transferCode({
    db,
    ip,
    doorId: lock.doorId,
    res,
    id,
  })
    .then(() => {
      // assign id to the door:
      const door = db.get('doors').find((door) => door.id === lock.doorId).value();
      if (door) {
        door.lockId = id;
        db.get('doors').find({ id: door.id }).assign(door).write();
      }
      // cleanup locks
      db.set(
        'locks',
        db
          .get('locks')
          .filter((lock) => lock.ip !== ip)
          .value(),
      ).write();
    });
}

export default function doorController({ app, db, authMiddleware }) {
  app.get('/code-compile', (req, res) => {
    compile({}, db).then(() => {
      res.send(200);
    })
      .catch((e) => {
        console.log('error on compile ', e);
        res.status(400).json({ e });
      });
  });

  app.get('/code-update/:ip/:date/:doorId', (req, res) => {
    const date = +req.params.date;
    const { ip } = req.params;
    const { doorId } = req.params;

    if (doorId === 'unassigned') {
      return handleUnassigned({ ip, res, db });
    }
    const door = db.get('doors').find({ doorId }).value();
    const mostRecentCodeDate = door && door.codeDate ? door.codeDate : 0;
    console.log('request code update', ip, date, doorId);

    if (mostRecentCodeDate <= date) {
      // code is already updated
      res.send(400);
      return;
    }
    transferCode({
      db, ip, doorId, res,
    });
  });

  app.post('/lock', authMiddleware, (req, res) => {
    const lock = db.get('locks').find({ ip: req.body.ip }).value();
    if (!lock) {
      res.send(400);
      return;
    }
    db.get('locks').find({ ip: req.body.ip }).assign(req.body).write();
    res.send(db.get('locks').value());
  });

  app.get('/lock', (req, res) => {
    const locks = db.get('locks').value();
    res.send(locks);
  });
}
