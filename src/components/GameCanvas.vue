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
import {onMounted, onUnmounted, ref} from "vue";
import {usePlatforms} from "../stores/platforms";
import {useEnemies} from "../stores/enemies";
import {useGame} from "../stores/game";
import {SCENE} from "../helpers/constants";

const canvasRef = ref<HTMLCanvasElement | null>(null);

const {movePlatforms} = usePlatforms()
const {
  applyGravity,
  move,
  moveHearts,
  checkHeartCollisions,
  checkCollisionWithEnemies,
  draw
} = useGame();
const {
  moveEnemies,
  spawnEnemy,
  resetEnemies
} = useEnemies()

const animate = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  applyGravity()
  move()
  movePlatforms()
  moveEnemies()
  moveHearts()
  checkHeartCollisions()
  checkCollisionWithEnemies()
  draw(ctx)
  requestAnimationFrame(animate)
};

onMounted(() => {
  animate()
  spawnEnemy()
});
onUnmounted(() => resetEnemies())
</script>

<style scoped>
canvas {
  border: 1px solid black;
}
</style>
