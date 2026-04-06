// =============================================================
//  APP.JS — LOGICA DEL DASHBOARD
//  No necesitas editar este archivo normalmente
//  Toda la configuracion esta en config.js
// =============================================================


// -------------------------------------------------------------
//  PARSER DE CALENDARIO ICS
//  Convierte el texto del archivo .ics en una lista de eventos
// -------------------------------------------------------------

function parseICS(text) {
  const events = [];
  const blocks = text.split('BEGIN:VEVENT');
  blocks.shift();
  for (const block of blocks) {
    const get = (key) => {
      const m = block.match(new RegExp(key + '[^:]*:([^\r\n]+)'));
      return m ? m[1].trim() : '';
    };
    const summary = get('SUMMARY');
    const dtstart = get('DTSTART');
    const desc    = get('DESCRIPTION');
    if (!summary || !dtstart) continue;
    events.push({ summary, dtstart, desc });
  }
  return events;
}

// Convierte fecha ICS a objeto Date
function parseICSDate(str) {
  if (!str) return null;
  const s = str.replace(/[:\-]/g, '');
  const y = +s.slice(0,4), mo = +s.slice(4,6)-1, d = +s.slice(6,8);
  const h = +(s.slice(9,11) || 0), mi = +(s.slice(11,13) || 0);
  return str.includes('Z')
    ? new Date(Date.UTC(y, mo, d, h, mi))
    : new Date(y, mo, d, h, mi);
}

function isAllDay(dtstart) { return !dtstart.includes('T'); }

function fmtTime(date, allDay) {
  if (allDay) return 'Todo el dia';
  return date.toLocaleTimeString('es-PR', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function fmtDate(date) {
  return date.toLocaleDateString('es-PR', { weekday: 'short', month: 'short', day: 'numeric' });
}


// -------------------------------------------------------------
//  CONEXION AL CALENDARIO
//  Intenta cada proxy en orden hasta que uno funcione
// -------------------------------------------------------------
let calEvents = [];

async function fetchCalendar() {
  const dot  = document.getElementById('calDot');
  const info = document.getElementById('calStatusText');

  for (const proxy of CONFIG.corsProxies) {
    try {
      const url = proxy + encodeURIComponent(CONFIG.icsUrl);
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const text = await res.text();
      if (!text.includes('BEGIN:VCALENDAR')) throw new Error('Invalid ICS');
      calEvents = parseICS(text);
      dot.className = 'cal-dot ok';
      info.textContent = 'Google Calendar ok - ' + calEvents.length + ' eventos';
      renderAll();
      return;
    } catch(e) {
      // intenta el siguiente proxy
    }
  }

  // Ultimo intento: fetch directo
  try {
    const res = await fetch(CONFIG.icsUrl, { cache: 'no-store', mode: 'cors' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    if (!text.includes('BEGIN:VCALENDAR')) throw new Error('Invalid ICS');
    calEvents = parseICS(text);
    dot.className = 'cal-dot ok';
    info.textContent = 'Google Calendar ok - ' + calEvents.length + ' eventos';
    renderAll();
    return;
  } catch(e) {}

  dot.className = 'cal-dot err';
  info.textContent = 'Sin conexion al calendario';
  renderAll();
}


// -------------------------------------------------------------
//  EVENTOS DE HOY
// -------------------------------------------------------------
function renderTodayEvents() {
  const container = document.getElementById('todayEvents');
  const now = new Date();
  const todayKey = '' + now.getFullYear()
    + String(now.getMonth()+1).padStart(2,'0')
    + String(now.getDate()).padStart(2,'0');

  const todays = calEvents.filter(ev =>
    ev.dtstart.replace(/[TZ\-:]/g, '').slice(0, 8) === todayKey
  );

  if (!todays.length) {
    container.innerHTML = '<div class="no-events">Sin eventos hoy</div>';
    return;
  }
  container.innerHTML = todays.slice(0, 4).map(ev => {
    const d = parseICSDate(ev.dtstart);
    const allDay = isAllDay(ev.dtstart);
    return '<div class="today-event">'
      + '<span class="today-time">' + (d ? fmtTime(d, allDay) : '') + '</span>'
      + '<span class="today-name">' + ev.summary + '</span>'
      + '</div>';
  }).join('');
}


// -------------------------------------------------------------
//  ANUNCIOS
//  Combina eventos del calendario + anuncios manuales del config
// -------------------------------------------------------------
const MAX_VIS = 3;
let annIdx = 0;
let allAnns = [];

function buildAnns() {
  allAnns = CONFIG.announcements;
}

function renderAnnouncements() {
  buildAnns();
  const list = document.getElementById('announcementsList');
  list.innerHTML = '';
  if (!allAnns.length) {
    list.innerHTML = '<div style="color:var(--muted);font-size:.85rem">No hay anuncios</div>';
    return;
  }
  for (var i = 0; i < MAX_VIS; i++) {
    var a = allAnns[(annIdx + i) % allAnns.length];
    var div = document.createElement('div');
    div.className = 'announcement-item' + (a.urgent ? ' highlight' : '') + (a.isCal ? ' cal-event' : '');
    div.innerHTML = '<div class="ann-icon">' + a.icon + '</div>'
      + '<div>'
      + '<div class="ann-title">' + a.title + '</div>'
      + '<div class="ann-desc">' + a.desc + '</div>'
      + '<span class="ann-tag ' + (a.urgent ? 'urgent' : '') + ' ' + (a.isCal ? 'cal' : '') + '">' + a.tag + '</span>'
      + '</div>';
    list.appendChild(div);
  }
}

function cycleAnns() {
  if (allAnns.length) annIdx = (annIdx + 1) % allAnns.length;
  renderAnnouncements();
}


// -------------------------------------------------------------
//  COUNTDOWN — PROXIMAS FECHAS
// -------------------------------------------------------------
function renderCountdowns() {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const list = document.getElementById('countdownList');
  const upcoming = calEvents
    .map(ev => ({ name: ev.summary, d: parseICSDate(ev.dtstart) }))
    .filter(function(x) { return x.d && x.d >= now; })
    .sort(function(a, b) { return a.d - b.d; })
    .slice(0, 5);

  if (!upcoming.length) {
    list.innerHTML = '<div style="color:var(--muted);font-size:.8rem;padding:6px 0">Agrega eventos al calendario para verlos aqui</div>';
    return;
  }
  list.innerHTML = upcoming.map(function(x) {
    var diff = Math.ceil((x.d - now) / 86400000);
    return '<div class="countdown-item">'
      + '<span class="countdown-name">' + x.name + '</span>'
      + '<span class="countdown-days">' + diff + '<span>dias</span></span>'
      + '</div>';
  }).join('');
}


// -------------------------------------------------------------
//  RELOJ Y FECHA
// -------------------------------------------------------------
function updateClock() {
  const now = new Date();
  var h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  document.getElementById('clockTime').textContent   = String(h).padStart(2,'0') + ':' + m;
  document.getElementById('clockSec').textContent    = ':' + s;
  document.getElementById('clockPeriod').textContent = period;
}

function updateDate() {
  const s = new Date().toLocaleDateString('es-PR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  document.getElementById('fullDate').textContent = s.charAt(0).toUpperCase() + s.slice(1);
}


// -------------------------------------------------------------
//  MENSAJE POSITIVO DEL DIA
// -------------------------------------------------------------
function renderQuote() {
  const q = CONFIG.quotes[new Date().getDay() % CONFIG.quotes.length];
  const c = document.getElementById('quoteContainer');
  c.classList.remove('quote-fade');
  void c.offsetWidth;
  c.classList.add('quote-fade');
  document.getElementById('quoteText').textContent   = '"' + q.text + '"';
  document.getElementById('quoteAuthor').textContent = q.author;
}


// -------------------------------------------------------------
//  TICKER INFERIOR
// -------------------------------------------------------------
function buildTicker() {
  const items = CONFIG.tickerItems.concat(CONFIG.tickerItems);
  document.getElementById('tickerContent').innerHTML =
    items.map(t => '<span class="ticker-item">' + t + '</span>').join('');
}


// -------------------------------------------------------------
//  RENDER ALL — actualiza todos los paneles dinamicos
// -------------------------------------------------------------
function renderAll() {
  renderTodayEvents();
  renderAnnouncements();
  renderCountdowns();
}


// -------------------------------------------------------------
//  CLIMA — Open-Meteo (gratis, sin API key)
// -------------------------------------------------------------
function weatherCodeInfo(code) {
  if (code === 0)              return { icon: '☀️',  desc: 'Despejado' };
  if (code <= 2)               return { icon: '⛅',  desc: 'Parcialmente nublado' };
  if (code === 3)              return { icon: '☁️',  desc: 'Nublado' };
  if (code <= 48)              return { icon: '🌫️', desc: 'Neblina' };
  if (code <= 55)              return { icon: '🌦️', desc: 'Llovizna' };
  if (code <= 65)              return { icon: '🌧️', desc: 'Lluvia' };
  if (code <= 75)              return { icon: '❄️',  desc: 'Nieve' };
  if (code <= 82)              return { icon: '🌧️', desc: 'Aguaceros' };
  if (code <= 99)              return { icon: '⛈️',  desc: 'Tormenta' };
  return { icon: '🌡️', desc: '' };
}

async function fetchWeather() {
  try {
    const { lat, lon, units } = CONFIG.weather;
    const windUnit = units === 'fahrenheit' ? 'mph' : 'kmh';
    const url = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=' + lat + '&longitude=' + lon
      + '&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m'
      + '&temperature_unit=' + units
      + '&windspeed_unit=' + windUnit
      + '&timezone=auto';
    const res  = await fetch(url);
    const data = await res.json();
    const c    = data.current;
    const info = weatherCodeInfo(c.weathercode);
    const deg  = units === 'fahrenheit' ? '°F' : '°C';
    document.getElementById('weatherIcon').textContent = info.icon;
    document.getElementById('weatherTemp').textContent = Math.round(c.temperature_2m) + deg;
    document.getElementById('weatherDesc').textContent = info.desc;
    document.getElementById('weatherMeta').textContent =
      '💧 ' + c.relative_humidity_2m + '%   🌬 ' + Math.round(c.windspeed_10m) + ' ' + windUnit;
  } catch(e) {
    document.getElementById('weatherDesc').textContent = 'Sin datos de clima';
  }
}


// -------------------------------------------------------------
//  INICIALIZACION
// -------------------------------------------------------------
document.getElementById('schoolName').textContent = CONFIG.schoolName;

updateClock();
updateDate();
renderQuote();
buildTicker();

// Intervalos de actualizacion
setInterval(updateClock, 1000);
setInterval(updateDate,  60 * 1000);

// Calendario: carga inmediata y refresco periodico
fetchCalendar();

// Clima: carga inmediata y refresco cada 10 min
fetchWeather();
setInterval(fetchWeather, 10 * 60 * 1000);
setInterval(fetchCalendar, CONFIG.CAL_REFRESH_MIN * 60 * 1000);

// Rotacion de anuncios con barra de progreso
var elapsed = 0;
var TICK = 100;

setInterval(function() {
  elapsed += TICK;
  document.getElementById('annProgress').style.width = (elapsed / CONFIG.ANN_DUR * 100) + '%';
  if (elapsed >= CONFIG.ANN_DUR) {
    elapsed = 0;
    cycleAnns();
  }
}, TICK);
