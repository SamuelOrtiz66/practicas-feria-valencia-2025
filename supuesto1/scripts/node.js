const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

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

    const mjmlPath = path.resolve(__dirname, '../mjml/supuesto1.mjml');
    const mjmlTemplateOriginal = fs.readFileSync(mjmlPath, 'utf-8');

    // Configurar SMTP
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

    const [suscriptores] = await connection.execute('SELECT * FROM suscriptores');
    console.log(`Se encontraron ${suscriptores.length} suscriptores. Enviando correos...`);

    for (const suscriptor of suscriptores) {
      try {
        // Sustituir variables en MJML
        const mjmlPersonalizado = mjmlTemplateOriginal
          .replace(/{{\s*nombre\s*}}/g, suscriptor.nombre || '')
          .replace(/{{\s*empresa\s*}}/g, suscriptor.empresa || '')
          .replace(/{{\s*idioma\s*}}/g, suscriptor.idioma || '');

        const { html, errors } = mjml(mjmlPersonalizado);
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

        // Insertar en historial_envios con boletin_id = 1
        await connection.execute(
          `INSERT INTO historial_envios (suscriptor_id, boletin_id, asunto, estado_envio, fecha_envio, error_mensaje)
           VALUES (?, ?, ?, 'enviado', NOW(), NULL)`,
          [suscriptor.id, 1, '¡Participa en el sorteo del GP de Motociclismo | Feria Valencia!']
        );
      } catch (error) {
        console.error(`❌ Error enviando a ${suscriptor.email}:`, error.message);

        await connection.execute(
          `INSERT INTO historial_envios (suscriptor_id, boletin_id, asunto, estado_envio, fecha_envio, error_mensaje)
           VALUES (?, ?, ?, 'error', NOW(), ?)`,
          [suscriptor.id, 1, '¡Participa en el sorteo del GP de Motociclismo | Feria Valencia!', error.message]
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
