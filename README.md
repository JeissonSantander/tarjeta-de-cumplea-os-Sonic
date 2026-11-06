# Tarjeta de cumpleaños · Juan José (tema Sonic)

Invitación web estática para GitHub Pages. Sin dependencias ni build; los personajes son SVG propios.

## Datos que se editan
Todo está en el bloque `EVENT` al inicio de [script.js](script.js): edad, fecha y hora, lugar, ciudad y WhatsApp.
Fecha, calendario, mapa, cuenta regresiva y mensaje de WhatsApp se calculan solos desde ahí.

> ⚠ `age` y `start` son provisionales hasta confirmar con los papás.

## Estructura
- `index.html` — portada, invitación y personajes (SVG inline)
- `styles.css` — diseño responsive
- `script.js` — datos del evento, anillos, cuenta regresiva, música chiptune y compartir
- `.nojekyll` — configuración para GitHub Pages

## Publicar
Settings → Pages → Source: rama `main`, carpeta `/ (root)`.
