"use strict";

/* ==========================================================================
   DATOS DEL EVENTO — lo único que hay que editar.
   ⚠ age y start son PROVISIONALES hasta confirmar con los papás.
   ========================================================================== */
const EVENT = {
  age: 7,                               // PROVISIONAL: años que cumple
  start: "2026-12-12T15:00:00-05:00",   // PROVISIONAL: fecha y hora (hora Colombia)
  place: "Salón Comunal Barrio Chambú",
  city: "Pasto, Nariño",
  phone: "573233724654",
  durationHours: 4,
};

const when = new Date(EVENT.start);
const fmt = (o) => when.toLocaleString("es-CO", { timeZone: "America/Bogota", ...o });
const FIELDS = {
  age: EVENT.age, place: EVENT.place, city: EVENT.city,
  weekday: fmt({ weekday: "long" }), day: fmt({ day: "numeric" }),
  month: fmt({ month: "long" }), year: fmt({ year: "numeric" }),
  time: fmt({ hour: "numeric", minute: "2-digit", hour12: true }),
};
document.querySelectorAll("[data-f]").forEach((el) => { el.textContent = FIELDS[el.dataset.f]; });

const stamp = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
const end = new Date(when.getTime() + EVENT.durationHours * 3600000);
const q = encodeURIComponent;
const place = `${EVENT.place}, ${EVENT.city}`;
document.getElementById("mapsLink").href = `https://www.google.com/maps/search/?api=1&query=${q(place)}`;
document.getElementById("calLink").href =
  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${q("Cumpleaños de Juan José Melo Santander")}` +
  `&dates=${stamp(when)}/${stamp(end)}&location=${q(place)}&details=${q("Invitan Dalitza Santander y Darío Melo")}`;
document.getElementById("waLink").href =
  `https://wa.me/${EVENT.phone}?text=${q("Hola Dalitza y Darío, confirmo mi asistencia al cumpleaños de Juan José 🦔💙")}`;

/* --------------------------------------------------------------------------
   Anillos dorados cayendo (fondo)
   -------------------------------------------------------------------------- */
(function rings() {
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let W, H, list = [];
  const make = (y) => ({ x: Math.random() * W, y, r: 7 + Math.random() * 7, vy: 0.5 + Math.random() * 0.9, ph: Math.random() * 6.28 });

  function resize() {
    W = canvas.width = innerWidth; H = canvas.height = innerHeight;
    list = Array.from({ length: Math.floor(W * H / 30000) + 6 }, () => make(Math.random() * H));
  }
  addEventListener("resize", resize);
  resize();

  (function frame(t) {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 4; ctx.shadowColor = "#ffb300"; ctx.shadowBlur = 10;
    list.forEach((p, i) => {
      p.y += p.vy;
      if (p.y > H + 20) list[i] = make(-20);
      ctx.strokeStyle = "rgba(255,212,0,.85)";
      ctx.beginPath();
      // el ancho oscila para simular el giro del anillo
      ctx.ellipse(p.x, p.y, Math.max(1.5, p.r * Math.abs(Math.cos(t / 400 + p.ph))), p.r, 0, 0, 6.283);
      ctx.stroke();
    });
    requestAnimationFrame(frame);
  })(0);
})();

/* --------------------------------------------------------------------------
   Abrir / cerrar invitación
   -------------------------------------------------------------------------- */
(function envelope() {
  const openBtn = document.getElementById("openBtn");
  const inv = document.getElementById("invitation");
  let opened = false;

  function open() {
    opened = true;
    openBtn.setAttribute("aria-expanded", "true");
    if (window.playMusic) window.playMusic();
    burst();
    inv.classList.add("show");
    inv.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function close() {
    opened = false;
    openBtn.setAttribute("aria-expanded", "false");
    document.getElementById("cover").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => { if (!opened) inv.classList.remove("show"); }, 600);
  }
  openBtn.addEventListener("click", () => (opened ? close() : open()));
  document.getElementById("closeBtn").addEventListener("click", close);
})();

/* Estallido de anillos y confeti */
function burst() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = document.createElement("canvas");
  c.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:99";
  c.width = innerWidth; c.height = innerHeight;
  document.body.appendChild(c);
  const ctx = c.getContext("2d");
  const colors = ["#ffd400", "#1a56db", "#e8222d", "#3cb043", "#ffffff"];
  const bits = Array.from({ length: 110 }, (_, i) => {
    const a = Math.random() * 6.283, s = 3 + Math.random() * 7;
    return { x: c.width / 2, y: c.height * 0.4, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 5, ring: i % 3 === 0,
             col: colors[i % colors.length], a: 1, r: 0 };
  });
  let f = 0;
  (function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    let alive = false;
    bits.forEach((b) => {
      b.vy += 0.2; b.x += b.vx; b.y += b.vy; b.r += 0.2;
      if (f > 50) b.a = Math.max(0, b.a - 0.02);
      if (b.a > 0) alive = true;
      ctx.globalAlpha = b.a;
      if (b.ring) {
        ctx.strokeStyle = "#ffd400"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(b.x, b.y, Math.max(1.5, 9 * Math.abs(Math.cos(b.r))), 9, 0, 0, 6.283); ctx.stroke();
      } else {
        ctx.fillStyle = b.col; ctx.fillRect(b.x, b.y, 9, 6);
      }
    });
    f++;
    if (alive) requestAnimationFrame(draw); else c.remove();
  })();
}

/* --------------------------------------------------------------------------
   Cuenta regresiva
   -------------------------------------------------------------------------- */
(function countdown() {
  const ids = ["days", "hours", "minutes", "seconds"].map((id) => document.getElementById(id));
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    const d = Math.max(0, when - Date.now());
    [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60]
      .forEach((v, i) => { ids[i].textContent = pad(v); });
  }
  tick();
  setInterval(tick, 1000);
})();

/* --------------------------------------------------------------------------
   Música chiptune original (Web Audio, sin archivos externos)
   -------------------------------------------------------------------------- */
(function music() {
  const btn = document.getElementById("audioToggle");
  const label = document.getElementById("audioText");
  const Hz = (n) => 440 * 2 ** ((n - 69) / 12); // n = nota MIDI
  const R = null;
  const BEAT = 0.17;
  // [nota MIDI, duración en corcheas] — melodía alegre en Do mayor
  const LEAD = [[76,1],[76,1],[79,1],[76,1],[74,1],[72,1],[74,2],  [72,1],[72,1],[76,1],[72,1],[69,1],[67,1],[69,2],
                [67,1],[69,1],[71,1],[74,1],[72,2],[R,1],[67,1],  [72,1],[74,1],[76,1],[79,1],[76,3],[R,1]];
  const BASS = [48,48,55,52, 53,53,60,57, 55,55,59,62, 48,52,55,60]; // una nota cada 2 corcheas
  let ctx = null, timer = null;

  function tone(freq, t, dur, type, vol) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function schedule(start) {
    let t = start;
    LEAD.forEach(([n, d]) => { if (n) tone(Hz(n), t, d * BEAT * 0.9, "square", 0.05); t += d * BEAT; });
    BASS.forEach((n, i) => tone(Hz(n), start + i * 2 * BEAT, BEAT * 1.8, "triangle", 0.12));
    return t - start;
  }
  function play() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const len = schedule(ctx.currentTime + 0.05);
    timer = setInterval(() => schedule(ctx.currentTime + 0.05), len * 1000);
    btn.classList.add("playing"); label.textContent = "Pausar";
  }
  function stop() {
    clearInterval(timer);
    if (ctx) ctx.close();
    ctx = null;
    btn.classList.remove("playing"); label.textContent = "Música";
  }
  btn.addEventListener("click", () => (ctx ? stop() : play()));
  window.playMusic = () => { if (!ctx) play(); };
})();

/* --------------------------------------------------------------------------
   Compartir
   -------------------------------------------------------------------------- */
(function share() {
  const tip = document.getElementById("shareTip");
  document.getElementById("shareBtn").addEventListener("click", async () => {
    const data = { title: "Cumpleaños de Juan José", text: "¡Estás invitado al cumpleaños de Juan José! 🦔💙", url: location.href };
    if (navigator.share) { try { await navigator.share(data); return; } catch { /* cancelado */ } }
    try {
      await navigator.clipboard.writeText(location.href);
      tip.classList.add("visible");
      setTimeout(() => tip.classList.remove("visible"), 2500);
    } catch { prompt("Copia este enlace:", location.href); }
  });
})();
