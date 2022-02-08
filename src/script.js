import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";


// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  5000
);
camera.position.z = 1750;
scene.add(camera);

const light = new THREE.AmbientLight();
scene.add(light);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.minDistance = 1000;
controls.maxDistance = 3000;
controls.enableDamping = true;

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


// Debug
const gui = new GUI();


const radius = 600; //length of each side of geometry
const maxParticles = 1000; //max number of points

const params = {
  numParticles : 450, //number of particles currently visible
  maxDistance : 250 //max distancne two pointns cann be and still be connected
}

gui.add(params, 'maxDistance', 10, 400, 1)
gui.add(params, 'numParticles', 0, maxParticles, 1).onFinishChange(
  (value) =>{
    particles.setDrawRange(0, value)
  }

)



const group = new THREE.Group();
scene.add(group);

const testSphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 16));
//scene.add(testSphere);

const boundingBox = new THREE.BoxHelper(testSphere, 0x808080);
boundingBox.material.blending = THREE.AdditiveBlending;
boundingBox.material.transparent = true;
group.add(boundingBox);

const segments = maxParticles * maxParticles;
const positions = new Float32Array(segments * 3); //one position for each triangle corner - this is for the line geometry 
const colors = new Float32Array(segments * 3); //save line colors / opacities 
const particlePositions = new Float32Array(maxParticles * 3); // set a position to each particle - for points
const particlesData = [];

const particles = new THREE.BufferGeometry();

//populate particles array
for (let i = 0; i < maxParticles; i++) {
  const i3 = i * 3;
  particlePositions[i3] = (Math.random() - 0.5) * 2 * radius; //x position
  particlePositions[i3 + 1] = (Math.random() - 0.5) * 2 * radius; //y position
  particlePositions[i3 + 2] = (Math.random() - 0.5) * 2 * radius; //z position

  // add data to data array
  particlesData.push({
    velocity: new THREE.Vector3(
      (-1 + Math.random() * 2) * 2,
      (-1 + Math.random() * 2) * 2,
      (-1 + Math.random() * 2) * 2
    ),
    numConnections: 0, //each particle starts with no connections 
  });
}

//create points geometry
const pointMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 2,
  blending: THREE.AdditiveBlending,
  transparent: true,
  sizeAttenuation: false,
});

particles.setDrawRange(0, params.numParticles); //only display the selected amount of particles

particles.setAttribute(
  "position",
  new THREE.BufferAttribute(particlePositions, 3).setUsage(
    THREE.DynamicDrawUsage
  )
); //set attribute usage for slight performance improvement
const pointCloud = new THREE.Points(particles, pointMaterial);
group.add(pointCloud);

//now create lines geometry
const linesGeometry = new THREE.BufferGeometry();

linesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3).setUsage(
    THREE.DynamicDrawUsage
  )
); //set position attribute
// linesGeometry.setAttribute(
//   "color",
//   new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage)
// ); //set color attribute

linesGeometry.computeBoundingSphere();
linesGeometry.setDrawRange(0, 0); //init at a draw range of 0 , so no lines show up 

const linesMaterial = new THREE.LineBasicMaterial({
  color: 0x808080,
  opacity: 0.3,
  //vertexColors: true,
  blending: THREE.AdditiveBlending,
  transparent: true,
});

//example uses lineSegments - I'm using lines

const linesShape = new THREE.Line(linesGeometry, linesMaterial);
group.add(linesShape);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true, // you can only see this effect if youre using a screen with a pixel ratio of 1
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  let vertexpos = 0; //initially, no lines are rendered 
  let colorpos = 0; 
  let lineConnections = 0; //initially, zero points connected

  for (let i = 0; i < params.numParticles; i++) {
    particlesData[i].numConnections = 0; //reset number of connections to each particle to 0 
    const i3 = i * 3; //store position in array
    const particleData = particlesData[i]; //save particle data of current particle 

    particlePositions[i3] += particleData.velocity.x; //move the particle in x
    particlePositions[i3 + 1] += particleData.velocity.y; //move in y
    particlePositions[i3 + 2] += particleData.velocity.z; // move in z

    if (particlePositions[i3] < -radius || particlePositions[i3] > radius) {
      particleData.velocity.x = -particleData.velocity.x; //if particle exits the square in x, flip the velocity
    }
    if (
      particlePositions[i3 + 1] < -radius ||
      particlePositions[i3 + 1] > radius
    ) {
      particleData.velocity.y = -particleData.velocity.y; //if particle exits the square in y, flip the velocity
    }
    if (
      particlePositions[i3 + 2] < -radius ||
      particlePositions[i3 + 2] > radius
    ) {
      particleData.velocity.z = -particleData.velocity.z; //if particle exits the square in z, flip the velocity
    }

    for (let j = i + 1; j < params.numParticles; j++) {
      //every particle before i has already been checked
      const secondParticleData = particlesData[j];
      const j3 = j * 3;
      const distX = particlePositions[i3] - particlePositions[j3];
      const distY = particlePositions[i3 + 1] - particlePositions[j3 + 1];
      const distZ = particlePositions[i3 + 2] - particlePositions[j3 + 2];

      const totalDist = Math.sqrt(
        distX * distX + distY * distY + distZ * distZ
      ); //calculate distance between points

      if (totalDist < params.maxDistance) {
        //if dist is less thann the min distance needed
        particleData.numConnections++; //add a connection to first particle 
        secondParticleData.numConnections++; //if particles are close enough to be connected, connect them

        //update line position

        //add co-ords of first point to positionns array
        positions[vertexpos++] = particlePositions[i3]; //x position 
        positions[vertexpos++] = particlePositions[i3 + 1]; //y
        positions[vertexpos++] = particlePositions[i3 + 2]; //z

        //add co-ords of second point to positionns array
        positions[vertexpos++] = particlePositions[j3]; //x2
        positions[vertexpos++] = particlePositions[j3 + 1]; //y2
        positions[vertexpos++] = particlePositions[j3 + 2]; //z2

        lineConnections++; //update number of connections total within this frame
      }
    }
  }

  linesShape.geometry.setDrawRange(0, 2 * lineConnections)
  linesShape.geometry.attributes.position.needsUpdate = true

  pointCloud.geometry.attributes.position.needsUpdate = true;
  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
