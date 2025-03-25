<template>
  <main>
    <GameCanvas/>
  </main>
</template>

<script setup>
import GameCanvas from '@/components/GameCanvas.vue';
</script>

<style>
#app {
  padding: 0;
}
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
}
</style>
