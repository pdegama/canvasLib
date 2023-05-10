import { CanvasElement, CanvasElementInfo } from "./element";

class NoneElement extends CanvasElement {
    public getInfo(): CanvasElementInfo {
        return {
            elementType: 'none'
        }
    }
}

export default NoneElement 