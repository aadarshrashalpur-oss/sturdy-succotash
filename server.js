const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/emymail')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Email Schema
const emailSchema = new mongoose.Schema({
    emailAddress: String,
    prefix: String,
    domain: String,
    createdAt: { type: Date, default: Date.now, expires: 1200 }, // Auto-delete after 20 minutes
    messages: [{
        from: String,
        subject: String,
        body: String,
        timestamp: { type: Date, default: Date.now }
    }]
});

const Email = mongoose.model('Email', emailSchema);

// Routes

// Generate new temporary email
app.post('/api/generate-email', async (req, res) => {
    try {
        const { domain } = req.body;
        const prefix = crypto.randomBytes(10).toString('hex');
        const emailAddress = `${prefix}${domain}`;
        
        const email = new Email({
            emailAddress,
            prefix,
            domain,
            createdAt: new Date()
        });
        
        await email.save();
        
        res.json({
            success: true,
            email: emailAddress,
            prefix,
            domain,
            expiresIn: 1200
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to generate email' });
    }
});

// Get inbox for email
app.get('/api/inbox/:emailAddress', async (req, res) => {
    try {
        const { emailAddress } = req.params;
        const email = await Email.findOne({ emailAddress });
        
        if (!email) {
            return res.json({ success: false, error: 'Email not found' });
        }
        
        res.json({
            success: true,
            messages: email.messages || []
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to fetch inbox' });
    }
});

// Receive email (incoming webhook)
app.post('/api/receive-email', async (req, res) => {
    try {
        const { to, from, subject, body } = req.body;
        
        const email = await Email.findOne({ emailAddress: to });
        
        if (!email) {
            return res.json({ success: false, error: 'Email address not found' });
        }
        
        email.messages.push({
            from,
            subject,
            body,
            timestamp: new Date()
        });
        
        await email.save();
        
        res.json({
            success: true,
            message: 'Email received successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to receive email' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'EMyMail server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`EMyMail server running on port ${PORT}`);
});