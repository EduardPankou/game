import {IUnitConfig, IUnit, IScene} from "../types";

export const ENEMY_CONFIG: IUnitConfig = {
  width: 80,
  height: 80
} as const


export const UNIT: IUnit = {
  width: 100,
  height: 100,
  x: 50,
  y: 750
} as const

export const SCENE: IScene = {
  width: 900,
  height: 750
} as const

export const GROUND_LEVEL: number = 750 as const