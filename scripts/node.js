const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const fs = require('fs');
const mjml = require('mjml');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');

// Función principal
async function main() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
  });

  // Leer plantilla MJML
  const mjmlPath = path.resolve(__dirname, '../mjml/supuesto4.mjml');
  const mjmlTemplateOriginal = fs.readFileSync(mjmlPath, 'utf-8');

  // Elegir proveedor SMTP
  const provider = process.env.SMTP_PROVIDER || 'gmail';

  const smtpConfig = {
    gmail: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
    outlook: {
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      user: process.env.OUTLOOK_USER,
      pass: process.env.OUTLOOK_PASS,
    },
  };

  const selectedProvider = smtpConfig[provider];

  if (!selectedProvider) {
    console.error(`❌ Proveedor SMTP no válido: ${provider}`);
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: selectedProvider.host,
    port: selectedProvider.port,
    secure: selectedProvider.secure,
    auth: {
      user: selectedProvider.user,
      pass: selectedProvider.pass,
    },
  });

  try {
    // Consultar suscriptores
    const [suscriptores] = await connection.execute('SELECT * FROM suscriptores');

    console.log(`Se encontraron ${suscriptores.length} suscriptores. Enviando correos...`);

    for (const suscriptor of suscriptores) {
      try {
        // Personalizar plantilla MJML
        let mjmlTemplatePersonalizado = mjmlTemplateOriginal
          .replace(/\{\{nombre\}\}/g, suscriptor.nombre || '')
          .replace(/\{\{empresa\}\}/g, suscriptor.empresa || '')
          .replace(/\{\{idioma\}\}/g, suscriptor.idioma || '');

        // Convertir a HTML
        const { html, errors } = mjml(mjmlTemplatePersonalizado);
        if (errors && errors.length > 0) {
          console.error('Errores en MJML:', errors);
          throw new Error('Error en la plantilla MJML');
        }

        // Enviar al correo real del suscriptor
        await transporter.sendMail({
          from: `"Feria Valencia" <${selectedProvider.user}>`,
          to: suscriptor.email,
          subject: '¡Participa en el sorteo del GP de Motociclismo | Feria Valencia!',
          html,
        });

        console.log(`✅ Correo enviado a: ${suscriptor.email}`);

        // Registrar envío exitoso
        await connection.execute(
          `INSERT INTO historial_envios (suscriptor_id, newsletter_id, fecha_envio, asunto, estado_envio)
           VALUES (?, ?, NOW(), ?, 'enviado')`,
          [suscriptor.id, 1, '¡Participa en el sorteo del GP de Motociclismo | Feria Valencia!']
        );
      } catch (error) {
        console.error(`❌ Error enviando a ${suscriptor.email}:`, error.message);

        // Registrar fallo
        await connection.execute(
          `INSERT INTO historial_envios (suscriptor_id, newsletter_id, fecha_envio, asunto, estado_envio)
           VALUES (?, ?, NOW(), ?, 'fallido')`,
          [suscriptor.id, 1, '¡Participa en el sorteo del GP de Motociclismo | Feria Valencia!']
        );
      }
    }

    console.log('🎉 Todos los correos han sido procesados.');
  } catch (error) {
    console.error('Error general:', error.message);
  } finally {
    await connection.end();
  }
}

main();
