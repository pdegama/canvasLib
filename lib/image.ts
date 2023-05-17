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

    autoSize?: boolean;

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

            height: 0,
            width: 0,

            autoSize: true,

            isLoad: false
        }
    }

    public setSrc(src: string) {
        this.prop.src = src
        this.prop.isLoad = false
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

    public getLoad(b: boolean): boolean {
        return this.prop.isLoad || false
    }

    public setLoad(b: boolean) {
        this.prop.isLoad = b
    }

    public setAutoSize(b: boolean) {
        this.prop.autoSize = b
    }

    public getAutoSize(): boolean {
        return this.prop.autoSize || false
    }

}

export { FillImage }
export type { ImageProp }
