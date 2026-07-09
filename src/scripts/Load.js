import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
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
		this.loadListeners = [];
		this.resources = new Map();
		this.resourcesLower = new Map();
		this.manager = new THREE.LoadingManager();
		this.manager.setURLModifier(url => {
			if (url.startsWith('data:')) return url;
			const name = decodeURIComponent(url.split('/').pop().split('\\').pop());
			return this.resources.get(name) || this.resourcesLower.get(name.toLowerCase()) || url;
		});
		this.manager.onError = url => this.resourceError(url);
	}

	loadFiles(files) {
		for (const url of this.resources.values()) URL.revokeObjectURL(url);
		this.resources.clear();
		this.resourcesLower.clear();

		const list = Array.from(files);
		let totalSize = 0;
		for (const file of list) {
			const url = URL.createObjectURL(file);
			this.resources.set(file.name, url);
			this.resourcesLower.set(file.name.toLowerCase(), url);
			totalSize += file.size;
		}

		const modelExt = ['glb', 'gltf', 'fbx', 'stl', 'dae', 'obj', 'ply', '3mf'];
		const modelFiles = list.filter(f => modelExt.includes(f.name.split('.').pop().toLowerCase()));
		if (!modelFiles.length) {
			alert('Aucun fichier 3D reconnu dans la sélection.');
			return;
		}

		this.filesize = totalSize;

		const gltfFiles = modelFiles.filter(f => ['glb', 'gltf'].includes(f.name.split('.').pop().toLowerCase()));
		if (gltfFiles.length > 1) {
			this.loadGltfSet(gltfFiles);
			return;
		}

		this.loadFile(modelFiles[0]);
	}

	loadGltfSet(files) {
		this.loadError = false;
		if (this.currentModel) this.scene.remove(this.currentModel);
		this.spinner.show();

		Promise.all(files.map(file => this.parseGltfFile(file)))
			.then(pairs => {
				const base = pairs.reduce((best, pair) =>
					this.meshCount(pair.gltf.scene) > this.meshCount(best.gltf.scene) ? pair : best
				, pairs[0]);

				const animations = [];
				pairs.forEach(pair => {
					const clips = pair.gltf.animations || [];
					const label = pair.file.name.replace(/\.[^.]+$/, '');
					clips.forEach((clip, i) => {
						clip.name = clips.length > 1 ? `${label} #${i + 1}` : label;
						animations.push(clip);
					});
				});

				this.filename = base.file.name;
				this.extension = this.filename.split('.').pop().toLowerCase();
				this.frameModel(base.gltf.scene, animations);
			})
			.catch(error => this.errorMessage(this.filename || 'model', error, 'gltf'));
	}

	parseGltfFile(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = event => {
				new GLTFLoader(this.manager).parse(
					event.target.result, '',
					gltf => resolve({ file, gltf }),
					error => reject(error)
				);
			};
			reader.onerror = () => reject(new Error(`Cannot read ${file.name}`));
			reader.readAsArrayBuffer(file);
		});
	}

	meshCount(root) {
		let count = 0;
		root.traverse(child => { if (child.isMesh) count++; });
		return count;
	}

	addLoadListener(fn) {
		this.loadListeners.push(fn);
		if (this.currentModel) fn(this.currentModel);
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
		this.loadError = false;
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

	frameModel(object, animations = []) {
		object.traverse(child => {
			if (!child.isMesh) return;
			child.castShadow = true;
			child.receiveShadow = true;
			const mats = Array.isArray(child.material) ? child.material : [child.material];
			mats.forEach(mat => { if (mat) { mat.fog = false; mat.dithering = true; } });
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
		pivot.userData.animations = animations;

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
		this.loadListeners.forEach(fn => fn(pivot));
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
						if (image && image.width) textureBytes += image.width * image.height * 4 * 1.33;
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
		this.loadListeners.forEach(fn => fn(null));
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

	setRealSize(enabled) {
		const model = this.currentModel;
		if (!model) return;
		if (enabled) {
			model.scale.set(1, 1, 1);
			model.position.set(0, 0, 0);
			model.rotation.set(0, 0, 0);
			this.groundModel(model);
		} else {
			const home = model.userData.home;
			if (home) {
				model.position.copy(home.position);
				model.scale.copy(home.scale);
			}
			model.rotation.set(0, 0, 0);
		}
	}

	loadGltf(file, object) {
		this.reader.onload = readerEvent => {
			const contents = readerEvent.target.result;
			const loader = new GLTFLoader(this.manager);
			try {
				loader.parse(
					contents, '',
					gltf => this.frameModel(gltf.scene, gltf.animations),
					error => this.errorMessage(this.filename, error, 'gltf')
				);
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
				object = new FBXLoader(this.manager).parse(contents, '');
			}
			catch (error) {
				this.errorMessage(this.filename, error);
				return;
			}
			this.frameModel(object, object.animations);
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
				collada = new ColladaLoader(this.manager).parse(contents);
			}
			catch (error) {
				this.errorMessage(this.filename, error);
				return;
			}
			object = collada.scene;
			for (var i = 0; i < object.children[0].children.length; ++i) {
				object.children[0].children[i].material = this.material;
			}
			this.frameModel(object, object.animations || []);
		}
		this.reader.readAsText(file);
	}

	loadObj(file, object) {
		this.reader.onload = readerEvent => {
			const contents = readerEvent.target.result;
			const mtlUrl = this.findResource('.mtl');
			if (mtlUrl) {
				new MTLLoader(this.manager).load(
					mtlUrl,
					materials => { materials.preload(); this.parseObj(contents, materials); },
					undefined,
					() => this.parseObj(contents, null)
				);
			} else {
				this.parseObj(contents, null);
			}
		}
		this.reader.readAsText(file);
	}

	parseObj(contents, materials) {
		let object;
		try {
			const loader = new OBJLoader(this.manager);
			if (materials) loader.setMaterials(materials);
			object = loader.parse(contents);
		}
		catch (error) {
			this.errorMessage(this.filename, error);
			return;
		}
		object.traverse(child => {
			if (child.isMesh && child.geometry && !child.geometry.attributes.normal) {
				child.geometry.computeVertexNormals();
			}
		});
		this.frameModel(object);
	}

	findResource(extension) {
		for (const [name, url] of this.resources) {
			if (name.toLowerCase().endsWith(extension)) return url;
		}
		return null;
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
		this.loadError = false;
		this.spinner.show();
		return new Promise((resolve) => {
			new GLTFLoader().load(path, gltf => resolve(this.frameModel(gltf.scene, gltf.animations)));
		});
	}

	errorMessage(filename, error, kind) {
		this.spinner.hide();
		if (this.loadError) return;
		this.loadError = true;
		if (kind === 'gltf') {
			this.missingResourceAlert();
			return;
		}
		alert("Your file " + filename + " was not parsed correctly." + "\n\n" + "ERROR MESSAGE : " + error.message);
	}

	resourceError(url) {
		this.spinner.hide();
		if (this.loadError) return; /* une seule alerte par chargement */
		this.loadError = true;
		const name = url ? decodeURIComponent(url.split('/').pop().split('\\').pop()) : '';
		this.missingResourceAlert(name);
	}

	missingResourceAlert(name) {
		const header = name
			? `Missing external file: "${name}".\n\n`
			: `Missing external file(s).\n\n`;
		alert(
			header +
			`Drop the model together with ALL its files at once (matching filenames):\n` +
			`• .gltf  →  + .bin + textures\n` +
			`• .obj   →  + .mtl + textures\n` +
			`• .dae / .fbx  →  + textures\n\n` +
			`Tip: .glb and .3mf pack everything into a single file.`
		);
	}
}
