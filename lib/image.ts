// Copyright (c) 2023 Parth Degama
// This code is licensed under MIT license

// image

import { CanvasElement } from "./element";
import { Position } from "./position";

interface ImageProp {
    type: 'image';

    src: string;

    pos: Position
    onclick?: Function;

    height: number;
    width: number;

    selected?: boolean;
    isLoad?: boolean;
}

class FillImage extends CanvasElement {

    prop: ImageProp

    constructor() {
        super()
        this.prop = {
            type: 'image',
            src: "",

            pos: { x: 10, y: 10 },

            height: -1,
            width: -1,

            isLoad: false
        }
    }

    public setSrc(src: string) {
        this.prop.src = src
    }

    public setWidth(w: number) {
        this.prop.width = w
    }

    public getWidth(): number {
        return this.prop.width
    }

    public setHeight(h: number) {
        this.prop.height = h
    }

    public getHeight(): number {
        return this.prop.height
    }

    public onclick(cb: Function) {
        this.prop.onclick = cb
    }

    public getLoad(b: boolean):boolean {
        return this.prop.isLoad || false
    }
    
    public setLoad(b: boolean) {
        this.prop.isLoad = b
    }

}

export { FillImage }
export type { ImageProp }
