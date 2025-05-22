require('dotenv').config()
const mjml = require('mjml')
const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')

async function sendEmail() {
  try {
    // 1. Leer el archivo MJML
    const mjmlFile = path.join(__dirname, 'newsletter.mjml')
    const mjmlContent = fs.readFileSync(mjmlFile, 'utf-8')

    // 2. Convertir MJML a HTML
    const { html, errors } = mjml(mjmlContent)
    if (errors.length > 0) {
      console.error('Errores en MJML:', errors)
      return
    }

    // 3. Configurar el transporte de nodemailer para Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    // 4. Configurar el correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'samuelortizheredia@gmail.com', // Cambia por el destinatario real
      subject: 'Sorteo GP Cheste - Feria Dos Ruedas',
      html // El HTML generado del MJML
    }

    // 5. Enviar el correo
    const info = await transporter.sendMail(mailOptions)
    console.log('Correo enviado:', info.response)

  } catch (error) {
    console.error('Error enviando correo:', error)
  }
}

sendEmail()
