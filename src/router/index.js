import { createRouter, createWebHistory } from 'vue-router';
// I am importing my pages here
import ButtonsView from '../pages/ButtonsView.vue';
import RickAndMortyView from '../pages/RickAndMortyView.vue';

// I define my application routes here
const routes = [
  {
    path: '/',
    name: 'buttons-example',
    component: ButtonsView
  },
  {
    path: '/characters',
    name: 'rick-morty',
    component: RickAndMortyView
  }
];

// I create and configure my router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;