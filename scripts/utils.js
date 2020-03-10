const sampleModels = {
	"samples": {
		"Street Car": "assets/models/gltf/street_car.glb",
		"F1 Car": "assets/models/gltf/f1_car.glb",
		"Off-Road Truck": "assets/models/gltf/offroad_truck.glb",
		"Motorbike": "assets/models/gltf/motorbike.glb",
		"Empire State Building": "assets/models/gltf/empire_state_building.glb"
	}
};

function errorMessage(filename, error) {
	alert("Your file " + Load.filename + " was not parsed correctly." + "\n\n" + "ERROR MESSAGE : " + error.message);
}

function errorScale(params) {
	if (currentModel.scale.x === 0) {
		params.reset();
		alert("You model has been reset because his size was egal to zero");
	}
}

function rotateModel() {
	if (rotateOn == true) currentModel.rotation.y += 0.005;
}
