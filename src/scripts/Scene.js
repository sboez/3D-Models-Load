import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import InfiniteGrid from './InfiniteGrid';
import * as THREE from 'three';

const FLOOR_SIZE = 3500;
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
		this.setInfiniteGrid();
		this.setLights();
		this.setRenderer();
		this.setControls();
	}

	setInfiniteGrid() {
		this.infiniteGrid = new InfiniteGrid();
		this.add(this.infiniteGrid);
	}

	setFloor() {
		this.floorAlpha = this.radialAlphaTexture();
		this.plane = new THREE.Mesh(
			new THREE.PlaneGeometry(FLOOR_SIZE, FLOOR_SIZE),
			new THREE.MeshPhongMaterial({ color: 0xcfcfcf, side: THREE.DoubleSide, dithering: true })
		);
		this.plane.rotation.x = -Math.PI / 2;
		this.plane.receiveShadow = true;
		this.add(this.plane);
	}

	updateFog() {
		if (!this.fog) return; /* Showroom : pas de fog */
		const distance = this.camera.position.distanceTo(this.controls.target);
		this.fog.near = distance * FOG_NEAR_FACTOR;
		this.fog.far = distance * FOG_FAR_FACTOR;
	}

	applyRealSizeView(box) {
		if (!this._realSize) {
			this._savedView = {
				position: this.camera.position.clone(),
				target: this.controls.target.clone(),
				min: this.controls.minDistance,
				max: this.controls.maxDistance,
			};
		}

		const size = box.getSize(new THREE.Vector3());
		const center = box.getCenter(new THREE.Vector3());
		const maxDim = Math.max(size.x, size.y, size.z) || 1;

		const dir = new THREE.Vector3().subVectors(this.camera.position, this.controls.target);
		if (dir.lengthSq() < 1e-6) dir.set(75, 57, 175);
		dir.normalize();
		this.camera.position.copy(center).addScaledVector(dir, maxDim * 2.6);
		this.controls.target.copy(center);
		this.controls.minDistance = maxDim * 0.05;
		this.controls.maxDistance = maxDim * 30;
		this.controls.update();

		this.infiniteGrid.setFade(maxDim * 12);
		this.infiniteGrid.visible = true;
		this.plane.visible = false;

		this._realSize = true;
	}

	applyNormalView() {
		this._realSize = false;
		this.infiniteGrid.visible = false;
		this.plane.visible = true;
		if (!this._savedView) return;
		this.camera.position.copy(this._savedView.position);
		this.controls.target.copy(this._savedView.target);
		this.controls.minDistance = this._savedView.min;
		this.controls.maxDistance = this._savedView.max;
		this.controls.update();
		this._savedView = null;
	}

	updateInfiniteGrid() {
		if (!this._realSize) return;
		const distance = this.camera.position.distanceTo(this.controls.target);
		this.infiniteGrid.setFade(distance * 4);
	}

	setGroundStyle(showroom) {
		if (showroom) {
			this.fog = null;
			this.plane.material.alphaMap = this.floorAlpha;
			this.plane.material.transparent = true;
		} else {
			this.fog = this.normalFog;
			this.plane.material.alphaMap = null;
			this.plane.material.transparent = false;
		}
		this.plane.material.needsUpdate = true;
	}

	radialAlphaTexture() {
		const size = 512;
		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = size;
		const ctx = canvas.getContext('2d');
		const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
		gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1)');
		gradient.addColorStop(DISC_INNER / DISC_OUTER, 'rgba(255, 255, 255, 1)');
		gradient.addColorStop(1.0, 'rgba(0, 0, 0, 1)');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, size, size);

		const tex = new THREE.CanvasTexture(canvas);
		tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
		const span = (2 * DISC_OUTER) / FLOOR_SIZE;
		tex.repeat.set(1 / span, 1 / span);
		tex.offset.set(0.5 - 0.5 / span, 0.5 - 0.5 / span);
		return tex;
	}

	setLights() {
		this.hemLight = new THREE.HemisphereLight(0xffffff, 0x404040, 2);
		this.add(this.hemLight);

		this.light = new THREE.DirectionalLight(0xffffff, 2.5);
		this.light.castShadow = true;
		this.light.position.set(0, 50, 0)

		this.light.shadow.mapSize.width = 2048;
		this.light.shadow.mapSize.height = 2048;
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
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
