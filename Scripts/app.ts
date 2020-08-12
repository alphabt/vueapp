import AppLayout from "./Layout.vue";
import Home from "./Home.vue";
import Babylon from "./Babylon.vue";
import AlertPopup from "./AlertPopup.vue";

Vue.use(Vuetify);
Vue.use(VueRouter);

// Not used in this code yet
Vue.component("alert-popup", AlertPopup);

const routes = [
  {path: "/", component: Home},
  {path: "/babylon", component: Babylon}
];
const router = new VueRouter({ routes });

const app = new AppLayout({vuetify: new Vuetify(), router});
app.$mount("#app");

export default "v0.1";
