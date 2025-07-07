const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());
// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aashishpro18@gmail.com',
        pass: 'lwwpsphhqyelrkya'
    }
});

// POST route to send the message
app.post('/send-message', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: email,
        to: 'aashishpro18@gmail.com', // Your email address where you want to receive messages
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send email',
            });
        }
        res.json({
            success: true,
            message: 'Email sent successfully!',
        });
    });
});
app.get('/', (req, res) => {
  res.send('Welcome to the homepage!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
