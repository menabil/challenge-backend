const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendAppointmentEmail = async (to, doctor, date, serial) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Appointment Confirmed',
      text: `Doctor: ${doctor}\nDate: ${date}\nSerial: ${serial}`
    });
  } catch (e) {
    console.error('Email error:', e.message);
  }
};

module.exports = { sendAppointmentEmail };
