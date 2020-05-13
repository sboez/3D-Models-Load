class SceneInit {
	createScene() {
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);
		this.camera.position.set(250, 180, 280);

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0xa0a0a0);

		this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({
			color: 0xcfcfcf
		}));
		this.plane.rotation.x = -Math.PI / 2;
		this.plane.receiveShadow = true;
		this.scene.add(this.plane);

		Showroom.createLights();
		this.createLights();
	}

	createLights() {
		this.hemLight = new THREE.HemisphereLight(0xffffff, 0x404040, 1); 
		this.scene.add(this.hemLight);

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
		this.scene.add(this.light);
	}

	createControls() {
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		this.controls.maxPolarAngle = Math.PI / 2;
		this.controls.maxDistance = 2000;
		this.controls.target = new THREE.Vector3(0, 15, 0);
		this.controls.update();
	}

	createRenderer() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
	}
}
