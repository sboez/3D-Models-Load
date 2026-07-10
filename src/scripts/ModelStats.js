export function computeStats(root) {
	let vertices = 0;
	let triangles = 0;
	let meshes = 0;
	const materials = new Set();
	const materialNames = [];
	const textures = new Set();
	let textureBytes = 0;

	root.traverse(child => {
		if (!child.isMesh || !child.geometry) return;
		meshes++;
		const geometry = child.geometry;
		const position = geometry.attributes.position;
		if (position) vertices += position.count;
		if (geometry.index) triangles += geometry.index.count / 3;
		else if (position) triangles += position.count / 3;

		const mats = Array.isArray(child.material) ? child.material : [child.material];
		for (const mat of mats) {
			if (!mat || materials.has(mat)) continue;
			materials.add(mat);
			materialNames.push(mat.name || mat.type);
			for (const key of Object.keys(mat)) {
				const value = mat[key];
				if (value && value.isTexture && !textures.has(value)) {
					textures.add(value);
					const image = value.image;
					if (image && image.width) textureBytes += image.width * image.height * 4 * 1.33;
				}
			}
		}
	});

	return {
		meshes,
		vertices,
		triangles: Math.round(triangles),
		materials: materialNames,
		textureCount: textures.size,
		textureBytes: Math.round(textureBytes),
	};
}
