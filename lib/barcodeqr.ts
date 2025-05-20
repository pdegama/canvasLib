import { CanvasElement } from "./element";
import { Position } from "./position";

interface BarcodeQrProp {
    type: 'barcode' | 'qr';

    data: string;

    isEnv: boolean;
    ifEnvKey: string;

    pos: Position;
    onclick?: Function;

    height: number;
    width: number;

    selected?: boolean;
    isLoad?: boolean;

    autoSize?: boolean;

    deleted: boolean;
}

class FillBarCodeQR extends CanvasElement {
    prop: BarcodeQrProp
    constructor() {
        super();
        this.prop = {
            type: 'barcode',
            data: "",
            isEnv: false,
            ifEnvKey: '',
            pos: { x: 0, y: 0 },
            height: 0,
            width: 0,
            deleted: false,
            autoSize: true,
        }
    }

    public setType(type: 'barcode' | 'qr') {
        this.prop.type = type
    }
    public getType(): 'barcode' | 'qr' {
        return this.prop.type
    }
    public setData(data: string) {
        this.prop.data = data
    }
    public getData(): string {
        return this.prop.data
    }
    public setPos(pos: Position) {
        this.prop.pos = pos
    }
    public getPos(): Position {
        return this.prop.pos
    }
    public setHeight(height: number) {
        this.prop.height = height
    }
    public getHeight(): number {
        return this.prop.height
    }
    public setWidth(width: number) {
        this.prop.width = width
    }
    public getWidth(): number {
        return this.prop.width
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
    public setAutoSize(autoSize: boolean) {
        this.prop.autoSize = autoSize
    }
    public getAutoSize(): boolean | undefined {
        return this.prop.autoSize
    }
}

export { FillBarCodeQR }
export type { BarcodeQrProp }