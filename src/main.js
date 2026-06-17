import { createApp } from 'vue';
import App from './App.vue';
// I am importing my configured router
import router from './router';

// I import Bulma styles here so they are available globally
import 'bulma/css/bulma.css';

const app = createApp(App);

// I tell my Vue app to use the router
app.use(router);

app.mount('#app');