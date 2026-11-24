# SOUND OF SPACE
### *Explore the Universe. Experience the Cosmos.*

An immersive, responsive, and scientifically grounded 3D interactive Solar System & Universe Explorer built with **pure HTML5, CSS3, and Vanilla JavaScript (ES6+)**.

---

## 🌟 Overview & Highlights

- **Interactive 3D Solar System**: High-performance Canvas 2D engine featuring an animated, perspective-projected solar system with the **Sun** and all **8 planets** (Mercury, Venus, Earth, Mars, Jupiter, Saturn with ring system, Uranus, and Neptune). Features smooth exponential camera easing, mouse drag-to-rotate, wheel zoom, touch orbit navigation, simulation speed multipliers ($0\times$ to $4\times$), play/pause toggle, and dynamic celestial body tracking.
- **17 Planetary Moons**: Visible 3D spherical moons with directional lighting and orbital paths for Earth (The Moon), Mars (Phobos, Deimos), Jupiter (Io, Europa, Ganymede, Callisto), Saturn (Titan, Enceladus, Rhea, Iapetus), Uranus (Titania, Oberon, Umbriel, Ariel, Miranda), and Neptune (Triton).
- **Asteroid Belt**: 800 Keplerian particles orbiting between Mars and Jupiter.
- **Milky Way Galaxy Exploration**: Seamless zoom transition from the Solar System into the broader Milky Way galaxy. The Solar System is marked by a location beacon in the Orion-Cygnus Arm, approximately 26,000 light-years from the core.
- **Sagittarius A* (Supermassive Black Hole)**: Situated at the exact Galactic Center of the Milky Way. Features a pitch-black event horizon shadow, a glowing relativistic accretion disk with Keplerian plasma particles, asymmetric Doppler beaming, gravitational lensing arcs, a luminescent photon sphere ring, and astrophysical polar jets.
- **Andromeda Galaxy (M31)**: Realistic inclined barred-spiral galaxy located in the Local Group, visible when zooming out into intergalactic space. Features a luminous central bulge, spiral dust lanes, and companion dwarf galaxies (M32 and M110). *Exterior observation only (interior exploration restricted).*
- **Scientific Information Dossier**: Clean, readable scientific dashboard with modern typography (`Inter`), displaying planet/body type, diameter, distance from Sun, rotation period, orbital period, surface gravity, surface temperature, and astronomical description.
- **Cosmic Audio Engine**: Web Audio API continuous ambient space synthesizer and authentic data sonifications (e.g. SOHO solar helioseismology, Jovian radio waves, Saturn Kilometric Radiation, Earth Van Allen belts, Chandra/ALMA Sagittarius A* accretion flow, and Hubble M31 acoustic translation).

---

## 🔒 Absolute Technology Compliance

Strictly adheres to frontend restrictions:
- **HTML5**: Semantic elements, accessible ARIA attributes.
- **CSS3**: Modern custom properties, responsive flexbox/grid, glassmorphism HUD accents, and clean system typography.
- **Vanilla JavaScript (ES6+)**: Canvas 2D API, Web Audio API, `requestAnimationFrame`, high-precision delta-time physics.
- **Zero prohibited dependencies**:
  - NO Three.js, Babylon.js, GSAP, or third-party libraries
  - NO React, Vue, Angular, or frontend frameworks
  - NO Tailwind, Bootstrap, or CSS frameworks
  - NO Node.js, Express, Python, or backend server runtimes
  - NO npm packages, bundlers, Vite, or Webpack
  - Runs natively in any modern browser as a pure static web app!

---

## 📁 Project Structure

```
SOLAR SYSTEM/
├── index.html            # Primary application entry point & Canvas UI
├── README.md             # Project documentation & scientific overview
├── SOURCES.md            # NASA/JPL/EHT scientific citations & references
├── css/
│   └── style.css         # Complete application & scientific dashboard styles
└── js/
    └── app.js            # 3D Solar System, Universe Engine & Web Audio synthesizer
```

---

## 🚀 Running the Project

Because the project is built as a native static website using standard ES modules:

1. Open the project directory in a terminal.
2. Start any local static HTTP server:
   ```bash
   # Python 3
   python -m http.server 8080

   # Or Node npx
   npx serve .
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:8080/index.html
   ```

---

## 🔭 Controls & Interactions

- **Left Click + Drag**: Orbit / rotate 3D camera.
- **Mouse Wheel / Pinch**: Smoothly zoom in and out across planetary, galactic, and intergalactic scales.
- **Click Any Object**: Smoothly focus camera on any planet, moon, Sagittarius A*, or Andromeda to open its scientific dossier.
- **Scale Navigation Pills** (`Solar System` | `Milky Way` | `Andromeda`): Instantly glide between astronomical scale regimes.
- **↩ Back Button**: Smoothly returns camera to the previous scale level.
- **Space Audio Button**: Toggles the generative deep space ambient synthesizer.
- **Play/Pause & Speed Slider**: Controls orbital simulation playback and speed multiplier ($0\times$ – $4\times$).
