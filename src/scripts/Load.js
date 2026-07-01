import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';
import Spinner from './Spinner';
import InfoPanel from './InfoPanel';
import * as THREE from 'three';

const TARGET_SIZE = 100;

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
		this.spinner = new Spinner();
		this.infoPanel = new InfoPanel();
		this.wireframe = false;
	}

	setWireframe(enabled) {
		this.wireframe = enabled;
		if (this.currentModel) this.applyWireframe(this.currentModel);
	}

	applyWireframe(model) {
		model.traverse(child => {
			if (!child.isMesh) return;
			const mats = Array.isArray(child.material) ? child.material : [child.material];
			mats.forEach(mat => { if (mat) mat.wireframe = this.wireframe; });
			child.castShadow = !this.wireframe;
		});
	}

	loadFile(file, object) {
		this.filename = file.name;
		this.extension = this.filename.split('.').pop().toLowerCase();
		this.filesize = file.size;
		this.material = new THREE.MeshPhongMaterial({ color: 0xAAAAAA, specular: 0x111111, shininess: 100 });

		if (this.currentModel) this.scene.remove(this.currentModel);

		this.spinner.show();

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
			case 'ply':
				this.loadPly(file);
				break;
			case '3mf':
				this.load3mf(file);
				break;
			default:
				this.spinner.hide();
		}
	}

	/* normalise n'importe quel objet chargé : ombres, mise à l'échelle sur TARGET_SIZE,
	   recentrage X/Z et base posée sur le sol — quelle que soit sa taille/position d'origine. */
	frameModel(object) {
		object.traverse(child => {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});

		const box = new THREE.Box3().setFromObject(object);
		const size = box.getSize(new THREE.Vector3());
		const center = box.getCenter(new THREE.Vector3());
		const maxDim = Math.max(size.x, size.y, size.z) || 1;
		const factor = TARGET_SIZE / maxDim;

		object.position.sub(center);

		const pivot = new THREE.Group();
		pivot.add(object);
		pivot.scale.setScalar(factor);
		pivot.position.y = (size.y * factor) / 2;

		pivot.userData.home = {
			position: pivot.position.clone(),
			scale: pivot.scale.clone(),
		};

		/* métriques d'origine (avant normalisation) —  pour le panneau de stats */
		pivot.userData.info = {
			filename: this.filename || '',
			extension: this.extension || '',
			size: size.clone(),
			center: center.clone(),
			scaleFactor: factor,
			targetSize: TARGET_SIZE,
			zUpFixed: !!object.userData.zUpFixed,
			fileSize: this.filesize ?? null,
			...this.computeStats(object),
		};

		this.currentModel = pivot;
		this.scene.add(pivot);
		this.applyWireframe(pivot);
		this.spinner.hide();
		this.infoPanel.update(pivot.userData.info);
		return pivot;
	}

	computeStats(root) {
		let vertices = 0;
		let triangles = 0;
		let meshes = 0;
		const materials = new Set();
		const materialNames = [];
		const textures = new Set();
		let textureBytes = 0;

		root.traverse(child => {
			if (!child.isMesh || !child.geometry) return;
			meshes++;
			const geometry = child.geometry;
			const position = geometry.attributes.position;
			if (position) vertices += position.count;
			if (geometry.index) triangles += geometry.index.count / 3;
			else if (position) triangles += position.count / 3;

			const mats = Array.isArray(child.material) ? child.material : [child.material];
			for (const mat of mats) {
				if (!mat || materials.has(mat)) continue;
				materials.add(mat);
				materialNames.push(mat.name || mat.type);
				for (const key of Object.keys(mat)) {
					const value = mat[key];
					if (value && value.isTexture && !textures.has(value)) {
						textures.add(value);
						const image = value.image;
						if (image && image.width) textureBytes += image.width * image.height * 4 * 1.33; /* +mipmaps approx */
					}
				}
			}
		});

		return {
			meshes,
			vertices,
			triangles: Math.round(triangles),
			materials: materialNames,
			textureCount: textures.size,
			textureBytes: Math.round(textureBytes),
		};
	}

	clearModel() {
		if (this.currentModel) this.scene.remove(this.currentModel);
		this.currentModel = null;
		this.infoPanel.update(null);
	}

	rotateBy90(axis) {
		if (!this.currentModel) return;
		this.currentModel.rotation[axis] += Math.PI / 2;
		this.groundModel(this.currentModel);
	}

	groundModel(model) {
		const box = new THREE.Box3().setFromObject(model);
		model.position.y -= box.min.y;
	}

	loadGltf(file, object) {
		this.reader.onload = readerEvent => {
			const contents = readerEvent.target.result;
			const loader = new GLTFLoader();
			try {
				loader.parse(contents, '', gltf => this.frameModel(gltf.scene));
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
			try {
				object = new FBXLoader().parse(contents);
			}
			catch (error) {
				this.errorMessage(this.filename, error);
				return;
			}
			this.frameModel(object);
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
				return;
			}
			object = new THREE.Mesh(geometry, this.material);
			object.rotation.set(-Math.PI / 2, 0, 0);
			object.userData.zUpFixed = true;
			this.frameModel(object);
		}
		if (this.reader.readAsBinaryString !== undefined) this.reader.readAsBinaryString(file);
		else this.reader.readAsArrayBuffer(file);
	}

	loadDae(file, object) {
		this.reader.onload = readerEvent => {
			const contents = readerEvent.target.result;
			let collada;
			try {
				collada = new ColladaLoader().parse(contents);
			}
			catch (error) {
				this.errorMessage(this.filename, error);
				return;
			}
			object = collada.scene;
			for (var i = 0; i < object.children[0].children.length; ++i) {
				object.children[0].children[i].material = this.material;
			}
			this.frameModel(object);
		}
		this.reader.readAsText(file);
	}

	loadObj(file, object) {
		this.reader.onload = readerEvent => {
			const contents = readerEvent.target.result;
			try {
				object = new OBJLoader().parse(contents);
			}
			catch (error) {
				this.errorMessage(this.filename, error);
				return;
			}
			this.frameModel(object);
		}
		this.reader.readAsText(file);
	}

	loadPly(file) {
		this.reader.onload = readerEvent => {
			const contents = readerEvent.target.result;
			let geometry;
			try {
				geometry = new PLYLoader().parse(contents);
			}
			catch (error) {
				this.errorMessage(this.filename, error);
				return;
			}
			geometry.computeVertexNormals();
			const object = new THREE.Mesh(geometry, this.material);
			object.rotation.set(-Math.PI / 2, 0, 0);
			object.userData.zUpFixed = true;
			this.frameModel(object);
		}
		this.reader.readAsArrayBuffer(file);
	}

	load3mf(file) {
		this.reader.onload = readerEvent => {
			const contents = readerEvent.target.result;
			let object;
			try {
				object = new ThreeMFLoader().parse(contents);
			}
			catch (error) {
				this.errorMessage(this.filename, error);
				return;
			}
			object.rotation.set(-Math.PI / 2, 0, 0);
			object.userData.zUpFixed = true;
			this.frameModel(object);
		}
		this.reader.readAsArrayBuffer(file);
	}

	loadSample(path) {
		this.filename = path.split('/').pop();
		this.extension = this.filename.split('.').pop().toLowerCase();
		this.filesize = null;
		this.spinner.show();
		return new Promise((resolve) => {
			new GLTFLoader().load(path, gltf => resolve(this.frameModel(gltf.scene)));
		});
	}

	errorMessage(filename, error) {
		this.spinner.hide();
		alert("Your file " + filename + " was not parsed correctly." + "\n\n" + "ERROR MESSAGE : " + error.message);
	}
}
