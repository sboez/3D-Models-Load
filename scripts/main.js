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
		camera.position.set(300, 750, 900);

		scene = new THREE.Scene();
		scene.background = new THREE.Color(0xa0a0a0);

		let light = new THREE.AmbientLight(0x404040, 20); 
		light.position.set(0, 10, 0);
		scene.add(light);

		let mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
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

		window.addEventListener('resize', onWindowResize, false);
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