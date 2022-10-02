import "../css/style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Create scene, camera and renderer
// Scene
const scene = new THREE.Scene();
// Camera
const camera = new THREE.PerspectiveCamera(
  // FOV
  75,
  // Aspect Ratio
  window.innerWidth / window.innerHeight,
  // Near (Objects closer than this won't be rendered)
  0.1,
  // Far (Objects further away than this won't be rendered)
  1000
);
// Renderer
const renderer = new THREE.WebGLRenderer({
  // Which element to use
  canvas: document.querySelector("#bg"),
});
// Set the pixel ratio to the device pixel ratio
renderer.setPixelRatio(window.devicePixelRatio);
// Set the size to the size of the device screen
renderer.setSize(window.innerWidth, window.innerHeight);
// Move camera backwards (so it's not in the middle of the scene)
camera.position.z = 30;
camera.position.x = -3;
// Render the scene and camera
renderer.render(scene, camera);

// Add normal map texture
const normalMap = new THREE.TextureLoader().load("../textures/normal.jpg");
// Create object to render in the scene
function objectTorus() {
  // Geometry
  const geometry = new THREE.TorusGeometry(
    // Radius
    10,
    // Tube Radius
    2,
    // Radial Segments
    20,
    // Tubular Segments
    100
  );
  // Material
  const material = new THREE.MeshLambertMaterial({
    color: 0xdaa520, // Gold
    normalMap: normalMap,
    wireframe: false,
  });
  // Mesh
  const Torus = new THREE.Mesh(geometry, material);
  // Add object to the scene
  scene.add(Torus);
  // Return object
  return Torus;
}
// Add objects
const Torus1 = objectTorus();
const Torus2 = objectTorus();

// Lighting
// Light source
const pointLight = new THREE.PointLight(0xffffff); // Emits light in all directions
// Move it away from the center
pointLight.position.set(20, 20, 20);
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff); // Will light up everything in the scene equaly
// Add light to the scene
scene.add(pointLight, ambientLight);

// // Light helper (Will show the position of the Point Light)
// const lightHelper = new THREE.PointLightHelper(pointLight);
// // Grid helper (Will add a grid to the scene)
// const gridHelper = new THREE.GridHelper(200, 50);
// // Add helpers to the scene
// scene.add(lightHelper, gridHelper);

// // Instanciate OrbitControls class
// const controls = new OrbitControls(camera, renderer.domElement); // This will listen to dom Events on mouse and pass it to the camera accordingly

// Randomly generate stars and add them to the scene
function addStar() {
  // Geometry
  const geometry = new THREE.SphereGeometry(
    // Radius
    0.25,
    // Width segments
    25,
    // Height segments
    25
  );
  // Material
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White
    wireframe: false,
  });
  // Mesh
  const star = new THREE.Mesh(geometry, material);

  // Generate random coordinates for each star
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  // Set the position of the star
  star.position.set(x, y, z);
  // Add star to the scene
  scene.add(star);
}
// Add 400 stars
Array(400).fill().forEach(addStar);

// Load a background image
const spaceTexture = new THREE.TextureLoader().load("../textures/space.jpg");
// Set the image as scene background
scene.background = spaceTexture;

// Add metal cube texture
const metalCubeTexture = new THREE.TextureLoader().load(
  "../textures/metalCube.jpg"
);
// Add metal cube normal
const metalCubeNormal = new THREE.TextureLoader().load(
  "../textures/normalCube.jpg"
);
// Create object
const metalCube = new THREE.Mesh(
  // Create box
  new THREE.BoxGeometry(3, 3, 3),
  // Add metal-ish mesh
  new THREE.MeshPhongMaterial({
    map: metalCubeTexture,
    normalMap: metalCubeNormal,
    wireframe: false,
  })
);
// Add object to the scene
scene.add(metalCube);
// Reposition the cube
metalCube.position.z = -5;
metalCube.position.x = 2;

// Add moon texture
const moonTexture = new THREE.TextureLoader().load("../textures/moon.jpg");
// Add moon normal
const moonNormal = new THREE.TextureLoader().load("../textures/normalMoon.jpg");
// Create object
const moon = new THREE.Mesh(
  // Create sphere
  new THREE.SphereGeometry(
    // Radius
    3,
    // Width segments
    32,
    // Height segments
    32
  ),
  // Add mesh
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: moonNormal,
    wireframe: false,
  })
);
// Add moon to the scene
scene.add(moon);
// Reposition the moon
moon.position.z = 30;
moon.position.x = -10;

// Move the camera on scroll
function moveCamera() {
  // Calculate where the user is currently scrolled to
  const t = document.body.getBoundingClientRect().top;

  // Rotate Moon
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.0075;
  moon.rotation.z += 0.05;
  // Rotate Cube
  metalCube.rotation.x += 0.05;
  metalCube.rotation.z += 0.05;

  // Change the position of the camera
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}
// Assign the function to document body scroll
document.body.onscroll = moveCamera;
moveCamera();

// Create the animation renderer
function animate() {
  requestAnimationFrame(animate);

  // Rotate Torus
  Torus1.rotation.x += 0.01;
  Torus1.rotation.y += 0.005;
  Torus1.rotation.z += 0.01;
  Torus2.rotation.x += 0.02;
  Torus2.rotation.y += 0.01;
  Torus2.rotation.z += 0.02;
  //Rotate Moon
  moon.rotation.x += 0.005;

  //   // Update controls
  //   controls.update();

  // Render the scene and camera
  renderer.render(scene, camera);
}
animate();
