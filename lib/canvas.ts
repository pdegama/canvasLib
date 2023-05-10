import { CanvasElement } from "./element"
import NoneElement from "./noneelement"

class Canvas {

    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D | null
    private elements: [CanvasElement]

    constructor(canvas: any) {
        this.elements = [new NoneElement()]

        this.canvas = canvas
        this.context = this.canvas.getContext("2d")
    }

    public setCanvas(canvas: any) {
        this.canvas = canvas
        this.context = this.canvas.getContext("2d")
    }

    public clickable(clickable: boolean) {
        if (clickable) {
            this.canvas.addEventListener("click", this.canvasClickEvent)
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

        this.elements.map((element) => {
            let elementInfo = element.getInfo()
            switch (elementInfo.elementType) {
                case 'text':

                    if (this.context?.textBaseline) {
                        this.context.textBaseline = "top"
                    }

                    if (this.context?.font) {
                        this.context.font = `${elementInfo.textSize}px ${elementInfo.textFont}`
                    }

                    if (this.context?.fillStyle) {
                        this.context.fillStyle = "#0000ffcc"
                    }

                    let textWidth = this.context?.measureText(elementInfo.text || "Text Field").width
                    this.context?.fillRect(elementInfo.pos?.x || 0, elementInfo.pos?.y || 0, textWidth || 0, elementInfo.textSize || 0)

                    if (this.context?.fillStyle) {
                        this.context.fillStyle = "black"
                    }

                    this.context?.fillText(elementInfo.text || "Text Field", elementInfo.pos?.x || 0, elementInfo.pos?.y || 0, 500)

                    break;

                case 'image':

                    break;
            }
        })
    }

    private canvasClickEvent(e: any) {

        let x = e.clientX - e.target.getBoundingClientRect().x
        let y = e.clientY - e.target.getBoundingClientRect().y

        console.log(x, y);
        

    }

}

export default Canvas
