import {ref} from "vue";
import {UNIT, SCENE} from "../helpers/constants";
import usePlatforms from "./usePlatforms";
import useEnemies from "./useEnemies";

const x = ref<number>(50); // Позиция по X
const y = ref<number>(750); // Позиция по Y
const velocityY = ref<number>(0); // Скорость по Y
const score = ref<number>(0); // Скорость по Y
const isJumping = ref<boolean>(false); // Флаг прыжка
const keys = ref<Record<string, boolean>>({}); // Состояние клавиш


// Хук для игры
export default function useGame() {
  const {
    platforms,
    drawPlatforms
  } = usePlatforms()
  const {
    enemies,
    drawEnemies,
    resetEnemies
  } = useEnemies()

  const speed: number = 5; // Скорость движения
  const gravity: number = 0.5; // Сила гравитации
  const jumpPower: number = -12; // Сила прыжка
  const groundLevel: number = 750; // Координата земли (граница падения)

  // Логика движения квадрата
  const move = () => {
    if ((keys.value.ArrowRight || keys.value.d) && x.value + UNIT.width < SCENE.width) {
      x.value += speed;
    }
    if ((keys.value.ArrowLeft || keys.value.a) && x.value > 0) {
      x.value -= speed;
    }
  };

  // Применяем гравитацию
  const applyGravity = () => {
    // Проверка столкновения с платформами
    for (const platform of platforms.value) {
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

    if (y.value + UNIT.height < groundLevel) {
      // Если квадрат не на земле, применяем гравитацию
      velocityY.value += gravity;
      y.value += velocityY.value;
    } else {
      // Если квадрат на земле, не двигаем его
      y.value = groundLevel - UNIT.height;
      velocityY.value = 0;

      if (isJumping.value) {
        isJumping.value = false;
      }
    }
  };

  // Прыжок
  const jump = () => {
    if (!isJumping.value) {
      velocityY.value = jumpPower;
      isJumping.value = true;
    }
  };

  // Рисуем квадрат
  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'blue';
    ctx.fillRect(x.value, y.value, UNIT.width, UNIT.height);

    drawPlatforms(ctx)
    drawEnemies(ctx)
  };

  // Проверка столкновения с врагами
  const checkCollisionWithEnemies = () => {
    for (const enemy of enemies.value) {
      if (
        enemy.isAlive &&
        x.value + 100 > enemy.x &&
        x.value < enemy.x + enemy.width &&
        y.value + 100 > enemy.y &&
        y.value < enemy.y + enemy.height
      ) {
        // Столкновение с врагом — перезапуск игры
        reset();
        score.value = 0; // Сброс очков при столкновении
        break;
      }
    }
  };

  const checkEnemyElimination = () => {
    for (const enemy of enemies.value) {
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

  const reset = () => {
    x.value = 50;
    y.value = 750;
    velocityY.value = 0;
    isJumping.value = false;
    resetEnemies()
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
  };
};
