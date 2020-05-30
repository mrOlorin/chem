<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MultiThree from '@/MultiThree';

@Component
export default class App extends Vue {
  public async mounted () {
    MultiThree.init(this.$refs.scene as HTMLCanvasElement);
  }

  public async beforeDestroy () {
    MultiThree.stopRender();
  }
}
</script>
<template>
  <div id="app">
    <canvas ref="scene"/>
    <div id="nav">
      <router-link to="/">Элементы</router-link> |
      <router-link to="/nuclides">Нуклиды</router-link> |
      <router-link to="/about">О</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
