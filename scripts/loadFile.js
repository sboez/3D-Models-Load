const reader = new FileReader();

function loadFile(file, object) {
	const filename = file.name;
	const extension = filename.split('.').pop().toLowerCase();

	switch (extension) {
		case 'glb':
		case 'gltf': 
			loadGltf(file, filename, object);
			break;
		case 'fbx':
			loadFbx(file, filename, object);
			break;
		case 'stl':
			loadStl(file, filename, object);
			break;
		case 'obj':
		case 'dae':
			alert("This file is not supported yet, only STL, FBX or GLB/GLTF model :-)");
			break;
	}
}

function loadGltf(file, filename, object) {
	reader.onload = readerEvent => {
		const contents = readerEvent.target.result;
		const loader = new THREE.GLTFLoader()
		try {
		    loader.parse(contents, '', function (gltf) {
				gltf.scene.traverse(function(child) {
					if (child.isMesh) {
						child.castShadow = true;
						child.receiveShadow = true;
					}
				});
				currentModel = gltf.scene;
				currentModel.scale.multiplyScalar(100);
				Scene.scene.add(gltf.scene);
			});
		}
		catch(error) {
			errorMessage(filename, error);
		}
	}
	reader.readAsArrayBuffer(file);
}

function loadFbx(file, filename, object) {
	reader.onload = readerEvent => {
		const contents = readerEvent.target.result;
		const loader = new THREE.FBXLoader();
		try {
	    	object = loader.parse(contents);
	    }
	    catch(error) {
	    	errorMessage(filename, error);
	    }
		object.traverse(function(child) {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
			currentModel = object;
			Scene.scene.add(object);
		});
	}
	reader.readAsArrayBuffer(file);
}

function loadStl(file, filename, object) {
	reader.onload = readerEvent => {
		const contents = readerEvent.target.result;
		let material = new THREE.MeshPhongMaterial({ color: 0xAAAAAA, specular: 0x111111, shininess: 200 });
		let geometry;
		try {
			geometry = new THREE.STLLoader().parse(contents);
		}
        catch (error) {
        	errorMessage(filename, error);
        }
        object = new THREE.Mesh(geometry, material);
        object.traverse(function(child) {
			object.rotation.set(-Math.PI / 2, -Math.PI * 2, 0);
	    	currentModel = object;
	    	currentModel.scale.multiplyScalar(100);
			Scene.scene.add(object);
        });
	}
	if (reader.readAsBinaryString !== undefined) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
}

function loadSample(path) {
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
			Scene.scene.add(gltf.scene);
			resolve(gltf.scene);
		});
	});
}
