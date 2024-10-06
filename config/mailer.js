// Nodemailer
import nodemailer from 'nodemailer';

// Path
import path from 'path';

// Read the HTML email template file
const emailTemplatePath = path.join(process.cwd(), 'views/email/template.ejs'); // Use process.cwd() to get the current directory

const host = `${process.env.MAIL_ENCRYPTION}://${process.env.MAIL_HOST}`;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: host,
    port: process.env.MAIL_PORT,
    secure: true, // use SSL
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

// Verify connection configuration
transporter.verify((err, info) => {
    try {
        console.log('Server is ready to take our messages: ', info);
    } catch (error) {
        console.error(error);
    }
});

// Export as a named export
export { 
    transporter, 
    emailTemplatePath 
};