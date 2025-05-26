# Proyecto Feria Valencia 2025

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
- 👉 [Ver diseño interactivo en Figma](https://www.figma.com/design/M8KqpvKuSKdoHqbuzZXotw/Newsletter-GP-Cheste---Feria-Dos-Ruedas?node-id=0-1&m=dev&t=2rfAaS5zRrYmAN9Y-1)
- [Justificacion del diseño figma](PDFs/justificaciondiseño_figma.pdf)

- [Diagrama E-R](mockups/diagrama_ER.PNG)
- [Documentacion del diagrama](PDFs/documentacion_diagrama_ER.pdf)  

## Cómo usar

1. Convertir MJML a HTML con el comando:
mjml mjml/supuesto4.mjml -o output/newsletter.html

2. Ejecutar script de envío:
node scripts/index.js

3. Consultar documentación en `docs/` para detalles del proyecto.



## Contacto
Samuel Ortiz Heredia samuelortizheredia@gmail.com
