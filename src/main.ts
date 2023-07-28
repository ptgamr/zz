import "./style.css";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gsap } from "gsap";

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let loader: GLTFLoader;
let controls: OrbitControls;
let groundMesh: THREE.Mesh;

let jet: GLTF | null = null;

const JET_SCALE = 1;
const CAMERA_Z_ORIGIN = 200;

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  // Add an AxesHelper to the scene
  const axesHelper = new THREE.AxesHelper(1000); // The parameter determines the size of the helper
  scene.add(axesHelper);

  createCamera();
  // createJet();
  createLight();
  createGround();

  controls.update();
}

function createCamera() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  controls = new OrbitControls(camera, renderer.domElement);
  camera.position.z = CAMERA_Z_ORIGIN;
  camera.position.y = 100;
  camera.position.x = 0;
  camera.updateProjectionMatrix();
}

function createLight() {
  // ================ LIGHTING ============================
  // Create an AmbientLight and add it to the scene.
  const ambientLight = new THREE.AmbientLight(0xcccccc);
  scene.add(ambientLight);

  // Create a DirectionalLight and add it to the scene.
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0, 1, 1).normalize();
  scene.add(directionalLight);
}

function createGround() {
  const groundGeo = new THREE.PlaneGeometry(1000, 1000, 200, 200);
  const disMap = new THREE.TextureLoader().load("/textures/Heightmap.png");
  const disScale = 100;

  // const groundGeo = new THREE.PlaneGeometry(1000, 1000, 200, 200);
  // const disMap = new THREE.TextureLoader().load(
  //   "/textures/mt-taranaki.png",
  // );
  // const disScale = 200

  disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
  disMap.repeat.set(1, 1);

  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x32cd32,
    wireframe: true,
    displacementMap: disMap,
    displacementScale: disScale,
  });
  groundMesh = new THREE.Mesh(groundGeo, groundMat);
  scene.add(groundMesh);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -0.5;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);
const scrollContainer = document.querySelector("#scroll-container");

function onScroll() {
  if (!scrollContainer) return;
  const scrollPosition = scrollContainer.scrollTop;

  // gsap.killTweensOf(camera.position);

  gsap.to(camera.position, {
    z: CAMERA_Z_ORIGIN - scrollPosition,
    ease: "sine.in", // easeIn animation
    duration: 1, // duration of the animation in seconds
    overwrite: "auto", //This will prevent the new animation from stopping the ongoing one
  });
  renderer.render(scene, camera);
}

if (scrollContainer) {
  scrollContainer.addEventListener("scroll", onScroll, false);
}

let jetDirection = 1;
let jetSpeed = 0.3;

function createJet() {
  loader = new GLTFLoader();

  loader.load(
    "models/sukhoi_su-57_felon_-_fighter_jet_-_free_small.glb",
    function (gltf) {
      jet = gltf;
      jet.scene.position.set(200, 100, -300);
      jet.scene.scale.set(JET_SCALE, JET_SCALE, JET_SCALE);
      scene.add(jet.scene);
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );
}

function animate() {
  requestAnimationFrame(animate);

  console.log(camera.position.z);

  // camera.position.z += 0.1;
  // camera.updateProjectionMatrix();

  if (jet) {
    let x = jet.scene.position.x;

    // jetDirection = z > 10 ? -1 : z < 0 ? 1 : jetDirection;
    jet.scene.position.x = x - jetSpeed * jetDirection;
    console.log(jet.scene.position);
  }

  // groundMesh.rotation.x += 0.01;

  renderer.render(scene, camera);
}

init();
animate();
