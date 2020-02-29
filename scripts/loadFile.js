function loadFile(file, object) {
  	let filename = file.name;
	let extension = filename.split('.').pop().toLowerCase();
	const reader = new FileReader();

	switch (extension) {
		case 'glb':
		case 'gltf': 
			scene.remove(object);
			console.log("Model was removed !");
			console.log("Object in the scene : ", object);
			reader.onload = readerEvent => {
		   		let contents = readerEvent.target.result;
		      	let loader = new THREE.GLTFLoader();

		      	try {
				    loader.parse(contents, '', function (gltf) {
						gltf.scene.traverse(function(child) {
							if (child.isMesh) {
								child.castShadow = true;
								child.receiveShadow = true;
							}
						});
						console.log("model added : ", gltf.scene);
						gltf.scene = object;
						object.scale.multiplyScalar(1);
						scene.add(object);
						console.log("New object in the scene : ", object);
					});
					console.log("New model is here !");
				}
				catch(error) {
					alert("Your file " + filename + "was not parsed correctly." + "\n\n" + "ERROR MESSAGE : " + error.message);
				}
			}
			reader.readAsArrayBuffer(file);
			break;

		case 'fbx':
			scene.remove(object);
			console.log("Model was removed !");
			reader.onload = readerEvent => {
				let contents = readerEvent.target.result;t
				let loader = new THREE.FBXLoader();
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
					scene.add(object);
				});
				console.log("New model is here !");
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