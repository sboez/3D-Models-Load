let Scene, Showroom, Load, currentModel, object, rotateOn = false;
const reader = new FileReader();

function letsPlay() {
	init();
	animate();
}

async function init() {
	let container = document.createElement('div');
	document.body.appendChild(container);
	window.addEventListener('resize', onWindowResize, false);

	Scene = new SceneInit();
	Showroom = new ShowroomInit();
	Load = new LoadInit();
	Scene.createScene();
	Scene.createRenderer();

	container.appendChild(Scene.renderer.domElement);

	Scene.createControls();

	await Load.loadSample('assets/models/gltf/street_car.glb');
	addGUI(currentModel);
}

function onWindowResize() {
	Scene.camera.aspect = window.innerWidth / window.innerHeight;
	Scene.camera.updateProjectionMatrix();
	Scene.renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
	Scene.renderer.render(Scene.scene, Scene.camera);
	rotateModel();
}

letsPlay();
