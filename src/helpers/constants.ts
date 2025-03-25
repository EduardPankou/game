import {IEnemies} from "../types/unit";
import {IUnit, IScene} from "../types/unit";

export const ENEMIES_DEFAULT_VALUES: IEnemies[] = [
  { x: 300, y: 700, width: 50, height: 50, direction: 1, isAlive: true },
  { x: 100, y: 500, width: 50, height: 50, direction: -1, isAlive: true }
]


export const UNIT: IUnit = {
  width: 20,
  height: 20
}

export const SCENE: IScene = {
  width: 900,
  height: 800
}