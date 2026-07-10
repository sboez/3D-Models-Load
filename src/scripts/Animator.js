import * as THREE from 'three';

const MIN_CLIP_DURATION = 0.1;

export default class Animator {
	constructor(gui) {
		this.folder = gui.addFolder('🎬 Animation');
		this.clock = new THREE.Clock();
		this.mixer = null;
		this.action = null;
		this.clips = [];
		this.duration = 1;
		this.controllers = [];
		this.params = { clip: 0, play: true, time: 0, speed: 1 };
		this.folder.hide();
	}

	setModel(model) {
		if (this.mixer) this.mixer.stopAllAction();
		this.controllers.forEach(controller => controller.destroy());
		this.controllers = [];
		this.mixer = null;
		this.action = null;
		this.timeController = null;
		this.playController = null;
		this.clipController = null;
		this.clips = ((model && model.userData.animations) || []).filter(clip => clip.duration > MIN_CLIP_DURATION);

		if (!this.clips.length) {
			this.folder.hide();
			return;
		}

		this.model = model;
		this.mixer = new THREE.AnimationMixer(model);
		this.params.play = true;
		this.params.speed = 1;
		this.params.time = 0;

		const idle = this.clips.findIndex(clip => /idle/i.test(clip.name));
		const startIndex = idle >= 0 ? idle : 0;
		this.params.clip = startIndex;
		this.lastClip = startIndex;

		const names = { '⏸ Reset pose': -1 };
		this.clips.forEach((clip, i) => { names[clip.name || `Clip ${i + 1}`] = i; });
		this.clipController = this.folder.add(this.params, 'clip', names).name('Clip')
			.onChange(i => {
				if (i === -1) { this.restPose(); return; }
				this.params.play = true;
				if (this.playController) this.playController.updateDisplay();
				this.playClip(i);
			});
		this.controllers.push(this.clipController);

		this.playController = this.folder.add(this.params, 'play').name('Play')
			.onChange(v => {
				if (v) {
					if (this.action) this.action.paused = false;
					else this.playClip(this.params.clip >= 0 ? this.params.clip : this.lastClip);
				} else if (this.action) {
					this.action.paused = true;
				}
			});
		this.controllers.push(this.playController);

		this.timeController = this.folder.add(this.params, 'time', 0, 1, 0.01).name('Time')
			.onChange(t => this.seek(t));
		this.controllers.push(this.timeController);

		this.controllers.push(
			this.folder.add(this.params, 'speed', 0, 2, 0.05).name('Speed')
				.onChange(s => { this.mixer.timeScale = s; })
		);

		this.playClip(startIndex);
		this.folder.show();
		this.folder.open();
	}

	playClip(index) {
		if (!this.mixer) return;
		const clip = this.clips[index];
		if (!clip) return;

		if (this.action) this.action.stop();
		this.action = this.mixer.clipAction(clip);
		this.action.paused = !this.params.play;
		this.action.play();

		this.duration = clip.duration || 1;
		this.params.time = 0;
		this.params.clip = index;
		this.lastClip = index;
		if (this.clipController) this.clipController.updateDisplay();
		if (this.timeController) {
			this.timeController.max(this.duration);
			this.timeController.updateDisplay();
		}
	}

	seek(time) {
		if (!this.action) return;
		this.params.play = false;
		this.action.paused = true;
		this.action.time = time;
		this.mixer.update(0);
		if (this.playController) this.playController.updateDisplay();
	}

	restPose() {
		if (this.mixer) this.mixer.stopAllAction();
		this.action = null;
		if (this.model) {
			this.model.traverse(child => {
				if (child.isSkinnedMesh && child.skeleton) child.skeleton.pose();
			});
		}
		this.params.play = false;
		this.params.time = 0;
		if (this.clipController) {
			this.params.clip = -1;
			this.clipController.updateDisplay();
		}
		if (this.playController) this.playController.updateDisplay();
		if (this.timeController) this.timeController.updateDisplay();
	}

	update() {
		const delta = this.clock.getDelta();
		if (!this.mixer) return;
		this.mixer.update(delta);

		if (this.action && !this.action.paused && this.timeController) {
			const t = this.duration ? this.action.time % this.duration : 0;
			this.params.time = Math.round(t * 100) / 100;
			this.timeController.updateDisplay();
		}
	}
}
