import * as THREE from 'three';

export default class Showroom {
	constructor(scene) {
		this.scene = scene;
		this.spots = [];
		this.setLights();
	}

	setLights() {
		for (let i = 0; i < 4; ++i) {
			const spot = new THREE.SpotLight();
			spot.decay = 0;
			this.spots.push(spot);
			this.scene.add(spot);
		}
		this.setPos();
		this.turnOff();
	}

	setColor() {
		for (let i = 0; i < this.spots.length; ++i) {
			this.spots[i].color.set(0xffffff);
		}
	}

	setPos() {
		this.spots[0].position.set(-100, 10, 0);
		this.spots[1].position.set(100, 10, 0);
		this.spots[2].position.set(0, 10, -150);
		this.spots[3].position.set(0, 70, 150);
	}

	turnOn() {
		for (let i = 0; i < this.spots.length; ++i) {
			this.spots[i].visible = true;
		}
	}

	turnOff() {
		for (let i = 0; i < this.spots.length; ++i) {
			this.spots[i].visible = false;
		}
	}

	randomColor() {
		for (let i = 0; i < 4; ++i) {
			const color = ('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6));
			this.spots[i].color.set(color);
		}
	}
}
