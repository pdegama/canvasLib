import { CanvasElement } from "./element"
import { Position } from "./position"

interface FillTextInfo {
    type: 'text';
    text: string;
    textIsEnv: boolean;
    textFont: string;
    textSize: number;
    textWidth: number;
    pos: Position
    onclick?: Function;

    height: number;
    width: number;

    selected?: boolean;
}

class FillText extends CanvasElement {

    prop: FillTextInfo

    constructor() {
        super()
        this.prop = {
            type: 'text',
            text: "Text",
            textIsEnv: false,
            textFont: "Verdana",
            textSize: 22,
            textWidth: -1,
            pos: { x: 10, y: 10 },

            height: 22,
            width: -1
        }
    }

    public setText(text: string) {
        this.prop.text = text
    }

    public setWidth(w: number) {
        this.prop.textWidth = w
    }

    public getWidth(): number {
        return this.prop.textWidth
    }

    public setFontSize(size: number) {
        this.prop.textSize = size
        this.setHeight(this.prop.textSize)
    }

    public setFont(font: string) {
        this.prop.textFont = font
    }

    public onclick(cb: Function) {
        this.prop.onclick = cb
    }

}


export { FillText }
export type { FillTextInfo }
