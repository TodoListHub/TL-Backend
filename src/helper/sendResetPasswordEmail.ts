import nodemailer from 'nodemailer'
import dotenv from 'dotenv'


dotenv.config()


export async function sendResetPasswordEmail(userEmail:string) {


    const resetLink = `https://tl-front-eight.vercel.app/reset-password`


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    })

    try{
        const info = await transporter.sendMail({
            from: 'arabiamir2005@gmail.com',
            replyTo: 'arabiamir2005@gmail.com',
            to: userEmail,
            subject: 'Reset Password',
            text: `Click the following link to reset your password: ${resetLink}`,
        });

        console.log("email sent:" + info.response)
        console.log(userEmail)
        return { message: 'Reset password email sent' }
    }catch(error){
        console.log(error)
        return { message: 'Failed to send reset password email' }
    }

}