# 3D-Models-Load

![GitHub stars](https://img.shields.io/github/stars/sboez/3D-Models-Load) ![GitHub](https://img.shields.io/github/license/sboez/3D-Models-Load) <img src="https://img.shields.io/badge/three.js-r185-orange"> <img src="https://img.shields.io/netlify/0ebe41c9-114d-44c6-a8f3-1e9061af7f37">

A browser viewer to inspect 3D assets before production: drag & drop your model, check its stats, tweak material colors, play animations, and show it off in Showroom mode.

## Usage

Try the [live demo](https://3d-models-load.netlify.app/), or run it locally:

```shell
git clone https://github.com/sboez/3D-Models-Load.git
cd 3D-Models-Load
npm install
npm run dev
```

## Features

- **Drag & drop** any supported model straight into the scene
- **Stats panel** — dimensions, triangle & vertex count, materials, textures, file size
- **Material colors** — recolor each material to check how the asset is split
- **Wireframe** mode
- **Animations** — play/pause, scrub the timeline, switch clips, adjust speed
- **Showroom** mode — dramatic multi-spot lighting on a studio floor
- Every model is automatically centered, grounded and normalized to a consistent size

## Supported formats

**.GLTF .GLB .FBX .OBJ .STL .DAE .PLY .3MF**

Multi-file assets work too: drop the model together with its external files (`.bin`, `.mtl`, textures) — just select them all at once.

## Animations

Drop your model and its animation files at the same time. The animation files must share the same skeleton (bone names) as the model. A clip named **Idle** is played first by default when present.

## Roadmap (V2)

- [x] .PLY and .3MF formats
- [x] Drag & drop
- [x] Stats panel
- [x] Wireframe
- [x] Animations
- [ ] Screenshot
- [ ] Export (GLB)

[<img width="700" alt="3D-Models-Load screenshot" src="screenshots/v2.png">](https://3d-models-load.netlify.app/)
