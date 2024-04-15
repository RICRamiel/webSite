/**
 * @type HTMLCanvasElement
 */
const canvas = document.getElementById("canvas");
const guide = document.getElementById("guide");
const toggleGuide = document.getElementById("toggleGuide");
const clearButton = document.getElementById("clearButton");
const drawingContext = canvas.getContext("2d");
const clusterize = document.getElementById("clusterize");
const numberOfCluster = document.getElementById("numberOfCluster");
const clusterNumDemo = document.getElementById("clusterNumDemo");
const mapSize = document.getElementById("mapSize");
const mapSizeDemo = document.getElementById("mapSizeDemo");
var size = parseInt(mapSize.value);
var numOfClust = parseInt(numberOfCluster.value);
mapSizeDemo.innerHTML = size;
clusterNumDemo.innerHTML = numOfClust;

//on open canvas
var CELL_SIDE_COUNT = size;
var cellPixelLength = canvas.width / CELL_SIDE_COUNT;
var colorHistory = {};
// Set default color
// Initialize the canvas background
drawingContext.fillStyle = "#ffffff";
drawingContext.fillRect(0, 0, canvas.width, canvas.height);

function guideUpdate() {
    while (guide.firstChild) {
        guide.removeChild(guide.firstChild);
    }
    if (toggleGuide.checked) {
        guide.style.width = `${canvas.width}px`;
        guide.style.height = `${canvas.height}px`;
        guide.style.gridTemplateColumns = `repeat(${CELL_SIDE_COUNT}, 1fr)`;
        guide.style.gridTemplateRows = `repeat(${CELL_SIDE_COUNT}, 1fr)`;
        console.log(canvas.width, canvas.height, CELL_SIDE_COUNT);
        [...Array(CELL_SIDE_COUNT ** 2)].forEach(() => guide.insertAdjacentHTML("beforeend", "<div></div>"));
    }
}

numberOfCluster.oninput = function () {
    clusterNumDemo.innerHTML = this.value;
    numOfClust = parseInt(numberOfCluster.value);
}

mapSize.oninput = function () {
    while (guide.firstChild) {
        guide.removeChild(guide.firstChild);
    }
    mapSizeDemo.innerHTML = this.value;
    size = parseInt(this.value);

    CELL_SIDE_COUNT = size;
    cellPixelLength = canvas.width / CELL_SIDE_COUNT;
    colorHistory = {};
    drawingContext.fillStyle = "#ffffff";
    drawingContext.fillRect(0, 0, canvas.width, canvas.height);
    guideUpdate();
}


// Setup the guide

guideUpdate();

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

    if (event.shiftKey) {
        deleteCell(cellX, cellY);
        // } else if (event.MOUSEOVER) {

    } else {
        //console.log(cellX,cellY);
        fillCell(cellX, cellY);
    }
}

function handleClearButtonClick() {
    colorHistory = {};
    drawingContext.fillStyle = "#ffffff";
    drawingContext.fillRect(0, 0, canvas.width, canvas.height);
}


function handleToggleGuideChange() {
    guide.style.display = toggleGuide.checked ? null : "none";

}

function deleteCell(cellX, cellY) {
    const startX = cellX * cellPixelLength;
    const startY = cellY * cellPixelLength;

    drawingContext.clearRect(startX, startY, cellPixelLength, cellPixelLength);
    delete colorHistory[`${cellX}_${cellY}`];
    drawingContext.fillStyle = "#FFFFFF";
    drawingContext.fillRect(startX, startY, cellPixelLength, cellPixelLength);
}

function fillCell(cellX, cellY, color = "#000000") {
    const startX = cellX * cellPixelLength;
    const startY = cellY * cellPixelLength;

    drawingContext.fillStyle = color;
    drawingContext.fillRect(startX, startY, cellPixelLength, cellPixelLength);
    colorHistory[`${cellX}_${cellY}`] = "#000000";
}

// function mouseMoveDraw(event) {
//     const canvasBoundingRect = canvas.getBoundingClientRect();
//     const x = event.clientX - canvasBoundingRect.left - event.offsetX;
//     const y = event.clientY - canvasBoundingRect.top - event.offsetY;
//     const cellX = Math.floor(x / cellPixelLength);
//     const cellY = Math.floor(y / cellPixelLength);
//     const currentColor = colorHistory[`${cellX}_${cellY}`];
//     drawingContext.fillStyle = currentColor;
//     console.log("hover")
//     if (event.button !== 0) {
//         console.log("click")
//         fillCell(cellX, cellY)
//     }
// }

function reColorCell(cellX, cellY, color) {
    const startX = cellX * cellPixelLength;
    const startY = cellY * cellPixelLength;

    drawingContext.fillStyle = color;
    drawingContext.fillRect(startX, startY, cellPixelLength, cellPixelLength);
    colorHistory[`${cellX}_${cellY}`] = "#000000";
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
    let classes = KMeans(requestData(), numOfClust);
    console.log(classes);
    let data = requestData();
    let colors = ["#ff0000", "#00ff00", "#0000ff", "#349599", "#a928b5", "#d9eb13", "#d656a1", "#647691", "#600cf2", "#ff8800"];
    for (let i = 0; i < classes.length; i++) {
        reColorCell(data[i][0], data[i][1], colors[classes[i]]);
        console.log("pix colored")
    }
}

function cluster() {
    colorizeOnCluster()
    console.log("cluster done");
}

function updateCanv() {
    cellPixelLength = canvas.width / CELL_SIDE_COUNT;
    canvas.height = cellPixelLength * CELL_SIDE_COUNT;

    guideUpdate();
    handleClearButtonClick();
}

// canvas.addEventListener("mouseover", mouseMoveDraw);
canvas.addEventListener("mousedown", handleCanvasMousedown);
clearButton.addEventListener("click", handleClearButtonClick);
toggleGuide.addEventListener("change", handleToggleGuideChange);
clusterize.addEventListener("click", cluster)
