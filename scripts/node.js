const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const fs = require('fs');
const csv = require('csv-parser');
const nodemailer = require('nodemailer');
const mjml = require('mjml');

const csvPath = path.resolve(__dirname, '../data/suscriptores.csv');
const mjmlPath = path.resolve(__dirname, '../mjml/supuesto4.mjml');

// Cargar plantilla MJML
const mjmlTemplate = fs.readFileSync(mjmlPath, 'utf-8');
const htmlOutput = mjml(mjmlTemplate).html;

// Configurar transportador de correo
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

function sendEmails() {
  const recipients = [];

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (row) => {
      if (row.email) {
        recipients.push(row.email);
      }
    })
    .on('end', async () => {
      console.log(`Se encontraron ${recipients.length} suscriptores. Enviando correos...`);

      for (const email of recipients) {
        try {
          await transporter.sendMail({
            from: `"Feria Dos Ruedas" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Participa en el sorteo del GP de Motociclismo | Feria Valencia',
            html: htmlOutput
          });
          console.log(`✅ Correo enviado a: ${email}`);
        } catch (error) {
          console.error(`❌ Error al enviar a ${email}:`, error.message);
        }
      }

      console.log('🎉 Todos los correos han sido procesados.');
    });
}

sendEmails();
