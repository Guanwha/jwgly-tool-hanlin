<template>
  <div id="app" class='wrap'>
    <HanlinFlow/>
  </div>
</template>

<script>
import HanlinFlow from './pages/HanlinFlow.vue';

export default {
  name: 'App',
  components: {
    HanlinFlow,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
.wrap {
  max-width: 640px;
  margin: 0 auto;
}
</style>
