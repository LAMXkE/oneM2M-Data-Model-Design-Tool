import { createApp } from "vue";
import App from "./App.vue";
// import { createRouter, createWebHashHistory } from "vue-router";

import rawDisplayer from "./components/infra/raw-displayer.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";

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