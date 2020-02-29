let gui = new dat.GUI();

function addGUI(object) {
	var params = {
		posX   : 0,
	    posY   : 0,
	    scaleX : 0,
	    scaleY : 0,
	    scaleZ : 0,
	    rotY   : 0,
	    rotX   : 0,
	    color  : 0xffffff,
	    normal: function() {
	    	scene.background = new THREE.Color(0xa0a0a0);
	    	light.visible = true;
	    	spotLight_left.visible  = false;
			spotLight_right.visible = false;
			spotLight_back.visible  = false;
			spotLight_front.visible = false;
	    },
		showroom: function() {
			scene.background = new THREE.Color(0x000000);
			light.visible = false;
			spotLight_left.visible  = true;
			spotLight_right.visible = true;
			spotLight_back.visible  = true;
			spotLight_front.visible = true;
		},
		reset: function() {
			object.position.set(0, 0, 0);
			object.scale.set(100, 100, 100);
			object.rotation.set(0, 0, 0);
			this.normal();
		},
		model: function() {
			let input = document.createElement('input');
			input.type = 'file';
		    input.click();
			input.onchange = e => { 
				var file = e.target.files[0];
				loadFile(file, object);
			}
		},
		remove: function() {
			scene.remove(object);
		}
	}

	/* POSITION */
	let folderPos = gui.addFolder('Position');
	folderPos.add(params, 'posX', -140, 140).name('X').onChange(function() { 
	    object.position.x = (params.posX);
	});
	folderPos.add(params, 'posY', -140, 140).name('Y').onChange(function() { 
	    object.position.z = (params.posY);
	});
	/* SCALE */
	let folderScale = gui.addFolder('Scale');
	folderScale.add(params, 'scaleX', 50, 300).name('X').onChange(function() { 
	    object.scale.x = (params.scaleX);
	});
	folderScale.add(params, 'scaleY', 50, 300).name('Y').onChange(function() { 
	    object.scale.y = (params.scaleY);
	});
	folderScale.add(params, 'scaleZ', 50, 300).name('Z').onChange(function() { 
	    object.scale.z = (params.scaleZ);
	});
	/* ROTATION */
	let folderRot = gui.addFolder('Rotation');
	folderRot.add(params, 'rotY', -5, 5).name('Y').onChange(function() { 
	    object.rotation.y = (params.rotY);
	});
    folderRot.add(params, 'rotX', -5, 5).name('X').onChange(function() { 
	    object.rotation.x = (params.rotX);
	});
	let folderModel = gui.addFolder('Model');
	folderModel.add(params, 'model').name('Load your model');
	folderModel.add(params, 'remove').name('Remove model');
	/* MODE */
	let folderMode = gui.addFolder('Mode');
	folderMode.add(params, 'normal').name('Interactive');
	folderMode.add(params, 'showroom').name('Showroom');
	folderMode.addColor(params, 'color').name('Color').onChange(function() { 
	    spotLight_left.color.set(params.color);
	    spotLight_right.color.set(params.color);
	    spotLight_front.color.set(params.color);
	    spotLight_back.color.set(params.color);
	});
	gui.add(params, 'reset');
}
