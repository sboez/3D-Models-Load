import * as THREE from "three";
import GUI from "lil-gui";

const gui = new GUI();

export default class Gui {
   constructor(scene, load, showroom) {
      this.scene = scene;
      this.load = load;
      this.showroom = showroom;

      this.sampleModels = { samples: "Street Car" };
   }

   addGUI(object) {
      const params = {
         posX: 0,
         posY: 0,
         posZ: 0,
         scale: 0,
         scaleX: 0,
         scaleY: 0,
         scaleZ: 0,
         rotY: 0,
         rotX: 0,
         intens: 1,
         color: 0xffffff,
         mode: false,
         turn: false,
         model: () => {
            const input = document.createElement("input");
            input.type = "file";
            input.click();
            input.onchange = (e) => {
               this.remove();
               const file = e.target.files[0];
               this.load.loadFile(file, object);
            };
         },
         remove: () => {
            this.remove();
         },
         reset: () => {
            this.normal();
            this.showroom.setPos();
            this.showroom.setColor();
            this.rotateOn = false;
            this.load.currentModel.position.set(0, 0, 0);
            this.load.currentModel.scale.set(40, 40, 40);
            this.load.currentModel.rotation.set(0, 0, 0);
         },
         randomPos: () => {
            this.showroom.randomPos();
         },
         randomColor: () => {
            this.showroom.randomColor();
         },
      };
      this.setGUI(params);
   }

   showroomMode(params) {
      if (params.mode === false) this.normal();
      else {
         this.scene.background = new THREE.Color(0x000000);
         this.scene.hemLight.visible = false;
         this.scene.light.visible = false;
         this.showroom.turnOn();
      }
   }

   rotate(params) {
      params.turn === true ? (this.rotateOn = true) : (this.rotateOn = false);
   }

   rotateModel() {
      if (this.rotateOn == true) this.load.currentModel.rotation.y += 0.005;
   }

   remove() {
      this.scene.remove(this.load.currentModel);
   }

   normal() {
      this.scene.background = new THREE.Color(0xa0a0a0);
      this.scene.hemLight.visible = true;
      this.scene.light.visible = true;
      this.showroom.turnOff();
   }

   setGUI(params) {
      this.setPosition(params);
      this.setScale(params);
      this.setRotation(params);
      this.setModel(params);
      this.setMode(params);
      gui.add(params, "reset").name("Reset");
   }

   setPosition(params) {
      const folderPos = gui.addFolder("Position");
      folderPos
         .add(params, "posX", -140, 140)
         .name("X")
         .onChange(() => {
            this.load.currentModel.position.x = params.posX;
         });
      folderPos
         .add(params, "posY", -140, 140)
         .name("Y")
         .onChange(() => {
            this.load.currentModel.position.z = params.posY;
         });
      folderPos
         .add(params, "posZ", -140, 140)
         .name("Z")
         .onChange(() => {
            this.load.currentModel.position.y = params.posZ;
         });
   }

   setScale(params) {
      const folderScale = gui.addFolder("Scale");
      folderScale
         .add(params, "scale", -500, 500)
         .name("- / +")
         .onChange(() => {
            this.load.currentModel.scale.x =
               this.load.currentModel.scale.y =
               this.load.currentModel.scale.z =
                  params.scale;
         });
      folderScale
         .add(params, "scaleX", -500, 500)
         .name("X")
         .onChange(() => {
            this.load.currentModel.scale.x = params.scaleX;
         });
      folderScale
         .add(params, "scaleY", -500, 500)
         .name("Y")
         .onChange(() => {
            this.load.currentModel.scale.y = params.scaleY;
         });
      folderScale
         .add(params, "scaleZ", -500, 500)
         .name("Z")
         .onChange(() => {
            this.load.currentModel.scale.z = params.scaleZ;
         });
   }

   setRotation(params) {
      const folderRot = gui.addFolder("Rotation");
      folderRot
         .add(params, "rotY", -5, 5)
         .name("Y")
         .onChange(() => {
            this.load.currentModel.rotation.y = params.rotY;
         });
      folderRot
         .add(params, "rotX", -5, 5)
         .name("X")
         .onChange(() => {
            this.load.currentModel.rotation.x = params.rotX;
         });
   }

   setModel(params) {
      const folderModel = gui.addFolder("Model");
      folderModel
         .add(this.sampleModels, "samples", {
            "Street Car": "./models/gltf/street_car.glb",
            "F1 Car": "./models/gltf/f1_car.glb",
            "Off-Road Truck": "./models/gltf/offroad_truck.glb",
            Motorbike: "./models/gltf/motorbike.glb",
            "Empire State Building": "./models/gltf/empire_state_building.glb",
         })
         .onChange((value) => {
            let path = value;
            this.remove();
            this.load.loadSample(path);
         });
      folderModel.add(params, "model").name("Load your model");
      folderModel.add(params, "remove").name("Remove model");
      folderModel.open();
   }

   setMode(params) {
      const folderMode = gui.addFolder("Mode");
      folderMode
         .add(params, "mode")
         .name("Showroom")
         .onChange(() => {
            this.showroomMode(params);
         });
      folderMode
         .add(params, "turn")
         .name("Rotate")
         .onChange(() => {
            this.rotate(params);
         });
      folderMode
         .addColor(params, "color")
         .name("Color")
         .onChange(() => {
            for (let i = 0; i < this.showroom.spots.length; ++i) {
               this.showroom.spots[i].color.set(params.color);
            }
         });
      folderMode
         .add(params, "intens", 0, 10)
         .name("Intensity")
         .onChange(() => {
            for (let i = 0; i < this.showroom.spots.length; ++i) {
               this.showroom.spots[i].intensity = params.intens;
            }
         });
      folderMode.add(params, "randomPos").name("Random Position");
      folderMode.add(params, "randomColor").name("Random Color");
   }
}
