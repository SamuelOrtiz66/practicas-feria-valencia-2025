const fs = require('fs');
const path = require('path');
const mjml = require('mjml');
const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const { exec } = require('child_process');

(async () => {
  try {
    // 1. Leer y convertir MJML a HTML
    const mjmlPath = path.resolve(__dirname, '../mjml/supuesto4_reel.mjml');
    const mjmlContent = fs.readFileSync(mjmlPath, 'utf8');

    const { html } = mjml(mjmlContent, { minify: true });
    const htmlPath = path.resolve(__dirname, 'temp.html');
    fs.writeFileSync(htmlPath, html);

    // 2. Lanzar navegador y abrir página con el HTML generado
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

    // 3. Iniciar grabación de pantalla virtual
    const recorder = new PuppeteerScreenRecorder(page);
    const webmPath = path.resolve(__dirname, 'reel.webm');

    console.log('⏳ Iniciando grabación...');
    await recorder.start(webmPath);

    // 4. Esperar 5 segundos con Promise y setTimeout
    await new Promise(resolve => setTimeout(resolve, 5000));

    await recorder.stop();
    await browser.close();

    // 5. Convertir webm a mp4 usando ffmpeg
    console.log('🎥 Convirtiendo a MP4...');
    const mp4Path = path.resolve(__dirname, 'reel.mp4');
    exec(`ffmpeg -y -i "${webmPath}" -c:v libx264 -preset fast -pix_fmt yuv420p "${mp4Path}"`, (error) => {
      if (error) throw error;
      console.log('✅ Reel generado en:', mp4Path);
    });

  } catch (err) {
    console.error('❌ Error:', err);
  }
})();
