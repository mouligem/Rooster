require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const Table = require('./models/Table'); // Assuming you have a Table model in models/Table.js
const User = require('./models/User'); // Assuming you have a User model in models/User.js

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Routes

// User Registration
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// User Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            res.status(200).json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Check table availability
app.get('/tables', async (req, res) => {
    try {
        const tables = await Table.find();
        res.status(200).json(tables);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tables' });
    }
});

// Book a table
app.post('/tables/book', async (req, res) => {
    try {
        const { tableNumber, email } = req.body;
        const table = await Table.findOne({ tableNumber });

        if (table && table.isAvailable) {
            table.isAvailable = false;
            table.reservedBy = email;
            table.reservedAt = new Date();
            await table.save();

            // Send acknowledgment email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Table Booking Confirmation',
                text: `Your table ${tableNumber} has been successfully booked.`,
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Error sending email', err);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            res.status(200).json({ message: 'Table booked successfully' });
        } else {
            res.status(400).json({ error: 'Table not available' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to book table' });
    }
});

app.post('/api/tables/book', (req, res) => {
    const { tableNumber, customerName, customerEmail, bookingDate, bookingTime, totalPrice } = req.body;

    if (!tableNumber || !customerName || !customerEmail || !bookingDate || !bookingTime || !totalPrice) {
        return res.status(400).send('Missing required fields');
    }

    const newBooking = new BookingModel({
        customerName,
        customerEmail,
        tableNumber,
        bookingDate,
        bookingTime,
        totalPrice
    });

    newBooking.save()
        .then(() => res.status(200).send('Table booked successfully!'))
        .catch(err => {
            console.error('Error saving booking:', err);
            res.status(500).send('Failed to book table. Please try again.');
        });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
