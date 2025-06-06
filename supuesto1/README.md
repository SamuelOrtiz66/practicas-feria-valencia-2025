# 📬 SUPUESTO 4 — Campaña de Email Marketing para Feria Dos Ruedas (Feria Valencia 2025)

Este proyecto consiste en el diseño, desarrollo y envío automatizado de una campaña de email marketing con tecnología MJML y Node.js, para promocionar el salon del comic de Feria Valencia.

---

## 🎯 Objetivo

Enviar un **newsletter personalizado** a cada suscriptor registrado en la base de datos, con un enlace de participación en el sorteo de entradas. El contenido del correo se adapta al dispositivo del usuario y es compatible con Outlook y Gmail.

---

## 🧾 Estructura del Proyecto
```bash
supuesto1/
├── data/                 # CSV con datos de suscriptores
│   └── suscriptores.csv
├── mjml/                 # Plantilla del email en MJML
│   ├── supuesto1.mjml
│   └── supuesto1_reel.mjml
├── mockups/              # Material de diseño y análisis
│   ├── diagrama-ER.png
│   ├── mockup final.png
│   └── dafo.png
├── pdfs/                 # Documentación final y por partes
│   └── informe-final.pdf
│   ├── guiausuario.pdf
│   └── justificacionanalisis.pdf
├── scripts/              # Automatización de envío y creación de reels
│   ├── node.js
│   ├── scriptreels.js
│   ├── package.json
│   └── package-lock.json
├── videos_redes/                 # Carpeta donde se guardan los reels listos para subir
│   └── ejemplos de videos.mp4
```
---

### 🗃️ Bases de Datos

- Usamos MySQL alojado en AWS EC2

***Estructura de tablas:***

- [suscriptores:]
nombre
email
empresa
idioma
fecha_registro
email_provider

- [newsletters:]
id
título
contenido
fecha_creación

- [historial_envios:]
suscriptor_id
newsletter_id
fecha_envio
asunto
estado_envio

- [Diagrama E-R](/supuesto1/mockups/diagramaE-Rsaloncomic.png)

### 💡 Personalizacion

- Cada correo se adapta al suscriptor:

- {{nombre}} → nombre personalizado

- {{email}} → email personalizado

- Diseño responsive con 3 media queries (oculta elementos en móvil)

- Compatible con Outlook, Gmail y móviles

### 📊 Test con usuarios

- Se enviaron newsletters reales a más de 10 personas

- Enlace a formulario de feedback desde el correo (Google Forms)

- Opiniones, valoraciones y sugerencias fueron consideradas

### 📱 Redes Sociales

- *** El script scriptreels.js genera un vídeo reel del correo ***

- *** Pensado para su publicación en: ***

- Instagram Reels

- TikTok

- Stories de WhatsApp o Telegram

- LinkedIn y otras redes

### 📂 Documentación y Recursos Visuales

- [Justificacion](./PDFs/JUSTIFICACION_DISEÑO_SUPUESTO1.pdf)

- [DAFO](/supuesto1/mockups/DAFO%20salon%20comic.png)

- [Figma](/supuesto1/mockups/mockup%20figma%20supuesto%201.png)
- 👉 [Ver diseño interactivo en Figma](https://www.figma.com/design/soEB03jwzyqb5rzTkxK86o/figma-salon-comic?node-id=0-1&p=f&t=iNQkGuk9G0x4GYv9-0)
- [Diagrama E-R](/supuesto1/mockups/diagramaE-Rsaloncomic.png)
- [Informe final](/supuesto1/PDFs/INFORME_FINAL_SUPUESTO1.pdf)  
- [Guia usuario](/supuesto1/PDFs/GUIA_USUARIO_SUPUESTO1.pdf)  

### 🧑‍💻 Autor

***Samuel Ortiz Heredia***
- Proyecto desarrollado para Feria Valencia 2025

***Repositorio:***
- 🔗 github.com/SamuelOrtiz66/practicas-feria-valencia-2025

- 📧 Contacto: samuelortizheredia@gmail.com