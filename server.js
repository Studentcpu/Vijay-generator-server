const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Setup transporter using environment variables from Render
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Gmail address
    pass: process.env.EMAIL_PASS   // Gmail App Password (16 chars)
  }
});

// Optional: verify transporter on server start
transporter.verify((error, success) => {
  if (error) console.log('Email setup error:', error);
  else console.log('Email server is ready to send messages');
});

// Booking endpoint
app.post('/book', async (req, res) => {
  const b = req.body;

  // Validate required fields
  if (!b.model || !b.date || !b.time || !b.name || !b.phone || !b.location) {
    return res.status(400).send('Please fill all required fields.');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'New Vijay Generator Booking!',
    text: `
New Booking:

Model: ${b.model}
Date: ${b.date}
Time: ${b.time}
Name: ${b.name}
Phone: ${b.phone}
Email: ${b.email}
Location: ${b.location}
Quantity: ${b.qty}
Message: ${b.message}
`
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Booking email sent:', info.response);
    res.send('Booking submitted successfully! Check your email.');
  } catch (err) {
    console.error('Failed to send booking email:', err);
    res.status(500).send('Booking received but failed to send email.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
