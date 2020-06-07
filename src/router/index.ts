import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/orbitals',
      name: 'orbitalList',
      component: () => import(/* webpackChunkName: "orbitalList" */ '../views/OrbitalList.vue')
    },
    {
      path: '/',
      name: 'elementList',
      component: () => import(/* webpackChunkName: "nuclideList" */ '../views/ElementList.vue')
    },
    {
      path: '/nuclides',
      name: 'nuclideList',
      component: () => import(/* webpackChunkName: "nuclideList" */ '../views/NuclideList.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
  ]
});

export default router;
