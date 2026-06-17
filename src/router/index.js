import { createRouter, createWebHistory } from 'vue-router';
// I am importing my buttons example page
import ButtonsView from '../pages/ButtonsView.vue';

// I define my application routes here
const routes = [
  {
    path: '/',
    name: 'buttons-example',
    component: ButtonsView
  }
];

// I create and configure my router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;