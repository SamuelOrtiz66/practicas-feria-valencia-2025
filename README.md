# Proyecto Feria Valencia 2025
Este repositorio contiene dos proyectos independientes desarrollados para la **Feria Valencia 2025**, ambos centrados en campañas de email marketing y promoción digital.

---

## 📁 Estructura del Repositorio

- `supuesto1/`  
  📬 **Campaña para el Salón del Cómic de València**  
  Creación de un boletín informativo digital destacando **noticias, novedades y promociones especiales** del evento.  
  → Incluye estructura MJML, ejemplos de diseño, y guía completa en su README.

- `supuesto4/`  
  🏍️ **Campaña para Feria Dos Ruedas – Sorteo GP Cheste**  
  Desarrollo de una campaña automatizada por email que **sortea entradas para el GP de motociclismo de Cheste** entre quienes completen un formulario antes del 1 de septiembre.  
  → Incluye scripts de envío con Node.js, diseño responsive en MJML, automatización de reels y documentación en su README.

---

📌 Cada carpeta contiene su propio `README.md` con una **guía paso a paso** para su instalación, uso y despliegue.

---
👨‍💻 Autor: Samuel Ortiz Heredia  
📧 Contacto: [samuelortizheredia@gmail.com](mailto:samuelortizheredia@gmail.com)  
🔗 Repositorio: [github.com/SamuelOrtiz66/practicas-feria-valencia-2025](https://github.com/SamuelOrtiz66/practicas-feria-valencia-2025)

## Estructura

- `mjml/`: Plantillas de email en MJML.
- `scripts/`: Código para envío de emails con Node.js.
- `data/`: Datos de prueba (CSV de suscriptores).
- `PDFs/`: Documentación en PDF (análisis, documentacion de diseño y del diagrama, planificación, etc.).
- `mockups/`: Imágenes y capturas del diseño.

### 📄 Documentos destacados

- [Análisis y planificacin](PDFs/ANÁLISIS_Y_PLANIFICACIÓN.pdf)

- [DAFO](mockups/dafo%20feria%20dos%20ruedas.png)
- [Análisis de newsletters de eventos similares](PDFs/analisisnewsletter_otrasferiasoeventos.pdf)

- [Figma](mockups/mockup%20final.png)
- 👉 [Ver diseño interactivo en Figma](https://www.figma.com/design/M8KqpvKuSKdoHqbuzZXotw/Newsletter-GP-Cheste---Feria-Dos-Ruedas?node-id=0-1&m=dev&t=8NmQAji58gKMKOTX-1)
- [Justificacion del diseño figma](PDFs/justificaciondiseño_figma.pdf)

- [Diagrama E-R](mockups/diagrama_ER.PNG)
- [Documentacion del diagrama](PDFs/documentacion_diagrama_ER.pdf)  

## Cómo usar

1. Convertir MJML a HTML con el comando:
mjml mjml/supuesto4.mjml -o output/newsletter.html

2. Ejecutar script de envío:
node scripts/index.js

3. Consultar documentación en `PDFs/` para detalles del proyecto.



## Contacto
Samuel Ortiz Heredia samuelortizheredia@gmail.com
