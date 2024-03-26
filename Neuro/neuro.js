function DCanvas(el) {
    ctx = el.getContext("2d");
    const pixel = 10;

    let is_mouse_down = false;

    canv.width = 500;
    canv.height = 500;

    this.drawLine = function (x1, y1, x2, y2, color = "#4A4E69") {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineJoin = "miter";
        ctx.lineWidth = 1;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    this.drawCell = function (x, y, w, h, color = "#4A4E69") {
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineJoin = "miter";
        ctx.lineWidth = 1;
        ctx.rect(x, y, w, h);
        ctx.fill();
    }
    this.clear = function () {
        ctx.clearRect(0, 0, canv.width, canv.height);
    }
    this.drawGrid = function () {
        const w = canv.width;
        const h = canv.height;
        const p = w / pixel;

        const xStep = w / p;
        const yStep = h / p;

        for (let x = 0; x < w; x += xStep) {
            this.drawLine(x, 0, x, h);
        }
        for (let y = 0; y < h; y += yStep) {
            this.drawLine(0, y, w, y);
        }
    }

    this.sharp = function (draw = false) {
        const w = canv.width;
        const h = canv.height;
        const p = w / pixel;

        const xStep = w / p;
        const yStep = h / p;

        const vector = [];
        let __draw = [];

        for (let x = 0; x < w; x += xStep) {
            for (let y = 0; y < h; y += yStep) {
                const data = ctx.getImageData(x, y, xStep, yStep);

                let nonEmptyPixelsCount = 0;
                for (i = 0; i < data.data.length; i += 10) {
                    const isEmpty = data.data[i] === 0;

                    if (!isEmpty) {
                        nonEmptyPixelsCount += 1;
                    }
                }
                if (nonEmptyPixelsCount > 1 && draw) {
                    __draw.push([x, y, xStep, yStep]);
                }
                vector.push(nonEmptyPixelsCount > 1 ? 1 : 0);
            }
        }

        if (draw) {
            this.clear();
            this.drawGrid();

            for (__d in __draw) {
                this.drawCell(__draw[__d][0], __draw[__d][1], __draw[__d][2], __draw[__d][3])
            }
        }
        return vector;
    }

    el.addEventListener("mousedown", function (e) {
        is_mouse_down = true;
        ctx.beginPath();
    })
    el.addEventListener("mouseup", function (e) {
        is_mouse_down = false;
    })
    el.addEventListener("mousemove", function (e) {
        if (is_mouse_down) {
            ctx.fillStyle = "#4A4E69";
            ctx.strokeStyle = "#4A4E69";
            ctx.lineWidth = pixel;

            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(e.offsetX, e.offsetY, pixel / 2, 0, Math.PI * 2)
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        }
    })
}


const d = new DCanvas(document.getElementById("canv"));