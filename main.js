import './style.css'
import * as THREE from 'three';
import { OrbitControls, } from 'three/examples/jsm/controls/OrbitControls';
import { TrackballControls, } from 'three/examples/jsm/controls/TrackballControls';

const cursor = {
  x: 0,
  y: 0,
}

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}


window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = - (event.clientY / sizes.height - 0.5);
});
  


window.addEventListener('resize', () => {
  //Update Sizes
  sizes.width= window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width/sizes.height;
  camera.updateProjectionMatrix();

  //Update Renderer
  renderer.setSize(sizes.width, sizes.height);
});






const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(65, sizes.width / sizes.height, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);


renderer.render( scene, camera );

// const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
// const material = new THREE.MeshBasicMaterial( {color: 0xFF6347,} );
// const torus = new THREE.Mesh( geometry, material );
// scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);


controls.update();

const matcapTexture = new THREE.TextureLoader().load('assets/4.png');
const donutGeometry = new THREE.TorusGeometry(0.4, 0.3, 30, 65)
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
function addStar() {
  const donut = new THREE.Mesh(donutGeometry, donutMaterial)
  donut.position.x = (Math.random() - 0.5) * 70
  donut.position.y = (Math.random() - 0.5) * 50
  donut.position.z = (Math.random() - 0.5) * 70
  donut.rotation.x = Math.random() * Math.PI
  donut.rotation.y = Math.random() * Math.PI
  const scale = Math.random()
  donut.scale.set(scale, scale, scale)
  scene.add(donut)

}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('assets/space.jpg');
scene.background = spaceTexture;

const gautamTexture = new THREE.TextureLoader().load('assets/gautam3.jpeg');

const gautam = new THREE.Mesh(
  new THREE.BoxGeometry(3.2,3.2,3.2),
  new THREE.MeshBasicMaterial( { 
    map: gautamTexture
  }),
);

gautam.rotation.x = 5;

scene.add(gautam);


const moonTexture = new THREE.TextureLoader().load('assets/moon.jpeg');
const normalTexture = new THREE.TextureLoader().load('assets/normal.jpeg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  }),
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

gautam.position.z = -5;
gautam.position.x = 2;



var textMesh
const fontLoader = new THREE.FontLoader()

fontLoader.load( 'fonts/Snowy-Night.json', function ( font ) {
  const textGeometry = new THREE.TextGeometry( "Gautam Arora", {
    font: font,
    size: 1.2,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });
  textGeometry.center()
  const matcapTexture = new THREE.TextureLoader().load('assets/4.png');
  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

  textMesh = new THREE.Mesh( textGeometry, textMaterial );
  textMesh.scale.x = 5;
  textMesh.scale.y = 5;
  textMesh.scale.z = 1;
  textMesh.position.y = 18;
}); 


function moveCamera() { 
  const t = document.body.getBoundingClientRect().top;
  if(document.documentElement.scrollTop < 50) {
    scene.remove(textMesh);
  } else {
    scene.add(textMesh);
  }
  if(document.documentElement.scrollHeight < 100) {
    scene.remove(textMesh)
  }
  
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  gautam.rotation.y += 0.01;
  gautam.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * 0.0002;
  
}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame( animate );

  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;

  gautam.rotation.x += 0.005;
  gautam.rotation.y += 0.005;

  //Update Camera
  camera.rotation.x = Math.sin(cursor.x * Math.PI) ;
  camera.rotation.z = Math.cos(cursor.x * Math.PI );
  camera.position.y = cursor.y * 3;
  camera.lookAt(cursor.x * Math.PI);


  controls.update();

  renderer.render( scene, camera );
}

animate();