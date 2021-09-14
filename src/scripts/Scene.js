import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

export default class Scene extends THREE.Scene {
	constructor() {
		super();

		this.setScene();
	}

	setScene() {
		this.background = new THREE.Color(0xa0a0a0);

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
		this.camera.position.set(190, 130, 170);

		this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(200, 200), new THREE.MeshPhongMaterial({ color: 0xcfcfcf, side: THREE.DoubleSide }));
		this.plane.rotation.x = -Math.PI / 2;
		this.plane.receiveShadow = true;
		this.add(this.plane);

		this.setLights();
		this.setRenderer();
		this.setControls();
	}

	setLights() {
		this.hemLight = new THREE.HemisphereLight(0xffffff, 0x404040, 1);
		this.add(this.hemLight);

		this.light = new THREE.DirectionalLight(0xffffff, .1);
		this.light.castShadow = true;
		this.light.position.set(0, 50, 0)

		/* set up shadow properties for the shadow casting directional light */
		this.light.shadow.mapSize.width = 1024;
		this.light.shadow.mapSize.height = 1024;
		this.light.shadow.camera.near = 0.5;
		this.light.shadow.camera.far = 500;
		const mapArea = 100
		this.light.shadow.camera.left = this.light.shadow.camera.bottom = -mapArea
		this.light.shadow.camera.top = this.light.shadow.camera.right = mapArea
		this.light.shadow.bias = -0.001
		this.add(this.light);
	}

	setRenderer() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
	}

	setControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.maxPolarAngle = Math.PI / 2;
		this.controls.maxDistance = 2000;
		this.controls.target = new THREE.Vector3(0, 15, 0);
		this.controls.update();
	}
}
