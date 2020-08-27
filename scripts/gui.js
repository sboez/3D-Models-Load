let gui = new dat.GUI();

function addGUI(object) {
	const params = {
		posX: 0,
	    posY: 0,
	    posZ: 0,
	    scaleX: 0,
	    scaleY: 0,
	    scaleZ: 0,
	    rotY: 0,
	    rotX: 0, 
	    intens: 1,
	    color: 0xffffff,
	    mode: false,
	    turn: false,
		model: function() {
			const input = document.createElement('input');
			input.type = 'file';
		    input.click();
			input.onchange = e => {
			    this.remove();
				const file = e.target.files[0];
				Load.loadFile(file, object);
			}
		},
		remove: function() {
			Scene.scene.remove(currentModel);
		},
	    normal: function() {
	    	Scene.scene.background = new THREE.Color(0xa0a0a0);
	    	Scene.hemLight.visible = true;
	    	Scene.light.visible = true;
	    	Showroom.turnOff();
	    },
		showroom: function() {
			if (this.mode === false) this.normal();
			else {
				Scene.scene.background = new THREE.Color(0x000000);
				Scene.hemLight.visible = false;
				Scene.light.visible = false;
				Showroom.turnOn();
			}
		},
		rotate: function() {
			this.turn == true ? rotateOn = true : rotateOn = false;
		},
		reset: function() {
			this.normal();
	    	Showroom.setPos();
	    	Showroom.setColor();
			rotateOn = false;
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
		},
		randomPos: function() {
			Showroom.randomPos();
		},
		randomColor: function() {
			Showroom.randomColor();
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
	gui.add(params, 'reset').name('Reset');
}

function setPosition(params) {
	const folderPos = gui.addFolder('Position');
	folderPos.add(params, 'posX', -140, 140).name('X').onChange(() => { 
	    currentModel.position.x = (params.posX);
	});
	folderPos.add(params, 'posY', -140, 140).name('Y').onChange(() => { 
	    currentModel.position.z = (params.posY);
	});
	folderPos.add(params, 'posZ', -140, 140).name('Z').onChange(() => { 
	    currentModel.position.y = (params.posZ);
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
	let dropdown = folderModel.add(sampleModels, 'samples', sampleModels.samples).onChange((value) => {
		let path = value;
		params.remove();
		Load.loadSample(path);
	});
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
	});
	folderMode.addColor(params, 'color').name('Color').onChange(() => { 
		for (let i = 0; i < Showroom.spots.length; ++i) {
			Showroom.spots[i].color.set(params.color);
		}
	});
	folderMode.add(params, 'intens', 0, 10).name('Intensity').onChange(() => {
		for (let i = 0; i < Showroom.spots.length; ++i) {
			Showroom.spots[i].intensity = params.intens;
		}
	});
	folderMode.add(params, 'randomPos').name('Random Position');
	folderMode.add(params, 'randomColor').name('Random Color');
}
