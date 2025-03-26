import {onMounted, onUnmounted, ref} from "vue";
import {GROUND_LEVEL, SCENE, UNIT} from "../helpers/constants";

interface IHeart {
  x: number,
  y: number,
  size: number
}

export default function useFallingStuff() {
  const hearts = ref<IHeart[]>([])
  let heartsId: number | null = null

  const spawnHeart = (): void => {
    hearts.value.push({
      x: Math.random() * SCENE.width + UNIT.width, // Случайная позиция по X
      y: 0, // Начинаем сверху
      size: 50,
    });

    heartsId = setTimeout(spawnHeart, Math.random() * 5000 + 5000);
  };

  const moveHearts = (): void => {
    for (let i = hearts.value.length - 1; i >= 0; i--) {
      hearts.value[i].y += 2; // Двигаем вниз

      // Если сердце упало за экран — удаляем
      if (hearts.value[i].y > GROUND_LEVEL + 50) {
        hearts.value.splice(i, 1);
      }
    }
  };

  const drawStuff = (ctx: CanvasRenderingContext2D): void => {
    const heartImage = new Image();
    heartImage.src = "/images/heart.png";

    hearts.value.forEach((heart) => {
      ctx.drawImage(heartImage, heart.x, heart.y, heart.size, heart.size);
    });
  }

  onMounted(() => spawnHeart())

  onUnmounted(() => {
    if (heartsId) {
      clearTimeout(heartsId)
    }
    heartsId = null
  })

  return {
    hearts,
    moveHearts,
    drawStuff
  }
}