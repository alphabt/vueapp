<template>
  <canvas id="the-canvas" style="height: 100%; width: 100%"></canvas>
</template>

<script lang="ts">
  import {Component} from "vue-property-decorator";
  import {Color3, Scene, ArcRotateCamera, DirectionalLight, MeshBuilder, Engine, SceneLoader, Mesh, Color4, Vector3, ShadowGenerator} from "babylonjs";
  import {GridMaterial, ShadowOnlyMaterial} from "babylonjs-materials";

  @Component({})
  export default class Babylon extends Vue {

    mounted() {
      const canvas = document.querySelector("#the-canvas") as HTMLCanvasElement;
      var engine = new Engine(canvas, true);
      const scene = this.CreateScene(engine, canvas);
      engine.runRenderLoop(() => scene.render());
    }

    CreateScene(engine: Engine, canvas: HTMLCanvasElement) {
      var scene = new Scene(engine)
      scene.clearColor = new Color4(0.66, 0.66, 0.66, 1);

      var camera = new ArcRotateCamera("Camera", -0.5, 0.8, 200, Vector3.Zero(), scene);
      camera.attachControl(canvas, true)

      var light = new DirectionalLight('light', new Vector3(0.5, -1, 0.75), scene)
      light.intensity = 1;

      var ground = Mesh.CreatePlane('ground', 1000, scene)
      ground.rotation.x = Math.PI / 2
      ground.material = new ShadowOnlyMaterial('mat', scene)
      ground.receiveShadows = true
      ground.position.y = -30;

      var groundPlaneMesh = MeshBuilder.CreateGround("groundPlaneMesh", { width: 200, height: 200, subdivisions: 1 }, scene);
      var gridMaterial = new GridMaterial("gridMaterial", scene);
      gridMaterial.gridRatio = 5;
      gridMaterial.majorUnitFrequency = 10;
      gridMaterial.backFaceCulling = false;
      gridMaterial.opacity = 0.98;
      gridMaterial.mainColor = new Color3(0.5, 0.5, 0.5);
      gridMaterial.lineColor = new Color3(0.5, 0.5, 0.5);
      groundPlaneMesh.material = gridMaterial;
      groundPlaneMesh.position.y = -30;
      groundPlaneMesh.position.z = 60;

      var shadowGenerator = new ShadowGenerator(512, light)
      shadowGenerator.useBlurExponentialShadowMap = true;
      shadowGenerator.blurScale = 2;
      shadowGenerator.setDarkness(0.75);

      SceneLoader.Append("scenes/", "Lighthouse.glb", scene, (scene) => {
        // Make the lighthouse bigger and place on the ground
        const lighthouse = scene.meshes[3];
        lighthouse.scaling = new Vector3(15, 15, 15);
        lighthouse.position.y = -3000;
        lighthouse.position.z = 6000;
        shadowGenerator.addShadowCaster(lighthouse);
      });

      return scene;
    };
  }
</script>
