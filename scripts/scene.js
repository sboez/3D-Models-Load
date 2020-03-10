class SceneInit {
	createScene() {
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);
		this.camera.position.set(250, 180, 280);

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0xa0a0a0);

		this.light = new THREE.HemisphereLight(0xffffff, 0x404040, 1); 
		this.scene.add(this.light);

		this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0xcfcfcf, side: THREE.DoubleSide }));
		this.plane.rotation.x = -Math.PI / 2;
		this.plane.receiveShadow = true;
		this.scene.add(this.plane);

		Showroom.createLights();
	}
	createRenderer() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
	}
}
