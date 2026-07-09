import * as THREE from 'three';

/* Grille infinie métrique adaptative au zoom (façon Blender) :
   - suit la caméra -> illusion d'infini
   - la décade métrique est calculée par pixel et fondue sur 3 niveaux
   - lignes anti-aliasées, cellules sous-pixel effacées
   - fondu à distance */

const vertexShader = `
	out vec3 worldPosition;
	out vec2 vCamXZ;
	uniform float uDistance;
	void main() {
		vec3 pos = position.xzy * uDistance;
		pos.x += cameraPosition.x;
		pos.z += cameraPosition.z;
		worldPosition = pos;
		vCamXZ = cameraPosition.xz; /* passé au fragment (cameraPosition absent en frag) */
		gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
	}
`;

const fragmentShader = `
	in vec3 worldPosition;
	in vec2 vCamXZ;
	out vec4 fragColor;
	uniform vec3 uColor;
	uniform float uDistance;

	float log10(float x) { return log(x) * 0.4342944819; }

	/* couverture anti-aliasée des lignes pour une taille de cellule donnée */
	float gridCoverage(vec2 p, float cell) {
		vec2 coord = p / cell;
		vec2 deriv = max(fwidth(coord), 1e-6);
		vec2 aa = abs(fract(coord - 0.5) - 0.5) / deriv;
		float line = 1.0 - clamp(min(aa.x, aa.y), 0.0, 1.0);
		/* efface les cellules sous-pixel (>~1 case/pixel) -> supprime l'aliasing/points au loin */
		float subpixel = 1.0 - clamp((max(deriv.x, deriv.y) - 0.5) * 2.0, 0.0, 1.0);
		return line * subpixel;
	}

	void main() {
		vec2 p = worldPosition.xz;
		float upp = max(length(dFdx(p)), length(dFdy(p))); /* unités monde par pixel */
		if (upp <= 0.0) discard;

		/* décade métrique adaptée au zoom : ~50px par cellule fine */
		float logI = log10(max(upp * 50.0, 1e-8));
		float f = fract(logI);
		float base = pow(10.0, floor(logI));

		/* 3 décades fondues -> pas de clignotement (la fine sort, la coarse entre) */
		float gS = gridCoverage(p, base);
		float gM = gridCoverage(p, base * 10.0);
		float gL = gridCoverage(p, base * 100.0);
		float alpha = max(max(gS * (1.0 - f), gM), gL * f);

		/* atténuation à distance */
		float dfade = 1.0 - min(distance(vCamXZ, p) / uDistance, 1.0);
		alpha *= pow(dfade, 3.0);

		if (alpha <= 0.001) discard;
		fragColor = vec4(uColor, alpha);
	}
`;

export default class InfiniteGrid extends THREE.Mesh {
	constructor(color = 0x8a8a90) {
		const material = new THREE.ShaderMaterial({
			glslVersion: THREE.GLSL3,
			side: THREE.DoubleSide,
			transparent: true,
			depthWrite: false,
			uniforms: {
				uColor: { value: new THREE.Color(color) },
				uDistance: { value: 1000 },
			},
			vertexShader,
			fragmentShader,
		});
		super(new THREE.PlaneGeometry(2, 2, 1, 1), material);
		this.frustumCulled = false;
		this.visible = false;
	}

	setFade(distance) {
		this.material.uniforms.uDistance.value = distance;
	}
}
