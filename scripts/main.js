let container, object, currentModel, Scene, rotateOn = false;

function letsPlay() {
	init();
	animate();
}

async function init() {
	container = document.createElement('div');
	document.body.appendChild(container);
	document.addEventListener('keydown', onDocumentKeyDown, false);
	window.addEventListener('resize', onWindowResize, false);

	Scene = new SceneInit();
	Scene.createScene();
	Scene.createShowroomLights()
	Scene.createRenderer();

	container.appendChild(Scene.renderer.domElement);

	let controls = new THREE.OrbitControls(Scene.camera, Scene.renderer.domElement);
	controls.update();

	await loadSample('assets/models/gltf/street_car.glb');
	addGUI(currentModel);
}

function onWindowResize() {
	Scene.camera.aspect = window.innerWidth / window.innerHeight;
	Scene.camera.updateProjectionMatrix();
	Scene.renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentKeyDown(event) {
	let speed = 1.4;
    let keyCode = event.which;

    if (keyCode == 87) currentModel.translateZ(speed);
    else if (keyCode == 83) currentModel.translateZ(-speed);
    else if (keyCode == 65) currentModel.translateX(speed);
    else if (keyCode == 68) currentModel.translateX(-speed);
};

function animate() {
	requestAnimationFrame(animate);
	Scene.renderer.render(Scene.scene, Scene.camera);
	rotateModel();
}

letsPlay();
