const SUPPORTED = ['glb', 'gltf', 'fbx', 'stl', 'dae', 'obj', 'ply', '3mf'];

export default class DragDrop {
	constructor(load) {
		this.load = load;
		this.dragCounter = 0;

		this.createOverlay();
		this.bindEvents();
	}

	createOverlay() {
		this.overlay = document.createElement('div');
		this.overlay.textContent = 'Drop your 3D file here';
		Object.assign(this.overlay.style, {
			position: 'fixed',
			inset: '0',
			display: 'none',
			alignItems: 'center',
			justifyContent: 'center',
			font: '600 24px system-ui, sans-serif',
			color: '#fff',
			background: 'rgba(0, 0, 0, 0.6)',
			border: '4px dashed rgba(255, 255, 255, 0.85)',
			boxSizing: 'border-box',
			zIndex: '1000',
			pointerEvents: 'none',
		});
		document.body.appendChild(this.overlay);
	}

	show() {
		this.overlay.style.display = 'flex';
	}

	hide() {
		this.overlay.style.display = 'none';
	}

	bindEvents() {
		window.addEventListener('dragenter', e => {
			e.preventDefault();
			this.dragCounter++;
			this.show();
		});
		window.addEventListener('dragover', e => e.preventDefault());
		window.addEventListener('dragleave', e => {
			e.preventDefault();
			this.dragCounter--;
			if (this.dragCounter <= 0) {
				this.dragCounter = 0;
				this.hide();
			}
		});
		window.addEventListener('drop', e => {
			e.preventDefault();
			this.dragCounter = 0;
			this.hide();

			const file = e.dataTransfer.files[0];
			if (!file) return;

			const extension = file.name.split('.').pop().toLowerCase();
			if (!SUPPORTED.includes(extension)) {
				alert(`Format ".${extension}" non supporté.\n\nFormats acceptés : ${SUPPORTED.join(', ')}`);
				return;
			}
			this.load.loadFile(file);
		});
	}
}
