// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import StateCanvas from '../views/StateCanvas.vue';
import Configuration from '../views/Configuration.vue';
import Inventory from '../views/Inventory.vue';

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
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: Inventory
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
