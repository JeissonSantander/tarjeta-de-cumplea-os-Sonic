"use strict";

/* ==========================================================================
   DATOS DEL EVENTO · CUMPLEAÑOS #4 DE JUAN JOSÉ MELO SANTANDER
   ========================================================================== */
const EVENT = {
  name: "Juan José Melo Santander",
  shortName: "Juan José",
  age: 4,
  start: "2026-11-22T15:00:00-05:00", // Domingo 22 de Noviembre 2026, 3:00 PM (hora Colombia)
  place: "Salón Comunal Barrio Chambú 2 Etapa",
  city: "Pasto, Nariño",
  parents: "Darío Melo y Dalitza Santander",
  phone: "573233724654",
  durationHours: 4,
};

const $ = (id) => document.getElementById(id);
const when = new Date(EVENT.start);
const fmt = (o) => when.toLocaleString("es-CO", { timeZone: "America/Bogota", ...o });

// Rellenar campos dinámicos [data-f]
const FIELDS = {
  age: EVENT.age,
  place: EVENT.place,
  city: EVENT.city,
  weekday: fmt({ weekday: "long" }).toUpperCase(),
  day: fmt({ day: "numeric" }),
  month: fmt({ month: "long" }).toUpperCase(),
  year: fmt({ year: "numeric" }),
  time: fmt({ hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase(),
};

document.querySelectorAll("[data-f]").forEach((el) => {
  if (FIELDS[el.dataset.f] !== undefined) {
    el.textContent = FIELDS[el.dataset.f];
  }
});

if ($("hostsNames")) {
  $("hostsNames").textContent = EVENT.parents;
}

// Configuración de URLs dinámicas
const stamp = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
const end = new Date(when.getTime() + EVENT.durationHours * 3600000);
const q = encodeURIComponent;
const fullLocation = `${EVENT.place}, ${EVENT.city}`;

// Enlace Google Maps
$("mapsLink").href = `https://www.google.com/maps/search/?api=1&query=${q(fullLocation)}`;

// Enlace Google Calendar
$("calLink").href =
  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${q("Cumpleaños #4 de Juan José Melo Santander 🦔🎂")}` +
  `&dates=${stamp(when)}/${stamp(end)}&location=${q(fullLocation)}&details=${q(`¡Estás invitado a celebrar los 4 añitos de Juan José a toda velocidad!\nLugar: ${fullLocation}\nInvitan con cariño sus padres: ${EVENT.parents}`)}`;

// Interacción divertida con el portal de Sonic en portada
const portal = $("portalSonic");
if (portal) {
  portal.addEventListener("click", () => {
    portal.classList.remove("spin-click");
    void portal.offsetWidth;
    portal.classList.add("spin-click");
    if (window.sfx) window.sfx([987, 1318, 1760], 0.08);
  });
}

// Personaje seleccionado y mensaje dinámico para WhatsApp
let selectedCharacter = "Sonic";
function updateWaLink() {
  const msg = 
`¡Hola Dalitza y Darío! 👋

🎉 *¡CONFIRMO MI ASISTENCIA!* 🎉
Al cumpleaños #4 de *Juan José Melo Santander* 🎂

⭐ *Personaje elegido:* ${selectedCharacter} ⚡
📅 *Fecha:* Domingo, 22 de Noviembre (3:00 PM)
📍 *Lugar:* Salón Comunal Barrio Chambú 2ª Etapa

¡Allí estaremos listos para celebrar a toda velocidad! 🚀🏁`;

  $("waLink").href = `https://api.whatsapp.com/send?phone=${EVENT.phone}&text=${encodeURIComponent(msg)}`;
}
updateWaLink();

/* --------------------------------------------------------------------------
   Navegación con botones "Ver más abajo" (Smooth Scroll)
   -------------------------------------------------------------------------- */
document.querySelectorAll("[data-target]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = $(btn.dataset.target);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      if (window.sfx) window.sfx([659, 880, 1046], 0.05);
    }
  });
});

/* --------------------------------------------------------------------------
   Anillos dorados flotantes de fondo
   -------------------------------------------------------------------------- */
(function createBackgroundRings() {
  const bg = $("dynamicFxLayer");
  if (!bg) return;
  for (let i = 0; i < 14; i++) {
    const ring = document.createElement("b");
    const size = 20 + Math.random() * 26;
    ring.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;--dx:${(Math.random() - 0.5) * 100}px;` +
      `animation-duration:${7 + Math.random() * 8}s,1.6s;animation-delay:-${Math.random() * 14}s,0s`;
    bg.appendChild(ring);
  }
})();

/* --------------------------------------------------------------------------
   Selector Interactivo de Personajes (Con Auras Elementales Dinámicas)
   -------------------------------------------------------------------------- */
const STATS = ["VELOCIDAD", "DIVERSIÓN", "HAMBRE DE PASTEL"];
const CHARS = [
  ["sonic", "Sonic", "¡El más veloz de la fiesta!", [100, 95, 75], "jump", "#00b0ff", "⚡"],
  ["tails", "Tails", "Experto en juegos y diversión.", [75, 90, 65], "fly", "#ffb300", "✈️"],
  ["knuckles", "Knuckles", "Guardián oficial del pastel.", [60, 85, 100], "punch", "#e53935", "🥊"],
  ["shadow", "Shadow", "Poder absoluto en la pista.", [95, 80, 75], "glide", "#d50000", "🔥"],
  ["amy", "Amy", "Reina de la diversión y alegría.", [70, 100, 80], "sway", "#ff4081", "💖"],
  ["silver", "Silver", "Viene del futuro con súper poderes.", [65, 88, 85], "float", "#00e5ff", "🔮"],
  ["eggman", "Dr. Eggman", "¡Bailará y festejará toda la tarde!", [35, 70, 95], "hover", "#ff6d00", "🤖"],
];

(function initRoster() {
  const box = $("roster"), img = $("pickImg"), wrap = $("pickWrap");
  const halo = $("charHalo"), emojiEl = $("charEmoji");

  function pick(i, fromTap) {
    const [id, name, role, v, move, haloCol, emoji] = CHARS[i];
    img.src = `assets/${id}.png`;
    img.alt = name;
    img.className = `char-hero-image m-${move}`;
    wrap.classList.remove("swap"); void wrap.offsetWidth; wrap.classList.add("swap");
    
    // Cambiar aura elemental del podio
    if (halo) {
      halo.style.boxShadow = `0 0 45px ${haloCol}`;
      halo.style.background = `radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 35%, ${haloCol}40 55%, transparent 72%)`;
    }
    if (emojiEl) emojiEl.textContent = emoji;

    if (fromTap && window.sfx) window.sfx([523, 659, 784, 1046], 0.04);
    
    $("pickName").textContent = name;
    $("pickRole").textContent = role;
    $("pickStats").innerHTML = STATS.map((s, k) => `<p><span>${s}</span><i style="--v:${v[k]}%"></i></p>`).join("");
    [...box.children].forEach((b, k) => b.setAttribute("aria-selected", k === i));

    selectedCharacter = name;
    updateWaLink();
  }

  CHARS.forEach(([id, name], i) => {
    const b = document.createElement("button");
    b.className = "champ-btn";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", name);
    b.innerHTML = `<img src="assets/${id}.png" alt="" loading="lazy">`;
    b.addEventListener("click", () => pick(i, true));
    box.appendChild(b);
  });

  pick(0, false);
})();

/* Tocar personaje: giro 360 y sonido */
document.querySelectorAll(".tapme").forEach((box) => box.addEventListener("click", () => {
  const img = box.querySelector("img");
  if (!img) return;
  img.classList.remove("spun"); void img.offsetWidth; img.classList.add("spun");
  img.addEventListener("animationend", () => img.classList.remove("spun"), { once: true });
  if (window.sfx) window.sfx([392, 523, 659, 880], 0.05);
}));

/* --------------------------------------------------------------------------
   Cuenta regresiva turbo
   -------------------------------------------------------------------------- */
(function initCountdown() {
  const els = ["days", "hours", "minutes", "seconds"].map($);
  const pad = (n) => String(n).padStart(2, "0");
  const title = $("cdTitle");

  function tick() {
    const diff = when.getTime() - Date.now();
    if (diff <= 0) {
      if (title) title.textContent = "🎉 ¡HOY ES EL GRAN DÍA! ¡A CELEBRAR! 🎂";
      els.forEach((el) => { if (el) el.textContent = "00"; });
      return;
    }
    if (title) title.textContent = "⚡ CUENTA REGRESIVA PARA LA CARRERA ⚡";
    const d = Math.floor(diff / 864e5);
    const h = Math.floor(diff / 36e5) % 24;
    const m = Math.floor(diff / 6e4) % 60;
    const s = Math.floor(diff / 1e3) % 60;
    [d, h, m, s].forEach((v, i) => { if (els[i]) els[i].textContent = pad(v); });
  }
  tick();
  setInterval(tick, 1000);
})();

/* --------------------------------------------------------------------------
   Música oficial: Green Hill Zone Theme (YouTube ID: G-i8HYi1QH0)
   Con respaldo automático de síntesis retro (Web Audio API)
   -------------------------------------------------------------------------- */
(function initMusic() {
  const btn = $("audioToggle");
  const label = $("audioText");

  let isPlaying = false;
  let ytPlayer = null;
  let ytReady = false;
  let useFallbackSynth = false;

  // 1. Cargar YouTube IFrame API para reproducir la canción solicitada
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  if (firstScriptTag && firstScriptTag.parentNode) {
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  } else {
    document.head.appendChild(tag);
  }

  window.onYouTubeIframeAPIReady = function () {
    try {
      ytPlayer = new YT.Player("ytPlayer", {
        height: "1",
        width: "1",
        videoId: "G-i8HYi1QH0", // Canción Green Hill Zone solicitada
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          playlist: "G-i8HYi1QH0",
          modestbranding: 1,
          playsinline: 1,
          rel: 0
        },
        events: {
          onReady: function () {
            ytReady = true;
            if (isPlaying) {
              try {
                ytPlayer.playVideo();
                ytPlayer.setVolume(85);
              } catch (_) {}
            }
          },
          onStateChange: function (event) {
            if (event.data === YT.PlayerState.PLAYING) {
              isPlaying = true;
              btn.classList.add("playing");
              label.textContent = "Pausar";
            } else if (event.data === YT.PlayerState.PAUSED) {
              isPlaying = false;
              btn.classList.remove("playing");
              label.textContent = "Música";
            }
          },
          onError: function () {
            console.warn("YouTube player blocked or offline, activating retro synth fallback");
            useFallbackSynth = true;
            if (isPlaying) playSynth();
          }
        }
      });
    } catch (e) {
      console.warn("YT Player init error:", e);
      useFallbackSynth = true;
    }
  };

  // 2. Respaldo Chiptune en Web Audio API (si YouTube tarda o está offline)
  const Hz = (n) => 440 * 2 ** ((n - 69) / 12);
  const R = null;
  const BEAT = 0.17;
  const LEAD = [
    [76,1],[76,1],[79,1],[76,1],[74,1],[72,1],[74,2],
    [72,1],[72,1],[76,1],[72,1],[69,1],[67,1],[69,2],
    [67,1],[69,1],[71,1],[74,1],[72,2],[R,1],[67,1],
    [72,1],[74,1],[76,1],[79,1],[76,3],[R,1]
  ];
  const BASS = [48,48,55,52, 53,53,60,57, 55,55,59,62, 48,52,55,60];
  let ctx = null, master = null, timer = null;

  function tone(freq, t, dur, type, vol) {
    if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function schedule(start) {
    let t = start;
    LEAD.forEach(([n, d]) => { if (n) tone(Hz(n), t, d * BEAT * 0.9, "square", 0.05); t += d * BEAT; });
    BASS.forEach((n, i) => tone(Hz(n), start + i * 2 * BEAT, BEAT * 1.8, "triangle", 0.12));
    return t - start;
  }

  function playSynth() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume();
    master = ctx.createGain();
    master.connect(ctx.destination);
    const len = schedule(ctx.currentTime + 0.05);
    timer = setInterval(() => schedule(ctx.currentTime + 0.05), len * 1000);
    btn.classList.add("playing");
    label.textContent = "Pausar";
  }

  function stopSynth() {
    clearInterval(timer);
    if (master) master.disconnect();
    master = null;
    btn.classList.remove("playing");
    label.textContent = "Música";
  }

  // 3. Control maestro de reproducción
  function playAudio() {
    isPlaying = true;
    if (ytReady && ytPlayer && typeof ytPlayer.playVideo === "function" && !useFallbackSynth) {
      try {
        ytPlayer.playVideo();
        ytPlayer.setVolume(85);
        btn.classList.add("playing");
        label.textContent = "Pausar";
        return;
      } catch (e) {
        console.warn("Falling back to synth:", e);
      }
    }
    playSynth();
  }

  function pauseAudio() {
    isPlaying = false;
    if (ytReady && ytPlayer && typeof ytPlayer.pauseVideo === "function") {
      try {
        ytPlayer.pauseVideo();
      } catch (_) {}
    }
    stopSynth();
    btn.classList.remove("playing");
    label.textContent = "Música";
  }

  btn.addEventListener("click", () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  });

  // Inicio en primera interacción de usuario (pantalla táctil o clic)
  document.addEventListener("click", function firstPlay() {
    if (!isPlaying) {
      playAudio();
    }
    document.removeEventListener("click", firstPlay);
  }, { once: true });

  window.playMusic = () => { if (!isPlaying) playAudio(); };

  // Efectos de sonido (anillos dorados y botones)
  window.sfx = (notes, step = 0.07) => {
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctx.resume();
      const sfxMaster = ctx.createGain();
      sfxMaster.gain.value = 0.2;
      sfxMaster.connect(ctx.destination);
      const t = ctx.currentTime;
      notes.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.2, t + i * step);
        g.gain.exponentialRampToValueAtTime(0.001, t + (i + 1) * step);
        o.connect(g);
        g.connect(sfxMaster);
        o.start(t + i * step);
        o.stop(t + (i + 1) * step);
      });
    } catch (_) {}
  };
})();

/* --------------------------------------------------------------------------
   Efecto de chispas interactivas al mover el cursor o dedo (Speed Sparks)
   -------------------------------------------------------------------------- */
(function initSparks() {
  let lastSpark = 0;
  const sparkColors = ["#ffd200", "#00e5ff", "#ffffff", "#ff4081"];

  function createSpark(x, y) {
    const now = Date.now();
    if (now - lastSpark < 60) return;
    lastSpark = now;

    const spark = document.createElement("span");
    spark.textContent = "✨";
    spark.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: ${14 + Math.random() * 12}px;
      pointer-events: none;
      z-index: 10000;
      color: ${sparkColors[Math.floor(Math.random() * sparkColors.length)]};
      transform: translate(-50%, -50%) scale(1);
      transition: transform 0.6s ease-out, opacity 0.6s ease-out;
    `;
    document.body.appendChild(spark);
    requestAnimationFrame(() => {
      spark.style.transform = `translate(-50%, ${-40 - Math.random() * 30}px) scale(0)`;
      spark.style.opacity = "0";
    });
    setTimeout(() => spark.remove(), 600);
  }

  addEventListener("pointermove", (e) => createSpark(e.clientX, e.clientY), { passive: true });
})();

/* --------------------------------------------------------------------------
   Compartir invitación
   -------------------------------------------------------------------------- */
(function initShare() {
  const tip = $("shareTip");
  $("shareBtn").addEventListener("click", async () => {
    const shareText = 
`🎉 *¡ESTÁS INVITADO AL CUMPLEAÑOS #4 DE JUAN JOSÉ!* 🦔🎂

Acompáñanos a celebrar una tarde llena de juegos, diversión y sorpresas a toda velocidad con Sonic y sus amigos ⚡

📅 *Fecha:* Domingo, 22 de Noviembre de 2026
⏰ *Hora:* 3:00 PM
📍 *Lugar:* Salón Comunal Barrio Chambú 2ª Etapa, Pasto

👉 *Abre aquí tu invitación interactiva y confirma tu asistencia:*
${location.href}`;

    const data = {
      title: "Cumpleaños #4 de Juan José Melo Santander",
      text: shareText,
      url: location.href,
    };
    if (navigator.share) {
      try { await navigator.share(data); return; } catch { /* cancelado */ }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      tip.classList.add("visible");
      setTimeout(() => tip.classList.remove("visible"), 2600);
    } catch {
      prompt("Copia este mensaje para compartir:", shareText);
    }
  });
})();
