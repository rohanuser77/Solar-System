/**
 * SOUND OF SPACE — Interactive 3D Solar System Engine
 * Pure Vanilla JavaScript (ES6+) & Canvas 2D.
 * Features:
 * - Complete Solar System: Sun + 8 Planets
 * - Full Planetary Moon Systems:
 *   Earth (Moon), Mars (Phobos, Deimos), Jupiter (Io, Europa, Ganymede, Callisto),
 *   Saturn (Titan, Enceladus, Rhea, Iapetus), Uranus (Titania, Oberon, Umbriel, Ariel, Miranda),
 *   Neptune (Triton)
 * - Asteroid belt with 800 particles
 * - Delta-time physics & frame-rate independent smooth camera easing
 * - Raycast picking with foreground depth resolution (Fixes Sun, planets, and moons selection)
 * - Redesigned scientific dashboard information panel
 * - Web Audio API continuous ambient space drone & planetary sonifications
 */

// =====================================================================
// 1. ASTRONOMICAL CELESTIAL & GALACTIC DATASET
// =====================================================================

export const SAGITTARIUS_A_DATA = {
  id: 'sagittarius_a',
  name: 'Sagittarius A*',
  tag: 'Supermassive Black Hole',
  color: '#ffa020',
  pos: { x: 260, y: 0, z: -70 },
  size: 3.4,
  facts: {
    diameter: 'Event Horizon: ~24M km (0.16 AU)',
    distance: 'Approximately 26,000 light-years',
    day: 'Relativistic spin parameter a* > 0.9',
    year: 'Galactic Center of the Milky Way',
    gravity: 'Approximately 4 million solar masses',
    temp: 'Accretion disk: ~10 Billion K (Hawking: ~10⁻¹⁴ K)'
  },
  desc: 'The supermassive black hole anchoring the Galactic Center of the Milky Way, with a mass of approximately 4 million solar masses. Confirmed through decades of Nobel Prize-winning stellar orbit tracking (S-stars) and imaged in polarized millimeter radio waves by the Event Horizon Telescope (EHT). Features a high-energy glowing accretion disk and extreme gravitational spacetime curvature.',
  sonify: {
    title: 'Sagittarius A* Acoustic Sonification',
    freq: 72,
    wave: 'sawtooth',
    mod: 1.2,
    desc: 'NASA Chandra X-ray Observatory and ALMA submillimeter sonification of superheated plasma plunging into the event horizon.'
  }
};

export const ANDROMEDA_DATA = {
  id: 'andromeda',
  name: 'Andromeda Galaxy (M31)',
  tag: 'Barred Spiral Galaxy (SA(s)b)',
  color: '#93c5fd',
  pos: { x: -840, y: 190, z: 640 },
  size: 38,
  facts: {
    diameter: '~220,000 light-years across',
    distance: '2.537 million light-years from Earth',
    day: 'Galactic rotation: ~250 Million yrs',
    year: 'Merger with Milky Way in ~4.5 Billion yrs',
    gravity: 'Total mass: ~1.5 Trillion Solar Masses',
    temp: 'Core bulge: ~4,500 K / Outer disk: ~10,000 K'
  },
  desc: 'The largest and most massive galaxy in our Local Group, containing approximately 1 trillion stars—nearly double that of the Milky Way. Approaching our galaxy at 110 km/s. Scientific Note: Distances and sizes are visually scaled for interactive cosmic navigation. Exterior observation only (interior exploration restricted).',
  sonify: {
    title: 'Andromeda M31 Multi-Wavelength Symphony',
    freq: 196,
    wave: 'sine',
    mod: 4.8,
    desc: 'Hubble Space Telescope and Swift ultraviolet sonification mapping stellar density waves and spiral arm resonance.'
  }
};

const CELESTIAL_DATA = [
  {
    id: 'sun',
    name: 'Sun',
    tag: 'Yellow Dwarf Star (G2V)',
    color: '#ffcc55',
    dist: 0,
    size: 2.3,
    speed: 0,
    spin: 0.08,
    tilt: 0.12,
    facts: {
      diameter: '1,392,700 km',
      distance: '0 km (Center of System)',
      day: '~25.4 Earth days',
      year: '230 Million yrs (Galactic Orbit)',
      gravity: '274.0 m/s² (27.9g)',
      temp: '5,500 °C (Surface) / 15M °C (Core)'
    },
    desc: 'The incandescent gravitational anchor of our solar system, containing 99.86% of its entire mass. Core hydrogen fusion converts 600 million tons of hydrogen into helium every second.',
    sonify: {
      title: 'Solar Helioseismic Acoustic Waves',
      freq: 110,
      wave: 'sawtooth',
      mod: 0.35,
      desc: 'SOHO Doppler velocity sonification of solar core pressure oscillations.'
    }
  },
  {
    id: 'mercury',
    name: 'Mercury',
    tag: 'Terrestrial Planet',
    color: '#b3aa9e',
    dist: 4.6,
    size: 0.24,
    speed: 0.82,
    spin: 0.35,
    tilt: 0.03,
    facts: {
      diameter: '4,879 km',
      distance: '57.9 million km (0.39 AU)',
      day: '58.6 Earth days',
      year: '88 Earth days',
      gravity: '3.70 m/s² (0.38g)',
      temp: '-180 °C (Night) to +430 °C (Day)'
    },
    desc: 'The smallest and swiftest planet, experiencing extreme temperature swings. A massive iron core occupies nearly 85% of its total radius.',
    sonify: {
      title: 'Hermian Magnetospheric Bow Shock',
      freq: 180,
      wave: 'triangle',
      mod: 1.5,
      desc: 'MESSENGER magnetometer data of solar wind particle compression.'
    }
  },
  {
    id: 'venus',
    name: 'Venus',
    tag: 'Terrestrial Planet',
    color: '#e8cf9c',
    dist: 6.4,
    size: 0.38,
    speed: 0.62,
    spin: 0.15,
    tilt: 3.1, // Retrograde
    facts: {
      diameter: '12,104 km',
      distance: '108.2 million km (0.72 AU)',
      day: '243 Earth days (Retrograde)',
      year: '225 Earth days',
      gravity: '8.87 m/s² (0.90g)',
      temp: '464 °C (Uniform surface)'
    },
    desc: 'The hottest world in the solar system, blanketed in a dense carbon dioxide greenhouse atmosphere with surface pressures 93 times that of Earth.',
    sonify: {
      title: 'Venusian Whistler Mode Waves',
      freq: 240,
      wave: 'sine',
      mod: 3.2,
      desc: 'Venus Express plasma wave detections of lightning-induced radio discharges.'
    }
  },
  {
    id: 'earth',
    name: 'Earth',
    tag: 'Terrestrial (Ocean World)',
    color: '#4b90ff',
    dist: 8.5,
    size: 0.42,
    speed: 0.50,
    spin: 1.2,
    tilt: 0.41,
    hasClouds: true,
    moons: [
      {
        id: 'luna',
        name: 'The Moon (Luna)',
        dist: 1.15,
        size: 0.11,
        speed: 2.8,
        color: '#c4c0b8',
        facts: {
          diameter: '3,474 km',
          distance: '384,400 km from Earth',
          day: '27.3 Earth days (Tidally locked)',
          year: '27.3 days (Orbit of Earth)',
          gravity: '1.62 m/s² (0.165g)',
          temp: '-130 °C to +120 °C'
        },
        desc: 'Earth’s only natural satellite, stabilizing our planet’s axial tilt and generating the tidal cycles that nurtured early terrestrial evolution.'
      }
    ],
    facts: {
      diameter: '12,742 km',
      distance: '149.6 million km (1.00 AU)',
      day: '23h 56m',
      year: '365.25 days',
      gravity: '9.807 m/s² (1.00g)',
      temp: '15 °C (Global mean)'
    },
    desc: 'Our vibrant haven: the only known celestial body in the cosmos confirmed to harbor surface liquid water oceans, plate tectonics, and life.',
    sonify: {
      title: 'Van Allen Belts Chorus Waves',
      freq: 440,
      wave: 'sine',
      mod: 7.5,
      desc: 'NASA Van Allen Probes EMFISIS electromagnetic chorus sounding like morning birdsong.'
    }
  },
  {
    id: 'mars',
    name: 'Mars',
    tag: 'Terrestrial Planet',
    color: '#c1603f',
    dist: 10.8,
    size: 0.30,
    speed: 0.41,
    spin: 1.1,
    tilt: 0.44,
    moons: [
      {
        id: 'phobos',
        name: 'Phobos',
        dist: 0.60,
        size: 0.048,
        speed: 5.5,
        color: '#9a9186',
        facts: {
          diameter: '22.2 km',
          distance: '9,377 km from Mars',
          day: '7h 39m (Tidally locked)',
          year: '7h 39m',
          gravity: '0.0057 m/s² (0.0006g)',
          temp: '-40 °C'
        },
        desc: 'The doomed potato-shaped inner moon of Mars, orbiting closer to its parent planet than any other moon in the solar system.'
      },
      {
        id: 'deimos',
        name: 'Deimos',
        dist: 0.88,
        size: 0.038,
        speed: 3.8,
        color: '#a89f92',
        facts: {
          diameter: '12.4 km',
          distance: '23,460 km from Mars',
          day: '30h 18m',
          year: '30h 18m',
          gravity: '0.003 m/s² (0.0003g)',
          temp: '-40 °C'
        },
        desc: 'The smooth outer moon of Mars, believed to be an ancient carbonaceous asteroid gravitationally captured from the asteroid belt.'
      }
    ],
    facts: {
      diameter: '6,779 km',
      distance: '227.9 million km (1.52 AU)',
      day: '24h 37m (1 sol)',
      year: '687 Earth days',
      gravity: '3.72 m/s² (0.38g)',
      temp: '-63 °C (Mean surface)'
    },
    desc: 'The Red Planet: a frozen desert world harboring Olympus Mons (the tallest volcano in the solar system) and polar water-ice caps.',
    sonify: {
      title: 'Martian Seismometer & Wind Acoustic',
      freq: 135,
      wave: 'triangle',
      mod: 0.8,
      desc: 'InSight microseismometer bed-rumblings blended with Perseverance SuperCam mic.'
    }
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    tag: 'Gas Giant',
    color: '#d8b078',
    dist: 15.5,
    size: 1.20,
    speed: 0.23,
    spin: 2.4,
    tilt: 0.05,
    moons: [
      {
        id: 'io',
        name: 'Io',
        dist: 1.85,
        size: 0.095,
        speed: 2.4,
        color: '#f5e050',
        facts: {
          diameter: '3,643 km',
          distance: '421,700 km from Jupiter',
          day: '42.5 hours',
          year: '1.77 Earth days',
          gravity: '1.79 m/s² (0.183g)',
          temp: '-130 °C (Sulfur plains) / 1,200 °C (Volcanoes)'
        },
        desc: 'The most volcanically active body in the solar system, with hundreds of active silicate and sulfur calderas driven by tidal friction.'
      },
      {
        id: 'europa',
        name: 'Europa',
        dist: 2.35,
        size: 0.088,
        speed: 1.8,
        color: '#f0ead0',
        facts: {
          diameter: '3,122 km',
          distance: '670,900 km from Jupiter',
          day: '85.2 hours',
          year: '3.55 Earth days',
          gravity: '1.31 m/s² (0.134g)',
          temp: '-160 °C (Surface)'
        },
        desc: 'A world encased in an icy shell harboring a global liquid saltwater ocean beneath, holding twice the water of all Earth’s oceans combined.'
      },
      {
        id: 'ganymede',
        name: 'Ganymede',
        dist: 2.95,
        size: 0.138,
        speed: 1.35,
        color: '#b8ac95',
        facts: {
          diameter: '5,268 km',
          distance: '1,070,400 km from Jupiter',
          day: '171.7 hours',
          year: '7.15 Earth days',
          gravity: '1.43 m/s² (0.146g)',
          temp: '-163 °C'
        },
        desc: 'The largest moon in the solar system (larger than Mercury and Pluto), and the only moon known to possess its own intrinsic magnetic field.'
      },
      {
        id: 'callisto',
        name: 'Callisto',
        dist: 3.55,
        size: 0.125,
        speed: 1.0,
        color: '#948a76',
        facts: {
          diameter: '4,821 km',
          distance: '1,882,700 km from Jupiter',
          day: '16.7 Earth days',
          year: '16.7 Earth days',
          gravity: '1.24 m/s² (0.126g)',
          temp: '-139 °C'
        },
        desc: 'The most heavily cratered object in the solar system, with an ancient undisturbed ice-rock crust dating back 4 billion years.'
      }
    ],
    facts: {
      diameter: '139,820 km',
      distance: '778.5 million km (5.20 AU)',
      day: '9h 55m',
      year: '11.86 Earth yrs',
      gravity: '24.79 m/s² (2.53g at 1-bar)',
      temp: '-110 °C (At 1-bar cloud deck)'
    },
    desc: 'Colossal king of planets: a turbulent gas giant with a Great Red Spot storm larger than Earth and a colossal magnetosphere.',
    sonify: {
      title: 'Jovian Decametric Radio Bursts',
      freq: 320,
      wave: 'sawtooth',
      mod: 6.2,
      desc: 'Voyager & Juno plasma wave recordings of electrons spiraling near the Io torus.'
    }
  },
  {
    id: 'saturn',
    name: 'Saturn',
    tag: 'Gas Giant',
    color: '#e8dcb0',
    dist: 20.8,
    size: 1.0,
    speed: 0.17,
    spin: 2.2,
    tilt: 0.47,
    hasRing: 'saturn',
    moons: [
      {
        id: 'enceladus',
        name: 'Enceladus',
        dist: 1.55,
        size: 0.070,
        speed: 2.7,
        color: '#ffffff',
        facts: {
          diameter: '504 km',
          distance: '238,000 km from Saturn',
          day: '32.9 hours',
          year: '1.37 Earth days',
          gravity: '0.113 m/s² (0.011g)',
          temp: '-198 °C (Surface)'
        },
        desc: 'A brilliant, reflective icy moon venting geysers of water vapor, salts, and organic molecules from a hydrothermal subsurface ocean.'
      },
      {
        id: 'rhea',
        name: 'Rhea',
        dist: 2.15,
        size: 0.088,
        speed: 1.9,
        color: '#dedad2',
        facts: {
          diameter: '1,527 km',
          distance: '527,100 km from Saturn',
          day: '4.52 Earth days',
          year: '4.52 Earth days',
          gravity: '0.264 m/s² (0.027g)',
          temp: '-174 °C'
        },
        desc: 'The second-largest moon of Saturn, composed of roughly 75% water ice and 25% rock, covered in deep impact craters.'
      },
      {
        id: 'titan',
        name: 'Titan',
        dist: 2.95,
        size: 0.145,
        speed: 1.25,
        color: '#f2b744',
        facts: {
          diameter: '5,149 km',
          distance: '1,221,870 km from Saturn',
          day: '15.9 Earth days',
          year: '15.9 Earth days',
          gravity: '1.35 m/s² (0.138g)',
          temp: '-179 °C'
        },
        desc: 'The second-largest moon in the solar system, surrounded by a dense nitrogen atmosphere with liquid methane rivers, lakes, and dunes.'
      },
      {
        id: 'iapetus',
        name: 'Iapetus',
        dist: 3.85,
        size: 0.092,
        speed: 0.75,
        color: '#c0baa8',
        facts: {
          diameter: '1,470 km',
          distance: '3,560,800 km from Saturn',
          day: '79.3 Earth days',
          year: '79.3 Earth days',
          gravity: '0.223 m/s² (0.023g)',
          temp: '-143 °C to -180 °C'
        },
        desc: 'The dramatic two-toned "yin-yang" moon of Saturn with one pitch-black hemisphere (Cassini Regio) and one bright snowy hemisphere.'
      }
    ],
    facts: {
      diameter: '116,460 km',
      distance: '1.43 billion km (9.58 AU)',
      day: '10h 42m',
      year: '29.45 Earth yrs',
      gravity: '10.44 m/s² (1.06g at 1-bar)',
      temp: '-140 °C (Mean cloud top)'
    },
    desc: 'The jewel of the solar system, crowned with a dazzling ring system of water ice spanning 282,000 km yet only tens of meters thin.',
    sonify: {
      title: 'Saturn Kilometric Radiation (SKR)',
      freq: 290,
      wave: 'sine',
      mod: 4.8,
      desc: 'Cassini RPWS audio of auroral radio emissions modulated by Saturnian rotation.'
    }
  },
  {
    id: 'uranus',
    name: 'Uranus',
    tag: 'Ice Giant',
    color: '#bfe8e8',
    dist: 25.8,
    size: 0.68,
    speed: 0.12,
    spin: 1.6,
    tilt: 1.71,
    hasRing: 'uranus',
    moons: [
      {
        id: 'miranda',
        name: 'Miranda',
        dist: 1.35,
        size: 0.060,
        speed: 2.8,
        color: '#d6d6d6',
        facts: {
          diameter: '472 km',
          distance: '129,900 km from Uranus',
          day: '33.9 hours',
          year: '1.41 Earth days',
          gravity: '0.079 m/s² (0.008g)',
          temp: '-213 °C'
        },
        desc: 'A bizarre Frankenstein moon scarred by colossal chevron fault valleys, including Verona Rupes, a 20-kilometer sheer vertical cliff.'
      },
      {
        id: 'ariel',
        name: 'Ariel',
        dist: 1.75,
        size: 0.082,
        speed: 2.1,
        color: '#e6e6e6',
        facts: {
          diameter: '1,158 km',
          distance: '190,900 km from Uranus',
          day: '2.52 Earth days',
          year: '2.52 Earth days',
          gravity: '0.269 m/s² (0.027g)',
          temp: '-213 °C'
        },
        desc: 'The brightest Uranian moon, displaying extensive fault scarps and smooth canyon floors shaped by cryovolcanic volcanic resurfacing.'
      },
      {
        id: 'umbriel',
        name: 'Umbriel',
        dist: 2.20,
        size: 0.080,
        speed: 1.6,
        color: '#858585',
        facts: {
          diameter: '1,169 km',
          distance: '266,000 km from Uranus',
          day: '4.14 Earth days',
          year: '4.14 Earth days',
          gravity: '0.200 m/s² (0.020g)',
          temp: '-213 °C'
        },
        desc: 'The darkest of the major Uranian moons, reflecting less than 16% of incident sunlight, adorned with the enigmatic bright Wunda crater ring.'
      },
      {
        id: 'titania',
        name: 'Titania',
        dist: 2.75,
        size: 0.105,
        speed: 1.25,
        color: '#c7c7c7',
        facts: {
          diameter: '1,578 km',
          distance: '436,300 km from Uranus',
          day: '8.71 Earth days',
          year: '8.71 Earth days',
          gravity: '0.379 m/s² (0.039g)',
          temp: '-213 °C'
        },
        desc: 'The largest moon of Uranus, carved by massive extensional grabens and fault canyons spanning up to 1,600 kilometers across.'
      },
      {
        id: 'oberon',
        name: 'Oberon',
        dist: 3.35,
        size: 0.098,
        speed: 0.95,
        color: '#a39f99',
        facts: {
          diameter: '1,523 km',
          distance: '583,500 km from Uranus',
          day: '13.46 Earth days',
          year: '13.46 Earth days',
          gravity: '0.346 m/s² (0.035g)',
          temp: '-213 °C'
        },
        desc: 'The outermost major Uranian moon, heavily cratered and scarred by an unknown dark carbonaceous material lining its crater basins.'
      }
    ],
    facts: {
      diameter: '50,724 km',
      distance: '2.87 billion km (19.2 AU)',
      day: '17h 14m (Retrograde)',
      year: '84.0 Earth yrs',
      gravity: '8.69 m/s² (0.89g at 1-bar)',
      temp: '-195 °C (Coldest atmosphere: -224 °C)'
    },
    desc: 'The cyan ice giant rolling around the Sun on its side with a 97.8° tilt, containing an exotic slush mantle of water, methane, and ammonia.',
    sonify: {
      title: 'Uranian Plasma Wave Whistles',
      freq: 210,
      wave: 'sine',
      mod: 2.1,
      desc: 'Voyager 2 plasma wave subsystem recordings of off-axis tipped magnetic lines.'
    }
  },
  {
    id: 'neptune',
    name: 'Neptune',
    tag: 'Ice Giant',
    color: '#4667d8',
    dist: 30.5,
    size: 0.65,
    speed: 0.09,
    spin: 1.6,
    tilt: 0.49,
    moons: [
      {
        id: 'triton',
        name: 'Triton',
        dist: 1.70,
        size: 0.110,
        speed: -1.9, // Retrograde orbit!
        color: '#9fd1d1',
        facts: {
          diameter: '2,707 km',
          distance: '354,800 km from Neptune',
          day: '5.88 Earth days (Retrograde)',
          year: '5.88 Earth days',
          gravity: '0.779 m/s² (0.079g)',
          temp: '-235 °C (Extremely cold)'
        },
        desc: 'The only large moon in the solar system with a retrograde orbit. A captured Kuiper Belt dwarf world featuring active liquid nitrogen geysers.'
      }
    ],
    facts: {
      diameter: '49,244 km',
      distance: '4.50 billion km (30.1 AU)',
      day: '16h 06m',
      year: '164.8 Earth yrs',
      gravity: '11.15 m/s² (1.14g at 1-bar)',
      temp: '-201 °C (Cloud tops)'
    },
    desc: 'The remote deep-blue realm of ferocious supersonic winds exceeding 2,100 km/h, discovered mathematically from perturbations in Uranus’s orbit.',
    sonify: {
      title: 'Neptunian Auroral Plasma Waves',
      freq: 260,
      wave: 'triangle',
      mod: 1.8,
      desc: 'Voyager 2 radio astronomy conversion of multipolar chaotic magnetic field waves.'
    }
  }
];

// =====================================================================
// 2. NATIVE WEB AUDIO ENGINE (AMBIENT & SCIENTIFIC SONIFICATION)
// =====================================================================
class SpaceAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientNodes = [];
    this.sonifyNodes = [];
    this.isAmbientPlaying = false;
    this.isSonifyPlaying = false;
    this.activeSonifyId = null;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleAmbient(buttonEl, textEl) {
    this.ensureContext();
    if (this.isAmbientPlaying) {
      this.stopAmbient();
      if (buttonEl) buttonEl.classList.remove('playing');
      if (textEl) textEl.textContent = 'Space Audio: Muted';
    } else {
      this.startAmbient();
      if (buttonEl) buttonEl.classList.add('playing');
      if (textEl) textEl.textContent = 'Space Audio: ON';
    }
  }

  startAmbient() {
    if (!this.ctx) return;
    this.stopAmbient();

    const now = this.ctx.currentTime;
    const ambGain = this.ctx.createGain();
    ambGain.gain.setValueAtTime(0.20, now);
    ambGain.connect(this.masterGain);

    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(55, now);

    const midOsc = this.ctx.createOscillator();
    midOsc.type = 'triangle';
    midOsc.frequency.setValueAtTime(110, now);

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, now);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(3.5, now);
    lfo.connect(lfoGain);
    lfoGain.connect(midOsc.frequency);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);

    subOsc.connect(filter);
    midOsc.connect(filter);
    filter.connect(ambGain);

    subOsc.start();
    midOsc.start();
    lfo.start();

    this.ambientNodes = [subOsc, midOsc, lfo, lfoGain, filter, ambGain];
    this.isAmbientPlaying = true;
  }

  stopAmbient() {
    this.ambientNodes.forEach(n => {
      try {
        if (n.stop) n.stop();
        if (n.disconnect) n.disconnect();
      } catch (e) {}
    });
    this.ambientNodes = [];
    this.isAmbientPlaying = false;
  }

  playSonification(sonifyInfo, uniqueId, iconEl) {
    this.ensureContext();
    if (this.isSonifyPlaying && this.activeSonifyId === uniqueId) {
      this.stopSonification(iconEl);
      return;
    }

    this.stopSonification();
    this.activeSonifyId = uniqueId;
    this.isSonifyPlaying = true;
    if (iconEl) {
      iconEl.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
    }

    const now = this.ctx.currentTime;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.connect(this.masterGain);

    const osc = this.ctx.createOscillator();
    osc.type = sonifyInfo.wave || 'sine';
    osc.frequency.setValueAtTime(sonifyInfo.freq || 220, now);

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(sonifyInfo.mod || 2.0, now);
    const lfoG = this.ctx.createGain();
    lfoG.gain.setValueAtTime(55, now);
    lfo.connect(lfoG);
    lfoG.connect(osc.frequency);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(sonifyInfo.freq * 1.4, now);
    filter.Q.setValueAtTime(3.5, now);

    osc.connect(filter);
    filter.connect(gain);

    osc.start();
    lfo.start();

    this.sonifyNodes = [osc, lfo, lfoG, filter, gain];
  }

  stopSonification(iconEl) {
    this.sonifyNodes.forEach(n => {
      try {
        if (n.stop) n.stop();
        if (n.disconnect) n.disconnect();
      } catch (e) {}
    });
    this.sonifyNodes = [];
    this.isSonifyPlaying = false;
    this.activeSonifyId = null;
    if (iconEl) {
      iconEl.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
    }
  }
}

// =====================================================================
// 3. MAIN 3D SOLAR SYSTEM APPLICATION
// =====================================================================
class SolarSystemApp {
  constructor() {
    this.canvas = document.getElementById('spaceCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.audio = new SpaceAudioEngine();

    // Clock & Delta-Time
    this.isPaused = false;
    this.speedMultiplier = 1.0;
    this.lastTime = performance.now();
    this.time = 0;

    // Camera 3D Spherical Coordinate Orbit
    this.rotationY = 0.52; // Yaw
    this.rotationX = 0.50; // Pitch
    this.targetRotationY = this.rotationY;
    this.targetRotationX = this.rotationX;

    this.distance = 36; // Camera zoom distance
    this.targetDistance = this.distance;

    this.focusTarget = { x: 0, y: 0, z: 0 };
    this.focusedEntity = null; // Planet, Moon, or Sun object

    // Interaction flags
    this.isDragging = false;
    this.dragMoved = false;
    this.prevMouse = { x: 0, y: 0 };
    this.hoveredEntity = null;

    // Elements
    this.tooltipEl = document.getElementById('hoverTooltip');
    this.hoverTextEl = document.getElementById('hoverText');
    this.hoverDotEl = document.getElementById('hoverDot');

    // Collections
    this.planets = [];
    this.allMoons = [];
    this.asteroids = [];
    this.sagittariusA = null;
    this.milkyWay = null;
    this.andromeda = null;
    this.currentScale = 'solar';

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.buildAsteroids(800);
    this.buildEntities();
    this.initEventListeners();

    // Start 60 FPS animation loop with delta-time
    requestAnimationFrame((t) => this.loop(t));
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.focalLength = Math.max(this.width, this.height) * 0.88;
  }

  // --- Asteroid Belt (Between Mars 10.8 and Jupiter 15.5) ---
  buildAsteroids(count) {
    this.asteroids = [];
    const colors = ['#8a8074', '#6b6154', '#a89c88', '#948a78'];
    for (let i = 0; i < count; i++) {
      const dist = 12.6 + Math.random() * 2.2;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 0.65;
      const speed = (0.32 / Math.sqrt(dist)) * 0.40;
      this.asteroids.push({
        dist,
        angle,
        height,
        speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 0.05 + 0.02,
        x: 0, y: 0, z: 0
      });
    }
  }

  // --- Build Planets & Moons ---
  buildEntities() {
    this.planets = [];
    this.allMoons = [];

    CELESTIAL_DATA.forEach((data, index) => {
      // Disperse initial angles evenly
      const initialAngle = (index / CELESTIAL_DATA.length) * Math.PI * 2 + (index * 0.65);

      const pObj = {
        data,
        name: data.name,
        isSun: data.dist === 0,
        dist: data.dist,
        size: data.size,
        speed: data.speed,
        spinSpeed: data.spin,
        tilt: data.tilt,
        angle: initialAngle,
        spinAngle: Math.random() * Math.PI * 2,
        cloudAngle: 0,
        x: 0, y: 0, z: 0,
        screenX: 0, screenY: 0, screenRadius: 0, camZ: 0,
        moons: []
      };

      // Set up moons
      if (data.moons) {
        data.moons.forEach((m, mIdx) => {
          const mObj = {
            data: m,
            name: m.name,
            isMoon: true,
            parent: pObj,
            dist: m.dist,
            size: m.size,
            speed: m.speed,
            color: m.color,
            angle: (mIdx / data.moons.length) * Math.PI * 2,
            x: 0, y: 0, z: 0,
            screenX: 0, screenY: 0, screenRadius: 0, camZ: 0
          };
          pObj.moons.push(mObj);
          this.allMoons.push(mObj);
        });
      }

      this.planets.push(pObj);
    });

    // 2. Build Sagittarius A* (Supermassive Black Hole at Galactic Center)
    this.sagittariusA = {
      data: SAGITTARIUS_A_DATA,
      name: SAGITTARIUS_A_DATA.name,
      isBlackHole: true,
      x: SAGITTARIUS_A_DATA.pos.x,
      y: SAGITTARIUS_A_DATA.pos.y,
      z: SAGITTARIUS_A_DATA.pos.z,
      size: SAGITTARIUS_A_DATA.size,
      screenX: 0, screenY: 0, screenRadius: 0, camZ: 0,
      particles: []
    };
    for (let i = 0; i < 150; i++) {
      const dist = 3.6 + Math.random() * 8.8;
      this.sagittariusA.particles.push({
        dist,
        angle: Math.random() * Math.PI * 2,
        speed: (2.2 / Math.sqrt(dist)) * 0.40,
        size: Math.random() * 1.8 + 0.8,
        color: i % 4 === 0 ? '#64ddf4' : (i % 2 === 0 ? '#ffb03a' : '#ff4411')
      });
    }

    // 3. Build Milky Way Galaxy Structure (Surrounding Sgr A*)
    this.milkyWay = {
      x: SAGITTARIUS_A_DATA.pos.x,
      y: SAGITTARIUS_A_DATA.pos.y,
      z: SAGITTARIUS_A_DATA.pos.z,
      size: 80,
      screenX: 0, screenY: 0, screenRadius: 0, camZ: 0,
      stars: []
    };
    // Spiral arms
    const mwArms = 4;
    const starsPerArm = 260;
    for (let arm = 0; arm < mwArms; arm++) {
      const armAngleOffset = (arm * Math.PI * 2) / mwArms;
      for (let i = 0; i < starsPerArm; i++) {
        const t = i / starsPerArm;
        const r = 9 + t * 95;
        const theta = armAngleOffset + 2.4 * Math.log(r / 8 + 1) + (Math.random() - 0.5) * 0.32;
        const scatter = (Math.random() - 0.5) * (r * 0.16);
        const yScatter = (Math.random() - 0.5) * (3.2 * Math.exp(-r / 40));
        const color = r < 24 ? '#ffcf99' : (r < 65 ? '#ffffff' : '#bfe0ff');
        this.milkyWay.stars.push({
          x: this.milkyWay.x + Math.cos(theta) * (r + scatter),
          y: this.milkyWay.y + yScatter,
          z: this.milkyWay.z + Math.sin(theta) * (r + scatter),
          size: Math.random() * 1.4 + 0.6,
          color,
          alpha: Math.random() * 0.35 + 0.35
        });
      }
    }
    // Galactic Bulge
    for (let i = 0; i < 340; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * 14;
      this.milkyWay.stars.push({
        x: this.milkyWay.x + r * Math.sin(phi) * Math.cos(theta) * 1.4,
        y: this.milkyWay.y + r * Math.sin(phi) * Math.sin(theta) * 0.42,
        z: this.milkyWay.z + r * Math.cos(phi),
        size: Math.random() * 1.8 + 0.8,
        color: i % 3 === 0 ? '#ffba66' : '#fff0b8',
        alpha: Math.random() * 0.5 + 0.4
      });
    }

    // 4. Build Andromeda Galaxy (M31 - Distant Spiral Galaxy)
    this.andromeda = {
      data: ANDROMEDA_DATA,
      name: ANDROMEDA_DATA.name,
      isAndromeda: true,
      x: ANDROMEDA_DATA.pos.x,
      y: ANDROMEDA_DATA.pos.y,
      z: ANDROMEDA_DATA.pos.z,
      size: ANDROMEDA_DATA.size,
      screenX: 0, screenY: 0, screenRadius: 0, camZ: 0,
      stars: []
    };
    const m31Stars = 680;
    for (let i = 0; i < m31Stars; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 4 + Math.pow(Math.random(), 0.72) * 58;
      const armAngle = theta + 2.1 * Math.log(r / 6 + 1);
      const scatter = (Math.random() - 0.5) * (r * 0.16);
      const localX = Math.cos(armAngle) * (r + scatter);
      const localZ = Math.sin(armAngle) * (r + scatter);
      const localY = (Math.random() - 0.5) * 2.8;

      // Rotate by inclination (~77 deg)
      const cosI = Math.cos(0.92);
      const sinI = Math.sin(0.92);
      const yInc = localY * cosI - localZ * sinI;
      const zInc = localY * sinI + localZ * cosI;

      this.andromeda.stars.push({
        x: this.andromeda.x + localX,
        y: this.andromeda.y + yInc,
        z: this.andromeda.z + zInc,
        size: Math.random() * 1.4 + 0.6,
        color: r < 18 ? '#ffe6b8' : '#badaff',
        alpha: Math.random() * 0.45 + 0.3
      });
    }
  }

  // --- 3D Coordinate to 2D Screen Perspective Projection ---
  project3D(x, y, z) {
    // 1. Shift by camera focus target
    const dx = x - this.focusTarget.x;
    const dy = y - this.focusTarget.y;
    const dz = z - this.focusTarget.z;

    // 2. Yaw rotation (around Y axis)
    const cosY = Math.cos(this.rotationY);
    const sinY = Math.sin(this.rotationY);
    const x1 = dx * cosY - dz * sinY;
    const z1 = dx * sinY + dz * cosY;

    // 3. Pitch rotation (around X axis)
    const cosX = Math.cos(this.rotationX);
    const sinX = Math.sin(this.rotationX);
    const y2 = dy * cosX - z1 * sinX;
    const z2 = dy * sinX + z1 * cosX + this.distance;

    // Behind camera clipping
    if (z2 <= 0.2) return null;

    // 4. Perspective projection
    const scale = this.focalLength / z2;
    return {
      screenX: this.width / 2 + x1 * scale,
      screenY: this.height / 2 + y2 * scale,
      scale,
      camZ: z2,
      camX: x1,
      camY: y2
    };
  }

  // --- Event Listeners & Interaction ---
  initEventListeners() {
    const canvas = this.canvas;

    const onDown = (clientX, clientY) => {
      this.isDragging = true;
      this.dragMoved = false;
      this.prevMouse = { x: clientX, y: clientY };
    };

    const onMove = (clientX, clientY) => {
      if (!this.isDragging) {
        this.updateHover(clientX, clientY);
        return;
      }
      const dx = clientX - this.prevMouse.x;
      const dy = clientY - this.prevMouse.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        this.dragMoved = true;
        const hint = document.getElementById('hint');
        if (hint) hint.style.opacity = '0';
        if (this.tooltipEl) this.tooltipEl.style.display = 'none';
      }
      this.targetRotationY += dx * 0.0055;
      this.targetRotationX += dy * 0.0035;
      // Clamp pitch
      this.targetRotationX = Math.max(0.12, Math.min(1.45, this.targetRotationX));
      this.prevMouse = { x: clientX, y: clientY };
    };

    const onUp = () => {
      this.isDragging = false;
    };

    canvas.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onUp);

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) onDown(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchend', (e) => {
      const wasTap = !this.dragMoved;
      onUp();
      if (wasTap && e.changedTouches && e.changedTouches[0]) {
        this.tryPick(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }
    }, { passive: true });

    // Wheel Zoom (Progressive intergalactic scaling)
    window.addEventListener('wheel', (e) => {
      const zoomFactor = Math.max(0.018, this.targetDistance * 0.0022);
      this.targetDistance += e.deltaY * zoomFactor;

      // When focused on Andromeda, user must NOT enter inside!
      if (this.focusedEntity && this.focusedEntity.isAndromeda) {
        this.targetDistance = Math.max(130, Math.min(850, this.targetDistance));
      } else {
        this.targetDistance = Math.max(2.2, Math.min(850, this.targetDistance));
      }
      this.syncScaleWithDistance();
    }, { passive: true });

    // Click Selection
    canvas.addEventListener('click', (e) => {
      if (!this.dragMoved) {
        this.tryPick(e.clientX, e.clientY);
      }
    });

    // Play / Pause Toggle
    const playPauseBtn = document.getElementById('playPause');
    playPauseBtn.addEventListener('click', () => {
      this.isPaused = !this.isPaused;
      playPauseBtn.textContent = this.isPaused ? '▶' : '⏸';
    });

    // Speed Slider
    const speedSlider = document.getElementById('speedSlider');
    speedSlider.addEventListener('input', (e) => {
      this.speedMultiplier = parseFloat(e.target.value);
    });

    // Reset View Button
    document.getElementById('resetViewBtn').addEventListener('click', () => {
      this.resetCamera();
    });

    // Ambient Space Audio
    const ambBtn = document.getElementById('ambientToggleBtn');
    const ambText = document.getElementById('ambientText');
    ambBtn.addEventListener('click', () => {
      this.audio.toggleAmbient(ambBtn, ambText);
    });

    // Close Info Button
    document.getElementById('closeInfo').addEventListener('click', () => {
      this.closeInfoPanel();
    });

    // Back Buttons (Dynamic Hierarchical Navigation)
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.handleBackNavigation();
      });
    }
    const backToSun = document.getElementById('backToSun');
    if (backToSun) {
      backToSun.addEventListener('click', () => {
        this.handleBackNavigation();
      });
    }

    // Scale Navigation Buttons (Solar System -> Milky Way -> Universe -> Andromeda)
    document.querySelectorAll('.scale-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const scale = btn.getAttribute('data-scale');
        this.navigateToScale(scale);
      });
    });

    // Sonification Play Button in Info Panel
    const sonifyBtn = document.getElementById('btnSonifyPlay');
    const sonifyIcon = document.getElementById('sonifyIcon');
    sonifyBtn.addEventListener('click', () => {
      if (this.focusedEntity) {
        const info = this.focusedEntity.data.sonify || (this.focusedEntity.parent && this.focusedEntity.parent.data.sonify);
        if (info) {
          this.audio.playSonification(info, this.focusedEntity.name, sonifyIcon);
        }
      }
    });
  }

  // --- Dynamic Hover Detection & Tooltip ---
  updateHover(clientX, clientY) {
    if (this.isDragging) {
      if (this.tooltipEl) this.tooltipEl.style.display = 'none';
      return;
    }

    const hit = this.findHitCandidate(clientX, clientY);
    this.hoveredEntity = hit;

    if (hit) {
      this.canvas.style.cursor = 'pointer';
      if (this.tooltipEl) {
        this.tooltipEl.style.display = 'flex';
        this.tooltipEl.style.left = `${clientX}px`;
        this.tooltipEl.style.top = `${clientY}px`;
        const color = hit.data.color || (hit.parent ? hit.parent.data.color : '#fff');
        this.hoverDotEl.style.background = color;
        this.hoverDotEl.style.color = color;
        if (hit.isBlackHole) {
          this.hoverTextEl.textContent = 'Sagittarius A* (Supermassive Black Hole)';
        } else if (hit.isAndromeda) {
          this.hoverTextEl.textContent = 'Andromeda Galaxy (M31)';
        } else {
          this.hoverTextEl.textContent = hit.isMoon ? `${hit.name} (${hit.parent.name})` : hit.name;
        }
      }
    } else {
      this.canvas.style.cursor = 'grab';
      if (this.tooltipEl) this.tooltipEl.style.display = 'none';
    }
  }

  // --- Accurate Depth-Sorted Raycast / Hit Detection ---
  findHitCandidate(screenX, screenY) {
    const candidates = [];

    // 1. Check Moons
    this.allMoons.forEach(m => {
      if (m.screenRadius > 0) {
        const dist = Math.hypot(screenX - m.screenX, screenY - m.screenY);
        const hitRadius = Math.max(14, m.screenRadius * 2.2);
        if (dist <= hitRadius) {
          candidates.push({ entity: m, camZ: m.camZ, dist });
        }
      }
    });

    // 2. Check Planets & Sun
    this.planets.forEach(p => {
      if (p.screenRadius > 0) {
        const dist = Math.hypot(screenX - p.screenX, screenY - p.screenY);
        const hitRadius = p.isSun ? Math.max(38, p.screenRadius * 1.25) : Math.max(18, p.screenRadius * 1.35);
        if (dist <= hitRadius) {
          candidates.push({ entity: p, camZ: p.camZ, dist });
        }
      }
    });

    // 3. Check Sagittarius A* (Supermassive Black Hole at Milky Way Center)
    if (this.sagittariusA && this.sagittariusA.screenRadius > 0) {
      const dist = Math.hypot(screenX - this.sagittariusA.screenX, screenY - this.sagittariusA.screenY);
      const hitRadius = Math.max(34, this.sagittariusA.screenRadius * 1.6);
      if (dist <= hitRadius) {
        candidates.push({ entity: this.sagittariusA, camZ: this.sagittariusA.camZ, dist });
      }
    }

    // 4. Check Andromeda Galaxy
    if (this.andromeda && this.andromeda.screenRadius > 0) {
      const dist = Math.hypot(screenX - this.andromeda.screenX, screenY - this.andromeda.screenY);
      const hitRadius = Math.max(48, this.andromeda.screenRadius * 0.95);
      if (dist <= hitRadius) {
        candidates.push({ entity: this.andromeda, camZ: this.andromeda.camZ, dist });
      }
    }

    if (candidates.length === 0) return null;

    // Pick candidate closest to camera in depth (smallest camZ)
    candidates.sort((a, b) => a.camZ - b.camZ);
    return candidates[0].entity;
  }

  tryPick(screenX, screenY) {
    const hit = this.findHitCandidate(screenX, screenY);
    if (hit) {
      this.focusOn(hit);
    }
  }

  // --- Focus Camera on Celestial Body ---
  focusOn(entity) {
    this.focusedEntity = entity;

    if (entity.isSun) {
      this.targetDistance = 11;
      this.openInfoPanel(entity.data, 'Yellow Dwarf Star');
      this.updateScaleUI('solar');
    } else if (entity.isMoon) {
      this.targetDistance = Math.max(entity.size * 12, 2.5);
      this.openInfoPanel(entity.data, `Moon of ${entity.parent.name}`);
      this.updateScaleUI('solar');
    } else if (entity.isBlackHole) {
      this.targetDistance = 18;
      this.openInfoPanel(entity.data, 'Supermassive Black Hole (Milky Way Center)');
      this.updateScaleUI('milkyway');
    } else if (entity.isAndromeda) {
      this.targetDistance = 160; // Safe exterior distance outside Andromeda (no interior entry)
      this.openInfoPanel(entity.data, 'Barred Spiral Galaxy (Exterior View)');
      this.updateScaleUI('andromeda');
    } else {
      this.targetDistance = Math.max(entity.size * 5.2, 3.2);
      this.openInfoPanel(entity.data, entity.data.tag || 'Planet');
      this.updateScaleUI('solar');
    }
  }

  handleBackNavigation() {
    if (this.focusedEntity && this.focusedEntity.isAndromeda) {
      this.focusOnMilkyWay();
    } else if (this.focusedEntity && this.focusedEntity.isBlackHole) {
      this.focusOnMilkyWay();
    } else if (this.currentScale === 'milkyway') {
      this.focusOnSolarSystem();
    } else if (this.focusedEntity && this.focusedEntity.isMoon) {
      this.focusOn(this.focusedEntity.parent);
    } else {
      this.focusOnSolarSystem();
    }
  }

  navigateToScale(scale) {
    if (scale === 'solar') {
      this.focusOnSolarSystem();
    } else if (scale === 'milkyway') {
      this.focusOnMilkyWay();
    } else if (scale === 'andromeda') {
      this.focusOnAndromeda();
    }
  }

  focusOnSolarSystem() {
    const sun = this.planets.find(p => p.isSun);
    this.focusedEntity = sun || null;
    this.targetDistance = 36;
    this.targetRotationX = 0.50;
    this.targetRotationY = 0.52;
    this.updateScaleUI('solar');
    if (sun) this.openInfoPanel(sun.data, 'Yellow Dwarf Star');
  }

  focusOnMilkyWay() {
    this.focusedEntity = null;
    this.focusTarget = { x: this.sagittariusA.x, y: this.sagittariusA.y, z: this.sagittariusA.z };
    this.targetDistance = 220; // Overview of the entire Milky Way
    this.targetRotationX = 0.65;
    this.targetRotationY = 0.85;
    this.updateScaleUI('milkyway');
    this.closeInfoPanel(false);
  }

  focusOnAndromeda() {
    this.focusedEntity = this.andromeda;
    this.targetDistance = 160; // Safe distance outside Andromeda
    this.targetRotationX = 0.45;
    this.targetRotationY = 0.25;
    this.updateScaleUI('andromeda');
    this.openInfoPanel(this.andromeda.data, 'Barred Spiral Galaxy (Exterior View)');
  }

  updateScaleUI(scale) {
    this.currentScale = scale;
    document.querySelectorAll('.scale-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-scale') === scale);
    });
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
      if (scale === 'andromeda') {
        backBtn.textContent = '↩ Back to Milky Way';
      } else if (this.focusedEntity && this.focusedEntity.isBlackHole) {
        backBtn.textContent = '↩ Back to Milky Way';
      } else if (scale === 'milkyway') {
        backBtn.textContent = '↩ Back to Solar System';
      } else {
        backBtn.textContent = '↩ Back to Sun';
      }
    }
  }

  syncScaleWithDistance() {
    let scale = 'solar';
    if (this.targetDistance < 85) {
      scale = 'solar';
    } else {
      scale = 'milkyway';
    }
    if (this.focusedEntity && this.focusedEntity.isAndromeda) {
      scale = 'andromeda';
    }
    if (this.currentScale !== scale) {
      this.updateScaleUI(scale);
    }
  }

  openInfoPanel(data, subtitle) {
    document.getElementById('infoTag').textContent = data.tag || subtitle;
    document.getElementById('infoName').textContent = data.name;
    document.getElementById('infoSub').textContent = subtitle;
    document.getElementById('infoDesc').textContent = data.desc;
    document.getElementById('infoDiameter').textContent = data.facts.diameter;
    document.getElementById('infoDistance').textContent = data.facts.distance;
    document.getElementById('infoDay').textContent = data.facts.day;
    document.getElementById('infoYear').textContent = data.facts.year;
    document.getElementById('infoGravity').textContent = data.facts.gravity || '—';
    document.getElementById('infoTemp').textContent = data.facts.temp || '—';

    // Sonification Box Setup
    const sonify = data.sonify || (this.focusedEntity && this.focusedEntity.parent && this.focusedEntity.parent.data.sonify);
    if (sonify) {
      document.getElementById('sonifyTitle').textContent = sonify.title;
      document.getElementById('sonifySub').textContent = sonify.desc;
    }
    const icon = document.getElementById('sonifyIcon');
    icon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
    this.audio.stopSonification();

    document.getElementById('infoPanel').classList.add('open');
  }

  closeInfoPanel() {
    document.getElementById('infoPanel').classList.remove('open');
    this.resetCamera();
  }

  resetCamera() {
    this.focusedEntity = null;
    this.targetDistance = 36;
    this.audio.stopSonification(document.getElementById('sonifyIcon'));
  }

  // ===================================================================
  // 4. ANIMATION & RENDER LOOP (Delta-Time Smoothness)
  // ===================================================================
  loop(currentTime) {
    requestAnimationFrame((t) => this.loop(t));

    // Calculate real high-resolution delta time (capped to prevent jumps)
    const deltaMs = currentTime - this.lastTime;
    const deltaSec = Math.min(deltaMs / 1000, 0.1);
    this.lastTime = currentTime;

    const simDelta = this.isPaused ? 0 : deltaSec * this.speedMultiplier;
    this.time += simDelta;

    // --- Update Planetary Positions & Axial Spin ---
    this.planets.forEach(p => {
      if (p.speed > 0) {
        p.angle += simDelta * p.speed * 0.32;
        p.x = Math.cos(p.angle) * p.dist;
        p.z = Math.sin(p.angle) * p.dist;
        p.y = 0;
      } else {
        // Sun center
        p.x = 0; p.y = 0; p.z = 0;
      }

      p.spinAngle += simDelta * p.spinSpeed * 0.9;
      p.cloudAngle += simDelta * p.spinSpeed * 0.55;

      // Update Moons in orbit around their parent planet
      p.moons.forEach(m => {
        m.angle += simDelta * m.speed * 0.55;
        m.x = p.x + Math.cos(m.angle) * m.dist;
        m.z = p.z + Math.sin(m.angle) * m.dist;
        m.y = p.y + Math.sin(m.angle * 1.5) * (m.dist * 0.12);
      });
    });

    // Update Asteroid Belt Particles
    this.asteroids.forEach(a => {
      a.angle += simDelta * a.speed;
      a.x = Math.cos(a.angle) * a.dist;
      a.z = Math.sin(a.angle) * a.dist;
      a.y = a.height;
    });

    // Update Sagittarius A* Accretion Matter
    if (this.sagittariusA) {
      this.sagittariusA.particles.forEach(p => {
        p.angle += simDelta * p.speed * 1.6;
        p.dist -= simDelta * 0.16;
        if (p.dist < 3.4) p.dist = 12.0;
      });
    }

    // --- Smooth Exponential Camera Easing (Frame-rate independent) ---
    const ease = 1 - Math.exp(-7.5 * deltaSec);
    this.rotationY += (this.targetRotationY - this.rotationY) * ease;
    this.rotationX += (this.targetRotationX - this.rotationX) * ease;
    this.distance += (this.targetDistance - this.distance) * ease;

    // Follow focused target
    if (this.focusedEntity) {
      this.focusTarget.x += (this.focusedEntity.x - this.focusTarget.x) * ease;
      this.focusTarget.y += (this.focusedEntity.y - this.focusTarget.y) * ease;
      this.focusTarget.z += (this.focusedEntity.z - this.focusTarget.z) * ease;
    } else {
      this.focusTarget.x += (0 - this.focusTarget.x) * ease;
      this.focusTarget.y += (0 - this.focusTarget.y) * ease;
      this.focusTarget.z += (0 - this.focusTarget.z) * ease;
    }

    // --- RENDER SCENE ---
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Milky Way Galactic Structure (Backdrop)
    if (this.milkyWay) {
      const mwProj = this.project3D(this.milkyWay.x, this.milkyWay.y, this.milkyWay.z);
      if (mwProj) {
        this.milkyWay.screenX = mwProj.screenX;
        this.milkyWay.screenY = mwProj.screenY;
        this.milkyWay.screenRadius = this.milkyWay.size * mwProj.scale;
        this.milkyWay.camZ = mwProj.camZ;
      }
      this.drawMilkyWay(this.milkyWay);
    }

    // 2. Draw Orbit Track Lines
    this.drawOrbitLines();

    // 3. Draw Moon Orbit Loops around Parent Planets
    this.drawMoonOrbitLoops();

    // 4. Collect Entities for Painter's Depth Sorting
    const renderList = [];

    // Asteroids
    this.asteroids.forEach(a => {
      const proj = this.project3D(a.x, a.y, a.z);
      if (proj) {
        renderList.push({
          type: 'asteroid',
          camZ: proj.camZ,
          proj,
          asteroid: a
        });
      }
    });

    // Planets & Sun
    this.planets.forEach(p => {
      const proj = this.project3D(p.x, p.y, p.z);
      if (proj) {
        p.screenX = proj.screenX;
        p.screenY = proj.screenY;
        p.screenRadius = p.size * proj.scale;
        p.camZ = proj.camZ;

        if (p.data.hasRing) {
          renderList.push({
            type: 'ring-back',
            camZ: proj.camZ - 0.001,
            planet: p,
            proj
          });
        }

        renderList.push({
          type: 'planet',
          camZ: proj.camZ,
          planet: p,
          proj
        });

        if (p.data.hasRing) {
          renderList.push({
            type: 'ring-front',
            camZ: proj.camZ + 0.001,
            planet: p,
            proj
          });
        }
      }

      // Moons
      p.moons.forEach(m => {
        const mProj = this.project3D(m.x, m.y, m.z);
        if (mProj) {
          m.screenX = mProj.screenX;
          m.screenY = mProj.screenY;
          m.screenRadius = m.size * mProj.scale;
          m.camZ = mProj.camZ;
          renderList.push({
            type: 'moon',
            camZ: mProj.camZ,
            moon: m,
            proj: mProj
          });
        }
      });
    });

    // Sagittarius A* (Supermassive Black Hole)
    if (this.sagittariusA) {
      const sProj = this.project3D(this.sagittariusA.x, this.sagittariusA.y, this.sagittariusA.z);
      if (sProj && sProj.camZ > 1) {
        this.sagittariusA.screenX = sProj.screenX;
        this.sagittariusA.screenY = sProj.screenY;
        this.sagittariusA.screenRadius = this.sagittariusA.size * sProj.scale;
        this.sagittariusA.camZ = sProj.camZ;
        renderList.push({
          type: 'blackhole',
          camZ: sProj.camZ,
          entity: this.sagittariusA,
          proj: sProj
        });
      }
    }

    // Andromeda Galaxy (M31)
    if (this.andromeda) {
      const aProj = this.project3D(this.andromeda.x, this.andromeda.y, this.andromeda.z);
      if (aProj && aProj.camZ > 5) {
        this.andromeda.screenX = aProj.screenX;
        this.andromeda.screenY = aProj.screenY;
        this.andromeda.screenRadius = this.andromeda.size * aProj.scale;
        this.andromeda.camZ = aProj.camZ;
        renderList.push({
          type: 'andromeda',
          camZ: aProj.camZ,
          entity: this.andromeda,
          proj: aProj
        });
      }
    }

    // 5. Sort from farthest (high camZ) to nearest (low camZ)
    renderList.sort((a, b) => b.camZ - a.camZ);

    // 6. Draw Sorted Entities
    renderList.forEach(item => {
      switch (item.type) {
        case 'asteroid':
          this.drawAsteroid(item.proj, item.asteroid);
          break;
        case 'planet':
          this.drawPlanetSphere(item.planet, item.proj);
          break;
        case 'ring-back':
          this.drawRingArc(item.planet, item.proj, true);
          break;
        case 'ring-front':
          this.drawRingArc(item.planet, item.proj, false);
          break;
        case 'moon':
          this.drawMoonSphere(item.moon, item.proj);
          break;
        case 'blackhole':
          this.drawBlackHole(item.entity, item.proj);
          break;
        case 'andromeda':
          this.drawAndromeda(item.entity, item.proj);
          break;
      }
    });

    // Draw Solar System location beacon in Milky Way view
    if (this.distance > 50) {
      const sunProj = this.project3D(0, 0, 0);
      if (sunProj && sunProj.camZ > 1) {
        this.drawSolarSystemBeacon(sunProj);
      }
    }

    // 7. Draw Selection Halo / Reticle
    if (this.focusedEntity && this.focusedEntity.screenRadius > 0) {
      this.drawSelectionReticle(this.focusedEntity);
    }
  }

  // --- Rendering Primitives ---
  drawOrbitLines() {
    const ctx = this.ctx;
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(100, 150, 220, 0.14)';

    this.planets.forEach(p => {
      if (p.dist <= 0) return;
      const segments = 96;
      ctx.beginPath();
      let firstPoint = true;

      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const ox = Math.cos(theta) * p.dist;
        const oz = Math.sin(theta) * p.dist;
        const proj = this.project3D(ox, 0, oz);

        if (proj) {
          if (firstPoint) {
            ctx.moveTo(proj.screenX, proj.screenY);
            firstPoint = false;
          } else {
            ctx.lineTo(proj.screenX, proj.screenY);
          }
        }
      }
      ctx.stroke();
    });

    ctx.restore();
  }

  drawMoonOrbitLoops() {
    const ctx = this.ctx;
    ctx.save();
    ctx.lineWidth = 0.85;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';

    this.planets.forEach(p => {
      p.moons.forEach(m => {
        const segments = 48;
        ctx.beginPath();
        let first = true;
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          const mx = p.x + Math.cos(theta) * m.dist;
          const mz = p.z + Math.sin(theta) * m.dist;
          const my = p.y + Math.sin(theta * 1.5) * (m.dist * 0.12);
          const proj = this.project3D(mx, my, mz);
          if (proj) {
            if (first) {
              ctx.moveTo(proj.screenX, proj.screenY);
              first = false;
            } else {
              ctx.lineTo(proj.screenX, proj.screenY);
            }
          }
        }
        ctx.stroke();
      });
    });

    ctx.restore();
  }

  drawAsteroid(proj, asteroid) {
    const ctx = this.ctx;
    const r = Math.max(0.7, asteroid.size * proj.scale);
    ctx.fillStyle = asteroid.color;
    ctx.globalAlpha = Math.min(0.85, 38 / proj.camZ);
    ctx.beginPath();
    ctx.arc(proj.screenX, proj.screenY, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  drawPlanetSphere(planet, proj) {
    const ctx = this.ctx;
    const r = Math.max(1.8, planet.size * proj.scale);
    const px = proj.screenX;
    const py = proj.screenY;

    if (planet.isSun) {
      // --- SUN: Multi-layer Corona Glow & Core ---
      const pulse = 1 + Math.sin(this.time * 2.2) * 0.04;

      const corona = ctx.createRadialGradient(px, py, r * 0.45, px, py, r * 3.8 * pulse);
      corona.addColorStop(0, 'rgba(255, 225, 120, 0.7)');
      corona.addColorStop(0.3, 'rgba(255, 145, 35, 0.3)');
      corona.addColorStop(0.7, 'rgba(255, 75, 10, 0.08)');
      corona.addColorStop(1, 'transparent');
      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(px, py, r * 3.8 * pulse, 0, Math.PI * 2);
      ctx.fill();

      const core = ctx.createRadialGradient(px, py, 0, px, py, r);
      core.addColorStop(0, '#ffffff');
      core.addColorStop(0.2, '#fff1a8');
      core.addColorStop(0.65, '#ffae34');
      core.addColorStop(0.9, '#f7581b');
      core.addColorStop(1, '#a62100');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    // --- PLANETS: Procedural Surface & Directional Sunlight Shading ---
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.clip();

    this.renderPlanetarySurface(planet, px, py, r);

    if (planet.hasClouds) {
      this.renderEarthClouds(planet, px, py, r);
    }

    // Directional Sunlight Terminator from Central Sun (0,0,0)
    const sunProj = this.project3D(0, 0, 0);
    const lightAngle = sunProj ? Math.atan2(sunProj.screenY - py, sunProj.screenX - px) : 0;

    const shadowOffset = r * 0.45;
    const shadowX = px - Math.cos(lightAngle) * shadowOffset;
    const shadowY = py - Math.sin(lightAngle) * shadowOffset;

    const shade = ctx.createRadialGradient(
      shadowX, shadowY, r * 0.2,
      shadowX, shadowY, r * 1.6
    );
    shade.addColorStop(0, 'rgba(0, 0, 0, 0)');
    shade.addColorStop(0.65, 'rgba(3, 7, 18, 0.65)');
    shade.addColorStop(1, 'rgba(1, 3, 8, 0.98)');
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(px, py, r * 1.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Subtle Atmospheric Rim Glow
    if (['Earth', 'Venus', 'Uranus', 'Neptune'].includes(planet.name)) {
      const limbColor = planet.name === 'Earth' ? 'rgba(56, 189, 248, 0.35)' :
                        planet.name === 'Venus' ? 'rgba(235, 205, 140, 0.25)' :
                        planet.name === 'Uranus' ? 'rgba(120, 240, 255, 0.3)' : 'rgba(70, 110, 240, 0.35)';
      const limb = ctx.createRadialGradient(px, py, r * 0.85, px, py, r * 1.25);
      limb.addColorStop(0, limbColor);
      limb.addColorStop(1, 'transparent');
      ctx.fillStyle = limb;
      ctx.beginPath();
      ctx.arc(px, py, r * 1.25, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  renderPlanetarySurface(planet, px, py, r) {
    const ctx = this.ctx;
    const spin = planet.spinAngle;

    switch (planet.name) {
      case 'Mercury': {
        const grad = ctx.createRadialGradient(px - r * 0.2, py - r * 0.2, 0, px, py, r);
        grad.addColorStop(0, '#b2aba0');
        grad.addColorStop(0.7, '#7a736a');
        grad.addColorStop(1, '#4a443d');
        ctx.fillStyle = grad;
        ctx.fillRect(px - r, py - r, r * 2, r * 2);
        ctx.fillStyle = 'rgba(50, 45, 40, 0.35)';
        ctx.beginPath();
        ctx.arc(px - r * 0.2, py + r * 0.15, r * 0.22, 0, Math.PI * 2);
        ctx.arc(px + r * 0.3, py - r * 0.25, r * 0.16, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'Venus': {
        const grad = ctx.createLinearGradient(px, py - r, px, py + r);
        grad.addColorStop(0, '#fae5ba');
        grad.addColorStop(0.4, '#e0b875');
        grad.addColorStop(0.8, '#c99850');
        grad.addColorStop(1, '#a67232');
        ctx.fillStyle = grad;
        ctx.fillRect(px - r, py - r, r * 2, r * 2);
        break;
      }

      case 'Earth': {
        const ocean = ctx.createRadialGradient(px, py, 0, px, py, r);
        ocean.addColorStop(0, '#1c63b8');
        ocean.addColorStop(0.7, '#12417d');
        ocean.addColorStop(1, '#082142');
        ctx.fillStyle = ocean;
        ctx.fillRect(px - r, py - r, r * 2, r * 2);

        // Continents
        ctx.fillStyle = '#2f7d32';
        for (let c = -1; c <= 2; c++) {
          const cx = px + Math.sin(spin + c * 2.2) * (r * 0.7);
          ctx.beginPath();
          ctx.ellipse(cx, py - r * 0.1, r * 0.45, r * 0.3, 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(cx + r * 0.25, py + r * 0.25, r * 0.3, r * 0.45, -0.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Polar Ice Caps
        ctx.fillStyle = 'rgba(240, 250, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(px, py - r * 0.88, r * 0.32, 0, Math.PI * 2);
        ctx.arc(px, py + r * 0.9, r * 0.28, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'Mars': {
        const grad = ctx.createRadialGradient(px - r * 0.2, py - r * 0.2, 0, px, py, r);
        grad.addColorStop(0, '#e36238');
        grad.addColorStop(0.7, '#b04320');
        grad.addColorStop(1, '#66220d');
        ctx.fillStyle = grad;
        ctx.fillRect(px - r, py - r, r * 2, r * 2);

        ctx.fillStyle = 'rgba(65, 20, 10, 0.4)';
        const mx = px + Math.sin(spin) * (r * 0.5);
        ctx.beginPath();
        ctx.ellipse(mx, py + r * 0.1, r * 0.55, r * 0.25, 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 250, 245, 0.92)';
        ctx.beginPath();
        ctx.ellipse(px, py - r * 0.85, r * 0.3, r * 0.14, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'Jupiter': {
        const bands = 8;
        for (let b = 0; b < bands; b++) {
          const by = py - r + (b / bands) * (r * 2);
          const bh = (r * 2) / bands;
          ctx.fillStyle = b % 2 === 0 ? '#b8895a' : '#e6d3ae';
          ctx.fillRect(px - r, by, r * 2, bh);
        }
        // Great Red Spot
        const spotX = px + Math.sin(spin) * (r * 0.65);
        const spotY = py + r * 0.28;
        ctx.fillStyle = '#a3331c';
        ctx.beginPath();
        ctx.ellipse(spotX, spotY, r * 0.28, r * 0.16, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'Saturn': {
        const grad = ctx.createLinearGradient(px, py - r, px, py + r);
        grad.addColorStop(0, '#ebd8a7');
        grad.addColorStop(0.3, '#c9ad71');
        grad.addColorStop(0.6, '#edd9ac');
        grad.addColorStop(1, '#a68c56');
        ctx.fillStyle = grad;
        ctx.fillRect(px - r, py - r, r * 2, r * 2);
        break;
      }

      case 'Uranus': {
        const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
        grad.addColorStop(0, '#d1f8f8');
        grad.addColorStop(0.6, '#86d6d6');
        grad.addColorStop(1, '#4aa8a8');
        ctx.fillStyle = grad;
        ctx.fillRect(px - r, py - r, r * 2, r * 2);
        break;
      }

      case 'Neptune': {
        const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
        grad.addColorStop(0, '#5379f5');
        grad.addColorStop(0.6, '#284ec7');
        grad.addColorStop(1, '#0e2b8c');
        ctx.fillStyle = grad;
        ctx.fillRect(px - r, py - r, r * 2, r * 2);
        ctx.fillStyle = 'rgba(8, 25, 75, 0.55)';
        ctx.beginPath();
        ctx.ellipse(px - r * 0.2, py - r * 0.1, r * 0.32, r * 0.18, 0.2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }
  }

  renderEarthClouds(planet, px, py, r) {
    const ctx = this.ctx;
    const cSpin = planet.cloudAngle;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = r * 0.14;
    ctx.beginPath();
    ctx.arc(px, py, r * 0.72, cSpin, cSpin + 1.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(px, py, r * 0.48, cSpin + 2.4, cSpin + 3.8);
    ctx.stroke();
  }

  drawRingArc(planet, proj, isBack) {
    const ctx = this.ctx;
    const px = proj.screenX;
    const py = proj.screenY;
    const r = Math.max(1.8, planet.size * proj.scale);

    ctx.save();
    ctx.translate(px, py);

    const ringPitch = Math.sin(this.rotationX);
    const ringRadiusX = r * (planet.name === 'Saturn' ? 2.35 : 1.75);
    const ringRadiusY = ringRadiusX * Math.abs(ringPitch) * 0.48 + (r * 0.15);

    ctx.beginPath();
    if (isBack) {
      ctx.rect(-ringRadiusX * 1.5, -ringRadiusY * 1.5, ringRadiusX * 3, ringRadiusY * 1.5);
    } else {
      ctx.rect(-ringRadiusX * 1.5, 0, ringRadiusX * 3, ringRadiusY * 1.5);
    }
    ctx.clip();

    if (planet.name === 'Saturn') {
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRadiusX * 0.85, ringRadiusY * 0.85, -0.15, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(224, 200, 150, 0.85)';
      ctx.lineWidth = r * 0.45;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, ringRadiusX * 0.90, ringRadiusY * 0.90, -0.15, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(3, 7, 18, 0.9)';
      ctx.lineWidth = r * 0.08;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, ringRadiusX * 0.98, ringRadiusY * 0.98, -0.15, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(200, 175, 130, 0.55)';
      ctx.lineWidth = r * 0.22;
      ctx.stroke();
    } else if (planet.name === 'Uranus') {
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRadiusX * 0.9, ringRadiusY * 0.9, 0.4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(120, 240, 255, 0.35)';
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }

    ctx.restore();
  }

  drawMoonSphere(moon, proj) {
    const ctx = this.ctx;
    const r = Math.max(1.2, moon.size * proj.scale);
    const px = proj.screenX;
    const py = proj.screenY;

    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = moon.color;
    ctx.fill();

    // Directional shading from central Sun
    const sunProj = this.project3D(0, 0, 0);
    const lightAngle = sunProj ? Math.atan2(sunProj.screenY - py, sunProj.screenX - px) : 0;
    const shadowX = px - Math.cos(lightAngle) * (r * 0.5);
    const shadowY = py - Math.sin(lightAngle) * (r * 0.5);

    const shade = ctx.createRadialGradient(
      shadowX, shadowY, r * 0.1,
      shadowX, shadowY, r * 1.5
    );
    shade.addColorStop(0, 'rgba(0, 0, 0, 0)');
    shade.addColorStop(0.7, 'rgba(0, 0, 0, 0.7)');
    shade.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawBlackHole(bh, proj) {
    const ctx = this.ctx;
    const px = proj.screenX;
    const py = proj.screenY;
    const r = Math.max(12, bh.size * proj.scale);
    if (r < 0.5 || px < -300 || px > this.width + 300 || py < -300 || py > this.height + 300) return;

    ctx.save();
    ctx.translate(px, py);

    // 1. Relativistic Polar Astrophysical Jets
    const jetGrad = ctx.createLinearGradient(0, -r * 3.8, 0, r * 3.8);
    jetGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    jetGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.45)');
    jetGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
    jetGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.45)');
    jetGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.strokeStyle = jetGrad;
    ctx.lineWidth = Math.max(2, r * 0.16);
    ctx.beginPath();
    ctx.moveTo(0, -r * 3.8);
    ctx.lineTo(0, r * 3.8);
    ctx.stroke();

    // 2. Gravitational Lensing Arcs (Light warped from backside over and under horizon)
    const upperLens = ctx.createRadialGradient(0, -r * 0.45, r * 0.5, 0, -r * 0.45, r * 2.2);
    upperLens.addColorStop(0, 'rgba(255, 170, 50, 0.75)');
    upperLens.addColorStop(0.5, 'rgba(255, 210, 110, 0.35)');
    upperLens.addColorStop(1, 'transparent');
    ctx.fillStyle = upperLens;
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.55, r * 2.2, r * 1.35, 0, Math.PI, 0);
    ctx.fill();

    const lowerLens = ctx.createRadialGradient(0, r * 0.45, r * 0.5, 0, r * 0.45, r * 1.9);
    lowerLens.addColorStop(0, 'rgba(255, 140, 30, 0.55)');
    lowerLens.addColorStop(0.6, 'rgba(230, 70, 15, 0.25)');
    lowerLens.addColorStop(1, 'transparent');
    ctx.fillStyle = lowerLens;
    ctx.beginPath();
    ctx.ellipse(0, r * 0.48, r * 2.0, r * 1.15, 0, 0, Math.PI);
    ctx.fill();

    // 3. Relativistic Accretion Disk (Front Plane with Asymmetric Doppler Beaming)
    const diskGrad = ctx.createLinearGradient(-r * 2.8, 0, r * 2.8, 0);
    diskGrad.addColorStop(0, 'rgba(255, 245, 220, 0.95)'); // Approaching (Doppler boosted)
    diskGrad.addColorStop(0.28, 'rgba(255, 175, 50, 0.85)');
    diskGrad.addColorStop(0.6, 'rgba(220, 80, 20, 0.6)');
    diskGrad.addColorStop(1, 'rgba(110, 20, 0, 0.2)'); // Receding (Doppler dimmed)

    ctx.beginPath();
    ctx.ellipse(0, 0, r * 2.8, r * 0.72, -0.06, 0, Math.PI * 2);
    ctx.strokeStyle = diskGrad;
    ctx.lineWidth = r * 0.48;
    ctx.stroke();

    // 4. Swirling Keplerian Accretion Disk Particles
    bh.particles.forEach(p => {
      const px = Math.cos(p.angle) * (p.dist * (r / bh.size));
      const py = Math.sin(p.angle) * (p.dist * (r / bh.size) * 0.28);
      const dopplerAlpha = px < 0 ? 0.95 : 0.35;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = dopplerAlpha;
      ctx.beginPath();
      ctx.arc(px, py, Math.max(1, p.size * (proj.scale * 0.4)), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // 5. Photon Sphere (r = 1.5 * r_s): Luminescent Boundary Ring
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.96, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = Math.max(1.5, r * 0.08);
    ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 6. Central Event Horizon (Schwarzschild Shadow: Pure Pitch Black)
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();

    ctx.restore();
  }

  drawMilkyWay(mw) {
    const ctx = this.ctx;
    // Opacity based on camera distance (faint in solar view, luminous in galaxy view)
    let mwAlpha = 0.22;
    if (this.distance > 40) {
      mwAlpha = Math.min(0.95, 0.22 + (this.distance - 40) * 0.006);
    }
    if (this.focusedEntity && (this.focusedEntity.isMilkyWay || this.focusedEntity.isBlackHole)) {
      mwAlpha = 0.95;
    }

    // Core bulge glow
    const coreProj = this.project3D(mw.x, mw.y, mw.z);
    if (coreProj && coreProj.camZ > 5) {
      const cx = coreProj.screenX;
      const cy = coreProj.screenY;
      const coreR = Math.max(25, 28 * coreProj.scale);

      const bulgeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.8);
      bulgeGrad.addColorStop(0, `rgba(255, 235, 190, ${0.45 * mwAlpha})`);
      bulgeGrad.addColorStop(0.35, `rgba(255, 180, 100, ${0.25 * mwAlpha})`);
      bulgeGrad.addColorStop(0.7, `rgba(180, 140, 220, ${0.12 * mwAlpha})`);
      bulgeGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = bulgeGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 2.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Galactic Disk Stars (Batch rendering)
    ctx.save();
    mw.stars.forEach(s => {
      const sProj = this.project3D(s.x, s.y, s.z);
      if (sProj && sProj.camZ > 5) {
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.min(1, s.alpha * mwAlpha);
        ctx.beginPath();
        ctx.arc(sProj.screenX, sProj.screenY, Math.max(0.6, s.size * (sProj.scale * 0.35)), 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.restore();
  }

  drawSolarSystemBeacon(sunProj) {
    const ctx = this.ctx;
    const px = sunProj.screenX;
    const py = sunProj.screenY;

    ctx.save();
    const pulse = 8 + Math.sin(this.time * 3.5) * 2.5;
    ctx.beginPath();
    ctx.arc(px, py, pulse, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(px, py, 2.8, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();

    // Label
    ctx.font = '500 11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(251, 191, 36, 0.95)';
    ctx.fillText('☉ Solar System (Orion Arm)', px + 12, py - 4);
    ctx.restore();
  }

  drawAndromeda(andromeda, proj) {
    const ctx = this.ctx;
    const px = proj.screenX;
    const py = proj.screenY;
    const r = Math.max(20, andromeda.size * proj.scale);
    if (r < 0.5 || px < -300 || px > this.width + 300 || py < -300 || py > this.height + 300) return;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(0.38);

    // 1. Outer Diffuse Spiral Halo
    const haloGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.6);
    haloGrad.addColorStop(0, 'rgba(220, 235, 255, 0.35)');
    haloGrad.addColorStop(0.35, 'rgba(150, 190, 255, 0.18)');
    haloGrad.addColorStop(0.7, 'rgba(80, 120, 220, 0.08)');
    haloGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 2.6, r * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Bright Barred Core Bulge
    const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.65);
    coreGrad.addColorStop(0, 'rgba(255, 250, 230, 0.95)');
    coreGrad.addColorStop(0.4, 'rgba(255, 215, 140, 0.65)');
    coreGrad.addColorStop(0.8, 'rgba(180, 210, 255, 0.25)');
    coreGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.75, r * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Dust Lanes & Spiral Stars
    andromeda.stars.forEach(s => {
      const lx = (s.x - andromeda.x) * (proj.scale * 1.0);
      const ly = (s.y - andromeda.y) * (proj.scale * 1.0);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.beginPath();
      ctx.arc(lx, ly, Math.max(0.6, s.size * (proj.scale * 0.35)), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // 4. Satellite Companion Galaxies: M32 and M110
    ctx.beginPath();
    ctx.ellipse(r * 0.95, -r * 0.55, r * 0.22, r * 0.14, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 230, 190, 0.45)';
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(-r * 1.1, r * 0.65, r * 0.32, r * 0.18, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200, 220, 255, 0.32)';
    ctx.fill();

    // 5. Exterior Viewing Indicator if focused (Users cannot enter inside)
    if (this.focusedEntity && this.focusedEntity.isAndromeda) {
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 2.8, r * 1.05, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.45)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = '500 11px Inter, sans-serif';
      ctx.fillStyle = '#93c5fd';
      ctx.fillText('Andromeda Observation Zone (Exterior View Only)', -115, r * 1.25);
    }

    ctx.restore();
  }

  drawSelectionReticle(entity) {
    const ctx = this.ctx;
    const px = entity.screenX;
    const py = entity.screenY;
    const r = (entity.screenRadius || 14) + 6;

    ctx.save();
    ctx.strokeStyle = entity.isBlackHole ? 'rgba(251, 146, 60, 0.85)' : (entity.isAndromeda ? 'rgba(147, 197, 253, 0.85)' : 'rgba(56, 189, 248, 0.75)');
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
}

// Start application when DOM is ready in browser
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    new SolarSystemApp();
  });
}
