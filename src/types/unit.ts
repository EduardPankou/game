interface Size {
  width: number;
  height: number;
}
interface Coordinates {
  x: number;
  y: number;
}

export interface IUnit {
  width: number;
  height: number;
}
export interface IScene {
  width: number;
  height: number;
}

export interface IPlatform extends Size, Coordinates {
  dx: number;
}

export interface IEnemies extends Size, Coordinates {
  direction: number;
  isAlive: boolean;
}