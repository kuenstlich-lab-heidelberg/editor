// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import StateCanvas from '../views/StateCanvas.vue';
import Configuration from '../views/Configuration.vue';

const routes = [
  {
    path: '/diagram',
    name: 'diagram',
    component: StateCanvas
  },
  {
    path: '/configuration',
    name: 'configuration',
    component: Configuration
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
