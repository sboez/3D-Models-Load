let gui = new dat.GUI();

let sampleModels = [
	"assets/models/gltf/street_car.glb",
	"assets/models/gltf/motorbike.glb"
]

function addGUI(object) {
	const params = {
		posX   : 0,
	    posY   : 0,
	    scaleX : 0,
	    scaleY : 0,
	    scaleZ : 0,
	    rotY   : 0,
	    rotX   : 0,
	    color  : 0xffffff,
	    mode   : false,
	    turn   : false,
		model: function() {
			const input = document.createElement('input');
			input.type = 'file';
		    input.click();
			input.onchange = e => { 
			    this.remove();
				const file = e.target.files[0];
				loadFile(file, object);
			}
		},
		sample: function() {
		},
		remove: function() {
			Scene.scene.remove(currentModel);
		},
	    normal: function() {
	    	Scene.scene.background = new THREE.Color(0xa0a0a0);
	    	Scene.light.visible = true;
	    	Scene.spotLight_left.visible = false;
			Scene.spotLight_right.visible = false;
			Scene.spotLight_back.visible = false;
			Scene.spotLight_front.visible = false;
	    },
		showroom: function() {
			if (this.mode === false) this.normal();
			else {
				Scene.scene.background = new THREE.Color(0x000000);
				Scene.light.visible = false;
				Scene.spotLight_left.visible = true;
				Scene.spotLight_right.visible = true;
				Scene.spotLight_back.visible = true;
				Scene.spotLight_front.visible = true;
			}
		},
		rotate: function() {
			gui.__folders['Mode'].__controllers[1].__checkbox.checked ? rotateOn = true : rotateOn = false;
		},
		reset: function() {
			this.normal();
			currentModel.position.set(0, 0, 0);
			currentModel.scale.set(100, 100, 100);
			currentModel.rotation.set(0, 0, 0);
		},
		scaleUp: function() {
			currentModel.scale.x += 1;
			currentModel.scale.y += 1;
			currentModel.scale.z += 1;
		},
		scaleDown: function() {
			currentModel.scale.x -= 1;
			currentModel.scale.y -= 1;
			currentModel.scale.z -= 1;
			errorScale(params);
		}
	}
	setGUI(params);
}

function setGUI(params) {
	setPosition(params);
	setScale(params);
	setRotation(params);
	setModel(params);
	setMode(params);
	gui.add(params, 'reset');
}

function setPosition(params) {
	const folderPos = gui.addFolder('Position');
	folderPos.add(params, 'posX', -140, 140).name('X').onChange(() => { 
	    currentModel.position.x = (params.posX);
	});
	folderPos.add(params, 'posY', -140, 140).name('Y').onChange(() => { 
	    currentModel.position.z = (params.posY);
	});
}

function setScale(params) {
	const folderScale = gui.addFolder('Scale');
	folderScale.add(params, 'scaleX', -500, 500).name('X').onChange(() => { 
	    currentModel.scale.x = (params.scaleX);
	});
	folderScale.add(params, 'scaleY', -500, 500).name('Y').onChange(() => { 
	    currentModel.scale.y = (params.scaleY);
	});
	folderScale.add(params, 'scaleZ', -500, 500).name('Z').onChange(() => { 
	    currentModel.scale.z = (params.scaleZ);
	});
	folderScale.add(params, 'scaleUp').name('+');
	folderScale.add(params, 'scaleDown').name('-');
}

function setRotation(params) {
	const folderRot = gui.addFolder('Rotation');
	folderRot.add(params, 'rotY', -5, 5).name('Y').onChange(() => { 
	    currentModel.rotation.y = (params.rotY);
	});
    folderRot.add(params, 'rotX', -5, 5).name('X').onChange(() => { 
	    currentModel.rotation.x = (params.rotX);
	});
}

function setModel(params) {
	const folderModel = gui.addFolder('Model');
	folderModel.add(params, 'model').name('Load your model');
	folderModel.add(params, 'sample').name('Samples');
	folderModel.add(params, 'remove').name('Remove model');
	folderModel.open();
}

function setMode(params) {
	const folderMode = gui.addFolder('Mode');
	folderMode.add(params, 'mode').name('Showroom').onChange(() => {
		params.showroom();
	});
	folderMode.add(params, 'turn').name('Rotate').onChange(() => {
		params.rotate();
	});;
	folderMode.addColor(params, 'color').name('Color').onChange(() => { 
	    Scene.spotLight_left.color.set(params.color);
	    Scene.spotLight_right.color.set(params.color);
	    Scene.spotLight_front.color.set(params.color);
	    Scene.spotLight_back.color.set(params.color);
	});
}
