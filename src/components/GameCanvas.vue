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

const platformsStore = usePlatforms()
const gameStore = useGame();
const enemiesStore = useEnemies()

const animate = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gameStore.applyGravity();
  gameStore.move();
  platformsStore.movePlatforms();
  enemiesStore.moveEnemies();
  gameStore.checkCollisionWithEnemies()
  gameStore.checkEnemyElimination()
  gameStore.draw(ctx);
  requestAnimationFrame(animate);
};

onMounted(() => {
  animate()
  enemiesStore.spawnEnemy()
});
onUnmounted(() => enemiesStore.resetEnemies())
</script>

<style scoped>
canvas {
  border: 1px solid black;
}
</style>
