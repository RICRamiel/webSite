/**
 * @type HTMLCanvasElement
 */
const canvas = document.getElementById("canvas");
const guide = document.getElementById("guide");
const toggleGuide = document.getElementById("toggleGuide");
const clearButton = document.getElementById("clearButton");
const drawingContext = canvas.getContext("2d");
const makePath = document.getElementById("makePath");
const ant = document.getElementById("ant");

const mapSize = document.getElementById("mapSize");
const mapSizeDemo = document.getElementById("mapSizeDemo");
let size = parseInt(mapSize.value);
mapSizeDemo.innerHTML = size;

const numberAnts = document.getElementById("numAnts");
const numberAntsDemo = document.getElementById("numAntsDemo");
let numAnts = parseInt(numberAnts.value);
numberAntsDemo.innerHTML = numAnts;

const numberIterations = document.getElementById("numIterations");
const numberIterationsDemo = document.getElementById("numIterationsDemo");
let numIterations = parseInt(numberIterations.value)
numberIterationsDemo.innerHTML = numIterations;

const evaporateRate = document.getElementById("evaporationRate");
const evaporateRateDemo = document.getElementById("evaporationRateDemo");
let evaporationRate = parseInt(evaporateRate.value) / 100;
evaporateRateDemo.innerHTML = parseInt(evaporateRate.value);


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
guideUpdate();

numberAnts.oninput = function () {
    numAnts = this.value;
    numberAntsDemo.innerHTML = this.value;
    handleClearButtonClick();
}

numberIterations.oninput = function () {
    numIterations = this.value;
    numberIterationsDemo.innerHTML = this.value;
    handleClearButtonClick();
}

evaporateRate.oninput = function () {
    evaporationRate = this.value / 100;
    evaporateRateDemo.innerHTML = this.value;
    handleClearButtonClick();
}

function handleCanvasMousedown(event) {
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

    } else {
        fillCell(cellX, cellY);
        cities = formateCities();
    }

}

function handleClearButtonClick() {
    minDistance = Infinity;
    colorHistory = {};
    cities = [];
    population = [];
    fitness = [];
    depth = 0;
    drawingContext.fillStyle = "#ffffff";
    drawingContext.fillRect(0, 0, canvas.width, canvas.height);
}

function tempClear() {
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
    //
    return data;
}

function drawPath(x1, y1, x2, y2, color = "#000000", thickness = 2) {
    x1 += 0.5;
    y1 += 0.5;
    x2 += 0.5;
    y2 += 0.5;
    drawingContext.strokeStyle = color;
    drawingContext.lineWidth = thickness;
    drawingContext.beginPath();
    drawingContext.moveTo(x1 * cellPixelLength, y1 * cellPixelLength);
    drawingContext.lineTo(x2 * cellPixelLength, y2 * cellPixelLength);
    drawingContext.stroke();
    drawingContext.closePath();
}

function drawBestPath(a, pointOrder, color, thickness) {
    for (let i = 0; i < pointOrder.length - 1; i++) {
        drawPath(a[pointOrder[i]].x / cellPixelLength, a[pointOrder[i]].y / cellPixelLength, a[pointOrder[i + 1]].x / cellPixelLength, a[pointOrder[i + 1]].y / cellPixelLength, color, thickness);
    }
    drawPath(a[pointOrder[0]].x / cellPixelLength, a[pointOrder[0]].y / cellPixelLength, a[pointOrder[pointOrder.length - 1]].x / cellPixelLength, a[pointOrder[pointOrder.length - 1]].y / cellPixelLength, color, thickness)
}

function drawAllPath() {
    let data = requestData();
    //
    for (let i = 0; i < data.length; i++) {
        for (let j = 1; j < data.length; j++) {
            drawPath(data[i][0], data[i][1], data[j][0], data[j][1], "black", 1);
        }
    }
}

function formateCities() {
    let data = requestData();
    let cities = [];
    for (let i = 0; i < data.length; i++) {
        cities[i] = {x: data[i][0] * cellPixelLength, y: data[i][1] * cellPixelLength};
    }
    return cities;
}

function drawCities(city) {
    tempClear();
    for (let i = 0; i < city.length; i++) {
        fillCell(city[i].x / cellPixelLength, city[i].y / cellPixelLength, "#000000");
    }
    drawAllPath();
}

let cities = formateCities();
let numCities = cities.length;
let pheromone = [];
const alpha = 1;
const beta = 2;

function updateCanv() {
    cellPixelLength = canvas.width / cellSideCount;
    canvas.height = cellPixelLength * cellSideCount;

    guideUpdate();
    handleClearButtonClick();
}

canvas.addEventListener("mousedown", handleCanvasMousedown);
clearButton.addEventListener("click", handleClearButtonClick);
toggleGuide.addEventListener("change", handleToggleGuideChange);
makePath.addEventListener("click", drawAllPath);
ant.addEventListener("click", driver);
