# EMyMail - Temporary Email Service

🛡️ **Private, Fast, and Secure Temporary Email Service**

EMyMail is a web-based temporary email service designed for privacy-conscious users who need quick email addresses for verification purposes, especially for Discord account creation.

## Features

✅ **No Registration Required** - Start using instantly
✅ **20-Minute Expiration** - Automatic cleanup
✅ **Multiple Domains** - Choose between @sendhelpdad.mail or @sendhelpmom.mail
✅ **Email Regeneration** - Generate unlimited temporary emails
✅ **Receive Emails** - Full inbox functionality
✅ **Black & White Theme** - Clean, minimalist aesthetic
✅ **100% Private** - No tracking, no cookies, no logs
✅ **Secure** - End-to-end encrypted storage
✅ **Mobile Friendly** - Works on all devices

## Tech Stack

### Frontend
- HTML5
- CSS3 (Modern Grid & Flexbox)
- Vanilla JavaScript (No dependencies)

### Backend
- Node.js
- Express.js
- MongoDB (NoSQL Database)
- Nodemailer (Email Integration)

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/aadarshrashalpur-oss/emymail.git
   cd emymail
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## Usage

1. **Generate Email** - Click "New Email" or let one auto-generate on page load
2. **Copy Email** - Click "Copy Email" button to copy to clipboard
3. **Choose Domain** - Select between @sendhelpdad.mail or @sendhelpmom.mail
4. **Receive Emails** - Emails are automatically added to your inbox
5. **View Messages** - Click on any email to view its contents
6. **Auto Expiration** - After 20 minutes, email automatically expires and new one generates

## API Endpoints

### Generate Temporary Email
```
POST /api/generate-email
Body: { "domain": "@sendhelpdad.mail" }
Response: { "email": "abc123xyz@sendhelpdad.mail", "expiresIn": 1200 }
```

### Get Inbox
```
GET /api/inbox/:emailAddress
Response: { "messages": [...] }
```

### Receive Email (Webhook)
```
POST /api/receive-email
Body: {
  "to": "abc123xyz@sendhelpdad.mail",
  "from": "sender@example.com",
  "subject": "Verification Code",
  "body": "<html>...</html>"
}
```

### Health Check
```
GET /api/health
Response: { "status": "OK" }
```

## Deployment

### Deploy to Heroku

1. **Create Heroku app**
   ```bash
   heroku create emymail
   ```

2. **Add MongoDB Atlas**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Deploy to Vercel (Frontend Only)

1. Push to GitHub
2. Connect to Vercel
3. Deploy with one click

## Security & Privacy

🔐 **No Data Collection**
- We don't track users
- No cookies or local tracking
- No analytics or third-party services

🔐 **Automatic Deletion**
- Emails auto-expire after 20 minutes
- Database records automatically purged
- No permanent storage of user data

🔐 **Encrypted Storage**
- Messages stored securely in MongoDB
- HTTPS/TLS for all communications
- Secure random email generation

## File Structure

```
emymail/
├── index.html          # Main frontend
├── styles.css          # Styling
├── script.js           # Frontend logic
├── server.js           # Backend server
├── package.json        # Dependencies
├── .env.example        # Environment template
├── .gitignore          # Git ignore rules
└── README.md           # Documentation
```

## Browser Support

✅ Chrome/Chromium (v90+)
✅ Firefox (v88+)
✅ Safari (v14+)
✅ Edge (v90+)
✅ Mobile Browsers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions, please open a GitHub issue.

## Disclaimer

**Use Responsibly**: This service is meant for legitimate purposes only. Do not use for:
- Spam or phishing
- Account takeover
- Malicious activities
- Violation of terms of service

---

**Made with ❤️ by the EMyMail Team**

*Last Updated: 2024*