// utils/sendEmail.js
const nodemailer = require('nodemailer');

/**
 * Sends a confirmation email to the specified recipient.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} text - The content of the email.
 */
const sendConfirmationEmail = async (to, subject, text) => {
    try {
        // Create a transporter object using your email service
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Change this if you're using another email service
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email password or app-specific password
            },
        });

        // Define email options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to, // Recipient's email address
            subject,
            text,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email sending failed');
    }
};

module.exports = sendConfirmationEmail;
