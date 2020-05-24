import Vue from 'vue';
import Vuex from 'vuex';
import Particles from '@/store/Particles';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    Particles
  }
});
export default store;
