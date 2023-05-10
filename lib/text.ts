import { CanvasElement, CanvasElementInfo } from "./element"
import { Position } from "./position"

class FillText extends CanvasElement {

    private textInfo: CanvasElementInfo

    constructor() {
        super()
        this.textInfo = {
            elementType: 'text',
            text: "Text",
            pos: { x: 10, y: 10 },
            textSize: 22,
            textFont: "Verdana"
        }
    }

    public setText(text: string) {
        this.textInfo.text = text
    }

    public setPos(pos: Position) {
        this.textInfo.pos = pos
    }

    public getPos(): Position {
        return this.textInfo.pos || { x: 10, y: 10 }
    }

    public setFontSize(size: number) {
        this.textInfo.textSize = size
    }

    public setFont(font: string) {
        this.textInfo.textFont = font
    }

    public onclick(cb: Function) {
        this.textInfo.onclick = cb
    }

    public getInfo(): CanvasElementInfo {
        return this.textInfo
    }

}

export default FillText
