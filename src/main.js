const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const light1 = new THREE.PointLight( 0xffffff, 1, 20, 3 );
light1.position.set( 0, 4, -2 );
scene.add( light1 );

const light2 = new THREE.PointLight( 0xffffff, 1, 20, 3 );
light2.position.set( 4, 4, -2 );
scene.add( light2 );

const light3 = new THREE.PointLight( 0xffffff, 1, 20, 3 );
light3.position.set( 4, 4, -6 );
scene.add( light3 );

const light4 = new THREE.PointLight( 0xffffff, 1, 20, 3 );
light4.position.set( 0, 4, -6 );
scene.add( light4 );

const height = 1.5; // Height of the camera
camera.position.set(0, height, 0); // Set camera position
camera.lookAt(2, height, 2); // Look at the center of the room

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera motion
controls.dampingFactor = 0.05;
controls.enablePan = false; // Optional: disable panning if you only want rotation
controls.maxDistance = 0.001;
controls.minPolarAngle = Math.PI / 2; // Limit vertical rotation
controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation
controls.target = new THREE.Vector3(0, height, 0); // Set target to the center of the room

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.GLTFLoader();
loader.load('Room.glb', function (gltf) {
    scene.add(gltf.scene);
    animate();
}, undefined, function (error) {
    console.error(error);
});

function moveCamera() {
    let diffY = mouseDownY - mouseMoveY;
    if (diffY > 20) {
        diffY = 0.02;
    } else if (diffY < -20) {
        diffY = -0.02;
    } else {
        return ;
    }

    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    camera.position.addScaledVector(direction, diffY);
    controls.target.addScaledVector(direction, diffY);
}

function animate() {
    moveCamera();
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

let mouseDownY;
let mouseMoveY;
window.addEventListener('pointerdown', function (event) {
    mouseDownY = event.clientY;
    mouseMoveY = event.clientY;
});

window.addEventListener('pointerup', function (event) {
    mouseDownY = undefined;
    mouseMoveY = undefined;
});

window.addEventListener('pointermove', function (event) {
    mouseMoveY = event.clientY;

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // const raycaster = new THREE.Raycaster();
    // raycaster.setFromCamera(mouse, camera);

    //const intersects = raycaster.intersectObjects(scene.children, true);
    //if (intersects.length > 0) {
        // controls.target = target; // Set the target to the clicked point
        
        // .lerp(direction, 0.1); // Move camera towards the clicked point
    //}
});

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});