const nodemailer = require("nodemailer");
const { htmlToText } = require("html-to-text");
const path = require("path");
const fs = require("node:fs");

const replacePlaceholders = (html, parent, children) => {
  const placeholderMap = {};
  placeholderMap["#Name#"] = `${parent.firstName} ${parent.lastName}`;

  const initialChildrenPlaceholder =
    children.length === 1 ? "Ihres Kindes " : "Ihrer Kinder ";

  placeholderMap["#Kinder#"] = children
    .map((child) => `${child.firstName} ${child.lastName}`)
    .reduce((acc, curr, currIndex, array) => {
      if (currIndex === array.length - 1) {
        return acc + curr;
      } else if (currIndex === array.length - 2) {
        return acc + curr + " und ";
      } else {
        return acc + curr + ", ";
      }
    }, initialChildrenPlaceholder);

  return Object.keys(placeholderMap).reduce(
    (acc, curr) => acc.replace(curr, placeholderMap[curr]),
    html,
  );
};

module.exports = async (parent, children) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "mx2f1a.netcup.net",
      port: 25,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let html = fs.readFileSync(
      path.join(__dirname, "../email/confirmation.html"),
      "utf8",
    );

    html = replacePlaceholders(html, parent, children);

    await transporter.sendMail({
      from: `"FELB Cloppenburg" <${process.env.EMAIL_USER}>`,
      to: parent.email,
      bcc: process.env.EMAIL_BCC,
      subject: "Anmeldebestätigung Zeltlager 2024",
      text: htmlToText(html),
      html: html,
      attachments: [
        {
          filename: "Infoblatt.pdf",
          path: path.join(__dirname, "../email/pdfs/Infoblatt.pdf"),
        },
        {
          filename: "logo.png",
          path: path.join(__dirname, "../public/images/square.png"),
          cid: "zeltlager-logo",
        },
      ],
    });

    console.log("Successfully send mail to", parent.email);
  } catch (e) {
    console.log(`Sending mail to ${parent.email} failed.`);
    console.log("Reason:", e);
  }
};
