import Scene from './scripts/Scene';
import Load from './scripts/Load';
import Showroom from './scripts/Showroom';
import Gui from './scripts/Gui';

class App {
	constructor() {
		this.scene = null;
		this.load = null;
		this.showroom = null;
		this.gui = null;

		this.letsPlay();
	}

	async letsPlay() {
		this.scene = new Scene();
		this.load = new Load(this.scene, this.currentModel);
		this.showroom = new Showroom(this.scene);
		this.gui = new Gui(this.scene, this.load, this.showroom);

		await this.load.loadSample('./models/gltf/street_car.glb');
		this.gui.addGUI(this.load.currentModel);

		this.init();
		this.animate();
	}

	init() {
		document.body.appendChild(this.scene.renderer.domElement);
		window.addEventListener('resize', this.onWindowResize.bind(this), false);
	}

	onWindowResize() {
		this.scene.camera.aspect = window.innerWidth / window.innerHeight;
		this.scene.camera.updateProjectionMatrix();
		this.scene.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.scene.renderer.render(this.scene, this.scene.camera);
		this.gui.rotateModel();
	}
}

new App();
