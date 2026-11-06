# Tarjeta de cumpleaños · Juan José (tema Sonic)

Invitación web estática para GitHub Pages. Sin dependencias ni build.

## Datos que se editan
Todo está en el bloque `EVENT` al inicio de [script.js](script.js): edad, fecha y hora, lugar, ciudad y WhatsApp.
Fecha, calendario, mapa, cuenta regresiva y mensaje de WhatsApp se calculan solos desde ahí.

> ⚠ `age` y `start` son provisionales hasta confirmar con los papás.

## Cómo funciona
Son 4 pantallas tipo historia (cada una ocupa todo el alto del celular): póster de portada → cuándo y dónde →
elige a tu personaje → confirmar por WhatsApp. Se avanza tocando el lado derecho, deslizando, con las flechas
del teclado, con los botones ‹ › o con las barras de arriba. El primer avance inicia la música.

## Estructura
- `index.html` — las 4 pantallas
- `styles.css` — diseño responsive
- `script.js` — datos del evento, navegación, selector de personajes, cuenta regresiva, música chiptune y compartir
- `assets/` — personajes recortados con fondo transparente
- `.nojekyll` — configuración para GitHub Pages

## Publicar
Settings → Pages → Source: rama `main`, carpeta `/ (root)`.
