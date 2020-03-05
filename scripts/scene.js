class SceneInit {
	constructor(camera, scene, plane, renderer, light, spotLight_left, spotLight_right, spotLight_front, spotLight_back) {
		this.camera = camera;
		this.scene = scene;
		this.plane = plane;
		this.renderer = renderer;
		this.light = light;
		this.spotLight_left = spotLight_left;;
		this.spotLight_right = spotLight_right;
		this.spotLight_front = spotLight_front;
		this.spotLight_back = spotLight_back;;
	}
	createScene() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(250, 180, 280);

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0xa0a0a0);

		this.light = new THREE.HemisphereLight(0xffffff, 0x404040, 1); 
		this.scene.add(this.light);

		this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0xcfcfcf, side: THREE.DoubleSide }));
		this.plane.rotation.x = -Math.PI / 2;
		this.plane.receiveShadow = true;
		this.scene.add(this.plane);
	}
	createRenderer() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
	}
	createShowroomLights() {
		this.spotLight_left = new THREE.SpotLight(0xffffff);
		this.spotLight_left.position.set(-100, 10, 0);
		this.scene.add(this.spotLight_left);
		this.spotLight_left.visible = false;
				
		this.spotLight_right = new THREE.SpotLight(0xffffff);
		this.spotLight_right.position.set(100, 10, 0);
		this.scene.add(this.spotLight_right);
		this.spotLight_right.visible = false;

		this.spotLight_back = new THREE.SpotLight(0xffffff);
		this.spotLight_back.position.set(0, 10, -150);
		this.scene.add(this.spotLight_back);
		this.spotLight_back.visible = false;

		this.spotLight_front = new THREE.SpotLight(0xffffff);
		this.spotLight_front.position.set(0, 70, 150);
		this.scene.add(this.spotLight_front);
		this.spotLight_front.visible = false;
	}
}
