// Import
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";

import { OBJLoader } from "https://unpkg.com/three@0.127.0/examples/jsm/loaders/OBJLoader.js";
import getAsteroidBelt from "/orrery-assets/getAsteroidBelt.js";

// ============================================
// GLOBAL STATE AND CONFIGURATION
// ============================================
let animationPaused = false;
let selectedPlanet = null;
let showLabels = true;
let showOrbits = true;
let animationSpeed = 1;
const planetLabels = {};

// Planet information database
const planetDatabase = {
    sun: {
        name: "Sun",
        diameter: "1,391,000 km",
        distance: "Center of Solar System",
        period: "—",
        rotation: "25.4 days",
        moons: "0",
        description: "The Sun is a G-type main-sequence star at the center of the Solar System. It contains 99.86% of the system's mass and is composed primarily of hydrogen and helium."
    },
    mercury: {
        name: "Mercury",
        diameter: "4,879 km",
        distance: "57.9 million km",
        period: "88 days",
        rotation: "58.6 days",
        moons: "0",
        description: "Mercury is the smallest planet in our Solar System and the closest to the Sun. Despite being closest to the Sun, it's not the hottest planet."
    },
    venus: {
        name: "Venus",
        diameter: "12,104 km",
        distance: "108.2 million km",
        period: "225 days",
        rotation: "243 days (retrograde)",
        moons: "0",
        description: "Venus is the hottest planet in the Solar System with surface temperatures reaching 465°C. It has a thick atmosphere composed mainly of carbon dioxide."
    },
    earth: {
        name: "Earth",
        diameter: "12,742 km",
        distance: "149.6 million km",
        period: "365.25 days",
        rotation: "24 hours",
        moons: "1",
        description: "Earth is our home planet and the only known planet to harbor life. It has a diverse biosphere and one natural satellite, the Moon."
    },
    mars: {
        name: "Mars",
        diameter: "6,779 km",
        distance: "227.9 million km",
        period: "687 days",
        rotation: "24.6 hours",
        moons: "2",
        description: "Mars is known as the Red Planet due to iron oxide on its surface. It's the fourth planet from the Sun and has been a focus of exploration missions."
    },
    jupiter: {
        name: "Jupiter",
        diameter: "139,820 km",
        distance: "778.5 million km",
        period: "12 years",
        rotation: "10 hours",
        moons: "79+",
        description: "Jupiter is the largest planet in the Solar System. It's a gas giant with a Great Red Spot storm larger than Earth and a strong magnetic field."
    },
    saturn: {
        name: "Saturn",
        diameter: "116,460 km",
        distance: "1,434 million km",
        period: "29 years",
        rotation: "10.7 hours",
        moons: "83+",
        description: "Saturn is famous for its spectacular ring system composed of ice and rock particles. It's the second-largest planet and also a gas giant."
    },
    uranus: {
        name: "Uranus",
        diameter: "50,724 km",
        distance: "2,873 million km",
        period: "84 years",
        rotation: "17 hours",
        moons: "27+",
        description: "Uranus is an ice giant that rotates on its side. It has a faint ring system and appears as a featureless blue-green sphere."
    },
    neptune: {
        name: "Neptune",
        diameter: "49,244 km",
        distance: "4,495 million km",
        period: "165 years",
        rotation: "16 hours",
        moons: "14+",
        description: "Neptune is the windiest planet in the Solar System. It's an ice giant with deep blue color caused by methane in its atmosphere."
    },
    pluto: {
        name: "Pluto",
        diameter: "2,376 km",
        distance: "5,906 million km",
        period: "248 years",
        rotation: "6.4 days",
        moons: "5",
        description: "Pluto is a dwarf planet and plutino. Discovered in 1930, it was reclassified in 2006. It has a large moon, Charon, relatively similar in size."
    }
};

// Helper functions for UI
function updateInfoPanel(planet) {
    if (!planet || !planet.name) return;
    
    const info = planetDatabase[planet.name.toLowerCase()];
    if (!info) return;
    
    document.getElementById('info-planet-name').textContent = info.name;
    document.getElementById('info-diameter').textContent = info.diameter;
    document.getElementById('info-distance').textContent = info.distance;
    document.getElementById('info-period').textContent = info.period;
    document.getElementById('info-rotation').textContent = info.rotation;
    document.getElementById('info-moons').textContent = info.moons;
    document.getElementById('info-description').textContent = info.description;
    
    document.getElementById('info-panel').classList.add('active');
}

function createPlanetLabel(planet, name) {
    // Create a canvas texture for the label
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    ctx.font = 'Bold 40px Arial';
    ctx.fillStyle = '#64c8ff';
    ctx.textAlign = 'center';
    ctx.fillText(name, 128, 45);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(15, 4, 1);
    
    planet.add(sprite);
    planetLabels[name] = sprite;
}

function toggleLabels() {
    showLabels = !showLabels;
    Object.values(planetLabels).forEach(label => {
        label.visible = showLabels;
    });
    document.getElementById('toggle-labels-btn').classList.toggle('active', showLabels);
}

function toggleOrbits() {
    showOrbits = !showOrbits;
    if (path_of_planets) {
        path_of_planets.forEach(orbit => {
            orbit.visible = showOrbits;
        });
    }
    document.getElementById('toggle-orbits-btn').classList.toggle('active', showOrbits);
}

function setupPlanetList() {
    const planetNames = Object.keys(planetDatabase);
    const planetList = document.getElementById('planet-list');

    planetNames.forEach(name => {
        const item = document.createElement('div');
        item.className = 'planet-item';
        item.textContent = planetDatabase[name].name;

        item.onclick = () => {
            document.querySelectorAll('.planet-item').forEach(el =>
                el.classList.remove('selected')
            );

            item.classList.add('selected');

            if (name === "sun") {

                selectedPlanet = {
                    name: "sun",
                    planet: sun
                };

                updateInfoPanel(selectedPlanet);
                return;
            }

            const planet = planets.find(
                p => p.name && p.name.toLowerCase() === name
            );

            if (planet) {
                selectedPlanet = planet;
                updateInfoPanel(planet);
            }
        };

        planetList.appendChild(item);
    });

    planetList.style.display = 'block';
}

// Hide loading screen when content loads
window.addEventListener('load', function() {
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            loading.style.display = 'none';
        }, 1000);
    }
});


// Fetch JSON data
async function loadJSONData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}
let planetData = {};
// Call the function to load your JSON file
// loadJSONData('https://data.nasa.gov/resource/b67r-rgxc.json')
//     .then(data => {
//         console.log(data); // Do something with the loaded data
//         planetData = data; // Store the data in a variable
//         // You can process your JSON data here
//     })
//     .catch(error => {
//         console.error('Error loading JSON data:', error);
//     });






// Assuming you have already set up a Three.js scene

// Function to fetch comet data
async function fetchCometData() {
    const response = await fetch('https://data.nasa.gov/resource/b67r-rgxc.json');
    const comets = await response.json();
    return comets;
}

// Function to create and display comets
function displayComets(comets) {
    comets.forEach(comet => {
        // Create a small sphere for each comet
        const geometry = new THREE.SphereGeometry(0.1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const cometMesh = new THREE.Mesh(geometry, material);

        // Set comet position (you might want to use actual coordinates)
        cometMesh.position.set(Math.random() * 10, Math.random() * 10, Math.random() * 10); // Example positions

        // Add comet mesh to the scene
        scene.add(cometMesh);

        // Optionally, display comet names or other info
        const cometName = comet.comet_name; // Adjust based on actual data keys
        const textGeometry = new THREE.TextGeometry(cometName, { font: yourFont, size: 0.5, height: 0.1 });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Position the text above the comet
        textMesh.position.set(cometMesh.position.x, cometMesh.position.y + 0.5, cometMesh.position.z);
        scene.add(textMesh);
    });
}

// Main function to initialize the scene and load comets
async function init() {
    // Your Three.js scene setup code here

    // Fetch and display comets
    const comets = await fetchCometData();
    displayComets(comets);
}

// Call the init function
// init();

//Creating renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//////////////////////////////////////
//texture loader
const textureLoader = new THREE.TextureLoader();

//////////////////////////////////////
//import all texture
const sunTexture = textureLoader.load("/orrery-assets/image/8k_sun.jpg");
const mercuryTexture = textureLoader.load("/orrery-assets/image/8k_mercury.jpg");
const venusTexture = textureLoader.load("/orrery-assets/image/8k_venus_surface.jpg");
const earthTexture = textureLoader.load("/orrery-assets/image/earth.jpg");
const marsTexture = textureLoader.load("/orrery-assets/image/8k_mars.jpg");
const jupiterTexture = textureLoader.load("/orrery-assets/image/8k_jupiter.jpg");
const saturnTexture = textureLoader.load("/orrery-assets/image/8k_saturn.jpg");
const uranusTexture = textureLoader.load("/orrery-assets/image/2k_uranus.jpg");
const neptuneTexture = textureLoader.load("/orrery-assets/image/2k_neptune.jpg");
const plutoTexture = textureLoader.load("/orrery-assets/image/pluto.jpg");
const saturnRingTexture = textureLoader.load("/orrery-assets/image/saturn_ring.png");
const uranusRingTexture = textureLoader.load("/orrery-assets/image/uranus_ring.png");
const earth_moonTexture = textureLoader.load("/orrery-assets/image/8k_moon.jpg");
const mars_PhobosTexture = textureLoader.load("/orrery-assets/image/phobos_mars1.jpg");
const mars_DeimosTexture = textureLoader.load("/orrery-assets/image/Deimos_mars2.jpg");
const jupiter_GanymedeTexture = textureLoader.load("/orrery-assets/image/Jupiter_Ganymede.jpg");
const jupiter_CallistaTexture = textureLoader.load("/orrery-assets/image/Jupiter_Callisto.jpg");
const jupiter_IOTexture = textureLoader.load("/orrery-assets/image/Jupiter_IO.webp");
const jupiter_EuropaTexture = textureLoader.load("/orrery-assets/image/Jupiter_Europa.jpg");
const saturn_TitanTexture = textureLoader.load("/orrery-assets/image/Saturn_titan.jpg");
const saturn_EnceladusTexture = textureLoader.load("/orrery-assets/image/Saturn_Enceladus.jpg");
const Uranus_MirandaTexture = textureLoader.load("/orrery-assets/image/Uranus_Miranda.jpg");
const Uranus_ArielTexture = textureLoader.load("/orrery-assets/image/Uranus_Ariel.jpg");
const Neptune_TritonTexture = textureLoader.load("/orrery-assets/image/Neptune_triton.jpg");
const Neptune_GalateaTexture = textureLoader.load("/orrery-assets/image/Neptune_Galatea.jpg");
const pluto_charonTexture = textureLoader.load("/orrery-assets/image/pluto_CharonTexture.jpg");


//////////////////////////////////////
// Creating scene
const scene = new THREE.Scene();
//////////////////////////////////////


//background
const backgroundTexture = textureLoader.load("/orrery-assets/media/stars-galaxy-3840x2560-10307.jpg");
scene.background = backgroundTexture;


//////////////////////////////////////
//Perspective Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(-50, 90, 150);

//////////////////////////////////////
//Percpective controll
const orbit = new OrbitControls(camera, renderer.domElement);

//////////////////////////////////////
//sun
const sungeo = new THREE.SphereGeometry(15, 50, 50);
const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture,
});
const sun = new THREE.Mesh(sungeo, sunMaterial);
scene.add(sun);

//////////////////////////////////////
//sun light (point light)
const sunLight = new THREE.PointLight(0xffffff, 4, 300);
scene.add(sunLight);

//////////////////////////////////////
//ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);

//////////////////////////////////////
//path for planet
const path_of_planets = [];
function createLineLoopWithMesh(radius, color, width) {
    const material = new THREE.LineBasicMaterial({
        color: color,
        linewidth: width,
    });
    const geometry = new THREE.BufferGeometry();
    const lineLoopPoints = [];

    // Calculate points for the circular path
    const numSegments = 100; // Number of segments to create the circular path
    for (let i = 0; i <= numSegments; i++) {
        const angle = (i / numSegments) * Math.PI * 2;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        lineLoopPoints.push(x, 0, z);
    }

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(lineLoopPoints, 3)
    );
    const lineLoop = new THREE.LineLoop(geometry, material);
    scene.add(lineLoop);
    path_of_planets.push(lineLoop);
}

///////////////////////////////////////
//create planet
const genratePlanet = (size, planetTexture, x, ring) => {
    const planetGeometry = new THREE.SphereGeometry(size, 50, 50);
    const planetMaterial = new THREE.MeshStandardMaterial({
        map: planetTexture,
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    const planetObj = new THREE.Object3D();
    planet.position.set(x, 0, 0);
    if (ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32
        );
        const ringMat = new THREE.MeshBasicMaterial({
            map: ring.ringmat,
            side: THREE.DoubleSide,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        planetObj.add(ringMesh);
        ringMesh.position.set(x, 0, 0);
        ringMesh.rotation.x = -0.5 * Math.PI;
    }
    scene.add(planetObj);

    planetObj.add(planet);
    createLineLoopWithMesh(x, 0xffffff, 3);
    return {
        planetObj: planetObj,
        planet: planet,
    };
};


// Function to create the Moon and add it to Earth
const generateMoon = (size, earth_moonTexture, distanceFromEarth,x,y) => {
    const moonGeometry = new THREE.SphereGeometry(size, 50, 50);
    const moonMaterial = new THREE.MeshStandardMaterial({ map: earth_moonTexture });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);

    // Position the moon relative to Earth
    const MoonObj = new THREE.Object3D();
    moon.position.set(distanceFromEarth, x,y);

    scene.add(MoonObj);

    MoonObj.add(moon);
    // createLineLoopWithMesh(MoonObj, 0xffffff, 3);
    return {
        moonOrbit: MoonObj,
        moon: moon,
    };
};



const planets = [
    {
        ...genratePlanet(3.2, mercuryTexture, 28), // Mercury's diameter should be about 4,880 km
        rotaing_speed_around_sun: 0.004, // Mercury takes about 88 Earth days to orbit the Sun
        self_rotation_speed: 0.004, // Mercury rotates very slowly, one rotation takes about 58.6 Earth days
    },
    {
        ...genratePlanet(5.8, venusTexture, 44), // Venus' diameter should be about 12,104 km
        rotaing_speed_around_sun: 0.015, // Venus takes about 225 Earth days to orbit the Sun
        self_rotation_speed: 0.002, // Venus rotates very slowly and in the opposite direction (retrograde), taking about 243 Earth days per rotation
    },
    {
        ...genratePlanet(6, earthTexture, 62), // Earth's diameter is approximately 12,742 km
        rotaing_speed_around_sun: 0.01, // Earth takes 365.25 days to orbit the Sun
        self_rotation_speed: 0.02, // Earth rotates once every 24 hours
        moons: [
            generateMoon(1.6362, earth_moonTexture, 68,6,-6) // Earth's moon
        ],  // Adding the moon here

    },
    {
        ...genratePlanet(4, marsTexture, 78), // Mars' diameter should be about 6,779 km
        rotaing_speed_around_sun: 0.008, // Mars takes about 687 Earth days to orbit the Sun
        self_rotation_speed: 0.018, // Mars rotates once every 24.6 hours
        moons: [
            generateMoon(1.056, mars_PhobosTexture, 83,6,3), // Phobos
            generateMoon(0.5844, mars_DeimosTexture, 74,3,3) // Deimos
        ],
    },
    {
        ...genratePlanet(12, jupiterTexture, 100), // Jupiter's diameter is about 139,820 km
        rotaing_speed_around_sun: 0.002, // Jupiter takes about 12 Earth years to orbit the Sun
        self_rotation_speed: 0.04, // Jupiter rotates very quickly, once every 10 hours
        moons: [
            generateMoon(4.8,jupiter_GanymedeTexture,120,6,2),
            generateMoon(4,jupiter_CallistaTexture,87,-5,-8),
            generateMoon(2.5,jupiter_IOTexture,85,-2,9),
            generateMoon(4.2,jupiter_EuropaTexture,120,4.5,-17)
        ]
    },
    {
        ...genratePlanet(10, saturnTexture, 138, {
            innerRadius: 10,
            outerRadius: 20,
            ringmat: saturnRingTexture,
        }), // Saturn's diameter is about 116,460 km
        rotaing_speed_around_sun: 0.0009, // Saturn takes about 29.5 Earth years to orbit the Sun
        self_rotation_speed: 0.038, // Saturn rotates once every 10.7 hours

        moons: [
            generateMoon(2,saturn_TitanTexture,125,6,0),
            generateMoon(0.5,saturn_EnceladusTexture,125,7,-6)
        ]
    },
    {
        ...genratePlanet(7, uranusTexture, 176, {
            innerRadius: 7,
            outerRadius: 12,
            ringmat: uranusRingTexture,
        }), // Uranus' diameter is about 50,724 km
        rotaing_speed_around_sun: 0.0004, // Uranus takes about 84 Earth years to orbit the Sun
        self_rotation_speed: 0.03, // Uranus rotates once every 17 hours

        moons: [
            generateMoon(0.1 , Uranus_MirandaTexture,165,6,0),
            generateMoon(0.23 , Uranus_ArielTexture,165,7,-6)

        ]
    },
    {
        ...genratePlanet(7, neptuneTexture, 200), // Neptune's diameter is about 49,244 km
        rotaing_speed_around_sun: 0.0001, // Neptune takes about 165 Earth years to orbit the Sun
        self_rotation_speed: 0.032, // Neptune rotates once every 16 hours
        moons: [
            generateMoon(0.4, Neptune_TritonTexture,190,-5,0),
            generateMoon(0.29, Neptune_GalateaTexture,190,6,-3),
        ]
    },
    {
        ...genratePlanet(2.8, plutoTexture, 216), // Pluto's diameter is about 2,377 km
        rotaing_speed_around_sun: 0.0007, // Pluto takes about 248 Earth years to orbit the Sun
        self_rotation_speed: 0.008, // Pluto rotates once every 6.4 Earth days
        moons: [
            generateMoon(1.4, pluto_charonTexture, 213,5,0)
        ]
    },


];

// ============================================
// ADD PLANET NAMES AND SETUP UI
// ============================================
const planetNames = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
planets.forEach((planet, index) => {
    if (index < planetNames.length) {
        planet.name = planetNames[index];
        const displayName = planetDatabase[planetNames[index]].name;
        createPlanetLabel(planet.planet, displayName);
    }
});

// Initialize planet list
setupPlanetList();

// ============================================
// EVENT LISTENERS FOR UI CONTROLS
// ============================================

// Pause button
document.getElementById('pause-btn').addEventListener('click', () => {
    animationPaused = !animationPaused;
    const btn = document.getElementById('pause-btn');
    if (animationPaused) {
        btn.textContent = '▶ Resume Animation';
        btn.classList.add('active');
    } else {
        btn.textContent = '⏸ Pause Animation';
        btn.classList.remove('active');
    }
});

// Reset button
document.getElementById('reset-btn').addEventListener('click', () => {
    camera.position.set(-50, 90, 150);
    orbit.target.set(0, 0, 0);
    orbit.update();
});

// Info button
document.getElementById('info-btn').addEventListener('click', () => {
    if (selectedPlanet && selectedPlanet.name) {
        updateInfoPanel(selectedPlanet);
    } else {
        alert('Please select a planet from the list first!');
    }
});

// Zoom to selection button
document.getElementById('zoom-btn').addEventListener('click', () => {
    if (selectedPlanet && selectedPlanet.planet) {

        const worldPosition = new THREE.Vector3();
        selectedPlanet.planet.getWorldPosition(worldPosition);

        const distance = 20;

        camera.position.set(
            worldPosition.x + distance,
            worldPosition.y + distance,
            worldPosition.z + distance
        );

        orbit.target.copy(worldPosition);
orbit.update();

document.getElementById('control-panel')
    .classList.add('hidden');

document.getElementById('show-controls-btn')
    .style.display = 'block';

        console.log("Zooming to:", worldPosition);

    } else {
        alert('Please select a planet first!');
    }
});

// Toggle labels button
document.getElementById('toggle-labels-btn').addEventListener('click', toggleLabels);

// Toggle orbits button
document.getElementById('toggle-orbits-btn').addEventListener('click', toggleOrbits);

// Speed slider
document.getElementById('speed-slider').addEventListener('input', (e) => {
    animationSpeed = parseFloat(e.target.value);
    document.getElementById('speed-value').textContent = animationSpeed.toFixed(1) + 'x';
});

// Search box
document.getElementById('search-box').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const items = document.querySelectorAll('.planet-item');
    items.forEach(item => {
        const planetName = item.textContent.toLowerCase();
        if (planetName.includes(query)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Close info panel button
document.getElementById('close-info-btn').addEventListener('click', () => {
    document.getElementById('info-panel').classList.remove('active');
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case ' ':
            e.preventDefault();
            document.getElementById('pause-btn').click();
            break;
        case 'r':
        case 'R':
            document.getElementById('reset-btn').click();
            break;
        case 'l':
        case 'L':
            toggleLabels();
            break;
        case 'o':
        case 'O':
            toggleOrbits();
            break;
    }
});

// Ensure you add the moon orbit object to the planet object
planets[2].planetObj.add(planets[2].moons[0].moonOrbit); // Adding Earth's moon to Earth
planets[3].planetObj.add(planets[3].moons[0].moonOrbit); // Adding Phobos to Mars
planets[3].planetObj.add(planets[3].moons[1].moonOrbit); // Adding Deimos to Mars

planets[4].planetObj.add(planets[4].moons[0].moonOrbit); // Adding Ganymede to Jupiter
planets[4].planetObj.add(planets[4].moons[1].moonOrbit); // Adding Callista to Jupiter
planets[4].planetObj.add(planets[4].moons[2].moonOrbit); // Adding IO to Jupiter
planets[4].planetObj.add(planets[4].moons[3].moonOrbit); // Adding Europa to Jupiter

planets[5].planetObj.add(planets[5].moons[0].moonOrbit); // Adding Titan to Saturn
planets[5].planetObj.add(planets[5].moons[1].moonOrbit); // Adding Enceladus to saturn

planets[6].planetObj.add(planets[6].moons[0].moonOrbit); // Adding Miranda to Uranus
planets[6].planetObj.add(planets[6].moons[1].moonOrbit); // Adding Ariel to Uranus

planets[7].planetObj.add(planets[7].moons[0].moonOrbit); // Adding Triton to Neptune
planets[7].planetObj.add(planets[7].moons[1].moonOrbit); // Adding Galatea to Neptuen

planets[8].planetObj.add(planets[8].moons[0].moonOrbit); // Adding Charon to Pluto








//////////////////////////////////////
//NOTE - GUI options
// var GUI = dat.gui.GUI;
// const gui = new GUI();
// const options = {
//     "Real view": true,
//     "Show path": true,
//     speed: 1,
// };
// gui.add(options, "Real view").onChange((e) => {
//     ambientLight.intensity = e ? 0 : 0.5;
// });
// gui.add(options, "Show path").onChange((e) => {
//     path_of_planets.forEach((dpath) => {
//         dpath.visible = e;
//     });
// });
// const maxSpeed = new URL(window.location.href).searchParams.get("ms") * 1;
// gui.add(options, "speed", 0, maxSpeed ? maxSpeed : 20);

//////////////////////////////////////
const hoverPlanetNames = [
    "Sun",
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
    "Pluto",
    "earthMoon"
];

const planetDataa = {
        sun: "The Sun is the star at the <br> center of our solar system.",
        mercury: "Mercury is the smallest <br>  planet in our solar system <br> and the closest to the Sun.",
        venus: "Venus is the second planet <br> from the Sun and is similar <br> in size to Earth.",
        earth: "Earth is the third planet <br> from the Sun and the only <br> known planet to support life.",
        mars: "Mars is known as the Red Planet <br> due to its reddish appearance.",
        jupiter: "Jupiter is the largest planet <br> in our solar system.",
        saturn: "Saturn is famous for <br> its stunning rings.",
        uranus: "Uranus is unique for its sideways <br> rotation and blue color.",
        neptune: "Neptune is the farthest planet<br> from the Sun and is known<br> for its strong winds.",
        pluto: "Pluto was reclassified <br> as a dwarf planet in 2006."
    };
// Initialize raycaster and mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const planetNameDiv = document.getElementById('planet-name');
const planetInfoDiv = document.getElementById('planet-info'); // Define it here



// Event listener for mouse movement
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
const planetsWithSun = [sun, ...planets.map(p => p.planet)];

// Update planet name display based on mouse hover
function updatePlanetName() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planetsWithSun);

    const planetNameDiv = document.getElementById('planet-name');
    
    // Log intersects to verify intersection
    console.log('Intersects:', intersects);

    if (intersects.length > 0) {
        const planetIndex = planetsWithSun.findIndex(p => p === intersects[0].object);
        if (planetIndex !== -1) {
            const planetName = hoverPlanetNames[planetIndex];
            planetNameDiv.textContent = planetName;
            console.log('Planet Name:', planetName);  // Verify planet name

             // Use the planetDataa object to get information
            const planetKey = hoverPlanetNames[planetIndex].toLowerCase(); // Get the lowercase key for the planet
            const planetInfo = planetDataa[planetKey]; // Retrieve info from planetDataa

       if (planetInfo) {
                planetInfoDiv.innerHTML = `
                   ${planetInfo}
                `;
            }
        }
    } else {
        planetNameDiv.textContent = '';
         planetInfoDiv.innerHTML = '';
    }
}

console.log(planetData);

function createAsteroidBelt() {
    if (rock1 && rock2 && rock3 && !asteroidBelt) {
        asteroidBelt = new THREE.Group();
        let x = 10;
        for (let i = 0; i < 130; i++) {
            const rock = rock2.clone(); // Clone one of your rocks
            rock.position.set(
                Math.random() * 850 - 100, // Random position within a range
                0,
                Math.random() * 850 - 100
            );
            rock.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            asteroidBelt.add(rock);
            x+=10;
        }


        scene.add(asteroidBelt);
    }
}


const loader = new OBJLoader();

let rock1, rock2, rock3;
let asteroidBelt;

loader.load("/orrery-assets/rocks/Rock1.obj", function (object) {
    rock1 = object;
    createAsteroidBelt();
});

loader.load("/orrery-assets/rocks/Rock2.obj", function (object) {
    rock2 = object;
    createAsteroidBelt();
});

loader.load("/orrery-assets/rocks/Rock3.obj", function (object) {
    rock3 = object;
    createAsteroidBelt();
});



//////////////////////////////////////
//Animation loop
const animate = () => {
    requestAnimationFrame(animate);
    
    // Only update animations if not paused
    if (!animationPaused) {
        planets.forEach((planet) => {
            // Rotate planets
            planet.planet.rotation.y += planet.self_rotation_speed * animationSpeed;
            planet.planetObj.rotation.y += planet.rotaing_speed_around_sun * animationSpeed;

            // Check if the planet has moons
            if (planet.moons && planet.moons.length > 0) {
                planet.moons.forEach((moon) => {
                    moon.moon.rotation.y += 0.01 * animationSpeed;
                });
            }
        });
        if (asteroidBelt) {
            asteroidBelt.rotation.y += 0.001; // Rotate the entire belt

            asteroidBelt.children.forEach(rock => {
                rock.rotation.x = 0.002; // Rotate each rock
                rock.rotation.y = 0.002;
            });
        }
    }
    
    orbit.update();
    renderer.render(scene, camera);
};



animate();

document.getElementById('show-controls-btn').addEventListener('click', () => {

    document.getElementById('control-panel')
        .classList.remove('hidden');

    document.getElementById('show-controls-btn')
        .style.display = 'none';

});

//////////////////////////////////////
//Adjust camera on window resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


