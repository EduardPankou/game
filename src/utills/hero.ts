import {SCENE, UNIT} from "../helpers/constants";
import {IIsMove} from "../types";

interface IXMove {
  keys: Record<string, boolean>;
  x: number;
}

export const isXMove = ({keys, x}: IXMove): IIsMove => {
  if ((keys.ArrowRight || keys.d) && x + UNIT.width < SCENE.width) {
    return 1
  }
  if ((keys.ArrowLeft || keys.a) && x > 0) {
    return -1
  }

  return 0
}