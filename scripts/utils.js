function errorMessage(filename, error) {
	alert("Your file " + filename + " was not parsed correctly." + "\n\n" + "ERROR MESSAGE : " + error.message);
}

function rotateModel() {
	if (rotateOn == true) currentModel.rotation.y += 0.005;
}
