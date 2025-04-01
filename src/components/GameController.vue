<template>
  <div>Press arrow keys to move, Space to jump!</div>
</template>

<script setup lang="ts">
import {useKeyboard} from "../stores/keyboard";
import {onMounted, onUnmounted} from "vue";

const {addKeysListeners, removeKeysListeners} = useKeyboard()

onMounted(() => addKeysListeners());
onUnmounted(() => removeKeysListeners());
</script>

<style scoped>
div {
  font-size: 16px;
  color: #333;
}
</style>
