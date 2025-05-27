const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const fs = require('fs');
const csv = require('csv-parser');
const mjml = require('mjml');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');

async function importarSuscriptoresDesdeCSV(connection, csvPath) {
  return new Promise((resolve, reject) => {
    const suscriptores = [];
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        suscriptores.push(row);
      })
      .on('end', async () => {
        try {
          for (const suscriptor of suscriptores) {
            // Insertar solo si no existe email para evitar duplicados
            await connection.execute(
              `INSERT IGNORE INTO suscriptores (nombre, email, empresa, idioma, fecha_registro) VALUES (?, ?, ?, ?, ?)`,
              [
                suscriptor.nombre,
                suscriptor.email,
                suscriptor.empresa,
                suscriptor.idioma,
                suscriptor.fecha_registro ? suscriptor.fecha_registro : new Date(),
              ]
            );
          }
          console.log(`Importados ${suscriptores.length} suscriptores desde CSV`);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });
}

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
  });

  try {
    const csvPath = path.resolve(__dirname, '../data/suscriptores.csv');
    await importarSuscriptoresDesdeCSV(connection, csvPath);

    // Leer plantilla MJML
    const mjmlPath = path.resolve(__dirname, '../mjml/supuesto4.mjml');
    const mjmlTemplateOriginal = fs.readFileSync(mjmlPath, 'utf-8');

    // Configurar transporter SMTP según provider (outlook o gmail)
    let transporterConfig;
    if (process.env.SMTP_PROVIDER === 'gmail') {
      transporterConfig = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      };
    } else {
      // outlook por defecto
      transporterConfig = {
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.OUTLOOK_USER,
          pass: process.env.OUTLOOK_PASS,
        },
      };
    }
    const transporter = nodemailer.createTransport(transporterConfig);

    // Consultar suscriptores para enviar email
    const [suscriptores] = await connection.execute('SELECT * FROM suscriptores');

    console.log(`Se encontraron ${suscriptores.length} suscriptores. Enviando correos...`);

    for (const suscriptor of suscriptores) {
      try {
        const mjmlTemplatePersonalizado = mjmlTemplateOriginal
          .replace(/\{\{nombre\}\}/g, suscriptor.nombre || '') // Modificación aquí
          .replace(/\{\{empresa\}\}/g, suscriptor.empresa || '')
          .replace(/\{\{idioma\}\}/g, suscriptor.idioma || '');

        const { html, errors } = mjml(mjmlTemplatePersonalizado);
        if (errors && errors.length > 0) {
          console.error('Errores en MJML:', errors);
          throw new Error('Error en la plantilla MJML');
        }

        await transporter.sendMail({
          from: `"Feria Valencia" <${transporterConfig.auth.user}>`,
          to: suscriptor.email,
          subject: '¡Participa en el sorteo del GP de Motociclismo | Feria Valencia!',
          html,
        });

        console.log(`✅ Correo enviado a: ${suscriptor.email}`);

        await connection.execute(
          `INSERT INTO historial_envios (suscriptor_id, newsletter_id, fecha_envio, asunto, estado_envio)
           VALUES (?, ?, NOW(), ?, 'enviado')`,
          [suscriptor.id, 1, '¡Participa en el sorteo del GP de Motociclismo | Feria Valencia!']
        );
      } catch (error) {
        console.error(`❌ Error enviando a ${suscriptor.email}:`, error.message);
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
