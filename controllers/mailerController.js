const User = require("../models/User");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

// https://ethereal.email/create
let nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.USERMAILER,
    pass: process.env.PAASWORDMAILER,
  },
};

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "beulah.bernhard83@ethereal.email",
    pass: "95BFZmtjEzcFh5TJ21",
  },
});

// let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

/** POST: http://localhost:8080/api/registerMail 
 * @param: {
  "username" : "example123",
  "userEmail" : "admin123",
  "text" : "",
  "subject" : "",
}
*/
module.exports = {
  registerMail: async (req, res) => {
    const { username, userEmail, text, subject } = req.body;

     console.log("PROCESS", process.env.USERMAILER);
     console.log("PROCESS", process.env.PASSWORDMAILER);


    // body of the email
    var email = {
      body: {
        name: username,
        intro:
          text ||
          "Welcome to FlashPay! We're very excited to have you on board.",
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    var emailBody = MailGenerator.generate(email);

    let message = {
      from: process.env.USERMAILER,
      to: userEmail,
      subject: subject || "Signup Successful",
      html: emailBody,
    };

    // send mail
    transporter
      .sendMail(message)
      .then(() => {
        return res
          .status(200)
          .send({ msg: "You should receive an email from us." });
      })
      .catch((error) => res.status(500).send({ error }));
  },
};
