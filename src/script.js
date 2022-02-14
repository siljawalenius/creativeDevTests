import "./style.css";
import * as THREE from "three";
import { MeshLine, MeshLineMaterial } from "three.meshline";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { params, maxParticles } from "./constants";
import initGUI from "./functions";
import planeVertexShader from "./shader/sphere/vertex.glsl";
import planeFragmentShader from "./shader/sphere/fragment.glsl";


import { gsap } from "gsap";

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
  8000
);
camera.position.z = 1150;
camera.position.y = 574;

camera.lookAt(0, 0, 0);
scene.add(camera);

const light = new THREE.AmbientLight();
light.position.set(0, 0, 0);
scene.add(light);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.minDistance = 1000;
//controls.maxDistance = 2700;
controls.maxDistance = 8000;
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

//load textures
const textureLoader = new THREE.TextureLoader();
const pointTexture = textureLoader.load("/textures/1.png");

const group = new THREE.Group();
scene.add(group);

//const planeGeometry = new THREE.PlaneGeometry(4000, 4000, 32, 32);
const sceneGeometry = new THREE.SphereGeometry(3000, 64, 64);
//const sceneGeometry = new THREE.PlaneGeometry(1000, 1000, 16, 16)

// Material
const planeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 1.0 },
    seed: {value: Math.random()}
  },
  vertexShader: planeVertexShader,
  fragmentShader: planeFragmentShader,
  side: THREE.DoubleSide,
  transparent: true,
});

const shaderPlane = new THREE.Mesh(sceneGeometry, planeMaterial);
//shaderPlane.position.z = -2000;
shaderPlane.rotation.y = Math.PI/2
scene.add(shaderPlane);

const testSphere = new THREE.Mesh(
  new THREE.SphereGeometry(params.radius, 32, 16),
  new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.01,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
  })
);
group.add(testSphere); //adding a sphere to give more of a rounded shape
const boundingBox = new THREE.BoxHelper(testSphere, 0x808080);

const segments = maxParticles * maxParticles;
const positions = new Float32Array(segments * 3); //one position for each triangle corner - this is for the line geometry
const colors = new Float32Array(segments * 3); //save line colors / opacities
const particlePositions = new Float32Array(maxParticles * 3); // set a position to each particle - for points
const particlesData = [];

const particles = new THREE.BufferGeometry();

//populate particles array
for (let i = 0; i < maxParticles; i++) {
  const i3 = i * 3;
  // particlePositions[i3] = Math.sin((Math.random() - 0.5) * 2) * params.radius; //x position
  // particlePositions[i3 + 1] = (Math.random() - 0.5) * 2 * params.radius; //y position
  // particlePositions[i3 + 2] = Math.cos((Math.random() - 0.5) * 2) * params.radius;  //z position
  const randVal = Math.random();
  const r = params.radius;
  const xPos = Math.sin(randVal * 2 * Math.PI) * r * Math.random();
  const zPos = Math.cos(randVal * 2 * Math.PI) * r * Math.random();
  const isPos = Math.random() > 0.5 ? 1 : -1;
  const yPos =
    Math.sqrt(Math.pow(r, 2) - Math.pow(xPos, 2) - Math.pow(zPos, 2)) *
    isPos *
    Math.random();

  particlePositions[i3] = xPos; //x
  particlePositions[i3 + 1] = yPos; //y
  particlePositions[i3 + 2] = zPos; //z

  // add data to data array
  particlesData.push({
    velocity: new THREE.Vector3(
      -1 + Math.random() * 2,
      -1 + Math.random() * 2,
      -1 + Math.random() * 2
    ),
    numConnections: 0, //each particle starts with no connections
  });
}

//create points geometry
const pointMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 7,
  blending: THREE.AdditiveBlending,
  transparent: true,
  sizeAttenuation: false,
  alphaMap: pointTexture,
  depthWrite: false,
  depthTest: false,
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
  new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
); //set position attribute
linesGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage)
); //set color attribute

//linesGeometry.computeBoundingSphere();
linesGeometry.setDrawRange(0, 0); //init at a draw range of 0 , so no lines show up

const thinLinesMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff,
  linewidth: 5,
  opacity: params.lineOpacity,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
  transparent: true,
});
const linesShape = new THREE.Line(linesGeometry, thinLinesMaterial);
linesShape.computeLineDistances();
group.add(linesShape);

//rewrite line material to gave thickness
// const linesMaterial = new LineMaterial({
//   color: 0xffffff,
//   linewidth: 5,
//   //vertexColors: true,
//   //blending: THREE.AdditiveBlending,
//   dashed: false,
//   alphaToCoverage: false,
//   transparent: true,
// });
// const linesShape = new Line2(linesGeometry, linesMaterial);
// linesShape.computeLineDistances()
// group.add(linesShape);

//test using meshlines
// const lines = new MeshLine()
// lines.setPoints(linesGeometry)
// const meshLineMaterial = new MeshLineMaterial({
//   color: new THREE.Color(0xffffff),
//   opacity: params.lineOpacity,
//   lineWidth: 3,
//   depthWrite: false,
//   transparent: true,
//   side: THREE.DoubleSide
// })
// const linesMesh = new THREE.Mesh(lines, meshLineMaterial)
// scene.add(linesMesh)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true, // you can only see this effect if youre using a screen with a pixel ratio of 1
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new THREE.Color(0xfc9797));

initGUI({ boundingBox, pointCloud, linesShape }, particles);

/**
 * Animate
 */

const inhale = () => {
  gsap.to(group.scale, {
    x: 1.5,
    y: 1.5,
    z: 1.5,
    duration: params.inhaleLength,
    ease: "power1.inOut",
  });
};
const exhale = () => {
  gsap.to(group.scale, {
    x: 0.5,
    y: 0.5,
    z: 0.5,
    duration: params.exhaleLength,
    ease: "power1.inOut",
  });
};

const clock = new THREE.Clock();
let lastElapsedTime = 0;
let countTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;

  // Update controls
  controls.update();

  let vertexpos = 0; //initially, no lines are rendered
  let colorpos = 0;
  let lineConnections = 0; //initially, zero points connected

  for (let i = 0; i < params.numParticles; i++) {
    particlesData[i].numConnections = 0; //reset number of connections to each particle to 0
    const i3 = i * 3; //store position in array
    const particleData = particlesData[i]; //save particle data of current particle

    particlePositions[i3] += particleData.velocity.x * params.particleSpeed; //move the particle in x
    particlePositions[i3 + 1] += particleData.velocity.y * params.particleSpeed; //move in y
    particlePositions[i3 + 2] += particleData.velocity.z * params.particleSpeed; // move in z

    const r = params.radius;
    const x = particlePositions[i3];
    const y = particlePositions[i3 + 1];
    const z = particlePositions[i3 + 2];

    const distFromOrigin = Math.sqrt(x * x + y * y + z * z);

    if (distFromOrigin >= r) {
      //if point hits sphere boundary, reverse it
      particleData.velocity.x *= -1;
      particleData.velocity.y *= -1;
      particleData.velocity.z *= -1;
    }

    const connectionsUnderLimit =
      params.limitConnections &&
      particleData.numConnections < params.maxConnections;
      
    if (connectionsUnderLimit || !params.limitConnections) {
      for (let j = i + 1; j < params.numParticles; j++) {
        //every particle before i has already been checked
        const secondParticleData = particlesData[j];

        const secondConnectionsUnderLimit =
          params.limitConnections &&
          secondParticleData.numConnections < params.maxConnections;

        if (secondConnectionsUnderLimit || !params.limitConnections) {
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

            //set alpha based on distance
            const alpha = 1.0 - totalDist / params.maxDistance;

            //update line positions
            //add co-ords of first point to positionns array
            positions[vertexpos++] = particlePositions[i3]; //x position
            positions[vertexpos++] = particlePositions[i3 + 1]; //y
            positions[vertexpos++] = particlePositions[i3 + 2]; //z

            //add co-ords of second point to positionns array
            positions[vertexpos++] = particlePositions[j3]; //x2
            positions[vertexpos++] = particlePositions[j3 + 1]; //y2
            positions[vertexpos++] = particlePositions[j3 + 2]; //z2

            colors[colorpos++] = alpha;
            colors[colorpos++] = alpha;
            colors[colorpos++] = alpha;

            colors[colorpos++] = alpha;
            colors[colorpos++] = alpha;
            colors[colorpos++] = alpha;

            lineConnections++; //update number of connections total within this frame
          }
        }
      }
    }
  }

  countTime += deltaTime;
  //inhale, hold, exhale, hold

  const phase1 = params.inhaleLength;
  const phase2 = params.inhaleLength + params.holdLength;
  const phase3 = params.inhaleLength + params.holdLength + params.exhaleLength;
  const phase4 =
    params.inhaleLength +
    params.holdLength +
    params.exhaleLength +
    params.holdLength;

  if (countTime < phase1) {
    inhale();
  } else if (phase1 <= countTime && countTime <= phase2) {
    //rotate whole shape slowly
    group.rotation.y += deltaTime * 0.02;
  } else if (phase2 < countTime && countTime < phase3) {
    exhale();
  } else if (phase3 <= countTime && countTime <= phase4) {
    group.rotation.y += deltaTime * 0.02;
  }
  //reset count time when breath cucle ends
  countTime >= phase4 ? (countTime = 0) : null;

  linesShape.geometry.setDrawRange(0, 2 * lineConnections);
  linesShape.geometry.attributes.position.needsUpdate = true;
  linesShape.geometry.attributes.color.needsUpdate = true;
  pointCloud.geometry.attributes.position.needsUpdate = true;

  //rotate whole shape slowly
  group.rotation.y += deltaTime * 0.1;
  //UPDATE GRADIENT MATERIAL TIME
  planeMaterial.uniforms.time.value = elapsedTime;
  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

const update = () => {
  const elapsedTime = clock.getElapsedTime();
  //UPDATE GRADIENT MATERIAL TIME
  planeMaterial.uniforms.time.value = elapsedTime;
  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(update);
};
//update()
