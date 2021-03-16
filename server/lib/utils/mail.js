import config from '../config';

const nodemailer = require('nodemailer');

export default function sendPasswordResetMail({ destination, url }) {
  return config
    .getValue('mail')
    .then(({ id, password, service }) => {
      const transporter = nodemailer.createTransport({
        service,
        auth: {
          user: id,
          pass: password,
        },
      });
      // send mail with defined transport object
      return transporter.sendMail({
        from: `"Door Manager" <${id}>`,
        to: `${destination}`,
        subject: 'Password reset',
        text: `Cliquez sur ce lien pour changer de mot de passe: ${url}`,
        html: `<a href= ${url}>Cliquez sur ce lien pour changer de mot de passe</a>`,
      });
    })
    .then((info) => {
      console.log('ICI');
      console.log('Message sent: %s', info.messageId);
    });
}
