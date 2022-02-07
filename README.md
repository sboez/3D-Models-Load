# 3D-Models-Load

![GitHub stars](https://img.shields.io/github/stars/sboez/3D-Models-Load) ![GitHub](https://img.shields.io/github/license/sboez/3D-Models-Load) <img src="https://img.shields.io/badge/three.js-r137.5-orange"> <img src=https://img.shields.io/netlify/0ebe41c9-114d-44c6-a8f3-1e9061af7f37>

Load your 3D model easily in a Three.js scene and enjoy Showroom mode.

## Usage

Enjoy [live demo](https://3d-models-load.netlify.app/) or run locally :

```shell
git clone https://github.com/sboez/3D-Models-Load.git
```

```shell
npm install
```

```shell
npm run dev
```

## Compatible formats

**.STL .DAE .FBX .GLTF .GLB**

## Textures

Only **.GLB** can show you the model with a texture because it's a binary file who contains images. It's also possible with **.FBX**, with Blender you need to check _copy_ in _Path Mode_ during export.
Others need to add texture manually. But you can still change the texture path in the code, follow the procedure explained in the comments.

## Samples

My samples models are lightweight **.GLB**

[<img width="700" alt="Capture d’écran 2020-03-09 à 14 21 10" src="https://user-images.githubusercontent.com/23494780/76219808-b2fdc700-6216-11ea-974f-99a0076f6cf3.png">](https://sboez.github.io/3D-Models-Load/)
