const fs = require('fs');
const path = require('path');
const mjml = require('mjml');
const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const { exec } = require('child_process');

(async () => {
  try {
    //Definir carpeta de destino para los archivos
    const videosDir = path.resolve(__dirname, '../videos_redes');

    //Crear la carpeta si no existe
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir);
    }

    //Leer y convertir MJML a HTML
    const mjmlPath = path.resolve(__dirname, '../mjml/supuesto1_reel.mjml');
    const mjmlContent = fs.readFileSync(mjmlPath, 'utf8');

    const { html } = mjml(mjmlContent, { minify: true });
    const htmlPath = path.resolve(videosDir, 'temp.html');
    fs.writeFileSync(htmlPath, html);

    //Lanzar navegador y abrir página con el HTML generado
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

    //Iniciar grabación de pantalla virtual
    const recorder = new PuppeteerScreenRecorder(page);
    const webmPath = path.resolve(videosDir, 'reel.webm');

    console.log('⏳ Iniciando grabación...');
    await recorder.start(webmPath);

    //Esperar 5 segundos con Promise y setTimeout
    await new Promise(resolve => setTimeout(resolve, 5000));

    await recorder.stop();
    await browser.close();

    //Convertir webm a mp4 usando ffmpeg
    console.log('🎥 Convirtiendo a MP4...');
    const mp4Path = path.resolve(videosDir, 'reel.mp4');
    exec(`ffmpeg -y -i "${webmPath}" -c:v libx264 -preset fast -pix_fmt yuv420p "${mp4Path}"`, (error) => {
      if (error) throw error;
      console.log('✅ Reel generado en:', mp4Path);

      fs.unlinkSync(htmlPath);
      fs.unlinkSync(webmPath);
    });

  } catch (err) {
    console.error('❌ Error:', err);
  }
})();

