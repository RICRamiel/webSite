/**
 * @type HTMLCanvasElement
 */
const canvas = document.getElementById("canvas");
const guide = document.getElementById("guide");
const toggleGuide = document.getElementById("toggleGuide");
const clearButton = document.getElementById("clearButton");
const drawingContext = canvas.getContext("2d");

const mapSize = document.getElementById("mapSize");
const mapSizeDemo = document.getElementById("mapSizeDemo");

const makePath = document.getElementById("makePath");
const startAlgo = document.getElementById("startAlgo");

const MutateProcent = document.getElementById("MutateProcent");
const MutateProcentDemo = document.getElementById("MutateProcentDemo");

const PopulationSize = document.getElementById("PopulationSize");
const PopulationSizeDemo = document.getElementById("PopulationSizeDemo");

const maxGeneration = document.getElementById("maxGeneration");
const maxGenerationDemo = document.getElementById("maxGenerationDemo");

let maxGen = parseInt(maxGeneration.value);
maxGenerationDemo.innerHTML = maxGeneration.value;

let mutateProcent = parseInt(MutateProcent.value) / 100;
MutateProcentDemo.innerHTML = mutateProcent * 100;

let size = parseInt(mapSize.value);
mapSizeDemo.innerHTML = size;

let popSize = parseInt(PopulationSize.value);
PopulationSizeDemo.innerHTML = popSize;


let depth = 0;
//for GA

let numberBestPath = 0;
let population = [];
let fitness = [];
let cities = [];
let order = [];
let lastBestOrder;

let minDistance = Infinity;
let bestPath;
let totalCities;
let timeOutID;

//on open canvas
let cellSideCount = size;
let cellPixelLength = canvas.width / cellSideCount;
let colorHistory = {};
//let graph = {}; //adjacency list
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


let MakingPath = 0;
let GraphData = [];


mapSize.oninput = function () {
    while (guide.firstChild) {
        guide.removeChild(guide.firstChild);
    }
    mapSizeDemo.innerHTML = this.value;
    size = parseInt(this.value);

    cellSideCount = size;
    cellPixelLength = canvas.width / cellSideCount;
    colorHistory = {};
    graph = {};
    drawingContext.fillStyle = "#ffffff";
    drawingContext.fillRect(0, 0, canvas.width, canvas.height);
    guideUpdate();
}

MutateProcent.oninput = function () {
    mutateProcent = this.value;
    MutateProcentDemo.innerHTML = this.value;
    handleClearButtonClick();
}

PopulationSize.oninput = function () {
    popSize = this.value;
    PopulationSizeDemo.innerHTML = this.value;
    handleClearButtonClick();
}

maxGeneration.oninput = function () {
    maxGen = this.value;
    maxGenerationDemo.innerHTML = this.value;
    handleClearButtonClick();
}

guideUpdate();

function setup() {
    order = [];
    for (let i = 0; i < totalCities; i++) {
        order[i] = i;
    }
    bestPath = cities.slice();
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
    depth = maxGen + 100;
    clearTimeout(timeOutID);
    // setTimeout(() => {
    //     minDistance = Infinity;
    //     colorHistory = {};
    //     cities = [];
    //     population = [];
    //     fitness = [];
    //     depth = 0;
    // }, 100);
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

function draw(event) {

    if (event.button !== 0) {
        return;
    }

    if (cities.length === 0) {
        alert("Пожалуйста поставьте точки");
        return;
    }

    if (depth === 0) {
        totalCities = cities.length;
        setup();
    }
    depth += 1;

    let bestOrder = calculateFitness();
    if (lastBestOrder === bestOrder) {
        numberBestPath++;
    } else {
        numberBestPath = 0;
    }
    lastBestOrder = bestOrder;

    normalizeFitness();
    generateNext();

    drawCities(cities);
    drawBestPath(cities, bestOrder, "purple", 9);
    if (depth > 0 && depth < maxGen && numberBestPath < maxGen / 2) {
        timeOutID = setTimeout(() => {
            draw(event)
        }, timeCalc(cities.length));
    }
    else{
        clearInterval(timeOutID);
    }
}

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
startAlgo.addEventListener("click", draw)
