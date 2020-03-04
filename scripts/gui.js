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
	    normal: function() {
	    	Scene.scene.background = new THREE.Color(0xa0a0a0);
	    	Scene.light.visible = true;
	    	Scene.spotLight_left.visible = false;
			Scene.spotLight_right.visible = false;
			Scene.spotLight_back.visible = false;
			Scene.spotLight_front.visible = false;
	    },
		showroom: function() {
			Scene.scene.background = new THREE.Color(0x000000);
			Scene.light.visible = false;
			Scene.spotLight_left.visible = true;
			Scene.spotLight_right.visible = true;
			Scene.spotLight_back.visible = true;
			Scene.spotLight_front.visible = true;
		},
		reset: function() {
			this.normal();
			currentModel.position.set(0, 0, 0);
			currentModel.scale.set(100, 100, 100);
			currentModel.rotation.set(0, 0, 0);
		},
		model: function() {
			const input = document.createElement('input');
			input.type = 'file';
		    input.click();
			input.onchange = e => { 
			    Scene.scene.remove(currentModel);
				const file = e.target.files[0];
				loadFile(file, object);
			}
		},
		sample: function() {
			
		},
		remove: function() {
			Scene.scene.remove(currentModel);
		}
	}

	/* POSITION */
	const folderPos = gui.addFolder('Position');
	folderPos.add(params, 'posX', -140, 140).name('X').onChange(() => { 
	    currentModel.position.x = (params.posX);
	});
	folderPos.add(params, 'posY', -140, 140).name('Y').onChange(() => { 
	    currentModel.position.z = (params.posY);
	});
	/* SCALE */
	const folderScale = gui.addFolder('Scale');
	folderScale.add(params, 'scaleX', 0, 300).name('X').onChange(() => { 
	    currentModel.scale.x = (params.scaleX);
	});
	folderScale.add(params, 'scaleY', 0, 300).name('Y').onChange(() => { 
	    currentModel.scale.y = (params.scaleY);
	});
	folderScale.add(params, 'scaleZ', 0, 300).name('Z').onChange(() => { 
	    currentModel.scale.z = (params.scaleZ);
	});
	/* ROTATION */
	const folderRot = gui.addFolder('Rotation');
	folderRot.add(params, 'rotY', -5, 5).name('Y').onChange(() => { 
	    currentModel.rotation.y = (params.rotY);
	});
    folderRot.add(params, 'rotX', -5, 5).name('X').onChange(() => { 
	    currentModel.rotation.x = (params.rotX);
	});
	/* MODELS */
	const folderModel = gui.addFolder('Model');
	folderModel.add(params, 'model').name('Load your model');
	folderModel.add(params, 'sample').name('Samples');
	folderModel.add(params, 'remove').name('Remove model');
	/* MODE */
	const folderMode = gui.addFolder('Mode');
	folderMode.add(params, 'normal').name('Interactive');
	folderMode.add(params, 'showroom').name('Showroom');
	folderMode.addColor(params, 'color').name('Color').onChange(() => { 
	    Scene.spotLight_left.color.set(params.color);
	    Scene.spotLight_right.color.set(params.color);
	    Scene.spotLight_front.color.set(params.color);
	    Scene.spotLight_back.color.set(params.color);
	});
	gui.add(params, 'reset');
}
