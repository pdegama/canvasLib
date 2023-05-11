import { CanvasElement } from "./element"
import { NoneElement } from "./noneelement"

class Canvas {

    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D | null
    private elements: [CanvasElement] = [new NoneElement()]

    private eleSlect: boolean = false

    constructor(canvas: any) {
        this.canvas = canvas
        this.context = this.canvas.getContext("2d")
    }

    public setCanvas(canvas: any) {
        this.canvas = canvas
        this.context = this.canvas.getContext("2d")
    }

    public selectable(selectable: boolean) {
        this.eleSlect = selectable
    }

    public clickable(clickable: boolean) {
        if (clickable) {
            var elements = this.elements
            this.canvas.addEventListener("click", (e) => {
                this.canvasClickEvent(e, elements)
            }, false)
        }
    }

    public setSize(height: number, width: number) {
        this.canvas.height = height
        this.canvas.width = width
        this.render()
    }

    public add(element: CanvasElement) {
        this.elements.push(element)
    }

    public render() {
        this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height)

        let ratio = Math.min(
            this.canvas.clientWidth / this.canvas.width,
            this.canvas.clientHeight / this.canvas.height
        );
        this.context?.scale(ratio, ratio)

        this.elements.map((element, elementIndex) => {

            let elementProp = element.getProp()
            switch (elementProp.type) {
                case 'text':

                    if (this.context?.textBaseline) {
                        this.context.textBaseline = "top"
                    }

                    if (this.context?.font) {
                        this.context.font = `${elementProp.textSize}px ${elementProp.textFont}`
                    }

                    let textWidth = this.context?.measureText(elementProp.text || "Text Field").width
                    this.elements[elementIndex].setWidth(textWidth || -1)

                    if (elementProp.selected) {
                        if (this.context?.fillStyle) {
                            this.context.fillStyle = "#4d90e855"
                        }
                        this.context?.fillRect(elementProp.pos.x, elementProp.pos.y, this.elements[elementIndex].getWidth(), elementProp.textSize)
                    }

                    if (this.context?.fillStyle) {
                        this.context.fillStyle = "black"
                    }

                    this.context?.fillText(elementProp.text || "Text Field", elementProp.pos.x, elementProp.pos.y, textWidth)

                    break;

                case 'none':

                    break;
            }
        })
    }

    private canvasClickEvent(e: any, elements: [CanvasElement]) {

        let x = e.clientX - e.target.getBoundingClientRect().x
        let y = e.clientY - e.target.getBoundingClientRect().y

        let selectEle: CanvasElement = new NoneElement()

        elements.map((element) => {

            element.deselect()

            let start = element.getPos();
            let end = { x: start.x + element.getWidth(), y: start.y + element.getHeight() }

            if ((x >= start.x && x <= end.x) && (y >= start.y && y <= end.y)) {
                selectEle = element
            }

        })


        if (selectEle.prop.type != 'none') {

            if (this.eleSlect) {
                selectEle.select()
            }

            if (selectEle.prop.onclick) selectEle.prop.onclick(selectEle)

        }

        this.render()
    }

}

export default Canvas
