import nodemailer from 'nodemailer'
import dotenv from 'dotenv'


dotenv.config()


export async function sendResetPasswordEmail(userEmail:string) {


    const resetLink = `http://localhost:3000/reset-password`


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    })


    await transporter.sendMail({
        from: 'arabiamir2005@gmail.com',
        to: userEmail,
        subject: 'Reset Password',
        text: `Click the following link to reset your password: ${resetLink}`,
    });

    return { message: 'Reset password email sent' }
}