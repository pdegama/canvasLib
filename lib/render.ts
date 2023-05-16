// Copyright (c) 2023 Parth Degama
// This code is licensed under MIT license

// render function

import { CanvasElement } from "./element"
import { FillTextProp } from "./text"
import { ImageProp } from "./image"

// text render code
function renderText(c: CanvasRenderingContext2D, element: CanvasElement, elementProp: FillTextProp) {

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

function renderImage(c: CanvasRenderingContext2D, element: CanvasElement, elementProp: ImageProp) {
    let img = new Image()
    img.src = elementProp.src

    if (elementProp.isLoad) {
        element.setHeight(elementProp.height == -1 ? img.height : elementProp.height)
        element.setWidth(elementProp.width == -1 ? img.width : elementProp.width)
        c.drawImage(img, elementProp.pos.x, elementProp.pos.y, element.getHeight(), element.getWidth())
    } else {
        img.onload = () => {
            element.setHeight(elementProp.height == -1 ? img.height : elementProp.height)
            element.setWidth(elementProp.width == -1 ? img.width : elementProp.width)
            c.drawImage(img, elementProp.pos.x, elementProp.pos.y, element.getHeight(), element.getWidth())
            elementProp.isLoad = true
        }
    }
}

export { renderText, renderImage }
