
import { CanvasElement } from "./element";
import { Position } from "./position";

interface NoneElementInfo {
    type: 'none';

    pos: Position

    height: number;
    width: number;

    selected?: boolean;
}

class NoneElement extends CanvasElement {

    prop: NoneElementInfo;

    constructor() {
        super()
        this.prop = {
            type: 'none',
            pos: { x: 0, y: 0 },
            height: 0,
            width: 0
        }
    }

}

export { NoneElement }
export type { NoneElementInfo }