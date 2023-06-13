// Copyright (c) 2023 Parth Degama
// This code is licensed under MIT license

// render function

import { CanvasElement } from "./element"
import { FillTextProp } from "./text"
import { ImageProp } from "./image"
import { Canvas } from "."

// text render code
function renderText(p: Canvas, c: CanvasRenderingContext2D, element: CanvasElement, elementProp: FillTextProp) {

    if (c.textBaseline) {
        c.textBaseline = "top"
    }

    if (c.font) {
        c.font = `${elementProp.textSize}px ${elementProp.textFont}`
    }

    let eText: string = elementProp.text || "Text Field"

    if (elementProp.isEnv) {
        let t = p.envs[elementProp.ifEnvKey]
        if (typeof (t) === 'string') {
            eText = t
        } else if (typeof (t) === 'number') {
            eText = String(t)
        } else if (typeof (t) === 'object') {
            eText = "[Invalid Field]"
        } else if (typeof (t) === 'undefined') {
            eText = ""
        }
    }

    let textWidth = c.measureText(eText).width

    if (elementProp.textWidthAuto) {
        element.setWidth(textWidth)
    }

    if (elementProp.selected) {

        if (!elementProp.textWidthAuto) {
            if (c.fillStyle) {
                c.fillStyle = "#000fb3cc"
            }

            c.fillRect(elementProp.pos.x + element.getWidth(), elementProp.pos.y, 6, elementProp.textSize)
        }

        if (c.fillStyle) {
            c.fillStyle = "#4d90e855"
        }

        c.fillRect(elementProp.pos.x, elementProp.pos.y, element.getWidth(), elementProp.textSize)
    }

    if (element.getWidth() < textWidth) {
        p.textOverFlow = true

        if (c.fillStyle) {
            c.fillStyle = "#ff000055"
        }

        c.fillRect(elementProp.pos.x, elementProp.pos.y, element.getWidth(), elementProp.textSize)
    }

    if (c.fillStyle) {
        c.fillStyle = "black"
    }

    c.fillText(eText, elementProp.pos.x, elementProp.pos.y, textWidth)

}

// image render code
function renderImage(p: Canvas, c: CanvasRenderingContext2D, element: CanvasElement, elementProp: ImageProp) {

    if (elementProp.autoSize) {
        element.setHeight(elementProp.src.height)
        element.setWidth(elementProp.src.width)
    }

    if (elementProp.selected) {
        if (c.fillStyle) {
            c.fillStyle = "#4d90e855"
        }
        c.fillRect(elementProp.pos.x - 2, elementProp.pos.y - 2, element.getWidth() + 4, element.getHeight() + 4)
    }

    c.drawImage(elementProp.src, elementProp.pos.x, elementProp.pos.y, element.getWidth(), element.getHeight())

    if (!elementProp.autoSize && elementProp.selected) {
        if (c.fillStyle) {
            c.fillStyle = "#000fb3cc"
        }

        c.fillRect(elementProp.pos.x + element.getWidth() - 3, elementProp.pos.y + element.getHeight() - 3, 6, 6)
    }

}

export { renderText, renderImage }
