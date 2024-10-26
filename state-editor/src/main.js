// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router instance
import store from './store'; // Import your store
import vuetify from './plugins/vuetify'; // Import Vuetify configuration


const app = createApp(App);

app.use(router); 
app.use(store);
app.use(vuetify);

app.mount('#app');
