let gui = new dat.GUI();

function addGUI(object, child) {
	var params = {
		posX   : 0,
	    posZ   : 0,
	    scaleX : 0,
	    scaleY : 0,
	    scaleZ : 0,
	    rotY   : 0,
	    rotX   : 0,
	    color  : 0xffffff,
	    normal: function() {
	    	scene.background = new THREE.Color(0xa0a0a0);
	    	light.visible    = true;
	    	spotLight_left.visible  = false;
			spotLight_right.visible = false;
			spotLight_back.visible  = false;
			spotLight_front.visible = false;
			folderLight.visible     = false;
			folderLight.close();
	    },
		showroom: function() {
			scene.background = new THREE.Color(0x000000);
			light.visible    = false;
			spotLight_left.visible  = true;
			spotLight_right.visible = true;
			spotLight_back.visible  = true;
			spotLight_front.visible = true;
			folderLight.open();
		},
		reset: function() {
			object.position.set(0, 0, 0);
			object.scale.set(100, 100, 100);
			object.rotation.set(0, 0, 0);
			this.normal();
		}
	}
	/* POSITION */
	let folderPos = gui.addFolder('Position');
	folderPos.add(params, 'posX', -140, 140).onChange(function() { 
	    object.position.x = (params.posX).listen();
	});
	folderPos.add(params, 'posZ', -140, 140).onChange(function() { 
	    object.position.z = (params.posZ);
	});
	folderPos.open();
	/* SCALE */
	let folderScale = gui.addFolder('Scale');
	folderScale.add(params, 'scaleX', 50, 300).onChange(function() { 
	    object.scale.x = (params.scaleX);
	});
	folderScale.add(params, 'scaleY', 50, 300).onChange(function() { 
	    object.scale.y = (params.scaleY);
	});
	folderScale.add(params, 'scaleZ', 50, 300).onChange(function() { 
	    object.scale.z = (params.scaleZ);
	});
	/* ROTATION */
	let folderRot = gui.addFolder('Rotation');
	folderRot.add(params, 'rotY', -5, 5).onChange(function() { 
	    object.rotation.y = (params.rotY);
	});
    folderRot.add(params, 'rotX', -5, 5).onChange(function() { 
	    object.rotation.x = (params.rotX);
	});
	let folderLight = gui.addFolder('Spotlights color');
	folderLight.addColor(params, 'color').onChange(function() { 
	    spotLight_left.color.set(params.color);
	    spotLight_right.color.set(params.color);
	    spotLight_front.color.set(params.color);
	    spotLight_back.color.set(params.color);
	});
	/* MODE */
	gui.add(params, 'normal');
	gui.add(params, 'showroom');
	gui.add(params, 'reset');
}