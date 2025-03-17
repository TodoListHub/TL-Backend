import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const JWT_SECRET = process.env.JWT_SECRET || 'asfhdb36t3svvdcaqs1'

export async function sendResetPasswordEmail(userEmail:string , userId:number ) {

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' })

    const resetLink = `http://localhost:3000/reset-password?token=${token}`

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'arabiamir2005@gmail.com',
            pass: 'A1m3i8r40630476845',
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