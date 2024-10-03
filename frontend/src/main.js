import {createApp} from "vue";
import "./styles.css";
import App from "./App.vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import {router} from "./router/router.js";
import pinia from "./stores/declare-pinia.js";

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.use(pinia)
app.mount("#app");
