import AlertPopup from "./AlertPopup.vue";
import {Engine} from "babylonjs";
import {CreateScene} from "./graphics";
import AppLayout from "./Layout.vue";

function RunScene() {
  const canvas = document.querySelector("#the-canvas") as HTMLCanvasElement;
  var engine = new Engine(canvas, true);
  const scene = CreateScene(engine, canvas);
  engine.runRenderLoop(() => scene.render());
};

Vue.use(Vuetify);

// Not used in this code yet
Vue.component("alert-popup", AlertPopup);

const app = new AppLayout({vuetify: new Vuetify()});
(app as any).onmounted = RunScene;
app.$mount("#app");

export default "v0.1";
