import { CanvasElement } from "./element";
import { Position } from "./position";

type SelectProp = {
    moveByArrow?: boolean;
    multiSelect?: boolean;
    multiLock: boolean;
    moveByMouse?: boolean;
    mouseLock: boolean;
    resize?: boolean;
}

type SelectEleWithPos = {
    element: CanvasElement;
    pos: Position;
}

export type { SelectProp, SelectEleWithPos }