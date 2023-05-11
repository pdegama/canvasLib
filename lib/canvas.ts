import { CanvasElement } from "./element"
import { NoneElement } from "./noneelement"
import { SelectProp } from "./select"

class Canvas {

    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D | null
    private elements: [CanvasElement] = [new NoneElement()]
    private selectProp: SelectProp

    private eleSlect: boolean = false

    constructor(canvas: any) {

        this.canvas = canvas
        this.context = this.canvas.getContext("2d")
        this.selectProp = {
            multiLock: false
        }

        var c = this
        window.addEventListener("keyup", (e) => {
            this.arrowKeyEvent(e, c)
        })
    }

    public setCanvas(canvas: any) {
        this.canvas = canvas
        this.context = this.canvas.getContext("2d")
    }

    public selectable(selectable: boolean, selectProp: SelectProp) {
        this.eleSlect = selectable
        this.selectProp = selectProp
    }

    public clickable(clickable: boolean) {
        if (clickable) {

            var c = this

            this.canvas.addEventListener("click", (e) => {
                this.canvasClickEvent(e, c)
            }, false)

            window.addEventListener("keydown", (e) => {
                if (e.key == "Control") this.selectProp.multiLock = true
            })

            window.addEventListener("keyup", (e) => {
                if (e.key == "Control") this.selectProp.multiLock = false
            })

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

    private canvasClickEvent(e: any, c: Canvas) {

        let x = e.clientX - e.target.getBoundingClientRect().x
        let y = e.clientY - e.target.getBoundingClientRect().y

        let selectEle: CanvasElement = new NoneElement()

        c.elements.map((element) => {

            if (!c.selectProp.multiLock) element.deselect()


            let start = element.getPos();
            let end = { x: start.x + element.getWidth(), y: start.y + element.getHeight() }

            if ((x >= start.x && x <= end.x) && (y >= start.y && y <= end.y)) {
                selectEle = element
            }

        })


        if (selectEle.prop.type != 'none') {

            if (this.eleSlect) {
                if (!selectEle.prop.selected) {
                    selectEle.select()
                } else {
                    selectEle.deselect()
                }
            }

            if (selectEle.prop.onclick) selectEle.prop.onclick(selectEle)

        }

        this.render()
    }

    private arrowKeyEvent(e: any, c: Canvas) {

        if (c.selectProp.moveByArrow == undefined || !c.selectProp.moveByArrow) {
            return
        }

        c.elements.map((element) => {
            if (element.prop.selected) {
                let pos = element.getPos()
                switch (e.key) {
                    case "ArrowDown":
                        element.setPos({ x: pos.x, y: pos.y + 5 })
                        break
                    case "ArrowUp":
                        element.setPos({ x: pos.x, y: pos.y - 5 })
                        break
                    case "ArrowLeft":
                        element.setPos({ x: pos.x - 5, y: pos.y })
                        break
                    case "ArrowRight":
                        element.setPos({ x: pos.x + 5, y: pos.y })
                        break
                }
                this.render()
            }
        })
        
    }

}

export default Canvas
