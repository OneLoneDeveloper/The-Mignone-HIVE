const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true if port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Utility to send mail
async function sendMail({ formType, name, email, body }) {
  return await transporter.sendMail({
    from: `"Website Contact" <${process.env.SMTP_USER}>`,
    to: process.env.TO_EMAIL,
    replyTo: email,
    subject: `[${formType}] New submission from ${name}`,
    text: body,
    html: `<pre style="font:14px/1.4 sans-serif">${body}</pre>`,
  });
}

module.exports = { sendMail };
