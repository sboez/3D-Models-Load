import * as THREE from 'three';

export default class Showroom {
	constructor(scene, spot_left, spot_right, spot_back, spot_front) {
		this.scene = scene;

		this.spots = [
			this.spot_left = spot_left,
			this.spot_right = spot_right,
			this.spot_back = spot_back,
			this.spot_front = spot_front
		];

		this.setLights();
	}

	setLights() {
		for (let i = 0; i < this.spots.length; ++i) {
			this.spots[i] = new THREE.SpotLight();
			this.scene.add(this.spots[i]);
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

	randomPos() {
		let r = [];
		for (let i = 0; i < 4; ++i) {
			r.push(Math.floor(Math.random() * 110));
		}
		this.spots[0].position.set(r[0], r[1], r[2]);
		this.spots[1].position.set(r[1], r[0], r[2]);
		this.spots[2].position.set(r[2], r[1], r[0]);
		this.spots[3].position.set(r[0], r[2], r[1]);
	}

	randomColor() {
		for (let i = 0; i < 4; ++i) {
			const color = ('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6));
			this.spots[i].color.set(color);
		}
	}
}
