// utils/sendEmail.js

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. transporter 객체 생성 (Gmail 사용)
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // TLS
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    // 2. 이메일 옵션 정의
    const mailOptions = {
        from: `"${process.env.SENDER_NAME}" <${process.env.GMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
    };

    // 3. 이메일 발송
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('이메일 발송에 실패했습니다.');
    }
};

module.exports = sendEmail;