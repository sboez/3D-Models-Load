//====================//
//      VARIABLES     //
//====================//
	var camera, renderer, scene, state;
	var light, spotLight_left, spotLight_right, spotLight_front, spotLight_back;

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
	function init() {
		let container = document.createElement('div');
		document.body.appendChild(container);

		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
		camera.position.set(250, 180, 280);

		scene = new THREE.Scene();
		scene.background = new THREE.Color(0xa0a0a0);

		let mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(400, 400), new THREE.MeshPhongMaterial({ color: 0xcfcfcf, depthWrite: false }));
		mesh.rotation.x = -Math.PI / 2;
		mesh.receiveShadow = true;
		scene.add(mesh);

		/*** Change the model here to add your ***/
		loadGltf('assets/models/gltf/street_car.glb');

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMap.enabled = true;
		container.appendChild(renderer.domElement);

		let controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.update();

		setLights();

		window.addEventListener('resize', onWindowResize, false);
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

	function loadFbx(path) {
		var loader = new THREE.FBXLoader();
		loader.load(path, function(object) {
			object.traverse( function (child) {
				if (child.isMesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});
			scene.add(object);
		});
	}

	function loadGltf(path) {
		return new Promise((resolve, reject) => {
			let loader = new THREE.GLTFLoader();
			loader.load(path, function(gltf) {
				gltf.scene.traverse(function(child) {
					if (child.isMesh) {
						if (child.name == "SR_Veh_StreetCar_Purple") addGUI(gltf.scene, child);
						child.castShadow = true;
						child.receiveShadow = true;
					}
				});
				/*** Rescale your model if needed ***/
				gltf.scene.scale.set(100,100,100);
				scene.add(gltf.scene);
				return resolve(gltf.scene);
			});
		})
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

//====================//
//      ANIMATION     //
//====================//
	function animate() {
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
	}

letsPlay();