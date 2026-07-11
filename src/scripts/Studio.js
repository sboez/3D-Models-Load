import * as THREE from 'three';

export default class Studio {
	constructor(scene) {
		this.scene = scene;
		this.spots = [];
		this.weights = [1.0, 0.35, 0.6, 0.6];
		this.setLights();
	}

	setLights() {
		for (let i = 0; i < 4; ++i) {
			const spot = new THREE.SpotLight();
			spot.decay = 0;
			spot.angle = 0.6;
			spot.penumbra = 0.6;
			spot.target.position.set(0, 45, 0);
			this.spots.push(spot);
			this.scene.add(spot);
			this.scene.add(spot.target);
		}

		const key = this.spots[0];
		key.castShadow = true;
		key.shadow.mapSize.set(2048, 2048);
		key.shadow.camera.near = 10;
		key.shadow.camera.far = 800;
		key.shadow.bias = -0.0005;

		this.setPos();
		this.turnOff();
	}

	applyIntensity(base) {
		for (let i = 0; i < this.spots.length; ++i) {
			this.spots[i].intensity = base * this.weights[i];
		}
	}

	setColor() {
		for (let i = 0; i < this.spots.length; ++i) {
			this.spots[i].color.set(0xffffff);
		}
	}

	setPos() {
		this.spots[0].position.set(140, 150, 120);
		this.spots[1].position.set(-130, 110, 90);
		this.spots[2].position.set(-110, 120, -130);
		this.spots[3].position.set(110, 120, -130);
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
