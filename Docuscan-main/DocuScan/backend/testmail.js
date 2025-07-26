require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const testEmail = async () => {
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: 'soujanya8136@gmail.com', // Replace with a valid recipient email
        subject: 'Test Email',
        text: 'This is a test email!',
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Test email sent successfully!');
    } catch (error) {
        console.error('Error sending test email:', error);
    }
};

testEmail();
