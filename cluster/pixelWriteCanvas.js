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
let size = parseInt(mapSize.value);
let numOfClust = parseInt(numberOfCluster.value);
mapSizeDemo.innerHTML = size;
clusterNumDemo.innerHTML = numOfClust;

//on open canvas
let cellSideCount = size;
let cellPixelLength = canvas.width / cellSideCount;
let colorHistory = {};
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
        guide.style.gridTemplateColumns = `repeat(${cellSideCount}, 1fr)`;
        guide.style.gridTemplateRows = `repeat(${cellSideCount}, 1fr)`;

        [...Array(cellSideCount ** 2)].forEach(() => guide.insertAdjacentHTML("beforeend", "<div></div>"));
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

    cellSideCount = size;
    cellPixelLength = canvas.width / cellSideCount;
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
        //
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

    return data;
}


function colorizeOnCluster() {
    let data = requestData();
    if (data.length === 0) {
        alert("Поставьте точки на холсте");
        return;
    }
    let classes = KMeans(data, numOfClust);

    let colors = ["#ff0000", "#00ff00", "#0000ff", "#349599", "#a928b5", "#d9eb13", "#d656a1", "#647691", "#600cf2", "#ff8800"];
    for (let i = 0; i < classes.length; i++) {
        reColorCell(data[i][0], data[i][1], colors[classes[i]]);

    }
}

function cluster() {
    colorizeOnCluster()
}

function updateCanv() {
    cellPixelLength = canvas.width / cellSideCount;
    canvas.height = cellPixelLength * cellSideCount;

    guideUpdate();
    handleClearButtonClick();
}

// canvas.addEventListener("mouseover", mouseMoveDraw);
canvas.addEventListener("mousedown", handleCanvasMousedown);
clearButton.addEventListener("click", handleClearButtonClick);
toggleGuide.addEventListener("change", handleToggleGuideChange);
clusterize.addEventListener("click", cluster)
