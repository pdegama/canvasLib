// Copyright (c) 2023 Parth Degama
// This code is licensed under MIT license

// canvas element

import { Position } from "./position";
import { FillTextProp } from "./text";
import { ImageProp } from "./image"
import { NoneElementInfo } from "./noneelement";

abstract class CanvasElement {

    abstract prop: FillTextProp | ImageProp | NoneElementInfo

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

    public getProp(): FillTextProp | ImageProp | NoneElementInfo {
        return this.prop
    }

    public delete() {
        this.prop.deleted = true
    }

}

export { CanvasElement }