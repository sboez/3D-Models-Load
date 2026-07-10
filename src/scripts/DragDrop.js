import { MODEL_EXTENSIONS } from './formats';

export default class DragDrop {
	constructor(load) {
		this.load = load;
		this.dragCounter = 0;

		this.createOverlay();
		this.createHint();
		this.bindEvents();
	}

	createHint() {
		this.hint = document.createElement('div');
		this.hint.textContent = '⤓  Drag & drop a 3D file';
		Object.assign(this.hint.style, {
			position: 'fixed',
			bottom: '14px',
			left: '50%',
			transform: 'translateX(-50%)',
			padding: '7px 14px',
			font: '12px system-ui, -apple-system, sans-serif',
			color: '#c8c8cc',
			background: 'rgba(20, 20, 24, 0.6)',
			border: '1px solid rgba(255, 255, 255, 0.08)',
			borderRadius: '999px',
			pointerEvents: 'none',
			userSelect: 'none',
			zIndex: '800',
		});
		document.body.appendChild(this.hint);
	}

	createOverlay() {
		this.overlay = document.createElement('div');
		this.overlay.textContent = 'Drop your 3D file(s) here';
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

			const files = e.dataTransfer.files;
			if (!files.length) return;

			const hasModel = Array.from(files).some(f =>
				MODEL_EXTENSIONS.includes(f.name.split('.').pop().toLowerCase())
			);
			if (!hasModel) {
				alert(`Aucun fichier 3D reconnu.\n\nFormats acceptés : ${MODEL_EXTENSIONS.join(', ')}`);
				return;
			}
			this.load.loadFiles(files);
		});
	}
}
