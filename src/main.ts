import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let loader: GLTFLoader;
let cube: THREE.Mesh;
let controls: OrbitControls;
let planeMesh: THREE.Mesh;

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  controls = new OrbitControls(camera, renderer.domElement);
  loader = new GLTFLoader();

  loader.load(
    "models/sukhoi_su-57_felon_-_fighter_jet_-_free.glb",
    function (gltf) {
      gltf.scene.position.set(0, 0, -5);
      scene.add(gltf.scene);
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  // https://github.com/mrdoob/three.js/tree/master/examples/textures
  const texture = new THREE.TextureLoader().load("textures/crate.gif");

  const material = new THREE.MeshBasicMaterial({ map: texture });
  cube = new THREE.Mesh(boxGeometry, material);
  scene.add(cube);

  const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
  });
  planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(planeMesh);

  // ================ LIGHTING ============================
  // Create an AmbientLight and add it to the scene.
  const ambientLight = new THREE.AmbientLight(0xcccccc);
  scene.add(ambientLight);

  // Create a DirectionalLight and add it to the scene.
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0, 1, 1).normalize();
  scene.add(directionalLight);

  camera.position.z = 30;
  camera.position.y = 10;
  camera.position.x = 10;
  camera.updateProjectionMatrix();
  controls.update();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  planeMesh.rotation.x += 0.01;

  renderer.render(scene, camera);
}

init();
animate();
