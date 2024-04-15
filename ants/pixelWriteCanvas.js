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
var size = parseInt(mapSize.value);
mapSizeDemo.innerHTML = size;

const numberAnts = document.getElementById("numAnts");
const numberAntsDemo = document.getElementById("numAntsDemo");
var numAnts = parseInt(numberAnts.value);
numberAntsDemo.innerHTML = numAnts;

const numberIterations = document.getElementById("numIterations");
const numberIterationsDemo = document.getElementById("numIterationsDemo");
var numIterations = parseInt(numberIterations.value)
numberIterationsDemo.innerHTML = numIterations;

const evaporateRate = document.getElementById("evaporationRate");
const evaporateRateDemo = document.getElementById("evaporationRateDemo");
var evaporationRate = parseInt(evaporateRate.value) / 100;
evaporateRateDemo.innerHTML = parseInt(evaporateRate.value);


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

// Setup the guide


function handleClearButtonClick() {
    //const yes = confirm("Are you sure you wish to clear the canvas?");

    //if (!yes) return;
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
    //console.log(data);
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
    for (var i = 0; i < pointOrder.length - 1; i++) {
        drawPath(a[pointOrder[i]].x / cellPixelLength, a[pointOrder[i]].y / cellPixelLength, a[pointOrder[i + 1]].x / cellPixelLength, a[pointOrder[i + 1]].y / cellPixelLength, color, thickness);
    }
    drawPath(a[pointOrder[0]].x / cellPixelLength, a[pointOrder[0]].y / cellPixelLength, a[pointOrder[pointOrder.length - 1]].x / cellPixelLength, a[pointOrder[pointOrder.length - 1]].y / cellPixelLength, color, thickness)
}

function drawAllPath() {
    let data = requestData();
    // console.log(data);
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
    for (var i = 0; i < city.length; i++) {
        fillCell(city[i].x / cellPixelLength, city[i].y / cellPixelLength, "#000000");
    }
    drawAllPath();
}

let cities = formateCities();
let numCities = cities.length;
let pheromone = [];
// const numAnts = 10;
// const numIterations = 100;
// const evaporationRate = 0.1;
const alpha = 1;
const beta = 2;


function initializePheromoneMatrix() {
    pheromone = [];

    for (let i = 0; i < numCities; i++) {
        pheromone.push([]);

        for (let j = 0; j < numCities; j++) {
            pheromone[i][j] = 1;
        }
    }
}

function calculateDistance(city1, city2) {
    const dx = city1.x - city2.x;
    const dy = city1.y - city2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function driver() {
    tempClear();
    cities = formateCities();
    drawCities(cities);
    numCities = cities.length;
    initializePheromoneMatrix();
    runAntColonyOptimization();
}

function calculateProbabilities(ant, currentCity) {
    const probabilities = [];

    for (let i = 0; i < numCities; i++) {
        if (!ant.visited[i]) {
            const pheromoneLevel = pheromone[currentCity][i];
            const distance = calculateDistance(cities[currentCity], cities[i]);
            const probability = Math.pow(pheromoneLevel, alpha) * Math.pow(1 / distance, beta);
            probabilities.push({cityIndex: i, probability});
        }
    }

    return probabilities;
}

function chooseNextCity(ant, currentCity) {
    const probabilities = calculateProbabilities(ant, currentCity);

    const totalProbability = probabilities.reduce((sum, {probability}) => sum + probability, 0);
    let random = Math.random() * totalProbability;

    for (const {cityIndex, probability} of probabilities) {
        random -= probability;
        if (random <= 0) {
            return cityIndex;
        }
    }

    return probabilities[probabilities.length - 1].cityIndex;
}


function updatePheromone(trails) {
    for (let i = 0; i < numCities; i++) {
        for (let j = 0; j < numCities; j++) {
            if (i !== j) {
                pheromone[i][j] *= 1 - evaporationRate;
            }
        }
    }

    for (const trail of trails) {
        const trailDistance = calculateDistanceOfTrail(trail);

        for (let i = 0; i < numCities - 1; i++) {
            const from = trail[i];
            const to = trail[i + 1];
            pheromone[from][to] += 1 / trailDistance;
            pheromone[to][from] += 1 / trailDistance;
        }
    }
}

function calculateDistanceOfTrail(trail) {
    let distance = 0;

    for (let i = 0; i < numCities - 1; i++) {
        const from = trail[i];
        const to = trail[i + 1];
        distance += calculateDistance(cities[from], cities[to]);
    }

    return distance;
}

function findBestTrail(trails) {
    let bestTrail = trails[0];
    let bestDistance = calculateDistanceOfTrail(bestTrail);

    for (let i = 1; i < trails.length; i++) {
        const trail = trails[i];
        const distance = calculateDistanceOfTrail(trail);

        if (distance < bestDistance) {
            bestTrail = trail;
            bestDistance = distance;
        }
    }

    return {trail: bestTrail, distance: bestDistance};
}

function runAntColonyOptimization() {
    const ants = [];

    for (let i = 0; i < numAnts; i++) {
        ants.push({trail: [], visited: new Array(numCities).fill(false)});
    }
    console.log(ants);

    let bestTrailOverall = null;

    for (let iteration = 0; iteration < numIterations; iteration++) {
        for (const ant of ants) {
            ant.trail = [];
            ant.visited.fill(false);

            const startCity = Math.floor(Math.random() * numCities);
            ant.trail.push(startCity);
            ant.visited[startCity] = true;

            let currentCity = startCity;

            while (ant.trail.length < numCities) {
                const nextCity = chooseNextCity(ant, currentCity);
                ant.trail.push(nextCity);
                ant.visited[nextCity] = true;
                currentCity = nextCity;
            }

            ant.trail.push(startCity);
        }

        const bestTrailIteration = findBestTrail(ants.map(ant => ant.trail));

        console.log(bestTrailIteration);

        if (!bestTrailOverall || bestTrailIteration.distance < bestTrailOverall.distance) {
            bestTrailOverall = bestTrailIteration;
        }

        updatePheromone(ants.map(ant => ant.trail));
    }

    drawBestTrail(bestTrailOverall.trail);
    console.log(`Best Distance: ${bestTrailOverall.distance}`);
}

function drawBestTrail(trail) {
    drawingContext.beginPath();
    drawingContext.moveTo(cities[trail[0]].x + cellPixelLength / 2, cities[trail[0]].y + cellPixelLength / 2);

    for (let i = 1; i < trail.length; i++) {
        const city = cities[trail[i]];
        drawingContext.lineTo(city.x + cellPixelLength / 2, city.y + cellPixelLength / 2);
    }

    drawingContext.lineTo(cities[trail[0]].x + cellPixelLength / 2, cities[trail[0]].y + cellPixelLength / 2);
    drawingContext.lineWidth = 5;
    drawingContext.strokeStyle = '#0000ff';
    drawingContext.stroke();
}

function updateCanv() {
    cellPixelLength = canvas.width / CELL_SIDE_COUNT;
    canvas.height = cellPixelLength * CELL_SIDE_COUNT;

    guideUpdate();
    handleClearButtonClick();
}

canvas.addEventListener("mousedown", handleCanvasMousedown);
clearButton.addEventListener("click", handleClearButtonClick);
toggleGuide.addEventListener("change", handleToggleGuideChange);
makePath.addEventListener("click", drawAllPath);
ant.addEventListener("click", driver);
