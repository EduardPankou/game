<template>
  <GameController/>
  <canvas
    ref="canvasRef"
    :width="SCENE.width"
    :height="SCENE.height"
  />
</template>

<script setup lang="ts">
import GameController from "../components/GameController.vue";
import { onMounted, ref } from "vue";
import useGame from "../composables/useGame";
import usePlatforms from "../composables/usePlatforms";
import useEnemies from "../composables/useEnemies";
import { SCENE } from "../helpers/constants";

const canvasRef = ref<HTMLCanvasElement | null>(null);

// Используем хук для игры
const {
  move,
  applyGravity,
  draw,
  checkCollisionWithEnemies,
  checkEnemyElimination
} = useGame();
const {movePlatforms} = usePlatforms()
const {moveEnemies} = useEnemies()

const animate = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  applyGravity();
  move();
  movePlatforms();
  moveEnemies();
  checkCollisionWithEnemies()
  checkEnemyElimination()
  draw(ctx);
  requestAnimationFrame(animate);
};

onMounted(() => {
  animate(); // Запускаем анимацию при монтировании
});
</script>

<style scoped>
canvas {
  border: 1px solid black;
}
</style>
