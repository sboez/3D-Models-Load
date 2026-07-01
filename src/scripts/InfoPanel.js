export default class InfoPanel {
	constructor() {
		this.createElement();
	}

	createElement() {
		this.el = document.createElement('div');
		Object.assign(this.el.style, {
			position: 'fixed',
			top: '12px',
			left: '12px',
			minWidth: '190px',
			padding: '12px 14px',
			font: '12px/1.6 system-ui, -apple-system, sans-serif',
			color: '#e8e8ea',
			background: 'rgba(20, 20, 24, 0.72)',
			border: '1px solid rgba(255, 255, 255, 0.08)',
			borderRadius: '8px',
			zIndex: '900',
			display: 'none',
			pointerEvents: 'none',
			userSelect: 'none',
		});
		document.body.appendChild(this.el);
	}

	format(n) {
		if (!isFinite(n)) return '—';
		const abs = Math.abs(n);
		if (abs === 0) return '0';
		if (abs >= 1000) return n.toFixed(0);
		if (abs >= 1) return n.toFixed(2);
		return parseFloat(n.toPrecision(3)).toString();
	}

	int(n) {
		return Number(n).toLocaleString('en-US');
	}

	bytes(n) {
		if (n == null || !isFinite(n)) return '—';
		if (n < 1024) return `${n} B`;
		if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
		return `${(n / 1024 / 1024).toFixed(1)} MB`;
	}

	escape(str) {
		return String(str).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
	}

	row(label, value) {
		return `<div style="display:flex;justify-content:space-between;gap:16px">
			<span style="opacity:.55">${label}</span><span>${value}</span></div>`;
	}

	divider() {
		return `<div style="height:1px;background:rgba(255,255,255,0.08);margin:8px 0"></div>`;
	}

	update(info) {
		if (!info) {
			this.el.style.display = 'none';
			return;
		}

		const s = info.size;
		const dims = `${this.format(s.x)} × ${this.format(s.y)} × ${this.format(s.z)}`;
		const maxDim = Math.max(s.x, s.y, s.z);

		const transform = [
			this.row('Size', dims),
			this.row('Max dim', this.format(maxDim)),
			this.row('Normalized', `×${this.format(info.scaleFactor)} → ${info.targetSize}u`),
			this.row('Transform', 'recentered + grounded'),
		];
		if (info.zUpFixed) transform.push(this.row('Axis', 'Z-up → Y-up'));

		const textures = info.textureCount
			? `${info.textureCount} · ${this.bytes(info.textureBytes)}`
			: '0';
		const stats = [
			this.row('Meshes', this.int(info.meshes)),
			this.row('Vertices', this.int(info.vertices)),
			this.row('Triangles', this.int(info.triangles)),
			this.row('Materials', this.int(info.materials.length)),
			this.row('Textures', textures),
			this.row('File', this.bytes(info.fileSize)),
		];

		let materialList = '';
		if (info.materials.length) {
			let names = info.materials.join(', ');
			if (names.length > 60) names = names.slice(0, 57) + '…';
			materialList = `<div style="opacity:.4;font-size:11px;margin-top:2px">${this.escape(names)}</div>`;
		}

		const name = this.escape(info.filename || 'model');
		const ext = this.escape((info.extension || '').toUpperCase());

		this.el.innerHTML =
			`<div style="font-weight:600;margin-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px">
				${name} <span style="opacity:.5;font-weight:400">${ext}</span>
			</div>` +
			transform.join('') +
			this.divider() +
			stats.join('') +
			materialList;
		this.el.style.display = 'block';
	}
}
