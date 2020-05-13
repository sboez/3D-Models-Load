/*** If you want to add a texture for your .OBJ or .DAE model, you need to add
this lines in the same way of material and change path.

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('assets/texture/image_0.png');
if (child.isMesh) child.material.map = texture; ***/

class LoadInit {
	loadFile(file, filename) {
		this.filename = file.name;
		this.extension = this.filename.split('.').pop().toLowerCase();
		this.material = new THREE.MeshPhongMaterial({ color: 0xAAAAAA, specular: 0x111111, shininess: 100 });
		switch (this.extension) {
			case 'glb':
			case 'gltf': 
				this.loadGltf(file, filename);
				break;
			case 'fbx':
				this.loadFbx(file, filename, object);
				break;
			case 'stl':
				this.loadStl(file, filename, object);
				break;
			case 'dae':
				this.loadDae(file, filename, object);
				break;
			case 'obj':
				this.loadObj(file, filename, object);
				break;
		}
	}

	loadGltf(file, filename) {
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
				errorMessage(this.filename, error);
			}
		}
		reader.readAsArrayBuffer(file);
	}

	loadFbx(file, filename, object) {
		reader.onload = readerEvent => {
			const contents = readerEvent.target.result;
			const loader = new THREE.FBXLoader();
			try {
		    	object = loader.parse(contents);
		    }
		    catch(error) {
		    	errorMessage(this.filename, error);
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

	loadStl(file, filename, object) {
		reader.onload = readerEvent => {
			const contents = readerEvent.target.result;
			let geometry;
			try {
				geometry = new THREE.STLLoader().parse(contents);
			}
			catch (error) {
	        	errorMessage(this.filename, error);
	        }
			object = new THREE.Mesh(geometry, this.material);
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

	loadDae(file, filename, object) {
		reader.onload = readerEvent => {
			const contents = readerEvent.target.result;
			const loader = new THREE.ColladaLoader();
			let collada;
	            try {
	                collada = loader.parse(contents);
	            }
	            catch(error) {
	            	errorMessage(this.filename, error);
	            }
	            object = collada.scene;
	            for (var i = 0; i < object.children[0].children.length; ++i) {
			    	object.children[0].children[i].material = this.material;
			    }
	            currentModel = object;
	            currentModel.scale.multiplyScalar(100);
	            Scene.scene.add(object);
		}	
		reader.readAsText(file);
	}

	loadObj(file, filename, object) {
		reader.onload = readerEvent => {
			const contents = readerEvent.target.result;
			const loader = new THREE.OBJLoader();
			 try {
	            object = loader.parse(contents);
	        }
	        catch (error) {
	        	errorMessage(this.filename, error);
	        }
	        currentModel = object;
			currentModel.scale.multiplyScalar(100);
			Scene.scene.add(object);
		}
		reader.readAsText(file);
	}
	
	loadSample(path) {
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
}
