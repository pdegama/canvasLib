// Copyright (c) 2023 Parth Degama
// This code is licensed under MIT license

// canvas

import { CanvasElement } from "./element"
import { NoneElement, NoneElementInfo } from "./noneelement"
import { Position } from "./position"
import { SelectProp, SelectEleWithPos } from "./select"
import { renderText, renderImage, renderBarCodeQR } from "./render"
import { FillImage, ImageProp } from "./image"
import { FillText, FillTextProp } from "./text"
import { BarcodeQrProp, FillBarCodeQR } from "./barcodeqr"

type EnvType = {
    [key: string]: string | number | HTMLImageElement;
};

class Canvas {

    private canvas: HTMLCanvasElement // canvas
    private context: CanvasRenderingContext2D | null // canvas 2d context
    private elements: CanvasElement[] = [new NoneElement()] // all canvas elements
    private selectProp: SelectProp // canvas elements selection prop

    private eleSlect: boolean = false // canvas elements is selectable
    private mouseDownPos: Position // if mouse down in canvas then set mouse position in canvas
    private mouseMoveEle: SelectEleWithPos[] = [] // mouse move then the elements move with mouse
    private notDeselectLock: boolean // not deselect element

    private resizeEle: CanvasElement | undefined // current resize text selection

    private canvasBackground: HTMLImageElement | undefined // background

    public envs: EnvType // envs

    public textOverFlow: boolean = false
    public textOverFlowEnvs: [string]

    public showFieldBg = false 

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

        this.resizeEle = undefined

        this.envs = {}

        this.textOverFlowEnvs = ["~"]

        var c = this
        window.addEventListener("keyup", (e) => {
            this.arrowKeyEvent(e, c)
        })

    }

    public setCanvas(canvas: any) {
        this.canvas = canvas
        this.context = this.canvas.getContext("2d")
    }

    public setScale(scale: number) {

        var dpr = scale;

        var rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.context?.scale(dpr, dpr);
    }

    public setScaleRatio(h: number, w: number) {

        this.canvas.style.width = w + "px"
        this.canvas.style.height = h + "px"

    }

    public selectable(selectable: boolean, selectProp: any) {
        this.eleSlect = selectable
        this.selectProp = { ...this.selectProp, ...selectProp }
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

    public setBackground(bg: HTMLImageElement) {
        this.canvasBackground = bg
    }

    public setFieldBg(b: boolean) {
        this.showFieldBg = b
        this.render()
    }

    public getFieldBg() {
        return this.showFieldBg
    }

    public async render() {

        // render all element in canvas

        this.textOverFlow = false
        this.textOverFlowEnvs = ["~"]
        this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height) // clear canvas

        if (this.canvasBackground) {
            this.context?.drawImage(this.canvasBackground, 0, 0)
        }

        for (const element of this.elements) { // loop of elements

            let elementProp = element.getProp() // get element info
            switch (elementProp.type) {
                case 'text':
                    // if  text
                    if (this.context) {
                        renderText(this, this.context, element, elementProp)
                    }
                    break;

                case 'image':
                    // if image
                    if (this.context) {
                        renderImage(this, this.context, element, elementProp)
                    }
                    break;
                case 'barcode':
                    // if barcode
                    if (this.context) {
                        await renderBarCodeQR(this, this.context, element, elementProp)
                    }
                    break;
                case 'qr':
                    // if qr code
                    if (this.context) {
                        await renderBarCodeQR(this, this.context, element, elementProp)
                    }
                    break;
                case 'none':
                    // if element is none

                    break;
            }
        }
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
                c.resizeEle = undefined
            }

            if (element.prop.type == 'text' && !element.prop.textWidthAuto) {
                // select resize text
                if ((x >= end.x && x <= end.x + 6) && (y >= start.y && y <= end.y)) {
                    selectEle = element
                    c.resizeEle = element as FillText
                }
            } else if (['image', 'qr', 'barcode'].includes((element.prop as ImageProp | BarcodeQrProp).type)) {
                if ((element.prop as ImageProp | BarcodeQrProp).autoSize) return 
                // select resize image
                if ((x >= end.x - 2 && x <= end.x + 2) && (y >= start.y - 2 && y <= end.y + 2)) {
                    selectEle = element
                    c.resizeEle = element as FillImage
                }
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
                //console.log("add");
                //console.log(c.mouseMoveEle);
            }
        })

    }

    private mouseMoveEvent(e: any, c: Canvas) {

        if (!c.selectProp.moveByMouse) return // if move by mouse is false then return this function
        if (!c.selectProp.mouseMoveLock) return // if mouse is not lock then return function

        // get mouse position in canvas
        let x = e.clientX - e.target.getBoundingClientRect().x
        let y = e.clientY - e.target.getBoundingClientRect().y

        if (c.resizeEle) {
            // if resize text is not undefined then resize text width and retu function 

            if (c.resizeEle.prop.type === 'text') {
                c.canvas.style.cursor = 'ew-resize' // change curser

                let w = x - c.resizeEle.getPos().x // text width
                c.resizeEle.setWidth(w < 0 ? 0 : w) // set width

                c.render()

                return
            }

            if (['image', 'qr', 'barcode'].includes(c.resizeEle.prop.type)) {
                c.canvas.style.cursor = 'se-resize' // change curser

                let pos = c.resizeEle.getPos()

                let w = x - pos.x// text width
                let h = y - pos.y// text height

                c.resizeEle.setWidth(w < 0 ? 0 : w)
                c.resizeEle.setHeight(h < 0 ? 0 : h)

                c.render()
                return
            }

        }

        let disp = { x: x - c.mouseDownPos.x, y: y - c.mouseDownPos.y }  // find mouse displesment

        if (c.mouseMoveEle.length != 1) {
            c.canvas.style.cursor = 'move' // change curser
        }

        c.mouseMoveEle.map(({ element, pos }) => { // loop of selected elements
            if (element.prop.type !== 'none') {
                // if element type is not none

                element.setPos({ x: pos.x + disp.x, y: pos.y + disp.y }) // set position is position + disp
                // console.log("move...");

                c.render()
            }
        })

    }

    private mouseMoveUpEvent(c: Canvas) {
        c.selectProp.mouseMoveLock = false // set mouse unlock
        c.resizeEle = undefined // set resize text element unlock
        c.canvas.style.cursor = 'default' // set cursor default
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
                        element.setPos({ x: pos.x, y: pos.y + 1 })
                        break
                    case "ArrowUp":
                        element.setPos({ x: pos.x, y: pos.y - 1 })
                        break
                    case "ArrowLeft":
                        element.setPos({ x: pos.x - 1, y: pos.y })
                        break
                    case "ArrowRight":
                        element.setPos({ x: pos.x + 1, y: pos.y })
                        break
                }
                this.render()
            }
        })

    }

    public setEnvs(e: EnvType) {
        this.envs = e
    }

    public getJSON(): string {
        let eProp: any = []
        this.elements.map((e) => {
            eProp.push(e.prop);
        })
        return JSON.stringify(eProp);
    }

    public loadJSON(jd: string) {
        let d = JSON.parse(jd)
        d.map((e: FillTextProp | ImageProp | BarcodeQrProp | NoneElementInfo) => {
            switch (e.type) {
                case 'text':
                    // assign text prop to new fill text object
                    let textEle = new FillText()
                    textEle.prop = e
                    this.add(textEle)
                    break
                case 'image':
                    // assign images props to new new image object
                    let imgEle = new FillImage()
                    imgEle.prop.src = new Image()
                    imgEle.prop.isEnv = e.isEnv
                    imgEle.prop.ifEnvKey = e.ifEnvKey
                    imgEle.prop.pos = e.pos
                    imgEle.prop.height = e.height
                    imgEle.prop.width = e.width
                    imgEle.prop.autoSize = e.autoSize
                    imgEle.prop.selected = e.selected
                    imgEle.prop.border = e.border;
                    imgEle.prop.borderColor = e.borderColor;
                    imgEle.prop.borderRadius = e.borderRadius;
                    this.add(imgEle)
                    break
                case 'barcode':
                    // assign barcode props to new new barcode object
                    let barCodeEle = new FillBarCodeQR()
                    barCodeEle.prop = e
                    this.add(barCodeEle)
                    break
                case 'qr':
                    // assign qr props to new new qr object
                    let qrEle = new FillBarCodeQR()
                    qrEle.prop = e
                    this.add(qrEle)
                    break
            }
        })
        this.render()
    }

    public deselectEles() {
        // loop of element
        this.elements.map(e => {
            // deselect element
            e.deselect()
        })
    }

    public selectedEles(): [CanvasElement] {
        let eles: any = []

        // loop of elements
        this.elements.map(e => {
            // if element is selected then add to eles stak
            if (e.prop.selected) {
                eles.push(e)
            }
        })

        return eles
    }

    public onMouseDown(cb: any) {
        // mouse down event
        this.canvas.onmousedown = () => cb(this)
    }

    public onMouseUp(cb: any) {
        // mouse up event
        this.canvas.onmouseup = () => cb(this)
    }

    public getImage(): string {
        // get image
        return this.canvas.toDataURL()
    }

    public isTextOverflow(): boolean {
        // if text is over flow this text field?
        return this.textOverFlow
    }

    public getTextOverFlowEnvs(): [string] {
        // overflow text enevs
        return this.textOverFlowEnvs
    }

    public clearDeleteElement() {
        let ele: CanvasElement[] = []
        // loop of elements
        this.elements.map((e) => {
            // if element is not deleted then add to ele stack 
            if (!e.prop.deleted) {
                ele.push(e)
            }
        })
        this.elements = ele // assign ele stack to elements
    }

}

export default Canvas
