import {createMemoryHistory, createRouter} from 'vue-router'
import Chat from "../pages/Chat.vue";
import Setting from "../pages/Setting.vue";

const routes = [
    {path: '/', component: Chat},
    {path: '/setting', component: Setting},
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})