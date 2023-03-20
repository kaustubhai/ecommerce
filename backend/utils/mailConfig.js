import nodemailer from 'nodemailer'

const emailer = (data) => {
  const { to, body, subject } = data
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS
    }
  })
  const mailOptions = {
    from: `"Admin" <${process.env.MAIL}>`,
    to,
    cc: ['admin@example.com'],
    subject,
    html: body
  }
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error)
      return false
    }
    return true
  })
}

export default emailer
