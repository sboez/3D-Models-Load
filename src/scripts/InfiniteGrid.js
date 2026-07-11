import * as THREE from 'three';
import {
	Fn, vec2, vec3, float, uniform,
	positionGeometry, positionWorld, cameraPosition,
	fract, floor, pow, log, abs, clamp, min, max, length, distance, fwidth, dFdx, dFdy,
} from 'three/tsl';

/* Grille infinie metrique adaptative au zoom (facon Blender), portee en TSL :
   - suit la camera -> illusion d'infini
   - la decade metrique est calculee par pixel et fondue sur 3 niveaux
   - lignes anti-aliasees, cellules sous-pixel effacees
   - fondu a distance */

export default class InfiniteGrid extends THREE.Mesh {
	constructor(color = 0x383838) {
		const uColor = uniform(new THREE.Color(color));
		const uDistance = uniform(1000);

		const material = new THREE.NodeMaterial();
		material.side = THREE.DoubleSide;
		material.transparent = true;
		material.depthWrite = false;

		/* le plan suit la camera en XZ et couvre +/- uDistance */
		material.positionNode = vec3(
			positionGeometry.x.mul(uDistance).add(cameraPosition.x),
			0,
			positionGeometry.y.mul(uDistance).add(cameraPosition.z),
		);

		/* couverture anti-aliasee des lignes pour une taille de cellule donnee */
		const gridCoverage = Fn(([p, cell]) => {
			const coord = p.div(cell);
			const deriv = max(fwidth(coord), vec2(1e-6));
			const aa = abs(fract(coord.sub(0.5)).sub(0.5)).div(deriv);
			const line = float(1).sub(clamp(min(aa.x, aa.y), 0, 1));
			const subpixel = float(1).sub(clamp(max(deriv.x, deriv.y).sub(0.5).mul(2), 0, 1));
			return line.mul(subpixel);
		});

		const alphaNode = Fn(() => {
			const p = positionWorld.xz;
			const upp = max(length(dFdx(p)), length(dFdy(p)));

			/* decade metrique adaptee au zoom : ~50px par cellule fine */
			const logI = log(max(upp.mul(50), 1e-8)).mul(0.4342944819);
			const f = fract(logI);
			const base = pow(10, floor(logI));

			/* 3 decades fondues -> pas de clignotement */
			const gS = gridCoverage(p, base);
			const gM = gridCoverage(p, base.mul(10));
			const gL = gridCoverage(p, base.mul(100));
			const grid = max(max(gS.mul(float(1).sub(f)), gM), gL.mul(f));

			/* attenuation a distance */
			const dfade = float(1).sub(min(distance(cameraPosition.xz, p).div(uDistance), 1));
			return grid.mul(pow(dfade, 3));
		});

		material.colorNode = uColor;
		material.opacityNode = alphaNode();

		super(new THREE.PlaneGeometry(2, 2, 1, 1), material);
		this.frustumCulled = false;
		this.visible = false;
		this._uDistance = uDistance;
	}

	setFade(distance) {
		this._uDistance.value = distance;
	}
}
