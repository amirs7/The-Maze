const nodemailer = require('nodemailer');
function sendEmail(subject, bodyText, bodyHTML, receivers) {
  return new Promise((resolve, reject) => {
    nodemailer.createTestAccount((err, account) => {
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      let mailOptions = {
        from: `'${process.env.EMAIL_NAME}' <${process.env.EMAIL_USERNAME}>`,
        to: receivers.join(','),
        subject,
        text: bodyText,
        html: bodyHTML
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        resolve(info);
      });
    });
  });
}

function sendVerificationEmail(link, receiver) {
  return sendEmail('The Maze Signup Verification',
    `Click this link to verify your registration:\n ${link}`,
    `<b>Click <a href="${link}">here</a> to verify your registration</b>`,
    [receiver]);
}

module.exports = {
  sendVerificationEmail
};