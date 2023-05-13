// Copyright (c) 2023 Parth Degama
// This code is licensed under MIT license

// select

import { CanvasElement } from "./element";
import { Position } from "./position";

type SelectProp = {
    moveByArrow?: boolean;
    multiSelect?: boolean;
    multiLock: boolean; // multi select lock
    moveByMouse?: boolean;
    mouseMoveLock: boolean; // mouse lock
    resize?: boolean;
}

type SelectEleWithPos = {
    element: CanvasElement;
    pos: Position;
}

export type { SelectProp, SelectEleWithPos }