function loadFile(file, object) {
  	const filename = file.name;
	const extension = filename.split('.').pop().toLowerCase();
	const reader = new FileReader();

	switch (extension) {
		case 'glb':
		case 'gltf': 
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
						scene.add(gltf.scene);
					});
				}
				catch(error) {
					alert("Your file " + filename + "was not parsed correctly." + "\n\n" + "ERROR MESSAGE : " + error.message);
				}
			}
			reader.readAsArrayBuffer(file);
			break;

		case 'fbx':
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
					scene.add(object);
				});
			}
			reader.readAsArrayBuffer(file);
			break;

		case 'obj':
		case 'stl':
		case 'dae':
			alert("This file is not supported yet, only GLB/GLTF or FBX model :-)");
		break;
	}
}
