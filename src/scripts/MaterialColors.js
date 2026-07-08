export default class MaterialColors {
	constructor(gui) {
		this.folder = gui.addFolder('Colors').close();
		this.controllers = [];
	}

	update(model) {
		this.controllers.forEach(controller => controller.destroy());
		this.controllers = [];

		if (!model) {
			this.folder.hide();
			return;
		}

		const seen = new Set();
		const materials = [];
		model.traverse(child => {
			if (!child.isMesh) return;
			const mats = Array.isArray(child.material) ? child.material : [child.material];
			mats.forEach(mat => {
				if (!mat || !mat.color || seen.has(mat)) return;
				seen.add(mat);
				materials.push(mat);
			});
		});

		if (!materials.length) {
			this.folder.hide();
			return;
		}

		materials.forEach((mat, i) => {
			const label = mat.name || `Material ${i + 1}`;
			const proxy = { color: `#${mat.color.getHexString()}` };
			const controller = this.folder
				.addColor(proxy, 'color')
				.name(label)
				.onChange(value => mat.color.set(value));
			this.controllers.push(controller);
		});

		this.folder.show();
	}
}
