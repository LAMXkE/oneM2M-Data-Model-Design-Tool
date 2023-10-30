import { createApp } from "vue";
import App from "./App.vue";
// import { createRouter, createWebHashHistory } from "vue-router";

// import routes from "./route";
import rawDisplayer from "./components/infra/raw-displayer.vue";
// import nestedDraggable from "./components/infra/nested.vue";
// import store from "./store";
// import ElementPlus from "element-plus";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";
// import "element-plus/lib/theme-chalk/index.css";

// const router = createRouter({
//   history: createWebHashHistory("/vue.draggable.next/"),
//   routes
// });

const app = createApp(App)
//   .use(store)
//   .use(router)
//   .use(ElementPlus)
  .component("rawDisplayer", rawDisplayer)
//   .component("nestedDraggable", nestedDraggable);
app.mount("#app");