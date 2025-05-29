const fs = require('fs');
const path = require('path');
const mjml = require('mjml');
const puppeteer = require('puppeteer');
const { exec } = require('child_process');

(async () => {
  try {
    // 1. Leer MJML
    const mjmlPath = path.resolve(__dirname, '../mjml/supuesto4.mjml');
    const mjmlContent = fs.readFileSync(mjmlPath, 'utf8');

    // 2. Convertir a HTML
    const { html } = mjml(mjmlContent, { minify: true });

    // 3. Guardar HTML temporal
    const htmlPath = path.resolve(__dirname, 'temp.html');
    fs.writeFileSync(htmlPath, html);

    // 4. Capturar video con Puppeteer y FFmpeg
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

    const webmPath = path.resolve(__dirname, 'reel.webm');

    // Lanzar ffmpeg para grabar la pantalla (requiere X11, probablemente no funcione en servidor sin GUI)
    const ffmpeg = exec(`ffmpeg -y -f x11grab -video_size 1080x1920 -i :99.0 -t 5 -r 30 ${webmPath}`);

    console.log('⏳ Reproduciendo HTML para captura...');
    // Esperar 5 segundos usando Promise + setTimeout (compatible con versiones viejas)
    await new Promise(resolve => setTimeout(resolve, 5000));

    await browser.close();
    ffmpeg.kill('SIGINT');

    // 5. Convertir a MP4
    const mp4Path = path.resolve(__dirname, 'reel.mp4');
    exec(`ffmpeg -y -i ${webmPath} -c:v libx264 -preset fast -pix_fmt yuv420p ${mp4Path}`, (error) => {
      if (error) throw error;
      console.log('✅ Reel generado en:', mp4Path);
    });

  } catch (err) {
    console.error('❌ Error:', err);
  }
})();
