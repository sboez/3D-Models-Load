function errorMessage(filename, error) {
	alert("Your file " + filename + " was not parsed correctly." + "\n\n" + "ERROR MESSAGE : " + error.message);
}

function rotateModel() {
	if (rotateOn == true) currentModel.rotation.y += 0.005;
}

function errorScale(params) {
	if (currentModel.scale.x === 0) {
		params.reset();
		alert("You model has been reset because his size was egal to zero");
	}
}
