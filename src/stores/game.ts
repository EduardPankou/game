import {defineStore} from 'pinia'
import {UNIT, GROUND_LEVEL} from "../helpers/constants";
import {usePlatforms} from "./platforms";
import {useEnemies} from "./enemies";
import useScore from "../composables/useScore";
import useKeyHandler from "../composables/useKeyHandler";
import useHero from "../composables/useHero";
import useFallingStuff from "../composables/useFallingStuff";
import useBackground from "../composables/useBackground";

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
    hp,
    move,
    drawHero,
    drawHp,
    resetStats,
    resetHero
  } = useHero()
  const {score, drawScore} = useScore()
  const {keys} = useKeyHandler()
  const {drawBackground, updateBackground} = useBackground({image: 'background.webp'})
  const {
    hearts,
    moveHearts,
    drawStuff
  } = useFallingStuff()

  // Применяем гравитацию
  const applyGravity = (): void => {
    // Проверка столкновения с платформами
    for (const platform of platformsStore.platforms) {
      const isColliding: boolean = y.value + UNIT.height <= platform.y &&
        y.value + UNIT.height + velocityY.value >= platform.y &&
        x.value + UNIT.width > platform.x &&
        x.value < platform.x + platform.width

      if (isColliding) {
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

  const checkPlatformCollisions = (): boolean => {
    for (const platform of platformsStore.platforms) {
      const isTouchingPlatform =
        x.value + UNIT.width > platform.x &&
        x.value < platform.x + platform.width &&
        y.value + UNIT.height >= platform.y &&
        y.value + UNIT.height <= platform.y + 10; // Учитываем небольшую погрешность

      if (isTouchingPlatform) {
        return isTouchingPlatform
      }
    }
    return false
  };

  // Прыжок
  const jump = (): void => {
    const onGround: boolean = y.value === (GROUND_LEVEL - UNIT.height)
    if (!isJumping.value && (onGround || checkPlatformCollisions())) {
      velocityY.value = jumpPower;
      isJumping.value = true;
    }
  };

  // Рисуем квадрат
  const draw = (ctx: CanvasRenderingContext2D): void => {
    drawBackground(ctx)
    platformsStore.drawPlatforms(ctx)
    enemiesStore.drawEnemies(ctx)
    drawScore(ctx)
    drawHp(ctx)
    drawStuff(ctx)
    drawHero(ctx)
  };

  const checkHeartCollisions = () => {
    for (let i = hearts.value.length - 1; i >= 0; i--) {
      const heart = hearts.value[i];

      const isColliding =
        x.value + UNIT.width > heart.x &&
        x.value < heart.x + heart.size &&
        y.value + UNIT.height > heart.y &&
        y.value < heart.y + heart.size;

      if (isColliding) {
        // Удаляем сердце и увеличиваем жизни (максимум 5)
        hearts.value.splice(i, 1);
        if (hp.value < 5) {
          hp.value += 1;
        }
      }
    }
  };

  // Проверка столкновения с врагами
  const checkCollisionWithEnemies = (): void => {
    for (let i = enemiesStore.enemies.length - 1; i >= 0; i--) {
      const enemy = enemiesStore.enemies[i];

      if (!enemy?.isAlive) continue;

      const xCollision: boolean = (x.value + UNIT.width) > enemy.x &&
        x.value < (enemy.x + enemy.width)
      const yCollision: boolean = (y.value + UNIT.height) > enemy.y &&
        y.value < (enemy.y + enemy.height)
      const isColliding: boolean = xCollision && yCollision

      if (isColliding) {
        const isJumpingOnEnemy: boolean = y.value + UNIT.height - velocityY.value <= enemy.y;

        if (isJumpingOnEnemy) {
          enemy.isAlive = false;
          enemiesStore.enemies.splice(i, 1);
          velocityY.value = jumpPower / 1.5;
          score.value += 1;
          continue
        }

        hp.value--

        if (hp.value <= 0) {
          reset();
          score.value = 0;
        } else {
          resetHero()
        }
      }
    }
  };

  const reset = (): void => {
    resetHero()
    enemiesStore.resetEnemies()
    resetStats()
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
    moveHearts,
    checkHeartCollisions,
    checkCollisionWithEnemies,
    updateBackground,
    reset
  }
})