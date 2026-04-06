# Dashboard - Salon

Dashboard de pantalla completa para salón de clases. Diseñado para mostrarse en un TV o proyector durante todo el día escolar.

## Vista previa

> **URL en vivo:** `https://carlosaolivera.github.io/dashboard-salon/dashboard

---

## Funciones

| Panel | Descripción |
|-------|-------------|
| **Reloj** | Hora en tiempo real con AM/PM y segundos |
| **Clima** | Temperatura, condición, humedad y viento (Open-Meteo, sin API key) |
| **Hoy** | Eventos del día desde Google Calendar |
| **Anuncios** | Mensajes manuales configurables con rotación automática |
| **Próximas fechas** | Countdown de eventos futuros del calendario con scroll |
| **Mensaje del día** | Frase motivacional rotativa según el día de la semana |
| **Ticker** | Barra de mensajes deslizante en la parte superior |

---

## Configuración

Todo se configura en **`dashboard/config.js`** — es el único archivo que necesitas editar.

### Nombre de la escuela
```js
schoolName: "Escuela Fernando Suria Chaves, Barceloneta PR",
```

### Google Calendar (ICS)
1. Abre [calendar.google.com](https://calendar.google.com)
2. Click en los tres puntos del calendario → **Configuración**
3. Copia la **"Dirección secreta en formato iCal"**
4. Pégala en `icsUrl`

```js
icsUrl: "https://calendar.google.com/calendar/ical/...basic.ics",
```

> Los eventos futuros aparecen automáticamente en **Hoy**, **Próximas fechas** y **Anuncios**.

### Clima
```js
weather: {
  lat:   18.4494,       // latitud (busca en maps.google.com → click derecho)
  lon:  -66.5390,       // longitud
  city:  "Barceloneta, PR",
  units: "fahrenheit"   // "fahrenheit" o "celsius"
},
```

### Anuncios manuales
```js
announcements: [
  {
    icon:   "🤖",
    title:  "Título del anuncio",
    desc:   "Descripción breve del evento o aviso.",
    tag:    "Categoría",
    urgent: true   // true = borde naranja | false = borde azul
  }
]
```

### Mensajes del día
```js
quotes: [
  { text: "Tu frase aquí.", author: "- Autor" },
  ...
]
```
Se selecciona uno por día de la semana en orden.

### Ticker inferior
```js
tickerItems: [
  "Mensaje 1",
  "Mensaje 2",
]
```

### Tiempos de actualización
```js
ANN_DUR:        8000,   // milisegundos entre rotación de anuncios (8 seg)
CAL_REFRESH_MIN: 15     // minutos entre refresco del calendario
```

---

## Estructura de archivos

```
dashboard/
├── index.html    — estructura HTML
├── style.css     — estilos y layout (grid, colores, animaciones)
├── app.js        — toda la lógica (reloj, calendario, clima, anuncios)
└── config.js     — configuración del usuario (editar este)
```

---

## Uso local

Requiere un servidor local (no funciona abriendo el archivo directamente por restricciones CORS).

**VS Code — Live Server:**
1. Instala la extensión [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Click derecho en `index.html` → **Open with Live Server**

**Terminal:**
```bash
cd dashboard
npx serve .
# abre http://localhost:3000
```

---

## GitHub Pages (hosting gratuito)

1. Sube el repo a GitHub
2. **Settings → Pages → Source:** `Deploy from a branch`
3. Branch: `main` / Folder: `/dashboard`
4. En ~1 minuto estará disponible en `https://TU-USUARIO.github.io/REPO/`

---

## Personalización de colores

Edita las variables en la parte superior de `style.css`:

```css
:root {
  --bg:      #05080f;          /* fondo principal */
  --panel:   rgba(12,24,49,.85); /* fondo de tarjetas */
  --accent:  #00d4ff;          /* azul cyan */
  --accent2: #ff6b35;          /* naranja */
  --text:    #e8f4fd;          /* texto principal */
  --muted:   #6b8caa;          /* texto secundario */
}
```

---

## Créditos

- Clima: [Open-Meteo](https://open-meteo.com/) — API gratuita sin registro
- Fuentes: [Orbitron](https://fonts.google.com/specimen/Orbitron) + [Exo 2](https://fonts.google.com/specimen/Exo+2) (Google Fonts)
- Calendario: Google Calendar ICS feed
