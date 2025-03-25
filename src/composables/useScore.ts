import {ref} from "vue";

export default function useScore() {
  const score = ref<number>(0)

  const drawScore = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score.value}`, 10, 30);
  }

  return {
    score,
    drawScore
  }
}