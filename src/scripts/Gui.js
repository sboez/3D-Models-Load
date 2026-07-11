import * as THREE from "three";
import GUI from "lil-gui";
import MaterialColors from "./MaterialColors";
import Animator from "./Animator";

const gui = new GUI();

export default class Gui {
   constructor(scene, load, studio) {
      this.scene = scene;
      this.load = load;
      this.studio = studio;

      this.sampleModels = { samples: "./models/gltf/leia.glb" };
      this.styleGUI();
   }

   applyRealSize(on) {
      if (!this.load.currentModel) return;
      if (on) {
         this.load.setRealSize(true);
         const box = new THREE.Box3().setFromObject(this.load.currentModel);
         this.scene.applyRealSizeView(box);
         this.load.infoPanel.setRealSize(true);
      } else {
         this.load.setRealSize(false);
         this.scene.applyNormalView();
         this.load.infoPanel.setRealSize(false);
      }
      if (this.studioCtrl) this.studioCtrl.enable(!on);
   }

   styleGUI() {
      const style = document.createElement("style");
      style.textContent = `
         .lil-gui {
            --background-color: #202024;
            --text-color: #d8d8dc;
            --title-background-color: #17171b;
            --title-text-color: #ffffff;
            --widget-color: #303036;
            --hover-color: #3b3b42;
            --focus-color: #44444c;
            --number-color: #6cb6ff;
            --string-color: #8fd694;
            --slider-knob-color: #6cb6ff;
            --font-family: system-ui, -apple-system, sans-serif;
         }
         /* action principale mise en avant */
         .lil-gui .controller.gui-primary { background: #26415f; }
         .lil-gui .controller.gui-primary:hover { background: #2f5177; }
         .lil-gui .controller.gui-primary .name { color: #cfe6ff; font-weight: 600; }
      `;
      document.head.appendChild(style);
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
         intens: 2.2,
         color: 0x311649,
         bgIntensity: 1,
         mode: false,
         turn: false,
         wireframe: false,
         realSize: false,
         model: () => {
            const input = document.createElement("input");
            input.type = "file";
            input.multiple = true;
            input.click();
            input.onchange = (e) => {
               this.remove();
               this.load.loadFiles(e.target.files);
            };
         },
         remove: () => {
            this.remove();
         },
         rotX90: () => {
            this.load.rotateBy90("x");
         },
         rotY90: () => {
            this.load.rotateBy90("y");
         },
         rotZ90: () => {
            this.load.rotateBy90("z");
         },
         reset: () => {
            this.normal();
            this.rotateOn = false;
            const model = this.load.currentModel;
            const home = model.userData.home;
            if (home) {
               model.position.copy(home.position);
               model.scale.copy(home.scale);
            } else {
               model.position.set(0, 0, 0);
               model.scale.set(1, 1, 1);
            }
            model.rotation.set(0, 0, 0);

            if (params.realSize) {
               params.realSize = false;
               this.scene.applyNormalView();
               this.load.infoPanel.setRealSize(false);
               if (this.studioCtrl) this.studioCtrl.enable(true);
            }

            params.posX = params.posY = params.posZ = 0;
            params.scale = params.scaleX = params.scaleY = params.scaleZ = 0;
            params.rotX = params.rotY = 0;
            params.turn = false;
            params.mode = false;
            params.color = 0x311649;
            params.bgIntensity = 1;
            this.scene.resetStudioBg();
            this.scene.uBgIntensity.value = 1;
            gui.controllersRecursive().forEach((c) => c.updateDisplay());
         },
         randomColor: () => {
            params.color = Math.floor(Math.random() * 0xffffff);
            this.scene.setStudioBgColor(params.color);
            this.colorCtrl.updateDisplay();
         },
      };
      this.setGUI(params);
   }

   studioMode(params) {
      if (params.mode === false) this.normal();
      else {
         this.scene.backgroundNode = this.scene.studioBgNode;
         this.scene.background = null;
         this.scene.hemLight.visible = false;
         this.scene.light.visible = false;
         this.scene.setGroundStyle(true);
         this.scene.setStudioEnv(true);
         this.showStudioControls(true);
         this.studio.turnOn();
         if (this.realSizeCtrl) this.realSizeCtrl.enable(false);
      }
   }

   rotate(params) {
      this.rotateOn = params.turn;
   }

   rotateModel() {
      if (this.rotateOn && this.load.currentModel) this.load.currentModel.rotation.y += 0.005;
   }

   remove() {
      this.load.clearModel();
   }

   normal() {
      this.scene.backgroundNode = null;
      this.scene.background = this.scene.defaultBackground;
      this.scene.hemLight.visible = true;
      this.scene.light.visible = true;
      this.scene.setGroundStyle(false);
      this.scene.setStudioEnv(false);
      this.showStudioControls(false);
      this.studio.turnOff();
      if (this.realSizeCtrl) this.realSizeCtrl.enable(true);
   }

   setGUI(params) {
      this.setPosition(params);
      this.setScale(params);
      this.setRotation(params);
      this.setModel(params);
      this.setMode(params);
      gui.add(params, "reset").name("Reset");
      gui.add({
         resetCamera: () => {
            const box = params.realSize ? new THREE.Box3().setFromObject(this.load.currentModel) : null;
            this.scene.resetCamera(box);
         },
      }, "resetCamera").name("🎥 Reset camera");

      this.materialColors = new MaterialColors(gui);
      this.load.addLoadListener((model) => this.materialColors.update(model));

      this.animator = new Animator(gui);
      this.load.addLoadListener((model) => this.animator.setModel(model));
      this.load.addLoadListener((model) => {
         if (model && params.realSize) this.applyRealSize(true);
      });

      this.load.addLoadListener((model) => {
         if (model && !this.load.isSample) {
            this.sampleModels.samples = "__custom__";
            this.samplesCtrl.updateDisplay();
         }
      });
   }

   updateAnimation() {
      if (this.animator) this.animator.update();
   }

   setPosition(params) {
      const folderPos = gui.addFolder("📍 Position").close();
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
      const folderScale = gui.addFolder("📏 Scale").close();
      folderScale
         .add(params, "scale", -500, 500)
         .name("- / +")
         .onChange(() => {
            this.load.currentModel.scale.x =
               this.load.currentModel.scale.y =
               this.load.currentModel.scale.z =
                  params.scale;
            this.load.groundModel(this.load.currentModel);
         });
      folderScale
         .add(params, "scaleX", -500, 500)
         .name("X")
         .onChange(() => {
            this.load.currentModel.scale.x = params.scaleX;
            this.load.groundModel(this.load.currentModel);
         });
      folderScale
         .add(params, "scaleY", -500, 500)
         .name("Y")
         .onChange(() => {
            this.load.currentModel.scale.y = params.scaleY;
            this.load.groundModel(this.load.currentModel);
         });
      folderScale
         .add(params, "scaleZ", -500, 500)
         .name("Z")
         .onChange(() => {
            this.load.currentModel.scale.z = params.scaleZ;
            this.load.groundModel(this.load.currentModel);
         });
   }

   setRotation(params) {
      const folderRot = gui.addFolder("🔄 Rotation").close();
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
      folderRot.add(params, "rotX90").name("↻ 90° X");
      folderRot.add(params, "rotY90").name("↻ 90° Y");
      folderRot.add(params, "rotZ90").name("↻ 90° Z");
   }

   setModel(params) {
      const folderModel = gui.addFolder("📦 Model");
      this.samplesCtrl = folderModel
         .add(this.sampleModels, "samples", {
            "Leia": "./models/gltf/leia.glb",
            "Street Car": "./models/gltf/street_car.glb",
            "Custom": "__custom__",
         })
         .onChange((value) => {
            if (value === "__custom__") return;
            this.remove();
            this.load.loadSample(value);
         });
      const loadCtrl = folderModel.add(params, "model").name("⤓ Load your model");
      loadCtrl.domElement.classList.add("gui-primary");
      folderModel.add(params, "remove").name("Remove model");
      folderModel.open();
   }

   setMode(params) {
      const folderMode = gui.addFolder("⚙️ Mode");
      this.realSizeCtrl = folderMode
         .add(params, "realSize")
         .name("📐 Real size")
         .onChange(() => {
            this.applyRealSize(params.realSize);
         });
      folderMode
         .add(params, "wireframe")
         .name("Wireframe")
         .onChange(() => {
            this.load.setWireframe(params.wireframe);
         });
      this.studioCtrl = folderMode
         .add(params, "mode")
         .name("Studio")
         .onChange(() => {
            this.studioMode(params);
         });
      folderMode
         .add(params, "turn")
         .name("Rotate")
         .onChange(() => {
            this.rotate(params);
         });
      this.colorCtrl = folderMode
         .addColor(params, "color")
         .name("Background")
         .onChange(() => {
            this.scene.setStudioBgColor(params.color);
         });
      this.bgIntensCtrl = folderMode
         .add(params, "bgIntensity", 0, 3)
         .name("Bg intensity")
         .onChange(() => {
            this.scene.uBgIntensity.value = params.bgIntensity;
         });
      this.intensCtrl = folderMode
         .add(params, "intens", 1, 10)
         .name("Lights intensity")
         .onChange(() => {
            this.studio.applyIntensity(params.intens);
         });
      this.studio.applyIntensity(params.intens);
      this.randomColorCtrl = folderMode.add(params, "randomColor").name("Random Color");

      this.showStudioControls(false);
   }

   showStudioControls(show) {
      if (!this.colorCtrl) return;
      this.colorCtrl.show(show);
      this.bgIntensCtrl.show(show);
      this.intensCtrl.show(show);
      this.randomColorCtrl.show(show);
   }
}
