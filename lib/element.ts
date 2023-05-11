import { Position } from "./position";
import { FillTextInfo } from "./text";
import { NoneElementInfo } from "./noneelement";

abstract class CanvasElement {

    abstract prop: FillTextInfo | NoneElementInfo

    public setWidth(w: number) {
        this.prop.width = w
    }

    public setHeight(h: number) {
        this.prop.height = h
    }

    public getWidth() {
        return this.prop.width
    }

    public getHeight() {
        return this.prop.height
    }

    public setPos(pos: Position) {
        this.prop.pos = pos
    }

    public getPos(): Position {
        return this.prop.pos || { x: 10, y: 10 }
    }

    public select() {
        this.prop.selected = true
    }

    public deselect() {
        this.prop.selected = false
    }

    public getProp(): FillTextInfo | NoneElementInfo {
        return this.prop
    }
    
}

export { CanvasElement }