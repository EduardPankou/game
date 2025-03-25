import {useGame} from "../stores/game";
import {ref} from "vue";

const keys = ref<Record<string, boolean>>({}); // Состояние клавиш

export default function useKeyHandler() {
  const gameStore = useGame();
  
  const handleKeyDown = (event: KeyboardEvent): void => {
    gameStore.keys[event.key] = true;
    if ([' ', 'ArrowUp'].includes(event.key)) {
      gameStore.jump(); // Прыжок при нажатии пробела или стрелки вверх
    }
  };

  const handleKeyUp = (event: KeyboardEvent): void => {
    gameStore.keys[event.key] = false;
  };

  const addKeysListeners = (): void => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  }

  const removeKeysListeners = (): void => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  }

  return {
    keys,
    addKeysListeners,
    removeKeysListeners
  }
}