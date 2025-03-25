import {defineStore} from 'pinia'
import {UNIT, GROUND_LEVEL} from "../helpers/constants";
import {usePlatforms} from "./platforms";
import {useEnemies} from "./enemies";
import useScore from "../composables/useScore";
import useKeyHandler from "../composables/useKeyHandler";
import useUnit from "../composables/useUnit";

export const useGame = defineStore('game', () => {
  const enemiesStore = useEnemies()
  const platformsStore = usePlatforms()

  const {
    x,
    y,
    velocityY,
    isJumping,
    jumpPower,
    gravity,
    move
  } = useUnit()
  const {score, drawScore} = useScore()
  const {keys} = useKeyHandler()

  // Применяем гравитацию
  const applyGravity = (): void => {
    // Проверка столкновения с платформами
    for (const platform of platformsStore.platforms) {
      if (
        y.value + UNIT.height <= platform.y &&
        y.value + UNIT.height + velocityY.value >= platform.y &&
        x.value + UNIT.width > platform.x &&
        x.value < platform.x + platform.width
      ) {
        y.value = platform.y - UNIT.height;
        velocityY.value = 0;
        isJumping.value = false;
        // Двигаемся вместе с платформой, если она движется
        x.value += platform.dx;
        return
      }
    }

    if (isJumping.value) {
      y.value += velocityY.value;
      isJumping.value = false;
    }

    if (y.value + UNIT.height < GROUND_LEVEL) {
      // Если квадрат не на земле, применяем гравитацию
      velocityY.value += gravity;
      y.value += velocityY.value;
    } else {
      // Если квадрат на земле, не двигаем его
      y.value = GROUND_LEVEL - UNIT.height;
      velocityY.value = 0;

      if (isJumping.value) {
        isJumping.value = false;
      }
    }
  };

  // Прыжок
  const jump = (): void => {
    if (!isJumping.value) {
      velocityY.value = jumpPower;
      isJumping.value = true;
    }
  };

  // Рисуем квадрат
  const draw = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = 'blue';
    ctx.fillRect(x.value, y.value, UNIT.width, UNIT.height);

    platformsStore.drawPlatforms(ctx)
    enemiesStore.drawEnemies(ctx)
    drawScore(ctx)
  };

  // Проверка столкновения с врагами
  const checkCollisionWithEnemies = (): void => {
    for (let i = enemiesStore.enemies.length - 1; i >= 0; i--) {
      const enemy = enemiesStore.enemies[i];

      if (!enemy.isAlive) continue;

      const xCollision: boolean = (x.value + UNIT.width) > enemy.x &&
        x.value < (enemy.x + enemy.width)
      const yCollision: boolean = (y.value + UNIT.height) > enemy.y &&
        y.value < (enemy.y + enemy.height)
      const isColliding: boolean = xCollision && yCollision

      if (isColliding) {
        const isJumpingOnEnemy: boolean = y.value + UNIT.height - velocityY.value <= enemy.y;

        if (isJumpingOnEnemy) {
          enemiesStore.enemies.splice(i, 1);
          enemy.isAlive = false;
          velocityY.value = jumpPower / 1.5; // Подпрыгиваем на 50% от обычного прыжка
          score.value += 1;
          continue
        }

        // Столкновение с врагом — перезапуск игры
        reset();
        score.value = 0; // Сброс очков при столкновении
        break;
      }
    }
  };

  const checkEnemyElimination = (): void => {
    for (const enemy of enemiesStore.enemies) {
      if (
        enemy.isAlive
        && x.value + UNIT.width > enemy.x
        && x.value < enemy.x + enemy.width
        && y.value + UNIT.height > enemy.y
        && y.value < enemy.y + enemy.height
      ) {
        enemy.isAlive = false; // Уничтожение врага
        score.value += 100; // Добавляем очки
      }
    }
  };

  const reset = (): void => {
    x.value = UNIT.x;
    y.value = UNIT.y;
    velocityY.value = 0;
    isJumping.value = false;
    enemiesStore.resetEnemies()
  };

  return {
    x,
    y,
    velocityY,
    isJumping,
    keys,
    score,
    move,
    jump,
    applyGravity,
    draw,
    checkCollisionWithEnemies,
    checkEnemyElimination,
    reset
  }
})