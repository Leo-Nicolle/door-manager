// import { fstat } from "fs";
const encrypt = require("quick-encrypt");
const inquirer = require('inquirer');
const { PathPrompt } = require('inquirer-path');
const chalk = require('chalk');
const express = require('express');
const { exec } = require("child_process");
const mkdirp = require('mkdirp')
const path = require('path')
const fs = require('fs');

inquirer.registerPrompt('path', PathPrompt);
let rootDir, APIPort, pathToKeys, pathToDB;

const defaultConfig = {
  doorDefaults: {
    passwordOTA: "coucou",
    pingFrequency: 0.1
  }
};
function generateAndWriteKeys(dir) {
  const keys = encrypt.generate(1024);
  fs.writeFile(path.resolve(dir, "keys.json"), JSON.stringify(keys), {}, () => { });
}

function promisifyExec(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        if (error.message.includes('exists')) {
          return resolve(true)
        }
        console.log(`error: ${error.message}`);
        return reject(error)
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return reject(error)
      }
      return resolve(stdout)
    })
  })
}


function askForRoot() {
  const defaultPath = path.resolve(process.env.HOME, 'door-manager');
  mkdirp.sync(defaultPath);

  return inquirer
    .prompt([
      {
        type: 'path',
        message: 'Dans quel dossier installer door manager ? ',
        default: defaultPath,
        name: 'root',
      },
    ])
    .then(({ root }) => {
      if (defaultPath !== root) {
        console.log(chalk.yellow(`Creation du dossier ${root}`))
        mkdirp.sync(root);
        fs.rmdir(defaultPath);
      }
      console.log(chalk.yellow(`Installation de labaux...`))
      promisifyExec(`cp -r ${path.resolve(process.argv[1], '../../dist')} ${root}`)
      rootDir = root;
    });
}

function askForPort() {
  return inquirer
    .prompt([
      {
        type: 'number',
        message: 'Quel port utiliser pour labaux ? ',
        name: 'port',
        default: 5052
      },
    ])
    .then(({ port }) => {
      return new Promise((resolve, reject) => {
        APIPort = port;
        const app = express();
        const server = app.listen(port, () => {
          server.close();
          resolve(true)
        })
          .on('error', (error) => {
            server.close();
            if (error.code === 'EADDRINUSE') {
              return resolve(false)
            }
            reject(e)
          })
      })
    }).then((ok) => {
      if (ok) return Promise.resolve();
      return inquirer
        .prompt([
          {
            type: 'list',
            message: chalk.red('Le port est déjà utilisé; êtes vous sur de vouloir continuer?'),
            choices: ['oui', 'non'],
            name: 'confirmation',
          },
        ]).then(({ confirmation }) => {
          if (confirmation === 'oui') return Promise.resolve()
          return askForPort();
        })
    })
}


function askForEncryption() {
  // create the default folder (hack for equirer-path)
  const defaultKeysPath = path.resolve(rootDir || process.cwd(), 'keys')
  mkdirp.sync(defaultKeysPath);
  const defaultDbPath = path.resolve(rootDir || process.cwd(), 'db')
  mkdirp.sync(defaultDbPath);

  return inquirer
    .prompt([
      {
        type: 'path',
        message: 'Dans quel dossier stocker les  clés secrètes ? ',
        default: defaultKeysPath,
        name: 'keysPath',
      },
      {
        type: 'path',
        message: 'Dans quel dossier stocker la base de données ? ',
        default: defaultDbPath,
        name: 'dbPath',
      },
      {
        type: 'list',
        message: 'Utiliser un groupe ? (+ de sécurité) ',
        choices: ['oui', 'non'],
        name: 'useGroup',
      },
      {
        type: 'input',
        message: 'Nom du groupe ?  ',
        default: 'doormanager',
        when: ({ useGroup }) => useGroup === 'oui',
        name: 'groupName',
      },

    ])
    .then(({ keysPath, groupName, dbPath, useGroup }) => {
      pathToKeys = keysPath;
      pathToDB = dbPath;
      if (!fs.existsSync(keysPath)) {
        console.log(chalk.yellow(`Creation du dossier ${keysPath}`))
        if (keysPath !== defaultKeysPath) {
          fs.rmdir(defaultKeysPath);
          mkdirp.sync(keysPath);
        }
      }
      if (!fs.existsSync(dbPath)) {
        console.log(chalk.yellow(`Creation du dossier ${dbPath}`))
        if (dbPath !== defaultDbPath) {
          fs.rmdir(defaultDbPath);
          mkdirp.sync(dbPath);
        }
      }
      console.log(chalk.yellow(`Creation des clés secretes`))
      generateAndWriteKeys(keysPath)
      if (useGroup) {
        console.log(chalk.yellow(`Creation du groupe ${groupName}`))
        return promisifyExec(`sudo groupadd ${groupName}`)
          .then(() => {
            console.log(chalk.yellow(`Attribution du groupe ${groupName} au dossier ${keysPath}`))
            return promisifyExec(`sudo chgrp ${groupName} ${keysPath}`);
          })
          .then(() => {
            console.log(chalk.yellow(`Attribution des droits au dossier ${keysPath}`))
            return promisifyExec(`sudo chmod 070 ${keysPath} ${dbPath}`);
          })

      }
      return Promise.resolve();
    }).catch((error) => {
      console.log(chalk.red("Une erreur est survenue:"))
      console.error(error)
      return askForEncryption();
    })
}

function askForEmail() {
  return inquirer
    .prompt([
      {
        type: 'list',
        message: 'email pour le door managet ? ',
        choices: [
          "Gmail",
          "Hotmail",
          "Mailjet",
          "autre?"
        ],
        name: 'mailService',
      },
      {
        type: 'input',
        message: 'Liste complete: https://nodemailer.com/smtp/well-known/',
        name: 'ohterMailService',
        when: ({ mailService }) => mailService === 'autre?'
      },
      {
        type: 'input',
        message: 'addresse email',
        name: 'email',
      },
      {
        type: 'password',
        message: 'mot de passe du mail',
        name: 'password',
      },
      {
        type: 'password',
        message: 'confirmer mot de passe du mail',
        name: 'confirmPassword',
      },
    ])
    .then(({ mailService, otherMailService, email, password, confirmPassword }) => {
      if (password !== confirmPassword) {
        console.log(chalk.red('Erreur: les mots de passe sont pas identiques'))
        return askForEmail()
      }
      defaultConfig.mail = {
        service: mailService || otherMailService,
        password,
        id: email
      }
    })
}

function askForDoorDefault() {
  return Promise.all([
    promisifyExec("hostname -I | awk '{print $1}'"),
    promisifyExec("iwgetid -r")
  ])
    .then(([ip, ssid]) =>
      inquirer
        .prompt([
          {
            type: 'input',
            message: 'IP du serveur ?',
            default: ip,
            name: 'ip'
          },
          {
            type: 'input',
            message: 'nom du wifi ?',
            default: ssid,
            name: 'ssid'
          },
          {
            type: 'input',
            message: 'mot de passe du wifi ?',
            name: 'wifiPassword'
          }
        ]))
    .then(({ ip, wifiPassword, ssid }) => {
      defaultConfig.doorDefaults = {
        ...defaultConfig.doorDefaults,
        ssid,
        baseUrl: `${ip}:${APIPort}`,
        wifiPassword,
      }
      defaultConfig.doorLockPath = path.resolve(rootDir || process.cwd(), 'door-lock')
    })
}

function askForPlatformIO() {
  return inquirer
    .prompt([
      {
        type: 'input',
        message: 'Path de platformio ? ',
        default: path.join(process.env.HOME, ".platformio/penv/bin/platformio"),
        name: 'path'
      },
    ])
    .then(({ path }) => {
      defaultConfig.platformioPath = path;
    })
}
let env;
askForRoot()
  .then(() => askForPort())
  .then(() => askForEncryption())
  .then(() => askForEmail())
  .then(() => askForDoorDefault())
  .then(() => askForPlatformIO())
  .then(() => {
    env = `DB_PATH=${path.resolve(pathToDB, "db.json")}\n`
    env += `LOGS_PATH=${path.resolve(pathToDB, "logs.json")}\n`
    env += `KEYS_PATH=${path.resolve(pathToKeys, "keys.json")}\n`
    env += `CONFIG_PATH=${path.resolve(pathToDB, "config.json")}\n`
    env += `PORT=${APIPort}\n`
    console.log(chalk.yellow('write .env file'))
    return promisifyExec(`echo '${env}' > ${path.resolve(rootDir, ".env")}`)
  })
  .then(() => {
    console.log(chalk.green("Configuration terminée !"))
    console.log(chalk.yellow('-----config file:------'))
    console.log(chalk.yellow(JSON.stringify(defaultConfig, 0, 2)))
    console.log(chalk.yellow('-----.env file:------'))
    console.log(chalk.yellow(env))
  })