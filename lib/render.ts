// Copyright (c) 2023 Parth Degama
// This code is licensed under MIT license

// render function

import { CanvasElement } from "./element"
import { FillTextProp } from "./text"
import { ImageProp } from "./image"
import { Canvas } from "."
import { BarcodeQrProp } from "./barcodeqr"
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';


// text render code
function renderText(p: Canvas, c: CanvasRenderingContext2D, element: CanvasElement, elementProp: FillTextProp) {

    if (c.textBaseline) {
        c.textBaseline = "top"
    }

    if (c.font) {
        c.font = `${elementProp.textBold ? "bold" : ""} ${elementProp.textItalic ? "italic" : ""} ${elementProp.textSize}px "${elementProp.textFont}"`
    }

    let eText: string = elementProp.text || "Text Field"

    if (elementProp.isEnv) {
        let t = p.envs[elementProp.ifEnvKey]
        if (typeof (t) === 'string') {
            eText = t
        } else if (typeof (t) === 'number') {
            eText = String(t)
        } else if (typeof (t) === 'object') {
            // @ts-ignore
            eText = t instanceof Image ? (t.img_name ? t.img_name : "[Invalid Field]") : "[Invalid Field]"
        } else if (typeof (t) === 'undefined') {
            eText = ""
        }
    }

    if (elementProp.style === "uppercase") {
        eText = eText.toUpperCase()
    } else if (elementProp.style === "lowercase") {
        eText = eText.toLowerCase()
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
    } else if (p.showFieldBg) {
        c.fillStyle = "#ede900cc"
        c.fillRect(elementProp.pos.x, elementProp.pos.y, element.getWidth(), elementProp.textSize)
    }

    if (element.getWidth() < textWidth) {
        p.textOverFlow = true
        p.textOverFlowEnvs.push(elementProp.isEnv ? elementProp.ifEnvKey : "_")

        c.fillStyle = "#ff000055"
        c.fillRect(elementProp.pos.x, elementProp.pos.y, element.getWidth(), elementProp.textSize)
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

    if (elementProp.strokeWidth > 0) {
        c.strokeStyle = elementProp.strokeColor
        c.lineWidth = elementProp.strokeWidth;
        c.strokeText(eText, x, elementProp.pos.y, textWidth)
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
    c.lineTo(x, y + radius + (radius === 0 ? (-elementProp.border) : 0))
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

// barcodeqr render code
async function renderBarCodeQR(p: Canvas, c: CanvasRenderingContext2D, element: CanvasElement, elementProp: BarcodeQrProp) {
    let data = String(elementProp.data) || "";
    if (elementProp.isEnv) {
        let t = p.envs[elementProp.ifEnvKey];
        if (typeof t === 'string' || typeof t === 'number') {
            data = String(t);
        } else if (typeof t === 'object') {
            data = "[Invalid Field]";
        } else {
            data = "";
        }
    }

    try {
        const { img, imgNotFound } = await generateBarcodeQR(elementProp.type, data);

        if (elementProp.autoSize) {
            element.setHeight(img.height);
            element.setWidth(img.width);
        }

        if (elementProp.selected) {
            c.fillStyle = "#4d90e855";
            c.fillRect(elementProp.pos.x - 2, elementProp.pos.y - 2, element.getWidth() + 4, element.getHeight() + 4);
        }

        const x = elementProp.pos.x;
        const y = elementProp.pos.y;
        const radius = 0;
        const width = element.getWidth();
        const height = element.getHeight();

        c.save();
        c.strokeStyle = "#000000";
        c.lineWidth = 0;

        c.beginPath();
        c.moveTo(x + radius, y);
        c.lineTo(x + width - radius, y);
        c.quadraticCurveTo(x + width, y, x + width, y + radius);
        c.lineTo(x + width, y + height - radius);
        c.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        c.lineTo(x + radius, y + height);
        c.quadraticCurveTo(x, y + height, x, y + height - radius);
        c.lineTo(x, y + radius);
        c.quadraticCurveTo(x, y, x + radius, y);

        c.closePath();
        c.clip();

        if (!imgNotFound) {
            c.drawImage(img, x, y, width, height);
        } else {
            c.fillStyle = "gray";
            c.fill();
        }

        c.restore();

        if (!elementProp.autoSize && elementProp.selected) {
            c.fillStyle = "#000fb3cc";
            c.fillRect(x + width - 3, y + height - 3, 6, 6);
        }

    } catch (err) {
        console.error("Error rendering barcode/QR:", err);
    }
}


const generateBarcodeQR = async (
    type: "barcode" | "qr",
    value: string
): Promise<{ img: HTMLImageElement; imgNotFound: boolean }> => {
    return new Promise(async (resolve, reject) => {
        if (!value || value === '') {
            return resolve({ img: new Image(), imgNotFound: true });
        }

        const handleImage = (img: HTMLImageElement, imgNotFound: boolean) => {
            resolve({ img, imgNotFound });
        };

        if (type === 'barcode') {
            try {
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                JsBarcode(svg, value, {
                    format: 'CODE128',
                    lineColor: '#000',
                    width: 2,
                    height: 80,
                    displayValue: true,
                    margin: 0,
                });

                const serializer = new XMLSerializer();
                const svgString = serializer.serializeToString(svg);
                const base64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));

                const img = new Image();
                img.src = base64;
                img.alt = 'Barcode';
                img.width = 300;

                img.onload = () => handleImage(img, false);
                img.onerror = (err) => reject(err);
            } catch (err) {
                reject(err);
            }
        } else {
            try {
                const url = await QRCode.toDataURL(value, { margin: 1 });
                const img = new Image();
                img.src = url;
                img.alt = 'QR Code';
                img.width = 200;

                img.onload = () => handleImage(img, false);
                img.onerror = (err) => reject(err);
            } catch (err) {
                reject(err);
            }
        }
    });
};


export { renderText, renderImage, renderBarCodeQR }
