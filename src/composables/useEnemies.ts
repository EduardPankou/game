import {ref} from "vue";
import {ENEMIES_DEFAULT_VALUES, SCENE} from "../helpers/constants";
import {IEnemies} from "../types/unit";

const enemies = ref<IEnemies[]>([...ENEMIES_DEFAULT_VALUES]);

export default function useEnemies() {
  const moveEnemies = () => {
    for (const enemy of enemies.value) {
      if (enemy.isAlive) {
        enemy.x += enemy.dx;
        if (enemy.x <= 0 || enemy.x + enemy.width >= SCENE.width) {
          enemy.dx = -enemy.dx;
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
    enemies.value = [...ENEMIES_DEFAULT_VALUES]
  }

  return {
    enemies,
    moveEnemies,
    drawEnemies,
    resetEnemies
  }
}