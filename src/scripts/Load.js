import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';

/*** If you want to add a texture for your .OBJ or .DAE model, you need to add
this lines in the same way of material and change path.
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('assets/texture/image_0.png');
if (child.isMesh) child.material.map = texture; ***/

export default class Load {
	constructor(scene, currentModel) {
		this.scene = scene;
		this.currentModel = currentModel;
		this.reader = new FileReader();
	}

	loadFile(file, object) {
		this.filename = file.name;
		this.extension = this.filename.split('.').pop().toLowerCase();
		this.material = new THREE.MeshPhongMaterial({ color: 0xAAAAAA, specular: 0x111111, shininess: 100 });
		switch (this.extension) {
			case 'glb':
			case 'gltf':
				this.loadGltf(file, object);
				break;
			case 'fbx':
				this.loadFbx(file, object);
				break;
			case 'stl':
				this.loadStl(file, object);
				break;
			case 'dae':
				this.loadDae(file, object);
				break;
			case 'obj':
				this.loadObj(file, object);
				break;
		}
	}

	loadGltf(file, object) {
		this.reader.onload = readerEvent => {
			const contents = readerEvent.target.result;
			const loader = new GLTFLoader()
			try {
				loader.parse(contents, '', gltf => {
					gltf.scene.traverse(child => {
						if (child.isMesh) {
							child.castShadow = true;
							child.receiveShadow = true;
						}
					});
					this.currentModel = gltf.scene;
					this.currentModel.scale.multiplyScalar(100);
					this.scene.add(gltf.scene);
				});
			}
			catch (error) {
				this.errorMessage(this.filename, error);
			}
		}
		this.reader.readAsArrayBuffer(file);
	}

	loadFbx(file, object) {
		this.reader.onload = readerEvent => {
			const contents = readerEvent.target.result;
			const loader = new FBXLoader();
			try {
				object = loader.parse(contents);
			}
			catch (error) {
				this.errorMessage(this.filename, error);
			}
			object.traverse(child => {
				if (child.isMesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
				this.currentModel = object;
				this.scene.add(object);
			});
		}
		this.reader.readAsArrayBuffer(file);
	}

	loadStl(file, object) {
		this.reader.onload = readerEvent => {
			const contents = readerEvent.target.result;
			let geometry;
			try {
				geometry = new STLLoader().parse(contents);
			}
			catch (error) {
				this.errorMessage(this.filename, error);
			}
			object = new THREE.Mesh(geometry, this.material);
			object.traverse(child => {
				object.rotation.set(-Math.PI / 2, -Math.PI * 2, 0);
				this.currentModel = object;
				this.currentModel.scale.multiplyScalar(100);
				this.scene.add(object);
			});
		}
		if (this.reader.readAsBinaryString !== undefined) this.reader.readAsBinaryString(file);
		else this.reader.readAsArrayBuffer(file);
	}

	loadDae(file, object) {
		this.reader.onload = readerEvent => {
			const contents = readerEvent.target.result;
			const loader = new ColladaLoader();
			let collada;
			try {
				collada = loader.parse(contents);
			}
			catch (error) {
				this.errorMessage(this.filename, error);
			}
			object = collada.scene;
			for (var i = 0; i < object.children[0].children.length; ++i) {
				object.children[0].children[i].material = this.material;
			}
			this.currentModel = object;
			this.currentModel.scale.multiplyScalar(100);
			this.scene.add(object);
		}
		this.reader.readAsText(file);
	}

	loadObj(file, object) {
		this.reader.onload = readerEvent => {
			const contents = readerEvent.target.result;
			const loader = new OBJLoader();
			try {
				object = loader.parse(contents);
			}
			catch (error) {
				this.errorMessage(this.filename, error);
			}
			this.currentModel = object;
			this.currentModel.scale.multiplyScalar(100);
			this.scene.add(object);
		}
		this.reader.readAsText(file);
	}

	loadSample(path) {
		return new Promise((resolve) => {
			const loader = new GLTFLoader();
			loader.load(path, gltf => {
				this.currentModel = gltf.scene;
				this.currentModel.traverse(child => {
					if (child.isMesh) {
						child.castShadow = true;
						child.receiveShadow = true;
					}
				});
				this.currentModel.scale.multiplyScalar(40);
				this.scene.add(this.currentModel);
				resolve(this.currentModel);
			});
		});
	}

	errorMessage(filename, error) {
		alert("Your file " + filename + " was not parsed correctly." + "\n\n" + "ERROR MESSAGE : " + error.message);
	}
}
