<template>
  <canvas id="the-canvas" style="height: 100%; width: 100%"></canvas>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import {
  Color3,
  Scene,
  ArcRotateCamera,
  DirectionalLight,
  MeshBuilder,
  Engine,
  SceneLoader,
  Mesh,
  Color4,
  Vector3,
  ShadowGenerator,
  GizmoManager,
  CubeTexture,
  PBRMaterial,
  Texture,
} from "babylonjs";
import * as GUI from "babylonjs-gui";
import { GridMaterial, ShadowOnlyMaterial } from "babylonjs-materials";

@Component({})
export default class Babylon extends Vue {
  mounted() {
    const canvas = document.querySelector("#the-canvas") as HTMLCanvasElement;
    var engine = new Engine(canvas, true);
    const scene = this.CreateScene(engine, canvas);
    engine.runRenderLoop(() => scene.render());
  }

  CreateScene(engine: Engine, canvas: HTMLCanvasElement) {
    /*


    Undo Data Structure







    */
    interface StackElement {
      scope?: string;
      baseObject?: any;
      property?: string;
      to?: any;
      from?: any;
      object?: any;
      fn?: (type?: "from" | "to") => void;
      undo?: () => void;
      redo?: () => void;
    }

    class UndoRedo {
      // Public members
      public static Stack: StackElement[] = [];
      public static CurrentIndex: number = 0;

      public static StackSize: number = 2000;

      public static onUndo: (element: StackElement) => void;
      public static onRedo: (element: StackElement) => void;

      /**
       * Pushes a new element in the stack
       * @param element the element to push in the stack
       */
      public static Push(element: StackElement): void {
        let start =
          this.CurrentIndex === this.Stack.length - 1
            ? this.CurrentIndex + 1
            : this.CurrentIndex;
        if (start < 0) start = 0;

        for (let i = start; i < this.Stack.length; i++) {
          this.Stack.splice(i, 1);
          i--;
        }

        this.Stack.push(element);
        this.CurrentIndex = this.Stack.length - 1;

        if (this.Stack.length > this.StackSize) this.Stack.splice(0, 1);

        // Callback
        element.redo && element.redo();

        // Event
        this.onRedo && this.onRedo(element);
      }

      /**
       * Pops an element from the undo/redo stack
       */
      public static Pop(): void {
        this.Stack.pop();
        if (this.CurrentIndex > 0) this.CurrentIndex--;
      }

      /**
       * Clears the given scope. For example when an extension has been closed
       * @param scope the scope name
       */
      public static ClearScope(scope: string): void {
        for (let i = 0; i < this.Stack.length; i++) {
          const element = this.Stack[i];
          if (element.scope === scope) {
            this.Stack.splice(i, 1);
            i--;
            this.CurrentIndex--;
          }
        }
      }

      /**
       * Clears the undo / redo stack
       */
      public static Clear(): void {
        this.Stack = [];
        this.CurrentIndex = 0;
      }

      /**
       * Undo an action
       */
      public static Undo(): StackElement {
        if (this.Stack.length === 0 || this.CurrentIndex < 0) return null;

        const element = this.Stack[this.CurrentIndex];
        this._SetEffectivePropertyValue(
          element.object,
          element.property,
          element.from
        );

        element.fn && element.fn("from");
        element.undo && element.undo();

        this.CurrentIndex--;

        // Event
        this.onUndo && this.onUndo(element);

        return element;
      }

      /**
       * Redo an action
       */
      public static Redo(): StackElement {
        if (
          this.Stack.length === 0 ||
          this.CurrentIndex >= this.Stack.length - 1
        )
          return;

        if (this.CurrentIndex < this.Stack.length) this.CurrentIndex++;

        const element = this.Stack[this.CurrentIndex];
        this._SetEffectivePropertyValue(
          element.object,
          element.property,
          element.to
        );

        element.fn && element.fn("to");
        element.redo && element.redo();

        // Event
        this.onRedo && this.onRedo(element);

        return element;
      }

      // Sets the given value to the given effective property
      private static _SetEffectivePropertyValue(
        object: any,
        property: string,
        value: any
      ): void {
        if (!property || !object) return;

        const split = property.split(".");

        if (split.length > 1) {
          property = split[split.length - 1];

          for (let i = 0; i < split.length - 1; i++) object = object[split[i]];
        }

        object[property] = value;
      }
    }

    var _gizmoDelta: number = 0;

    /**
     * Adds undo redo
     * @param delta the delta value (from / to)
     * @param axis the moved axis
     */
    let undoRedo = function (axis: "x" | "y" | "z"): void {
      let vector: Vector3 = null;
      vector = gizmoManager.gizmos.positionGizmo.xGizmo.attachedMesh.position;

      // switch (this._gizmoType) {
      //     case GizmoType.POSITION: vector = this.positionGizmo.xGizmo.attachedMesh.position; break;
      //     case GizmoType.ROTATION: vector = this.rotationGizmo.xGizmo.attachedMesh.rotation; break;
      //     case GizmoType.SCALING: vector = this.scalingGizmo.xGizmo.attachedMesh.scaling; break;
      //     default: break;
      // }

      switch (axis) {
        case "x":
          UndoRedo.Push({
            object: vector,
            property: "x",
            from: vector.x - _gizmoDelta,
            to: vector.x,
          });
          break;
        case "y":
          UndoRedo.Push({
            object: vector,
            property: "y",
            from: vector.y - _gizmoDelta,
            to: vector.y,
          });
          break;
        case "z":
          UndoRedo.Push({
            object: vector,
            property: "z",
            from: vector.z - _gizmoDelta,
            to: vector.z,
          });
          break;
      }

      _gizmoDelta = 0;
    };

    document.onkeydown = (e) => {
      if (e.key == "z") {
        UndoRedo.Undo();
      } else if (e.key == "x") {
        UndoRedo.Redo();
      }
    };
    /*
    
    
    
    
    Gizmo
    
    
    
    */

    // var scene = new Scene(engine);
    // scene.clearColor = new Color4(0.66, 0.66, 0.66, 1);

    var scene = new Scene(engine);

    var gizmoManager = new GizmoManager(scene);

    gizmoManager.positionGizmoEnabled = true;
    gizmoManager.rotationGizmoEnabled = false;
    gizmoManager.scaleGizmoEnabled = false;
    gizmoManager.boundingBoxGizmoEnabled = false;

    // gizmoManager.gizmos.positionGizmo.xGizmo.dragBehavior.onDragObservable.add(
    //   (g) => console.log(g)
    // );

    var positionGizmo = gizmoManager.gizmos.positionGizmo;

    // Undo redo
    positionGizmo.xGizmo.dragBehavior.onDragObservable.add(
      (g) => (_gizmoDelta += g.delta.x)
    );
    positionGizmo.yGizmo.dragBehavior.onDragObservable.add(
      (g) => (_gizmoDelta += g.delta.y)
    );
    positionGizmo.zGizmo.dragBehavior.onDragObservable.add(
      (g) => (_gizmoDelta += g.delta.z)
    );

    gizmoManager.gizmos.positionGizmo.xGizmo.dragBehavior.onDragEndObservable.add(
      (g) => undoRedo("x")
    );
    positionGizmo.yGizmo.dragBehavior.onDragEndObservable.add((g) =>
      undoRedo("y")
    );
    positionGizmo.zGizmo.dragBehavior.onDragEndObservable.add((g) =>
      undoRedo("z")
    );

    /*




      Camera + Objects




    */

    var camera = new ArcRotateCamera(
      "Camera",
      -0.5,
      0.8,
      200,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);

    // var camera = new ArcRotateCamera(
    //   "Camera",
    //   -Math.PI / 4,
    //   Math.PI / 2.5,
    //   10,
    //   Vector3.Zero(),
    //   scene
    // );
    // camera.attachControl(canvas, true);
    // camera.minZ = 0.1;

    var light = new DirectionalLight(
      "light",
      new Vector3(0.5, -1, 0.75),
      scene
    );
    light.intensity = 1;

    var ground = Mesh.CreatePlane("ground", 1000, scene);
    ground.rotation.x = Math.PI / 2;
    ground.material = new ShadowOnlyMaterial("mat", scene);
    ground.receiveShadows = true;
    ground.position.y = -30;

    var groundPlaneMesh = MeshBuilder.CreateGround(
      "groundPlaneMesh",
      { width: 200, height: 200, subdivisions: 1 },
      scene
    );
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

    var shadowGenerator = new ShadowGenerator(512, light);
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

    // Create objects
    // var hdrTexture = CubeTexture.CreateFromPrefilteredData(
    //   "textures/environment.dds",
    //   scene
    // );
    // var hdrSkybox = Mesh.CreateBox("hdrSkyBox", 1000.0, scene);
    // hdrSkybox.isPickable = false;
    // var hdrSkyboxMaterial = new PBRMaterial("skyBox", scene);
    // hdrSkyboxMaterial.backFaceCulling = false;
    // hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
    // hdrSkyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    // hdrSkyboxMaterial.microSurface = 1.0;
    // hdrSkyboxMaterial.disableLighting = true;
    // hdrSkybox.material = hdrSkyboxMaterial;
    // hdrSkybox.infiniteDistance = true;
    // var sphereGlass = Mesh.CreateSphere("sphereGlass", 48, 1.0, scene);
    // sphereGlass.translate(new Vector3(1, 0, 0), -3);
    // var sphereMetal = Mesh.CreateSphere("sphereMetal", 48, 1.0, scene);
    // sphereMetal.translate(new Vector3(1, 0, 0), 3);
    // var spherePlastic = Mesh.CreateSphere("spherePlastic", 48, 1.0, scene);
    // spherePlastic.translate(new Vector3(0, 0, 1), -3);
    // var woodPlank = MeshBuilder.CreateBox(
    //   "plane",
    //   { width: 3, height: 0.1, depth: 3 },
    //   scene
    // );
    // var glass = new PBRMaterial("glass", scene);
    // glass.reflectionTexture = hdrTexture;
    // glass.refractionTexture = hdrTexture;
    // glass.linkRefractionWithTransparency = true;
    // glass.indexOfRefraction = 0.52;
    // glass.alpha = 0;
    // glass.microSurface = 1;
    // glass.reflectivityColor = new Color3(0.2, 0.2, 0.2);
    // glass.albedoColor = new Color3(0.85, 0.85, 0.85);
    // sphereGlass.material = glass;
    // var metal = new PBRMaterial("metal", scene);
    // metal.reflectionTexture = hdrTexture;
    // metal.microSurface = 0.96;
    // metal.reflectivityColor = new Color3(0.85, 0.85, 0.85);
    // metal.albedoColor = new Color3(0.01, 0.01, 0.01);
    // sphereMetal.material = metal;
    // var plastic = new PBRMaterial("plastic", scene);
    // plastic.reflectionTexture = hdrTexture;
    // plastic.microSurface = 0.96;
    // plastic.albedoColor = new Color3(0.206, 0.94, 1);
    // plastic.reflectivityColor = new Color3(0.003, 0.003, 0.003);
    // spherePlastic.material = plastic;
    // var wood = new PBRMaterial("wood", scene);
    // wood.reflectionTexture = hdrTexture;
    // wood.environmentIntensity = 1;
    // wood.specularIntensity = 0.3;
    // wood.reflectivityTexture = new Texture("textures/reflectivity.png", scene);
    // wood.useMicroSurfaceFromReflectivityMapAlpha = true;
    // wood.albedoColor = Color3.White();
    // wood.albedoTexture = new Texture("textures/albedo.png", scene);
    // woodPlank.material = wood;

    // Add buttons

    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Undo button
    var button = GUI.Button.CreateSimpleButton("but", "Undo");
    button.width = 0.2;
    button.height = "40px";
    button.width = "100px";
    button.color = "white";
    button.background = "gray";
    button.left = "10px";
    button.top = "10px";
    button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(button);

    button.onPointerClickObservable.add(() => UndoRedo.Undo());

    // Redo button
    var button = GUI.Button.CreateSimpleButton("but", "Redo");
    button.width = 0.2;
    button.height = "40px";
    button.width = "100px";
    button.color = "white";
    button.background = "gray";
    button.left = "120px";
    button.top = "10px";
    button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(button);

    button.onPointerClickObservable.add(() => UndoRedo.Redo());

    return scene;
  }
}
</script>
