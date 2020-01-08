//====================//
//      VARIABLES     //
//====================//
	var camera, renderer, scene;

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

		let light = new THREE.HemisphereLight(0xffffff, 0x404040, 1); 
		scene.add(light);

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

		window.addEventListener('resize', onWindowResize, false);
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
				console.log(child);
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

	let gui = new dat.GUI();
	function addGUI(object, child) {
		var params = {
			color  : 0xFECA09,
			posX   : 0,
		    posZ   : 0,
		    scaleX : 0,
		    scaleY : 0,
		    scaleZ : 0,
		    rotY   : 0,
		    rotX   : 0,
		};
		/* COLOR */
		let folderSkin = gui.addFolder('Color');
		folderSkin.addColor(params, 'color').onChange(function() { 
		    if (child.name == "SR_Veh_StreetCar_Purple") child.material.color.set(params.color);
		});
		folderSkin.open();
		/* POSITION */
		let folderPos = gui.addFolder('Position');
		folderPos.add(params, 'posX', -140, 140).onChange(function() { 
		    object.position.x = (params.posX);
		});
		folderPos.add(params, 'posZ', -140, 140).onChange(function() { 
		    object.position.z = (params.posZ);
		});
		/* SCALE */
		let folderScale = gui.addFolder('Scale');
		folderScale.add(params, 'scaleX', 50, 300).onChange(function() { 
		    object.scale.x = (params.scaleX);
		});
		folderScale.add(params, 'scaleY', 50, 300).onChange(function() { 
		    object.scale.y = (params.scaleY);
		});
		folderScale.add(params, 'scaleZ', 50, 300).onChange(function() { 
		    object.scale.z = (params.scaleZ);
		});
		/* ROTATION */
		let folderRot = gui.addFolder('Rotation');
		folderRot.add(params, 'rotY', -5, 5).onChange(function() { 
		    object.rotation.y = (params.rotY);
		});
	    folderRot.add(params, 'rotX', -5, 5).onChange(function() { 
		    object.rotation.x = (params.rotX);
		});
	}


//====================//
//      ANIMATION     //
//====================//
	function animate() {
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
	}

letsPlay();