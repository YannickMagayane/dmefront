import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from './axios';
import './assets/tailwind.css';

const app = createApp(App);

app.config.globalProperties.$axios = axios; // Ajoutez axios aux propriétés globales de l'application

app.use(router).mount('#app');
