const transporter = require("../config/mailer");

// যেকোনো জায়গা থেকে সহজে ইমেইল পাঠানোর জন্য reusable ফাংশন
const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    // Email পাঠাতে সমস্যা হলেও যেন appointment save করার মূল কাজ আটকে না যায়
    console.error("Email sending failed:", error.message);
  }
};

module.exports = sendEmail;
