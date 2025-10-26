const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Email setup (will use Render environment variables)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/book', (req, res) => {
  const b = req.body;

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

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Booking received but email failed');
    } else {
      console.log('Email sent:', info.response);
      return res.send('Booking submitted successfully!');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
