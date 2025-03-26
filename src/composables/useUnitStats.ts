import {ref} from "vue";
import {IInitUnitStats} from "../types";
import {SCENE} from "../helpers/constants";

export default function useUnitStats({initialHp = 0}: IInitUnitStats) {
  const hp = ref<number>(initialHp)

  const drawHp = (ctx: CanvasRenderingContext2D) => {
    const heartImage = new Image();
    heartImage.src = "/images/heart.png";

    for (let i = 0; i < hp.value; i++) {
      ctx.drawImage(heartImage, SCENE.width - (i + 1) * 40 - 10, 10, 30, 30);
    }
  };

  const resetStats = (): void => {
    hp.value = initialHp
  }

  return {
    hp,
    drawHp,
    resetStats
  }
}