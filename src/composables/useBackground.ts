import {SCENE} from "../helpers/constants";

interface IBackground {
  image: string
}

export default function useBackground({image}: IBackground) {
  const backgroundImage = new Image();
  backgroundImage.src = `/images/${image}`; // Путь к файлу в `public/`
  let backgroundX = 0;

  const drawBackground = (ctx: CanvasRenderingContext2D): void => {
    ctx.drawImage(backgroundImage, backgroundX, 0, SCENE.width, SCENE.height);
    ctx.drawImage(backgroundImage, backgroundX + SCENE.width, 0, SCENE.width, SCENE.height);
  };

  const updateBackground = () => {
    backgroundX -= 2; // Скорость движения фона
    if (backgroundX <= -SCENE.width) {
      backgroundX = 0;
    }
  };

  return {
    drawBackground,
    updateBackground
  }
}