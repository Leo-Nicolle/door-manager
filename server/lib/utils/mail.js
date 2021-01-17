const nodemailer = require("nodemailer");
const fs = require('fs')
function getMailCredentials(){
  return new Promise((resolve, reject)=> {
    fs.readFile('./config.json',"utf-8", (err, data) => {
      if(err)reject(err);
      resolve(JSON.parse(data).mail);
    })
  })
}

export default function sendPasswordResetMail({destination, url}) {
  return getMailCredentials()
  .then(({id, password, service}) => {
      let transporter = nodemailer.createTransport({
        service,
        auth: {
          user: id,
          pass: password
        },
      });
      console.log('ICI', id)
      // send mail with defined transport object
      return transporter.sendMail({
        from: `"Door Manager" <${id}>`,
        to: `${destination}`,
        subject: "Password reset", 
        text: `Click on this link to reset password: ${url}`,
        html: `<a href= ${url}>Click on this link to reset password</a>`,
      });
    })
    .then((info) => {
      console.log("Message sent: %s", info.messageId);
    })
}
