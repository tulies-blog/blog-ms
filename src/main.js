import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
// import 'element-ui/lib/theme-chalk/reset.css'
import "@/assets/css/reset.css";
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/css/index.scss";
import router from "@/router/index";
import store from "@/store/index";
import "@/router/permission";

// markdown编辑器
import MavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
Vue.use(MavonEditor);

Vue.config.productionTip = false;
Vue.use(ElementUI, { size: "small" });

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
