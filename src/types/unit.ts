interface Size {
  width: number;
  height: number;
}
interface Coordinates {
  x: number;
  y: number;
}

export type IUnitConfig = Size
export type IUnit = Size & Coordinates

export type IScene = Size

export interface IPlatform extends Size, Coordinates {
  dx: number;
}

export interface IEnemy extends Size, Coordinates {
  direction: number;
  isAlive: boolean;
}