import {defineStore} from 'pinia'
import {ref} from "vue";
import {SCENE, ENEMY_CONFIG} from "../helpers/constants";
import {IEnemy} from "../types/unit";

export const useEnemies = defineStore('enemies', () => {
  const enemies = ref<IEnemy[]>([]);
  let spawnEnemyId: number | null = null

  function getRandomNumber() {
    let num;
    do {
      num = Math.floor(Math.random() * 5) - 2;
    } while (num === 0);
    return num;
  }

  const addEnemy = (): void => {
    enemies.value.push({
      x: Math.random() * SCENE.width + ENEMY_CONFIG.width,
      y: Math.random() * SCENE.height,
      width: ENEMY_CONFIG.width,
      height: ENEMY_CONFIG.height,
      isAlive: true,
      direction: getRandomNumber()
    });
  };

  const spawnEnemy = (): void => {
    spawnEnemyId = setInterval(() => {
      if (enemies.value.length < 3) addEnemy()
    }, 3000)
  }

  const removeEnemies = (): void => {
    if (spawnEnemyId !== null) {
      clearInterval(spawnEnemyId)
    }
    spawnEnemyId = null
  }

  const moveEnemies = () => {
    for (const enemy of enemies.value) {
      if (enemy.isAlive) {
        enemy.x += enemy.direction;
        if (enemy.x <= 0 || enemy.x + enemy.width >= SCENE.width) {
          enemy.direction = -enemy.direction;
        }
      }
    }
  };

  const drawEnemies = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "red";
    for (const enemy of enemies.value) {
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  }

  const resetEnemies = () => {
    enemies.value = []
  }

  return {
    enemies,
    moveEnemies,
    drawEnemies,
    resetEnemies,
    spawnEnemy,
    removeEnemies
  }
})