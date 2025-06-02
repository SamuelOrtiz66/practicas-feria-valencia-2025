# 📬 SUPUESTO 4 — Campaña de Email Marketing para Feria Dos Ruedas (Feria Valencia 2025)

Este proyecto consiste en el diseño, desarrollo y envío automatizado de una campaña de email marketing con tecnología MJML y Node.js, para promocionar un sorteo de entradas al GP de motociclismo de Cheste entre los asistentes registrados antes del 1 de septiembre.

---

## 🎯 Objetivo

Enviar un **newsletter personalizado** a cada suscriptor registrado en la base de datos, con un enlace de participación en el sorteo de entradas. El contenido del correo se adapta al dispositivo del usuario y es compatible con Outlook y Gmail.

---

## 🧾 Estructura del Proyecto
```bash
supuesto4/
├── data/                 # CSV con datos de suscriptores
│   └── suscriptores.csv
├── mjml/                 # Plantilla del email en MJML
│   ├── formulario_sorteo.mjml
│   ├── supuesto4.mjml
│   └── supuesto4_reel.mjml
├── mockups/              # Material de diseño y análisis
│   ├── diagrama-ER.png
│   ├── mockup final.png
│   └── dafo feria dos ruedas.png
├── pdfs/                 # Documentación final y por partes
│   └── informe-final.pdf
├── scripts/              # Automatización de envío y creación de reels
│   ├── node.js
│   ├── scriptreels.js
│   ├── package.json
│   └── package-lock.json
├── videos_redes/                 # Carpeta donde se guardan los reels listos para subir
│   └── ejemplos de videos.mp4
```
---

## ⚙️ Guía para el Usuario

### 1. Requisitos Previos

- Node.js instalado
- Base de datos MySQL (local o en AWS EC2)
- Cuenta Gmail o Outlook para enviar correos

### 2. Instalación

```bash
cd scripts
npm install
```

### 3 .Configuracion

Crea un archivo .env con las siguientes variables:
EMAIL_USER=tuemail@gmail.com
EMAIL_PASS=tucontraseña
EMAIL_SERVICE=gmail # o 'outlook'

### 4.Ejecutar el envio de correos

```bash
node scripts/node.js
```

Este script:
Actualiza base de datos con los datos del .csv

Lee los suscriptores desde MySQL

Personaliza el newsletter con el nombre de cada usuario

Convierte MJML a HTML

Envía el correo por Gmail u Outlook según el proveedor de cada usuario


### 5. Generar Reel para Redes Sociales

```bash
node scripts/scriptreels.js
```

- Crea un vídeo del newsletter listo para subir como Reel en Instagram o TikTok.

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

- [Diagrama E-R](../mockups/diagrama_ER.PNG)

### 💡 Personalizacion

- Cada correo se adapta al suscriptor:

- {{nombre}} → nombre personalizado

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

- [Análisis y planificacin](../PDFs/ANÁLISIS_Y_PLANIFICACIÓN.pdf)

- [DAFO](../mockups/dafo%20feria%20dos%20ruedas.png)
- [Análisis de newsletters de eventos similares](../PDFs/analisisnewsletter_otrasferiasoeventos.pdf)
- [Figma](../mockups/mockup%20final.png)
- 👉 [Ver diseño interactivo en Figma](https://www.figma.com/design/M8KqpvKuSKdoHqbuzZXotw/Newsletter-GP-Cheste---Feria-Dos-Ruedas?node-id=0-1&m=dev&t=8NmQAji58gKMKOTX-1)
- [Justificacion del diseño figma](../PDFs/justificaciondiseño_figma.pdf)
- [Diagrama E-R](../mockups/diagrama_ER.PNG)
- [Documentacion del diagrama](../PDFs/documentacion_diagrama_ER.pdf)  

### 🧑‍💻 Autor

***Samuel Ortiz Heredia***
- Proyecto desarrollado para Feria Valencia 2025

***Repositorio:***
- 🔗 github.com/SamuelOrtiz66/practicas-feria-valencia-2025

- 📧 Contacto: samuelortizheredia@gmail.com