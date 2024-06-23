<!-- src/App.vue -->
<template>
  <div>
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/NavbarMenu.vue';

export default {
  name: 'App',
  components: {
    Navbar,
  },
};
</script>

<style scoped>
body {
  font-family: 'Roboto', sans-serif;
}
</style>
