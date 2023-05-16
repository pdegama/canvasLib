// Copyright (c) 2023 Parth Degama
// This code is licensed under MIT license

// canvas

import { CanvasElement } from "./element"
import { NoneElement } from "./noneelement"
import { Position } from "./position"
import { SelectProp, SelectEleWithPos } from "./select"
import { FillTextInfo } from "./text"

class Canvas {

    private canvas: HTMLCanvasElement // canvas
    private context: CanvasRenderingContext2D | null // canvas 2d context
    private elements: [CanvasElement] = [new NoneElement()] // all canvas elements
    private selectProp: SelectProp // canvas elements selection prop

    private eleSlect: boolean = false // canvas elements is selectable
    private mouseDownPos: Position // if mouse down in canvas then set mouse position in canvas
    private mouseMoveEle: [SelectEleWithPos]
    private notDeselectLock: boolean // not deselect element

    constructor(canvas: any) {

        this.canvas = canvas
        this.context = this.canvas.getContext("2d")
        this.selectProp = {
            multiLock: false,
            mouseMoveLock: false,
            resize: false,
            moveByMouse: false,
        }

        this.mouseDownPos = { x: 0, y: 0 }
        this.mouseMoveEle = [{ element: new NoneElement(), pos: { x: 0, y: 0 } }] // init, stor none element

        this.notDeselectLock = false

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

            this.canvas.addEventListener("mousedown", (e: any) => {
                // mouse down in canvas

                if (c.mouseMoveEle.length > 2) {
                    /* 
                        select element is more then two
                        (noneElements + other element...)
                        then deselect lock set true
                    */
                    this.notDeselectLock = true
                }

                // c.mouseMoveEle = [{ element: new NoneElement(), pos: { x: 0, y: 0 } }]

                this.elementSelectEvent(e, c)  // first select canvas element
                this.mouseMoveDownEvent(e, c)  // and mouse move event
            })

            this.canvas.addEventListener("mousemove", (e: any) => {
                this.mouseMoveEvent(e, c) // mouse move event
            })

            window.addEventListener("mouseup", () => {
                this.mouseMoveUpEvent(c)// mouse up event
            })

            window.addEventListener("keydown", (e: any) => {
                if (this.selectProp.multiSelect && e.key == "Control") this.selectProp.multiLock = true // press control to lock multiselect element lock true 
            })

            window.addEventListener("keyup", (e: any) => {
                if (e.key == "Control") this.selectProp.multiLock = false // unset multi element select lock
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

        this.elements.map((element) => {

            let elementProp = element.getProp()
            switch (elementProp.type) {
                case 'text':
                    if (this.context) {
                        renderText(this.context, element, elementProp)
                    }
                    break;

                case 'none':

                    break;
            }
        })
    }

    private elementSelectEvent(e: any, c: Canvas) {

        // find mouse position in canvas
        let x = e.clientX - e.target.getBoundingClientRect().x
        let y = e.clientY - e.target.getBoundingClientRect().y

        let selectEle: CanvasElement = new NoneElement() // selected element

        c.elements.map((element) => { // loop of element

            if (!c.selectProp.multiLock) { // if multi select lock is not set
                if (!c.notDeselectLock) { // if not deselect lock is not set
                    element.deselect()
                }
            }

            let start = element.getPos();
            let end = { x: start.x + element.getWidth(), y: start.y + element.getHeight() }

            if ((x >= start.x && x <= end.x) && (y >= start.y && y <= end.y)) {
                // if select element is find 
                selectEle = element
            }

        })

        if (selectEle.prop.type != 'none') {

            if (c.eleSlect) {

                if (!selectEle.prop.selected) {

                    // if element is not selected
                    if (!c.selectProp.multiLock) {  // if multi select lock is not set
                        if (c.notDeselectLock) {  // if not deselect lock is set
                            c.notDeselectLock = false
                            c.elements.map((element) => element.deselect())
                        }
                    }

                    selectEle.select()

                } else {
                    // if element is already selected
                    if (c.selectProp.multiLock) {
                        // but select lock is set then deselect selected element
                        selectEle.deselect()
                    }
                }

            }

            if (selectEle.prop.onclick) selectEle.prop.onclick(selectEle)

        } else {
            c.notDeselectLock = false
            c.elements.map((element) => element.deselect())
        }

        this.render()
    }

    private arrowKeyEvent(e: any, c: Canvas) {

        if (c.selectProp.moveByArrow == undefined || !c.selectProp.moveByArrow) {
            return // if element is not move by arrow key then return this function
        }

        c.elements.map((element) => {
            if (element.prop.selected) {
                let pos = element.getPos() // get selected element position
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

    private mouseMoveDownEvent(e: any, c: Canvas) {

        c.selectProp.mouseMoveLock = true // set mouse lock

        // get mouse position in canvas
        let x = e.clientX - e.target.getBoundingClientRect().x
        let y = e.clientY - e.target.getBoundingClientRect().y
        c.mouseDownPos = { x, y } // set mouse down positon

        c.mouseMoveEle = [{ element: new NoneElement(), pos: { x: 0, y: 0 } }] // clear mouse selected elements

        c.elements.map((element) => {
            // loop of canvas elements
            if (element.prop.selected) {
                // if element is selected then add to mouseMoveEle
                c.mouseMoveEle.push({ element, pos: element.getPos() })
                console.log("add");
                console.log(c.mouseMoveEle);
            }
        })

    }

    private mouseMoveEvent(e: any, c: Canvas) {

        if (!c.selectProp.moveByMouse) return // if move by mouse is false then return this function
        if (!c.selectProp.mouseMoveLock) return // if mouse is not lock then return function

        // get mouse position in canvas
        let x = e.clientX - e.target.getBoundingClientRect().x
        let y = e.clientY - e.target.getBoundingClientRect().y

        let disp = { x: x - c.mouseDownPos.x, y: y - c.mouseDownPos.y }  // find mouse displesment

        c.mouseMoveEle.map(({ element, pos }) => { // loop of selected elements
            if (element.prop.type !== 'none') {
                // if element type is not none

                element.setPos({ x: pos.x + disp.x, y: pos.y + disp.y }) // set position is position + disp
                this.render()
            }
        })

    }

    private mouseMoveUpEvent(c: Canvas) {
        c.selectProp.mouseMoveLock = false // set mouse unlock
    }

}

function renderText(c: CanvasRenderingContext2D, element: CanvasElement, elementProp: FillTextInfo) {
    if (c.textBaseline) {
        c.textBaseline = "top"
    }

    if (c.font) {
        c.font = `${elementProp.textSize}px ${elementProp.textFont}`
    }

    let textWidth = c.measureText(elementProp.text || "Text Field").width
    element.setWidth(textWidth || -1)

    if (elementProp.selected) {
        if (c.fillStyle) {
            c.fillStyle = "#4d90e855"
        }
        c.fillRect(elementProp.pos.x, elementProp.pos.y, element.getWidth(), elementProp.textSize)
    }

    if (c.fillStyle) {
        c.fillStyle = "black"
    }

    c.fillText(elementProp.text || "Text Field", elementProp.pos.x, elementProp.pos.y, textWidth)

}

export default Canvas
