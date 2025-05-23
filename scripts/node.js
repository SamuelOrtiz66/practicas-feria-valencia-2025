const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const fs = require('fs');
const mjml = require('mjml');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');

//1. Conectar a MySQL
async function main() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
  });

  //2. Leer plantilla MJML
  const mjmlPath = path.resolve(__dirname, '../mjml/supuesto4.mjml');
  const mjmlTemplateOriginal = fs.readFileSync(mjmlPath, 'utf-8');

  //3. Configurar transporter nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    //4. Consultar suscriptores
    const [suscriptores] = await connection.execute('SELECT * FROM suscriptores');

    console.log(`Se encontraron ${suscriptores.length} suscriptores. Enviando correos...`);

    //5. Iterar suscriptores y enviar emails personalizados
    for (const suscriptor of suscriptores) {
      try {
        //Personalizar plantilla MJML con datos del suscriptor
        let mjmlTemplatePersonalizado = mjmlTemplateOriginal
          .replace(/\{\{nombre\}\}/g, suscriptor.nombre || '')
          .replace(/\{\{empresa\}\}/g, suscriptor.empresa || '')
          .replace(/\{\{idioma\}\}/g, suscriptor.idioma || '');

        //Convertir MJML a HTML
        const { html, errors } = mjml(mjmlTemplatePersonalizado);
        if (errors && errors.length > 0) {
          console.error('Errores en MJML:', errors);
          throw new Error('Error en la plantilla MJML');
        }

        //Enviar correo
        await transporter.sendMail({
          from: `"Feria Valencia" <${process.env.SMTP_USER}>`,
          to: suscriptor.email,
          subject: '¡Participa en el sorteo del GP de Motociclismo | Feria Valencia!',
          html,
        });

        console.log(`✅ Correo enviado a: ${suscriptor.email}`);

        //Registrar envío exitoso en historial_envios
        await connection.execute(
          `INSERT INTO historial_envios (suscriptor_id, newsletter_id, fecha_envio, asunto, estado_envio)
           VALUES (?, ?, NOW(), ?, 'enviado')`,
          [suscriptor.id, 1, '¡Participa en el sorteo del GP de Motociclismo | Feria Valencia!']
        );
      } catch (error) {
        console.error(`❌ Error enviando a ${suscriptor.email}:`, error.message);

        //Registrar envío fallido en historial_envios
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
    // 6. Cerrar conexión
    await connection.end();
  }
}

// Ejecutar script
main();
