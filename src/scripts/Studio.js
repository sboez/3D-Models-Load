import * as THREE from 'three';

export default class Studio {
	constructor(scene) {
		this.scene = scene;
		this.lights = [];
		this.baseIntensity = [];
		this.setLights();
	}

	setLights() {
		const hemi = new THREE.HemisphereLight(0xffffff, 0x555555, 3);
		this.scene.add(hemi);

		const front = new THREE.DirectionalLight(0xffffff, 2);
		front.position.set(120, 200, 160);
		this.scene.add(front);

		const back = new THREE.DirectionalLight(0xffffff, 1.4);
		back.position.set(-140, 160, -120);
		this.scene.add(back);

		this.lights = [hemi, front, back];
		this.baseIntensity = [3, 2, 1.4];
		this.turnOff();
	}

	applyIntensity(value) {
		const mult = value / 2;
		for (let i = 0; i < this.lights.length; ++i) {
			this.lights[i].intensity = this.baseIntensity[i] * mult;
		}
	}

	turnOn() {
		for (let i = 0; i < this.lights.length; ++i) this.lights[i].visible = true;
	}

	turnOff() {
		for (let i = 0; i < this.lights.length; ++i) this.lights[i].visible = false;
	}
}
