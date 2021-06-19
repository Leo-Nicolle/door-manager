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
const { group } = require("console");

inquirer.registerPrompt('path', PathPrompt);
let rootDir, APIPort;
function generateAndWriteKeys() {
  const keys = encrypt.generate(1024);
  fs.writeFile("dist/db/keys.json", JSON.stringify(keys), {}, () => { });
}

function askForRoot() {
  return inquirer
    .prompt([
      {
        type: 'path',
        message: 'Dans quel dossier installer labaux ? ',
        default: process.cwd(),
        name: 'root',
      },
    ])
    .then(({ root }) => {
      if (!fs.existsSync(root)) {
        console.log("Creation du dossier ", root)
        mkdirp.sync(root);
      }
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
      return resolve(true)
    })
  })
}

function askForEncryption() {
  // create the default folder (hack for equirer-path)
  const defaultPath = path.resolve(rootDir || process.cwd(), 'keys')
  mkdirp.sync(defaultPath);

  return inquirer
    .prompt([
      {
        type: 'list',
        message: 'Utiliser un user et un groupe ? (+ de sécurité) ',
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
      {
        type: 'path',
        message: 'Dans quel dossier stocker les  clés secrètes de labaux ? ',
        default: path.resolve(rootDir || process.cwd(), 'keys'),
        name: 'keysPath',
      },
    ])
    .then(({ keysPath, groupName, userName, useGroup }) => {

      if (!fs.existsSync(keysPath)) {
        console.log("Creation du dossier ", keysPath)
        if (keysPath !== defaultPath) {
          fs.rmdir(defaultPath);
          mkdirp.sync(keysPath);
        }
      }
      if (useGroup) {
        console.log(chalk.yellow(`Creation du groupe ${groupName}`))
        return promisifyExec(`sudo groupadd ${groupName}`)
          .then(() => {
            console.log(chalk.yellow(`Attribution du groupe ${groupName} au dossier ${keysPath}`))
            return promisifyExec(`sudo chgrp ${groupName} ${keysPath}`);
          })
          .then(() => {
            console.log(chalk.yellow(`Attribution des droits au dossier ${keysPath}`))
            return promisifyExec(`sudo chmod 070 ${keysPath}`);
          })

      }
      return Promise.resolve();
    }).catch((error) => {
      console.log(chalk.red("Une erreur est survenue:"))
      console.error(error)
      return askForEncryption();
    })
}


// askForRoot();
// askForPort()
askForEncryption();