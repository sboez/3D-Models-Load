const reader = new FileReader();

function loadFile(file, object) {
  	const filename = file.name;
	const extension = filename.split('.').pop().toLowerCase();

	switch (extension) {
		case 'glb':
		case 'gltf': 
			loadGltf(file, object);
			break;
		case 'fbx':
			loadFbx(file, object);
			break;
		case 'obj':
		case 'stl':
		case 'dae':
			alert("This file is not supported yet, only GLB/GLTF or FBX model :-)");
		break;
	}
}

function loadGltf(file, object) {
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
			alert("Your file " + filename + "was not parsed correctly." + "\n\n" + "ERROR MESSAGE : " + error.message);
		}
	}
	reader.readAsArrayBuffer(file);
}

function loadFbx(file, object) {
	reader.onload = readerEvent => {
		const contents = readerEvent.target.result;
		const loader = new THREE.FBXLoader();
		try {
	    	object = loader.parse(contents);
	    }
	    catch(error) {
	    	alert("Your file " + filename + "was not parsed correctly." + "\n\n" + "ERROR MESSAGE : " + error.message);
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
