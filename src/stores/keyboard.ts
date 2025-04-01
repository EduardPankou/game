import {defineStore} from 'pinia'
import {ref} from "vue";
import {useGame} from "./game";

export const useKeyboard = defineStore('keyboard', () => {
  const keys = ref<Record<string, boolean>>({});
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
})