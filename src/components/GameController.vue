<template>
  <div>Press arrow keys to move, Space to jump!</div>
  <div>Your score: {{ score }}!</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import useGame from "../composables/useGame";

// Используем хук для игры
const { keys, score, jump } = useGame();

// Обработчики клавиш
const handleKeyDown = (event: KeyboardEvent) => {
  keys.value[event.key] = true;
  if ([' ', 'ArrowUp'].includes(event.key)) {
    jump(); // Прыжок при нажатии пробела или стрелки вверх
  }
};

const handleKeyUp = (event: KeyboardEvent) => {
  keys.value[event.key] = false;
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
});
</script>

<style scoped>
div {
  font-size: 16px;
  color: #333;
}
</style>
