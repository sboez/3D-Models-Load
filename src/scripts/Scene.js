import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

const FLOOR_SIZE = 3500;
const GRID_DIVISIONS = 100;
const FOG_NEAR_FACTOR = 1.2;
const FOG_FAR_FACTOR = 3.2;
const DISC_INNER = 50;
const DISC_OUTER = 82;

export default class Scene extends THREE.Scene {
	constructor() {
		super();

		this.setScene();
	}

	setScene() {
		this.defaultBackground = new THREE.Color(0x1e1e22);
		this.background = this.defaultBackground;
		this.normalFog = new THREE.Fog(this.defaultBackground, 200, 600);
		this.fog = this.normalFog;

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000000);
		this.camera.position.set(75, 102, 175);

		this.setFloor();
		this.setGrid();
		this.setLights();
		this.setRenderer();
		this.setControls();
	}

	setFloor() {
		this.floorAlpha = this.radialAlphaTexture();
		this.plane = new THREE.Mesh(
			new THREE.PlaneGeometry(FLOOR_SIZE, FLOOR_SIZE),
			new THREE.MeshPhongMaterial({ color: 0xcfcfcf, side: THREE.DoubleSide })
		);
		this.plane.rotation.x = -Math.PI / 2;
		this.plane.receiveShadow = true;
		this.add(this.plane);
	}

	setGrid() {
		this.grid = new THREE.GridHelper(FLOOR_SIZE, GRID_DIVISIONS, 0x444444, 0x888888);
		this.grid.position.y = 0.01;
		this.buildGridColors(this.grid);
		this.add(this.grid);
	}

	updateFog() {
		if (!this.fog) return; /* Showroom : pas de fog */
		const distance = this.camera.position.distanceTo(this.controls.target);
		this.fog.near = distance * FOG_NEAR_FACTOR;
		this.fog.far = distance * FOG_FAR_FACTOR;
	}

	setGroundStyle(showroom) {
		if (showroom) {
			this.fog = null;
			this.plane.material.alphaMap = this.floorAlpha;
			this.plane.material.transparent = true;
			this.grid.geometry.setAttribute('color', this.gridColorFaded);
			this.grid.material.transparent = true;
		} else {
			this.fog = this.normalFog;
			this.plane.material.alphaMap = null;
			this.plane.material.transparent = false;
			this.grid.geometry.setAttribute('color', this.gridColorSolid);
			this.grid.material.transparent = false;
		}
		this.plane.material.needsUpdate = true;
		this.grid.material.needsUpdate = true;
	}

	radialAlphaTexture() {
		const size = 512;
		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = size;
		const ctx = canvas.getContext('2d');
		const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
		const half = FLOOR_SIZE / 2;
		gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1)');
		gradient.addColorStop(DISC_INNER / half, 'rgba(255, 255, 255, 1)');
		gradient.addColorStop(DISC_OUTER / half, 'rgba(0, 0, 0, 1)');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, size, size);
		return new THREE.CanvasTexture(canvas);
	}

	buildGridColors(grid) {
		const position = grid.geometry.attributes.position;
		const color = grid.geometry.attributes.color;
		const solid = new Float32Array(position.count * 4);
		const faded = new Float32Array(position.count * 4);
		for (let i = 0; i < position.count; ++i) {
			const r = color.getX(i);
			const g = color.getY(i);
			const b = color.getZ(i);
			const distance = Math.hypot(position.getX(i), position.getZ(i));
			let alpha = (DISC_OUTER - distance) / (DISC_OUTER - DISC_INNER);
			alpha = Math.min(1, Math.max(0, alpha));
			solid.set([r, g, b, 1], i * 4);
			faded.set([r, g, b, alpha * alpha], i * 4);
		}
		this.gridColorSolid = new THREE.BufferAttribute(solid, 4);
		this.gridColorFaded = new THREE.BufferAttribute(faded, 4);
		grid.material.vertexColors = true;
		grid.geometry.setAttribute('color', this.gridColorSolid);
	}

	setLights() {
		this.hemLight = new THREE.HemisphereLight(0xffffff, 0x404040, 2);
		this.add(this.hemLight);

		this.light = new THREE.DirectionalLight(0xffffff, 2.5);
		this.light.castShadow = true;
		this.light.position.set(0, 50, 0)

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
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.renderer.shadowMap.enabled = true;
	}

	setControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.maxPolarAngle = Math.PI / 2;
		this.controls.minDistance = 0;
		this.controls.maxDistance = 800;
		this.controls.target = new THREE.Vector3(0, 45, 0);
		this.controls.update();
	}
}
