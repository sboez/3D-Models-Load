class ShowroomInit extends SceneInit {
	constructor(spotLight_left, spotLight_right, spotLight_front, spotLight_back) {
		super();
		this.spotLight_left = spotLight_left;
		this.spotLight_right = spotLight_right;
		this.spotLight_front = spotLight_front;
		this.spotLight_back = spotLight_back;
	}
	createLights() {
		this.spotLight_left = new THREE.SpotLight();
		Scene.scene.add(this.spotLight_left);
		this.spotLight_right = new THREE.SpotLight();
		Scene.scene.add(this.spotLight_right);
		this.spotLight_back = new THREE.SpotLight();
		Scene.scene.add(this.spotLight_back);
		this.spotLight_front = new THREE.SpotLight();
		Scene.scene.add(this.spotLight_front);
		this.setPos();
		this.isOff();
	}
	setColor() {
		this.spotLight_left.color.set(0xffffff);
		this.spotLight_right.color.set(0xffffff);
		this.spotLight_back.color.set(0xffffff);
		this.spotLight_front.color.set(0xffffff);
	}
	setPos() {
		this.spotLight_left.position.set(-100, 10, 0);
		this.spotLight_right.position.set(100, 10, 0);
		this.spotLight_back.position.set(0, 10, -150);
		this.spotLight_front.position.set(0, 70, 150);
	}
	isOn() {
		this.spotLight_left.visible = true;
		this.spotLight_right.visible = true;
		this.spotLight_back.visible = true;
		this.spotLight_front.visible = true;
	}
	isOff() {
    	this.spotLight_left.visible = false;
		this.spotLight_right.visible = false;
		this.spotLight_back.visible = false;
		this.spotLight_front.visible = false;
	}
	randomPos() {
		let x = Math.floor(Math.random() * 90 + 10);
		let y = Math.floor(Math.random() * 90 + 10);
		let z = Math.floor(Math.random() * 90 + 10);
		this.spotLight_left.position.set(y, x, z);
		this.spotLight_right.position.set(z, y, x);
		this.spotLight_front.position.set(x, y, z);
		this.spotLight_back.position.set(x, z, y);
	}
	randomColor() {
	    let c = [];
	    for(let i = 0; i < 4; i++){
	   		c.push('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6));
	    }
		this.spotLight_back.color.set(c[0]);
		this.spotLight_front.color.set(c[1]);
		this.spotLight_left.color.set(c[2]);
		this.spotLight_right.color.set(c[3]);
	}
}
