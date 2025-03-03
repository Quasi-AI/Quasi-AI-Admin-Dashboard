import { createApp } from 'vue';
import App from '@/app.vue';
import router from '@/routes/index'; // ✅ Import your router

const app = createApp(App);

app.use(router); // ✅ Register the router

app.mount('#app'); // Mount the app to the DOM
