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

function sendVerificationEmail(receiver) {
  return sendEmail(`
  با سلام 
  <br>
  برنامه The Maze طبق برنامه ساعت ۹ در سایت دانشکده جدید (پشت آسانسور ها) برگزار خواهد شد
  <br>
  منتظرتون هستیم
  <br>
  یادتون نره :)
  <br>
  -شاخه دانشجویی acm دانشگاه تهران
  `,
    [receiver]);
}

module.exports = {
  sendVerificationEmail
};