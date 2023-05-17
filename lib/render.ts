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

    if (c.fillStyle) {
        c.fillStyle = "black"
    }

    c.fillText(elementProp.text || "Text Field", elementProp.pos.x, elementProp.pos.y, textWidth)

}

function renderImage(c: CanvasRenderingContext2D, element: CanvasElement, elementProp: ImageProp) {
    let img = new Image()
    img.src = elementProp.src

    if (elementProp.isLoad) {

        if (elementProp.autoSize) {
            element.setHeight(img.height)
            element.setWidth(img.width)
        }

        if (elementProp.selected) {
            if (c.fillStyle) {
                c.fillStyle = "#4d90e855"
            }
            c.fillRect(elementProp.pos.x - 2, elementProp.pos.y - 2, element.getWidth() + 4, element.getHeight() + 4)
        }

        c.drawImage(img, elementProp.pos.x, elementProp.pos.y, element.getWidth(), element.getHeight())

        if (!elementProp.autoSize && elementProp.selected) {
            if (c.fillStyle) {
                c.fillStyle = "#000fb3cc"
            }

            c.fillRect(elementProp.pos.x + element.getWidth() - 3, elementProp.pos.y + element.getHeight() - 3, 6, 6)
        }

    } else {

        img.onload = () => {

            if (elementProp.autoSize) {
                element.setHeight(img.height)
                element.setWidth(img.width)
            }

            if (elementProp.selected) {
                if (c.fillStyle) {
                    c.fillStyle = "#4d90e855"
                }
                c.fillRect(elementProp.pos.x - 2, elementProp.pos.y - 2, element.getWidth() + 4, element.getHeight() + 4)
            }

            c.drawImage(img, elementProp.pos.x, elementProp.pos.y, element.getWidth(), element.getHeight())

            if (!elementProp.autoSize && elementProp.selected) {
                if (c.fillStyle) {
                    c.fillStyle = "#000fb3cc"
                }
    
                c.fillRect(elementProp.pos.x + element.getWidth() - 3, elementProp.pos.y + element.getHeight() - 3, 6, 6)
            }

            elementProp.isLoad = true
        }

    }
}

export { renderText, renderImage }
