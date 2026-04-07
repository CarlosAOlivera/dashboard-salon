// =============================================================
//  CONFIG.JS — TODA LA CONFIGURACION DEL DASHBOARD
//  Este es el unico archivo que necesitas editar normalmente
// =============================================================

const CONFIG = {

  // Nombre que aparece en la barra superior
  schoolName: "Escuela Fernando Suria Chaves, Barceloneta PR",

  // Configuracion del clima (Open-Meteo — gratis, sin API key)
  // Busca tus coordenadas en: maps.google.com -> click derecho -> "¿Qué hay aquí?"
  weather: {
    lat:   18.4494,
    lon:  -66.5390,
    city:  "Barceloneta, PR",
    units: "fahrenheit"   // "fahrenheit" o "celsius"
  },

  // Enlace ICS de tu Google Calendar "Dashboard Salon"
  // Para actualizarlo: calendar.google.com -> tu calendario ->
  // tres puntos -> Configuracion -> "Direccion secreta en formato iCal"
  icsUrl: "https://calendar.google.com/calendar/ical/7d76282e40a9dad70dce4e2e395ffaec5ca530c3183284d6651984ec99740e9b%40group.calendar.google.com/private-56115b398ef981a679e76f3a7bf3fdbb/basic.ics",

  // Proxies CORS — el sistema los intenta en orden hasta que uno funcione
  corsProxies: [
    "https://corsproxy.io/?url=",
    "https://api.codetabs.com/v1/proxy?quest=",
    "https://api.allorigins.win/raw?url=",
    "https://yacdn.org/proxy/"
  ],

  // ---------------------------------------------------------------
  // ANUNCIOS MANUALES
  // Campos:
  //   icon    → emoji que aparece a la izquierda
  //   title   → titulo en negrita
  //   desc    → descripcion breve
  //   tag     → etiqueta de categoria
  //   urgent  → true = borde naranja | false = borde azul
  // ---------------------------------------------------------------
  announcements: [
    {
      icon: "🤖",
      title: "Torneo WRO - 3ra Regional",
      desc: "🚩TORNEO REGIONAL – 📌 Bonneville School: 🗓️ Sabado, Abril 18, 🕗 08:00am – 4:00pm.",
      tag: "Extracurricular",
      urgent: true
    },
    {
      icon: "🏆",
      title: "ULTIMO TIMBRE - 5 DE MAYO",
      desc: "Actividad especial para celebrar sus logros, esfuerzo y crecimiento durante el año escolar. ¡Felicidades!",
      tag: "Logro",
      urgent: false
    },
    {
      icon: "🎓",
      title: "GRADUATION DAY - 27 de Mayo",
      desc: "Celebramos el cierre de una gran etapa y el comienzo de nuevos caminos. 🎉¡Felicidades, Clase Graduanda!",
      tag: "Logro",
      urgent: false
    },
    {
      icon: "🍽️",
      title: "Menú de Almuerzo",
      desc: "Menu de almuerzo: 🐔 caderas de pollo en salsa bbq, 🍛 arroz chino, repollo, 🥕 zanahoria y 🍐 pera",
      tag: "Almuerzo",
      urgent: true 
    }
  ],

  // ---------------------------------------------------------------
  // MENSAJES POSITIVOS DEL DIA
  // Se muestran uno por dia segun el dia de la semana
  // Agrega o quita los que quieras
  // ---------------------------------------------------------------
  quotes: [
    { text: "El exito es la suma de pequenos esfuerzos repetidos dia tras dia.", author: "- Robert Collier" },
    { text: "No importa lo lento que vayas, siempre y cuando no te detengas.", author: "- Confucio" },
    { text: "El unico modo de hacer un gran trabajo es amar lo que haces.", author: "- Steve Jobs" },
    { text: "Cada experto fue alguna vez un principiante.", author: "- Helen Hayes" },
    { text: "La educacion es el arma mas poderosa que puedes usar para cambiar el mundo.", author: "- Nelson Mandela" },
    { text: "Cree en ti mismo y todo sera posible.", author: "- Anonimo" },
    { text: "Los errores son prueba de que lo estas intentando.", author: "- Jennifer Lim" },
    { text: "Hoy es un buen dia para aprender algo nuevo.", author: "- Anonimo" },
    { text: "Tu unico limite eres tu mismo.", author: "- Anonimo" },
    { text: "El cerebro que aprende es el cerebro que se transforma.", author: "- Neuroscience Today" }
  ],

  // ---------------------------------------------------------------
  // TICKER — mensajes de la barra inferior desplazante
  // Agregalos o cambialos libremente
  // ---------------------------------------------------------------
  tickerItems: [
    "Menu de almuerzo: caderas de pollo en salsa bbq, arroz chino, repollo, zanahoria y pera",
    "Si tienes dudas, pregunta! No hay preguntas tontas",
    "Unit 12.6 Module 1 debe ser trabajado diariamente"
  ],

  // ---------------------------------------------------------------
  // AJUSTES DE TIEMPO
  // ANN_DUR: cuantos milisegundos dura cada grupo de anuncios (8000 = 8 seg)
  // CAL_REFRESH: cada cuantos minutos se refresca el calendario
  // ---------------------------------------------------------------
  ANN_DUR: 8000,
  CAL_REFRESH_MIN: 15

};
