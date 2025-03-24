<template>
  <div id="app">
    <HelloWorld msg="每日面板"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
:root {
  --visionos-bg-color: rgb(240, 240, 244);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100vh;
  background-color: var(--visionos-bg-color);
  position: relative;
  overflow: hidden;
}
</style>
