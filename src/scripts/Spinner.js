export default class Spinner {
	constructor() {
		this.injectStyle();
		this.createElement();
	}

	injectStyle() {
		const style = document.createElement('style');
		style.textContent = '@keyframes mml-spin { to { transform: rotate(360deg); } }';
		document.head.appendChild(style);
	}

	createElement() {
		this.el = document.createElement('div');
		Object.assign(this.el.style, {
			position: 'fixed',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			width: '72px',
			height: '72px',
			borderRadius: '50%',
			background: 'rgba(20, 20, 24, 0.55)',
			display: 'none',
			alignItems: 'center',
			justifyContent: 'center',
			zIndex: '1001',
			pointerEvents: 'none',
		});

		const ring = document.createElement('div');
		Object.assign(ring.style, {
			width: '40px',
			height: '40px',
			border: '4px solid rgba(255, 255, 255, 0.25)',
			borderTopColor: '#fff',
			borderRadius: '50%',
			animation: 'mml-spin 0.8s linear infinite',
		});

		this.el.appendChild(ring);
		document.body.appendChild(this.el);
	}

	show() {
		this.el.style.display = 'flex';
	}

	hide() {
		this.el.style.display = 'none';
	}
}
