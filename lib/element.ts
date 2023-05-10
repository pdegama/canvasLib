import { Position } from "./position";

interface CanvasElementInfo {
    elementType: 'text' | 'image' | 'none';

    text?: string;
    textIsEnv?: boolean;
    textFont?: string;
    textSize?: number;

    imagePath?: string;

    height?: number;
    width?: number;
    pos?: Position;
}

abstract class CanvasElement {
    abstract getInfo(): CanvasElementInfo;
}

export { CanvasElement }
export type { CanvasElementInfo }