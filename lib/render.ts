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
        c.font = `${elementProp.textSize}px "${elementProp.textFont}"`
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
            c.fillStyle = "#000fb3cc"
            c.fillRect(elementProp.pos.x + element.getWidth(), elementProp.pos.y, 6, elementProp.textSize)
        }


        c.fillStyle = "#4d90e855"
        c.fillRect(elementProp.pos.x, elementProp.pos.y, element.getWidth(), elementProp.textSize)
    }

    if (element.getWidth() < textWidth) {
        p.textOverFlow = true
        p.textOverFlowEnvs.push(elementProp.isEnv ? elementProp.ifEnvKey : "_")

        c.fillStyle = "#ff000055"
        c.fillRect(elementProp.pos.x, elementProp.pos.y, element.getWidth(), elementProp.textSize)
    }

    if (elementProp.strokeWidth > 0) {
        c.strokeStyle = elementProp.strokeColor
        c.lineWidth = elementProp.strokeWidth;
        c.strokeText(eText, elementProp.pos.x, elementProp.pos.y, textWidth)
    }

    c.textAlign = elementProp.align

    let x = 0
    switch (elementProp.align) {
        case "left":
            x = elementProp.pos.x;
            break
        case "right":
            x = elementProp.pos.x + element.getWidth();
            break
        case "center":
            x = elementProp.pos.x + (element.getWidth() / 2);
            break
    }

    c.fillStyle = elementProp.color
    c.fillText(eText, x, elementProp.pos.y, textWidth)

}

// image render code
function renderImage(p: Canvas, c: CanvasRenderingContext2D, element: CanvasElement, elementProp: ImageProp) {

    let imgNotFound = false

    let imgSrc = elementProp.src
    if (elementProp.isEnv) {
        let t = p.envs[elementProp.ifEnvKey]
        if (typeof (t) !== 'string' && typeof (t) !== 'number' && typeof (t) !== 'undefined') {
            imgSrc = t
        } else {
            imgNotFound = true
        }
    }

    if (elementProp.autoSize) {
        element.setHeight(imgSrc.height)
        element.setWidth(imgSrc.width)
    }

    if (elementProp.selected) {
        c.fillStyle = "#4d90e855"
        c.fillRect(elementProp.pos.x - 2, elementProp.pos.y - 2, element.getWidth() + 4, element.getHeight() + 4)
    }

    let x = elementProp.pos.x
    let y = elementProp.pos.y
    let radius = elementProp.borderRadius
    let width = element.getWidth()
    let height = element.getHeight()

    c.save()

    c.strokeStyle = elementProp.borderColor
    c.lineWidth = elementProp.border * 2

    c.beginPath()
    c.moveTo(x + radius, y)
    c.lineTo(x + width - radius, y)
    c.quadraticCurveTo(x + width, y, x + width, y + radius)
    c.lineTo(x + width, y + height - radius)
    c.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    c.lineTo(x + radius, y + height)
    c.quadraticCurveTo(x, y + height, x, y + height - radius)
    c.lineTo(x, y + radius)
    c.quadraticCurveTo(x, y, x + radius, y)

    if (elementProp.border !== 0) {
        c.stroke();
    }

    c.closePath()
    c.clip()

    if (!imgNotFound) {
        c.drawImage(imgSrc, elementProp.pos.x, elementProp.pos.y, element.getWidth(), element.getHeight())
    } else {
        c.fillStyle = "gray"
        c.fill()
    }

    c.restore()

    if (!elementProp.autoSize && elementProp.selected) {
        c.fillStyle = "#000fb3cc"
        c.fillRect(elementProp.pos.x + element.getWidth() - 3, elementProp.pos.y + element.getHeight() - 3, 6, 6)
    }

}

export { renderText, renderImage }
