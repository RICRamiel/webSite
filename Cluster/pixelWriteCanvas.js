/**
 * @type HTMLCanvasElement
 */
const canvas = document.getElementById("canvas");
const guide = document.getElementById("guide");
const colorInput = document.getElementById("colorInput");
const toggleGuide = document.getElementById("toggleGuide");
const clearButton = document.getElementById("clearButton");
const drawingContext = canvas.getContext("2d");
const clusterize = document.getElementById("clusterize");
const numberOfCluster = document.getElementById("numberOfCluster");
const clusterNumDemo = document.getElementById("clusterNumDemo");
const CELL_SIDE_COUNT = 25;
const cellPixelLength = canvas.width / CELL_SIDE_COUNT;
const colorHistory = {};
var numOfClust = parseInt(numberOfCluster.value);
clusterNumDemo.innerHTML = numOfClust;
// Set default color
colorInput.value = "#000000";
numberOfCluster.oninput = function() {
    clusterNumDemo.innerHTML = this.value;
    numOfClust = parseInt(numberOfCluster.value);
}

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
    } else if (event.shiftKey) {
        deleteCell(cellX, cellY);
        // } else if (event.MOUSEOVER) {

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

function mouseMoveDraw(event) {
    const canvasBoundingRect = canvas.getBoundingClientRect();
    const x = event.clientX - canvasBoundingRect.left - event.offsetX;
    const y = event.clientY - canvasBoundingRect.top - event.offsetY;
    const cellX = Math.floor(x / cellPixelLength);
    const cellY = Math.floor(y / cellPixelLength);
    const currentColor = colorHistory[`${cellX}_${cellY}`];
    drawingContext.fillStyle = currentColor;
    console.log("hover")
    if (event.button !== 0) {
        console.log("click")
        fillCell(cellX, cellY)
    }
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
    let classes = KMeans(requestData(), numOfClust);
    console.log(classes);
    let data = requestData();
    let colors = ["#ff0000", "#00ff00","#0000ff","#349599", "#a928b5", "#d9eb13","#d656a1", "#647691", "#600cf2","#ff8800"];
    for (let i = 0; i < classes.length; i++) {
        reColorCell(data[i][0], data[i][1], colors[classes[i]]);
        console.log("pix colored")
    }
}

function cluster() {
    colorizeOnCluster()
    console.log("cluster done");
}

canvas.addEventListener("mouseover", mouseMoveDraw);
canvas.addEventListener("mousedown", handleCanvasMousedown);
clearButton.addEventListener("click", handleClearButtonClick);
toggleGuide.addEventListener("change", handleToggleGuideChange);
clusterize.addEventListener("click", cluster)
