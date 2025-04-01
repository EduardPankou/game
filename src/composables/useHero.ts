import {ref} from "vue";
import {storeToRefs} from 'pinia'
import {IIsMove} from "../types";
import {UNIT, DIRECTION_TYPE} from "../helpers/constants";
import {isXMove} from "../utills/hero";
import {useKeyboard} from "../stores/keyboard";
import useUnitStats from "./useUnitStats";

export default function useHero() {
  const x = ref<number>(UNIT.x); // Позиция по X
  const y = ref<number>(UNIT.y); // Позиция по Y
  const velocityY = ref<number>(0); // Скорость по Y
  const isJumping = ref<boolean>(false);

  const speed: number = 5; // Скорость движения
  const gravity: number = 0.5; // Сила гравитации
  const jumpPower: number = -12; // Сила прыжка

  const {keys} = storeToRefs(useKeyboard())
  const {
    hp,
    drawHp,
    resetStats
  } = useUnitStats({initialHp: 3})

  const move = (): IIsMove => {
    const isMove = isXMove({keys: keys.value, x: x.value})
    if (isMove === DIRECTION_TYPE.STOP) return isMove

    if (isMove === DIRECTION_TYPE.RIGHT) {
      x.value += speed;
    }
    if (isMove === DIRECTION_TYPE.LEFT) {
      x.value -= speed;
    }

    return isMove
  };

  const drawHero = (ctx: CanvasRenderingContext2D): void => {
    const heroImage = new Image();
    heroImage.src = "/images/hero.png";

    ctx.drawImage(heroImage, x.value, y.value, UNIT.width, UNIT.height);
  }

  const resetHero = (): void => {
    x.value = UNIT.x;
    y.value = UNIT.y;
    velocityY.value = 0;
    isJumping.value = false;
  }

  return {
    x,
    y,
    velocityY,
    isJumping,
    speed,
    gravity,
    jumpPower,
    hp,
    move,
    drawHero,
    drawHp,
    resetStats,
    resetHero
  }
}