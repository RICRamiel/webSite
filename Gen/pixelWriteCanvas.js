/**
 * @type HTMLCanvasElement
 */
const canvas = document.getElementById("canvas");
const guide = document.getElementById("guide");
const colorInput = document.getElementById("colorInput");
const toggleGuide = document.getElementById("toggleGuide");
const clearButton = document.getElementById("clearButton");
const drawingContext = canvas.getContext("2d");
const mapSize = document.getElementById("mapSize");
const mapSizeDemo = document.getElementById("mapSizeDemo");
const makePath = document.getElementById("makePath");
var size = parseInt(mapSize.value);
mapSizeDemo.innerHTML = size;


//on open canvas
var CELL_SIDE_COUNT = size;
var cellPixelLength = canvas.width / CELL_SIDE_COUNT;
var colorHistory = {};
var graph = {}; //adjacency list
// Set default color
colorInput.value = "#000000";
// Initialize the canvas background
drawingContext.fillStyle = "#ffffff";
drawingContext.fillRect(0, 0, canvas.width, canvas.height);
{
    guide.style.width = `${canvas.width}px`;
    guide.style.height = `${canvas.height}px`;
    guide.style.gridTemplateColumns = `repeat(${CELL_SIDE_COUNT}, 1fr)`;
    guide.style.gridTemplateRows = `repeat(${CELL_SIDE_COUNT}, 1fr)`;

    [...Array(CELL_SIDE_COUNT ** 2)].forEach(() =>
        guide.insertAdjacentHTML("beforeend", "<div></div>")
    );
}

let MakingPath = 0;
let GraphData = [];


mapSize.oninput = function () {
    while (guide.firstChild) {
        guide.removeChild(guide.firstChild);
    }
    mapSizeDemo.innerHTML = this.value;
    size = parseInt(this.value);

    CELL_SIDE_COUNT = size;
    cellPixelLength = canvas.width / CELL_SIDE_COUNT;
    colorHistory = {};
    graph = {};
    colorInput.value = "#000000";
    drawingContext.fillStyle = "#ffffff";
    drawingContext.fillRect(0, 0, canvas.width, canvas.height);
    if (toggleGuide.checked) {
        guide.style.width = `${canvas.width}px`;
        guide.style.height = `${canvas.height}px`;
        guide.style.gridTemplateColumns = `repeat(${CELL_SIDE_COUNT}, 1fr)`;
        guide.style.gridTemplateRows = `repeat(${CELL_SIDE_COUNT}, 1fr)`;

        [...Array(CELL_SIDE_COUNT ** 2)].forEach(() =>
            guide.insertAdjacentHTML("beforeend", "<div></div>")
        );
    }
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
    } else if (event.shiftKey) {
        deleteCell(cellX, cellY);

    } else {
        fillCell(cellX, cellY);
        graph[`${cellX}_${cellY}`] = [];
    }
}

function handleClearButtonClick() {
    const yes = confirm("Are you sure you wish to clear the canvas?");

    if (!yes) return;
    colorHistory = {};
    graph = {};
    drawingContext.fillStyle = "#ffffff";
    drawingContext.fillRect(0, 0, canvas.width, canvas.height);
}


function handleToggleGuideChange() {
    guide.style.display = toggleGuide.checked ? null : "none";

}


function addPath(event) {
    console.log("start")
    canvas.removeEventListener('mousedown', handleCanvasMousedown)
    canvas.addEventListener('mousedown', getPos)
}

function getPos(event) {
    const canvasBoundingRect = canvas.getBoundingClientRect();
    const x = event.clientX - canvasBoundingRect.left;
    const y = event.clientY - canvasBoundingRect.top;
    console.log(`${x}, ${y}`);
    const cellX = Math.floor(x / cellPixelLength);
    const cellY = Math.floor(y / cellPixelLength);
    console.log(`${cellX}, ${cellY}`);
    if (`${cellX}_${cellY}` in colorHistory) {
        GraphData.push([cellX, cellY]);
        MakingPath += 1;

        if (MakingPath === 2) {
            console.log(GraphData)
            let pathStart = GraphData[0];
            let pathEnd = GraphData[1];
            console.log(graph);
            console.log(pathStart, pathEnd);
            let dist = calcDistance(pathStart[0], pathStart[1], pathEnd[0], pathEnd[1]);
            graph[`${pathStart[0]}_${pathStart[1]}`].push([`${pathEnd[0]}_${pathEnd[1]}`, dist]);
            graph[`${pathEnd[0]}_${pathEnd[1]}`].push([`${pathStart[0]}_${pathStart[1]}`, dist]);
            drawPath(pathStart[0], pathStart[1], pathEnd[0], pathEnd[1]);
            console.log(graph);

            canvas.removeEventListener('mousedown', getPos);
            canvas.addEventListener('mousedown', handleCanvasMousedown);

            GraphData = [];
            MakingPath = 0;
        }
    } else {
        console.log('Wrong position!')
    }
}

function deleteCell(cellX, cellY) {
    const startX = cellX * cellPixelLength;
    const startY = cellY * cellPixelLength;

    drawingContext.clearRect(startX, startY, cellPixelLength, cellPixelLength);
    delete colorHistory[`${cellX}_${cellY}`];
    drawingContext.fillStyle = "#FFFFFF";
    drawingContext.fillRect(startX, startY, cellPixelLength, cellPixelLength);
}

function fillCell(cellX, cellY, color = colorInput.value) {
    const startX = cellX * cellPixelLength;
    const startY = cellY * cellPixelLength;

    drawingContext.fillStyle = color;
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

function drawPath(x1, y1, x2, y2) {
    x1 += 0.5;
    y1 += 0.5;
    x2 += 0.5;
    y2 += 0.5;
    drawingContext.fillStyle = "#000000";
    drawingContext.lineWidth = 5;
    drawingContext.beginPath();
    drawingContext.moveTo(x1 * cellPixelLength, y1 * cellPixelLength);
    drawingContext.lineTo(x2 * cellPixelLength, y2 * cellPixelLength);
    drawingContext.stroke();
    drawingContext.closePath();
}


canvas.addEventListener("mousedown", handleCanvasMousedown);
clearButton.addEventListener("click", handleClearButtonClick);
toggleGuide.addEventListener("change", handleToggleGuideChange);
makePath.addEventListener("click", addPath);
