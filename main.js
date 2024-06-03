import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Configurar o renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Configurar a câmera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 200, 300);

// Configurar a cena
const scene = new THREE.Scene();
scene.background = new THREE.Color('#fff')
scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

// Adicionar luzes
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(0, 200, 100);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 180;
dirLight.shadow.camera.bottom = -100;
dirLight.shadow.camera.left = -120;
dirLight.shadow.camera.right = 120;
scene.add(dirLight);

// Adicionar controles de órbita
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Ativa amortecimento (suavidade)
controls.dampingFactor = 0.25; // Fator de amortecimento
controls.screenSpacePanning = false;
controls.minDistance = 100;
controls.maxDistance = 500;
controls.maxPolarAngle = Math.PI / 2;

// Carregar o modelo FBX
const loader = new FBXLoader();
loader.load('teste.fbx', function (object) {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('textura.jpg', () => {
        // Aplicar a textura a todos os materiais do objeto
        object.traverse(function (child) {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    map: texture
                });
                child.material.needsUpdate = true;
            }
        });
    });

    object.scale.set(2, 2, 2);
    object.position.y = -20 // Ajuste a escala conforme necessário
    scene.add(object);
}, undefined, function (error) {
    console.error(error);
});

// Ajustar a tela quando o tamanho da janela mudar
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// Função de animação
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Atualiza os controles de órbita a cada quadro
    renderer.render(scene, camera);
}

// Iniciar a animação
animate();
