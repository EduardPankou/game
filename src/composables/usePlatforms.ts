import {ref} from "vue";
import {SCENE} from "../helpers/constants";
import {IPlatform} from "../types/unit";

const platforms = ref<IPlatform[]>([
  { x: 0, y: 675, width: 200, height: 20, dx: 2 },
  { x: 100, y: 575, width: 100, height: 20, dx: 0 },
  { x: 250, y: 450, width: 150, height: 20, dx: -1 },
  { x: 450, y: 350, width: 200, height: 20, dx: 1 }
])

export default function usePlatforms() {
  // Обновляем движение платформ
  const movePlatforms = () => {
    for (const platform of platforms.value) {
      platform.x += platform.dx;
      // Если платформа выходит за пределы экрана, меняем направление
      if (platform.x <= 0 || platform.x + platform.width >= SCENE.width) {
        platform.dx = -platform.dx;
      }
    }
  }

  const drawPlatforms = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "green";
    for (const platform of platforms.value) {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
  }

  return {
    platforms,
    movePlatforms,
    drawPlatforms
  }
}