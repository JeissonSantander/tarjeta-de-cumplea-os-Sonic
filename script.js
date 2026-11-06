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

const $ = (id) => document.getElementById(id);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
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
$("mapsLink").href = `https://www.google.com/maps/search/?api=1&query=${q(place)}`;
$("calLink").href =
  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${q("Cumpleaños de Juan José Melo Santander")}` +
  `&dates=${stamp(when)}/${stamp(end)}&location=${q(place)}&details=${q("Invitan Dalitza Santander y Darío Melo")}`;
$("waLink").href =
  `https://wa.me/${EVENT.phone}?text=${q("Hola Dalitza y Darío, confirmo mi asistencia al cumpleaños de Juan José 🦔💙")}`;

/* --------------------------------------------------------------------------
   Anillos para recoger: aparecen en cada acto y se cuentan en el marcador
   -------------------------------------------------------------------------- */
const level = $("level");
let rings = 0;
const BONUS = 10000;
const PER_ACT = [5, 4, 4, 4, 3];

document.querySelectorAll(".act").forEach((act, a) => {
  for (let i = 0; i < PER_ACT[a]; i++) {
    const el = document.createElement("i");
    el.className = "pick";
    el.style.setProperty("--x", `${48 + 36 * Math.sin(i * 1.9 + a * 1.3)}%`);
    el.style.setProperty("--y", `${18 + (i + 0.5) * (62 / PER_ACT[a])}%`);
    act.appendChild(el);
  }
});

function collect(el) {
  if (el.classList.contains("got")) return;
  el.classList.add("got");
  rings++;
  $("rings").textContent = rings;
  $("score").textContent = String(rings * 100).padStart(6, "0");
  ["rings", "score"].forEach((id) => { const b = $(id); b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); });
  if (window.sfx) window.sfx([1318.5, 1760]);
  if (resShown) showResults(); // la meta ya está visible: mantenla al día
}
// se recogen al pasar por el centro de la pantalla (o con un toque)
const ringIO = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (!e.isIntersecting) return;
    ringIO.unobserve(e.target);
    setTimeout(() => collect(e.target), i * 90);
  });
}, { rootMargin: "-35% 0px -35% 0px" });
document.querySelectorAll(".pick").forEach((p) => { ringIO.observe(p); p.addEventListener("click", () => collect(p)); });

// textos y personajes entran con efecto al aparecer en pantalla
const rvIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const sibs = [...e.target.parentElement.children].filter((c) => c.classList.contains("rv") || c.classList.contains("char"));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 90}ms`;
    e.target.classList.add("on");
    rvIO.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".act > :not(.pick):not(.char)").forEach((el) => { el.classList.add("rv"); rvIO.observe(el); });
document.querySelectorAll(".char").forEach((el) => rvIO.observe(el));

// poste de control: se pone rojo al llegar a cada acto
const postIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.querySelector(".post").classList.add("hit");
    postIO.unobserve(e.target);
  });
}, { rootMargin: "-25% 0px -45% 0px" });
document.querySelectorAll(".tag").forEach((t) => postIO.observe(t));

/* --------------------------------------------------------------------------
   Parallax de personajes + bolita de progreso
   -------------------------------------------------------------------------- */
(function scrollFx() {
  const par = [...document.querySelectorAll("[data-par]")];
  const ball = $("trackBall");
  let queued = false;
  function frame() {
    queued = false;
    par.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      el.style.setProperty("--py", `${((r.top + r.height / 2 - innerHeight / 2) * el.dataset.par).toFixed(1)}px`);
    });
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    ball.style.top = `${p * 100}%`;
    ball.style.transform = `rotate(${p * 4000}deg)`;
  }
  addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(frame); } }, { passive: true });
  if (!reduced) frame();
})();

/* --------------------------------------------------------------------------
   Acto 4: elige a tu personaje
   -------------------------------------------------------------------------- */
const STATS = ["VELOCIDAD", "DIVERSIÓN", "HAMBRE DE PASTEL"];
const CHARS = [ // [archivo, nombre, frase, stats, movimiento (clase m-… en el CSS)]
  ["sonic", "Sonic", "El más veloz: ¡no llegues tarde!", [100, 95, 70], "jump"],
  ["tails", "Tails", "Tu guía para llegar a la fiesta.", [75, 90, 60], "fly"],
  ["knuckles", "Knuckles", "Guardián del pastel.", [60, 85, 100], "punch"],
  ["amy", "Amy", "Reina de la diversión.", [70, 100, 80], "sway"],
  ["shadow", "Shadow", "Maestro de los juegos.", [95, 80, 75], "glide"],
  ["silver", "Silver", "Viene del futuro, ¡y llega a tiempo!", [65, 88, 85], "float"],
  ["eggman", "Dr. Eggman", "Prohibido robar los dulces.", [30, 60, 100], "hover"],
];
(function roster() {
  const box = $("roster"), img = $("pickImg"), wrap = $("pickWrap");
  function pick(i, fromTap) {
    const [id, name, role, v, move] = CHARS[i];
    img.src = `assets/${id}.png`;
    img.alt = name;
    img.className = `m-${move}`;
    wrap.classList.remove("swap"); void wrap.offsetWidth; wrap.classList.add("swap");
    if (fromTap && window.sfx) window.sfx([660, 880]);
    $("pickName").textContent = name;
    $("pickRole").textContent = role;
    $("pickStats").innerHTML = STATS.map((s, k) => `<p><span>${s}</span><i style="--v:${v[k]}%"></i></p>`).join("");
    [...box.children].forEach((b, k) => b.setAttribute("aria-selected", k === i));
  }
  CHARS.forEach(([id, name], i) => {
    const b = document.createElement("button");
    b.className = "mb";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", name);
    b.innerHTML = `<img src="assets/${id}.png" alt="" loading="lazy">`;
    b.addEventListener("click", () => pick(i, true));
    box.appendChild(b);
  });
  pick(0);
})();

/* --------------------------------------------------------------------------
   Meta: los puntos suben al llegar
   -------------------------------------------------------------------------- */
function count(el, to) {
  const id = (el.countId = (el.countId || 0) + 1), t0 = performance.now(); // un conteo nuevo cancela el anterior
  (function step(t) {
    if (el.countId !== id) return;
    const k = Math.min(1, (t - t0) / 1200);
    el.textContent = Math.round(to * k).toLocaleString("es-CO");
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}
let resShown = false;
function showResults() {
  count($("resRings"), rings * 100);
  count($("resBonus"), BONUS);
  count($("resTotal"), rings * 100 + BONUS);
}
new IntersectionObserver(([e]) => {
  if (e.isIntersecting && !resShown) { resShown = true; showResults(); burst(); }
}, { threshold: 0.6 }).observe($("results"));

/* --------------------------------------------------------------------------
   Empezar / volver
   -------------------------------------------------------------------------- */
$("openBtn").addEventListener("click", () => {
  const dash = $("dash"); // Sonic cruza la pantalla en bolita antes de entrar al nivel
  dash.classList.remove("on"); void dash.offsetWidth; dash.classList.add("on");
  setTimeout(() => dash.classList.remove("on"), 1000);
  level.classList.add("show");
  if (window.playMusic) window.playMusic();
  if (window.sfx) window.sfx([523, 659, 784, 1047], 0.07);
  setTimeout(burst, 350);
  setTimeout(() => document.querySelector(".a1").scrollIntoView({ behavior: "smooth" }), 400);
});
$("replay").addEventListener("click", () => {
  $("cover").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => level.classList.remove("show"), 800);
});

/* Estallido de anillos y confeti */
function burst() {
  if (reduced) return;
  const c = document.createElement("canvas");
  c.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:99";
  c.width = innerWidth; c.height = innerHeight;
  document.body.appendChild(c);
  const ctx = c.getContext("2d");
  const colors = ["#ffd400", "#1a56db", "#e8222d", "#3cb043", "#ffffff"];
  const bits = Array.from({ length: 110 }, (_, i) => {
    const a = Math.random() * 6.283, s = 3 + Math.random() * 7;
    return { x: c.width / 2, y: c.height * 0.45, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 5, ring: i % 3 === 0,
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
        ctx.strokeStyle = "#ffd400"; ctx.lineWidth = 4; ctx.shadowColor = "#ffb300"; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.ellipse(b.x, b.y, Math.max(1.5, 9 * Math.abs(Math.cos(b.r))), 9, 0, 0, 6.283); ctx.stroke();
      } else {
        ctx.shadowBlur = 0; ctx.fillStyle = b.col; ctx.fillRect(b.x, b.y, 9, 6);
      }
    });
    f++;
    if (alive) requestAnimationFrame(draw); else c.remove();
  })();
}

/* --------------------------------------------------------------------------
   Cuenta regresiva en el marcador
   -------------------------------------------------------------------------- */
(function countdown() {
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    const d = when - Date.now();
    if (d <= 0) { $("cd").textContent = "¡YA!"; return; }
    $("cd").textContent = `${Math.floor(d / 864e5)}d ${pad(Math.floor(d / 36e5) % 24)}:${pad(Math.floor(d / 6e4) % 60)}:${pad(Math.floor(d / 1e3) % 60)}`;
  }
  tick();
  setInterval(tick, 1000);
})();

/* --------------------------------------------------------------------------
   Música chiptune original + sonido de anillo (Web Audio, sin archivos)
   -------------------------------------------------------------------------- */
(function music() {
  const btn = $("audioToggle");
  const label = $("audioText");
  const Hz = (n) => 440 * 2 ** ((n - 69) / 12); // n = nota MIDI
  const R = null;
  const BEAT = 0.17;
  // [nota MIDI, duración en corcheas] — melodía alegre en Do mayor
  const LEAD = [[76,1],[76,1],[79,1],[76,1],[74,1],[72,1],[74,2],  [72,1],[72,1],[76,1],[72,1],[69,1],[67,1],[69,2],
                [67,1],[69,1],[71,1],[74,1],[72,2],[R,1],[67,1],  [72,1],[74,1],[76,1],[79,1],[76,3],[R,1]];
  const BASS = [48,48,55,52, 53,53,60,57, 55,55,59,62, 48,52,55,60]; // una nota cada 2 corcheas
  let ctx = null, master = null, timer = null;

  function tone(freq, t, dur, type, vol) {
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
  function play() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume();
    master = ctx.createGain();
    master.connect(ctx.destination);
    const len = schedule(ctx.currentTime + 0.05);
    timer = setInterval(() => schedule(ctx.currentTime + 0.05), len * 1000);
    btn.classList.add("playing"); label.textContent = "Pausar";
  }
  function stop() {
    clearInterval(timer);
    if (master) master.disconnect(); // corta también las notas ya programadas
    master = null;
    btn.classList.remove("playing"); label.textContent = "Música";
  }
  btn.addEventListener("click", () => (master ? stop() : play()));
  window.playMusic = () => { if (!master) play(); };
  window.sfx = (notes, step = 0.07) => { // efectos (anillo, toques…), solo si el sonido está activado
    if (!master) return;
    const t = ctx.currentTime;
    notes.forEach((f, i) => tone(f, t + i * step, step * 2, "square", 0.06));
  };
})();

/* --------------------------------------------------------------------------
   Tocar un personaje: da una vuelta y suena
   -------------------------------------------------------------------------- */
document.querySelectorAll(".tapme").forEach((box) => box.addEventListener("click", () => {
  const img = box.querySelector("img");
  img.classList.remove("spun"); void img.offsetWidth; img.classList.add("spun");
  img.addEventListener("animationend", () => img.classList.remove("spun"), { once: true });
  if (window.sfx) window.sfx([392, 523, 659], 0.05);
}));

/* Confeti que cae en la portada */
(function coverConfetti() {
  const box = $("confetti");
  const colors = ["#ffd31a", "#ff9a00", "#e8212e", "#19e6ff", "#ffffff", "#3cb043"];
  for (let i = 0; i < 26; i++) {
    const b = document.createElement("b");
    b.style.cssText = `left:${Math.random() * 100}%;background:${colors[i % colors.length]};` +
      `animation-duration:${5 + Math.random() * 6}s;animation-delay:-${Math.random() * 10}s`;
    box.appendChild(b);
  }
})();

/* --------------------------------------------------------------------------
   Compartir
   -------------------------------------------------------------------------- */
(function share() {
  const tip = $("shareTip");
  $("shareBtn").addEventListener("click", async () => {
    const data = { title: "Cumpleaños de Juan José", text: "¡Estás invitado al cumpleaños de Juan José! 🦔💙", url: location.href };
    if (navigator.share) { try { await navigator.share(data); return; } catch { /* cancelado */ } }
    try {
      await navigator.clipboard.writeText(location.href);
      tip.classList.add("visible");
      setTimeout(() => tip.classList.remove("visible"), 2500);
    } catch { prompt("Copia este enlace:", location.href); }
  });
})();
