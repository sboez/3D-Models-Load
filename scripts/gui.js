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
	    normal: () => {
	    	scene.background = new THREE.Color(0xa0a0a0);
	    	light.visible = true;
	    	spotLight_left.visible = false;
			spotLight_right.visible = false;
			spotLight_back.visible = false;
			spotLight_front.visible = false;
	    },
		showroom: () => {
			scene.background = new THREE.Color(0x000000);
			light.visible = false;
			spotLight_left.visible = true;
			spotLight_right.visible = true;
			spotLight_back.visible = true;
			spotLight_front.visible = true;
		},
		reset: () => {
			object.position.set(0, 0, 0);
			object.scale.set(100, 100, 100);
			object.rotation.set(0, 0, 0);
			this.normal();
		},
		model: () => {
			const input = document.createElement('input');
			input.type = 'file';
		    input.click();
			input.onchange = e => { 
			    scene.remove(currentModel);
				const file = e.target.files[0];
				loadFile(file, object);
			}
		},
		sample: () => {
			
		},
		remove: () => {
			scene.remove(currentModel);
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
	    spotLight_left.color.set(params.color);
	    spotLight_right.color.set(params.color);
	    spotLight_front.color.set(params.color);
	    spotLight_back.color.set(params.color);
	});
	gui.add(params, 'reset');
}
