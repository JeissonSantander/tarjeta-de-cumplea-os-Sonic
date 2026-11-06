# Tarjeta de cumpleaños · Juan José (tema Sonic)

Invitación web estática para GitHub Pages. Sin dependencias ni build; los personajes son SVG propios.

## Datos que se editan
Todo está en el bloque `EVENT` al inicio de [script.js](script.js): edad, fecha y hora, lugar, ciudad y WhatsApp.
Fecha, calendario, mapa, cuenta regresiva y mensaje de WhatsApp se calculan solos desde ahí.

> ⚠ `age` y `start` son provisionales hasta confirmar con los papás.

## Cómo funciona
La invitación es un "nivel" de Sonic: pantalla de título → 4 actos (quién, cuándo, dónde, equipo) → meta con
resultados y botón de confirmación por WhatsApp. Los anillos se recogen al avanzar y suman al marcador.

## Estructura
- `index.html` — pantalla de título, actos y meta
- `styles.css` — diseño responsive
- `script.js` — datos del evento, anillos, marcador, selector de personajes, música chiptune y compartir
- `assets/` — personajes recortados con fondo transparente
- `.nojekyll` — configuración para GitHub Pages

## Publicar
Settings → Pages → Source: rama `main`, carpeta `/ (root)`.
