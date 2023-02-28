import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import door from "../textures/door.glb";

const scene = new THREE.Scene();
scene.background = new THREE.Color("#666666");

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 50);
camera.position.z = 25;
camera.position.x = 3;
camera.position.y = 6;
camera.lookAt(0, 0, -20);

const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

//// PLANE
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshPhongMaterial({ color: 0xfab74b })
);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

//// CONE
const cone = new THREE.Mesh(
  new THREE.ConeGeometry(2, 5, 64),
  new THREE.MeshPhongMaterial({ color: 0xcc0000 })
);
cone.position.set(7, 2.5, 2.7);
cone.receiveShadow = true;
cone.castShadow = true;
scene.add(cone);

//// CYLINDER
const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 6, 64),
  new THREE.MeshPhongMaterial({ color: 0x3ea34c })
);
cylinder.position.set(3, 3, 2.7);
cylinder.receiveShadow = true;
cylinder.castShadow = true;
scene.add(cylinder);

//// DOOR
const loader = new GLTFLoader();
loader.load(door, function (glb) {
  const model = glb.scene;

  model.scale.set(1, 1, 1);
  model.position.set(-1, 0, 2.7);

  model.traverse(function (node) {
    if (node.isMesh) node.castShadow = true;
  });

  scene.add(model);
});

// DIRECTIONAL LIGHT
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.x += 20;
directionalLight.position.y += 20;
directionalLight.position.z += 20;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
const d = 25;
directionalLight.shadow.camera.left = -d;
directionalLight.shadow.camera.right = d;
directionalLight.shadow.camera.top = d;
directionalLight.shadow.camera.bottom = -d;
scene.add(directionalLight);

function render() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);

  const time = Date.now() * 0.0005;
  directionalLight.position.x = Math.sin(time * 0.7) * 20;
  directionalLight.position.z = Math.cos(time * 0.7) * 20;
}
render();
