// Copyright (c) 2023 Parth Degama
// This code is licensed under MIT license

// image

import { CanvasElement } from "./element";
import { Position } from "./position";

interface ImageProp {
    type: 'image';

    src: HTMLImageElement;

    isEnv: boolean;
    ifEnvKey: string;

    pos: Position
    onclick?: Function;

    height: number;
    width: number;

    border: number;
    borderColor: string;
    borderRadius: number;

    autoSize?: boolean;

    selected?: boolean;
    isLoad?: boolean;

    deleted: boolean;
}

class FillImage extends CanvasElement {

    prop: ImageProp

    constructor() {
        super()
        this.prop = {
            type: 'image',
            src: new Image(),

            isEnv: false,
            ifEnvKey: "",

            pos: { x: 10, y: 10 },

            height: 0,
            width: 0,

            border: 0,
            borderColor: "#000000",
            borderRadius: 0,

            autoSize: true,

            isLoad: false,

            deleted: false,
        }
    }

    public setSrc(src: HTMLImageElement) {
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

    public setBorder(width: number) {
        let b = Number(width)
        this.prop.border = b
    }

    public getBorder(): number {
        return this.prop.border
    }

    public setBorderColor(color: string) {
        this.prop.borderColor = color
    }

    public getBorderColor(): string {
        return this.prop.borderColor
    }

    public setBorderRadius(Radius: number) {
        this.prop.borderRadius = Radius
    }

    public getBorderRadius(): number {
        return this.prop.borderRadius
    }

    public onclick(cb: Function) {
        this.prop.onclick = cb
    }

    public getLoad(): boolean {
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

    public setEnv(key: string) {
        this.prop.isEnv = true
        this.prop.ifEnvKey = key
    }

    public removeEnv() {
        this.prop.isEnv = false
        this.prop.ifEnvKey = ""
    }

    public isEnv(): string {
        return this.prop.ifEnvKey
    }

}

export { FillImage }
export type { ImageProp }
