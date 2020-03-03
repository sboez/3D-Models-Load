//====================//
//      VARIABLES     //
//====================// 
	let camera, renderer, scene, state, container, object, currentModel;
	let light, spotLight_left, spotLight_right, spotLight_front, spotLight_back;

//====================//
//         GO         //
//====================//
	function letsPlay() {
		init();
		animate();
	}

//====================//
//   SET UP THREE JS  //
//====================//
	async function init() {
		container = document.createElement('div');
		document.body.appendChild(container);
		document.addEventListener('keydown', onDocumentKeyDown, false);
		window.addEventListener('resize', onWindowResize, false);

		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.set(250, 180, 280);

		scene = new THREE.Scene();
		scene.background = new THREE.Color(0xa0a0a0);

		let mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0xcfcfcf, depthWrite: false }));
		mesh.rotation.x = -Math.PI / 2;
		mesh.receiveShadow = true;
		scene.add(mesh);

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMap.enabled = true;
		container.appendChild(renderer.domElement);

		let controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.update();

		setLights();
		await loadGltf('assets/models/gltf/street_car.glb');
		addGUI(currentModel);
	}

	function loadGltf(path) {
		return new Promise((resolve) => {
			const loader = new THREE.GLTFLoader();
			loader.load(path, function(gltf) {
				gltf.scene.traverse(function(child) {
					if (child.isMesh) {
						child.castShadow = true;
						child.receiveShadow = true;
					}
				});
				currentModel = gltf.scene;
				gltf.scene.scale.set(100,100,100);
				scene.add(gltf.scene);
				resolve(gltf.scene);
			});
		});
	}

	function setLights() {
		light = new THREE.HemisphereLight(0xffffff, 0x404040, 1); 
		scene.add(light);

		spotLight_left = new THREE.SpotLight(0xffffff);
		spotLight_left.position.set(-100, 10, 0);
		scene.add(spotLight_left);
		spotLight_left.visible = false;
				
		spotLight_right = new THREE.SpotLight(0xffffff);
		spotLight_right.position.set(100, 10, 0);
		scene.add(spotLight_right);
		spotLight_right.visible = false;

		spotLight_back = new THREE.SpotLight(0xffffff);
		spotLight_back.position.set(0, 10, -150);
		scene.add(spotLight_back);
		spotLight_back.visible = false;

		spotLight_front = new THREE.SpotLight(0xffffff);
		spotLight_front.position.set(0, 70, 150);
		scene.add(spotLight_front);
		spotLight_front.visible = false;
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

//====================//
//      ANIMATION     //
//====================//
	function onDocumentKeyDown(event, object) {
		let speed = 0.05;
	    let keyCode = event.which;

	    if (keyCode == 87) object.translateY(speed);
	    else if (keyCode == 83) object.translateY(-speed);
	    else if (keyCode == 65) object.rotateZ(-speed);
	    else if (keyCode == 68) object.rotateZ(speed);
	};

	function animate() {
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
	}

letsPlay();