/**
 * @type HTMLCanvasElement
 */
const canvas = document.getElementById("canvas");
const guide = document.getElementById("guide");
const colorInput = document.getElementById("colorInput");
const toggleGuide = document.getElementById("toggleGuide");
const clearButton = document.getElementById("clearButton");
const sendButton = document.getElementById("sendData");
const mapSize = document.getElementById("mapSize");
const drawingContext = canvas.getContext("2d");
const clusterize = document.getElementById("clusterize")

//read map size in px
let size;
mapSize.addEventListener("input", (event) => {
    size = event.target.value;
});

const CELL_SIDE_COUNT = 10;
const cellPixelLength = canvas.width / CELL_SIDE_COUNT;
const colorHistory = {};

// Set default color
colorInput.value = "#000000";

// Initialize the canvas background
drawingContext.fillStyle = "#ffffff";
drawingContext.fillRect(0, 0, canvas.width, canvas.height);

// Setup the guide
{
    guide.style.width = `${canvas.width}px`;
    guide.style.height = `${canvas.height}px`;
    guide.style.gridTemplateColumns = `repeat(${CELL_SIDE_COUNT}, 1fr)`;
    guide.style.gridTemplateRows = `repeat(${CELL_SIDE_COUNT}, 1fr)`;

    [...Array(CELL_SIDE_COUNT ** 2)].forEach(() =>
        guide.insertAdjacentHTML("beforeend", "<div></div>")
    );
}

function handleCanvasMousedown(event) {
    // Ensure user is using their primary mouse button
    if (event.button !== 0) {
        return;
    }

    const canvasBoundingRect = canvas.getBoundingClientRect();
    const x = event.clientX - canvasBoundingRect.left;
    const y = event.clientY - canvasBoundingRect.top;
    const cellX = Math.floor(x / cellPixelLength);
    const cellY = Math.floor(y / cellPixelLength);
    const currentColor = colorHistory[`${cellX}_${cellY}`];

    if (event.ctrlKey) {
        if (currentColor) {
            colorInput.value = currentColor;
        }
    } else {
        //console.log(cellX,cellY);
        fillCell(cellX, cellY);
    }
}

function handleClearButtonClick() {
    const yes = confirm("Are you sure you wish to clear the canvas?");

    if (!yes) return;

    drawingContext.fillStyle = "#ffffff";
    drawingContext.fillRect(0, 0, canvas.width, canvas.height);
}

function handleToggleGuideChange() {
    guide.style.display = toggleGuide.checked ? null : "none";

}

function fillCell(cellX, cellY) {
    const startX = cellX * cellPixelLength;
    const startY = cellY * cellPixelLength;

    drawingContext.fillStyle = colorInput.value;
    drawingContext.fillRect(startX, startY, cellPixelLength, cellPixelLength);
    colorHistory[`${cellX}_${cellY}`] = colorInput.value;
}

function reColorCell(cellX, cellY, color) {
    const startX = cellX * cellPixelLength;
    const startY = cellY * cellPixelLength;

    drawingContext.fillStyle = color;
    drawingContext.fillRect(startX, startY, cellPixelLength, cellPixelLength);
    colorHistory[`${cellX}_${cellY}`] = colorInput.value;
}

function requestData() {
    let keys = Object.keys(colorHistory);
    let data = [];
    for (let i = 0; i < keys.length; i++) {
        data.push(keys[i].split("_").map(Number));
    }
    console.log(data);
    return data;
}


function colorizeOnCluster() {
    let classes = KMeans(requestData(), 2);
    console.log(classes);
    let data = requestData();
    let colors = ["#ff0000", "#00ff00"];
    for (let i = 0; i < classes.length; i++) {
        reColorCell(data[i][0], data[i][1], colors[classes[i]]);
        console.log("pix colored")
    }
}

function cluster() {
    colorizeOnCluster()
    console.log("cluster done");
}

sendButton.addEventListener("click", requestData)
canvas.addEventListener("mousedown", handleCanvasMousedown);
clearButton.addEventListener("click", handleClearButtonClick);
toggleGuide.addEventListener("change", handleToggleGuideChange);
clusterize.addEventListener("click", cluster)
