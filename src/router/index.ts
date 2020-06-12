import Vue from 'vue';
import VueRouter from 'vue-router';
import ELEMENTS from '@/chem/literals/elements';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'orbitalList',
      component: () => import(/* webpackChunkName: "orbitalList" */ '../views/OrbitalList.vue')
    },
    {
      path: '/elements',
      name: 'elementList',
      component: () => import(/* webpackChunkName: "nuclideList" */ '../views/ElementList.vue')
    },
    {
      path: '/element/:Z',
      props: (route) => {
        let Z: number;
        if (isNaN(+route.params.Z)) {
          Z = ELEMENTS.indexOf(route.params.Z);
        } else {
          Z = +route.params.Z;
        }
        if (Z > 118 || Z < 1) Z = 1;
        return { Z };
      },
      name: 'element',
      component: () => import(/* webpackChunkName: "element" */ '../views/Element.vue')
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
    }
  ]
});

export default router;
