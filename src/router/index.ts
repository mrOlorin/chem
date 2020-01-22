import Vue from 'vue';
import VueRouter from 'vue-router';
import { RouteConfig } from 'vue-router/types/router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/',
    name: 'nuclideList',
    component: () => import(/* webpackChunkName: "nuclideList" */ '../views/NuclideList.vue'),
  },
  {
    path: '/nuclide/:p-:n',
    name: 'nuclide',
    component: () => import(/* webpackChunkName: "nuclide" */ '../views/Nuclide.vue'),
    props: (route) => ({ p: +route.params.p, n: +route.params.n })
  }
];

const router = new VueRouter({
  routes,
});

export default router;
