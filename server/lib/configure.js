var inquirer = require("inquirer");
var encrypt = require("quick-encrypt");

var fs = require("fs");

fs.readFile("teststss.json", (err, data) => {
  console.log("error", err);
  if (err.code) return;
  persitantKeys = JSON.parse(data);
});

// inquirer
//   .prompt([
//     {
//       type: "confirm",
//       name: "keys",
//       message: "private keys found. Regenerate? ",

//       when: () => {
//         return !fs.existsSync("keys.json");
//       },
//     },
//   ])
//   .then((answer) => {});

const keys = encrypt.generate(1024); // Use either 2048 bits or 1024 bits.
fs.writeFileSync("./keys.json", JSON.stringify(keys));

// inquirer
//   .prompt([
//     {
//       type: "input",
//       name: "name",
//       default: "admin",
//       message: "Admin username",
//     },
//     {
//       type: "input",
//       name: "email",
//       default: "mail@mail.com",
//       message: "Admin email",
//     },
//     {
//       type: "password",
//       name: "password",
//       default: "admin",
//       message: "Admin password",
//     },
//     {
//       type: "password",
//       name: "password confirm",
//       default: "admin",
//       message: "confirm",
//     },
//   ])
//   .then((user) => {
//     user.groups = [];
//     user.isAdmin = true;

//     fs.writeFile("./db.json", JSON.stringify(user), (error) => {
//       if (error) throw error;
//     });
//   })
//   .catch((error) => {
//     console.log("error", error);
//     if (error.isTtyError) {
//       // Prompt couldn't be rendered in the current environment
//     } else {
//       // Something else when wrong
//     }
//   });
