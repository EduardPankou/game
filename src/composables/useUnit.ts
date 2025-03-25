import {ref} from "vue";
import {SCENE, UNIT} from "../helpers/constants";
import useKeyHandler from "./useKeyHandler";

export default function useUnit() {
  const x = ref<number>(UNIT.x); // Позиция по X
  const y = ref<number>(UNIT.y); // Позиция по Y
  const velocityY = ref<number>(0); // Скорость по Y
  const isJumping = ref<boolean>(false);

  const speed: number = 5; // Скорость движения
  const gravity: number = 0.5; // Сила гравитации
  const jumpPower: number = -12; // Сила прыжка

  const {keys} = useKeyHandler()

  const move = (): void => {
    if ((keys.value.ArrowRight || keys.value.d) && x.value + UNIT.width < SCENE.width) {
      x.value += speed;
    }
    if ((keys.value.ArrowLeft || keys.value.a) && x.value > 0) {
      x.value -= speed;
    }
  };

  return {
    x,
    y,
    velocityY,
    isJumping,
    speed,
    gravity,
    jumpPower,
    move
  }
}