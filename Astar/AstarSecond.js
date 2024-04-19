let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let canvasSize = 3;
let matrix;
let ROW;
let COL;
let d = [];
const delay = 45;
let start = null;
let end = null;
let findDraw = [];
let condition=false;
let cageSize;
createCanvas();
function createCanvas(){
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    canvas.innerHTML = "";
    canvasSize = parseInt(document.getElementById('size').value);
    ROW = canvasSize;
    COL = canvasSize;
    cageSize = canvas.width/canvasSize;
    ctx.beginPath();

    for(let i = 0; i <= canvas.width; i += cageSize){
        ctx.moveTo(i,0);
        ctx.lineTo(i,canvas.height);
    }

    for (let i = 0; i <= canvas.height; i += cageSize) {
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
    }
    canvas.style.backgroundColor = 'black';
    ctx.strokeStyle = "#ccc";
    ctx.stroke();

    start = null;
    end = null;
    matrix = createMatrix();
}

function createMatrix() {
    let matrix = [];
    for (let row = 0; row < canvasSize; row++) {
        let currentRow = [];
        for (let col = 0; col < canvasSize; col++) {
            currentRow.push(0);
        }
        matrix.push(currentRow);
    }

    return matrix;
}

function generationLab(){
    function check(pos){
        return (pos[0] >= 0 && pos[0] < canvasSize) && (pos[1] >= 0 && pos[1] < canvasSize) && !visited[pos[0]][pos[1]];
    }
    start = null;
    end = null;
    let startPos = [0, 0];
    let queue = [];
    let visited = [];
    matrix = createMatrix();
    way = [];
    for (let y = 1; y < canvasSize; y+=2) {
        for (let x = 1; x < canvasSize; x+=2) {
            matrix[x][y-1] = -1;
            matrix[x][y+1] = -1;
            matrix[x-1][y] = -1;
            matrix[x+1][y] = -1;
            matrix[x][y] = -1;
        }
    }

    for (let y = 0; y<canvasSize; y++) {
        let line = [];
        for (let x = 0; x < canvasSize; x++) {
            line.push(false);
        }
        visited.push(line);
    }

    queue.push(startPos);
    visited[startPos[0]][startPos[1]] = true;

    let avalibleMove = [[2, 0], [-2, 0], [0, 2], [0, -2]];

    do {
        let nowPos = queue[queue.length - 1];
        let posibleMoves = avalibleMove.map(x => [x[0] + nowPos[0], x[1] + nowPos[1]]);
        posibleMoves = posibleMoves.filter(check);

        //console.log(nowPos, posibleMoves);

        if (posibleMoves.length > 0) {
            let randInd = Math.floor(Math.random() * posibleMoves.length);

            let nextMove = posibleMoves[randInd];

            for (let y = 0; y <= Math.abs(nowPos[0] - nextMove[0]); y++) {
                matrix[nowPos[0] + y * (nextMove[0] - nowPos[0]) / 2][nowPos[1]] = 0;
                visited[nowPos[0] + y * (nextMove[0] - nowPos[0]) / 2][nowPos[1]] = true;
            }
            for (let x = 0; x <= Math.abs(nowPos[1] - nextMove[1]); x++) {
                matrix[nowPos[0]][nowPos[1] + x * (nextMove[1] - nowPos[1]) / 2] = 0;
                visited[nowPos[0]][nowPos[1] + x * (nextMove[1] - nowPos[1]) / 2] = true;
            }
            queue.push(nextMove);
        } else {
            queue.pop();
        }
    }while(queue.length > 0);
    showCanvas();
}

function showCanvas(){
    for (let y = 0; y <canvasSize; y++){
        for (let x = 0; x < canvasSize; x++) {
            if (matrix[y][x] == -1){
                drawCell(y, x, '#FFFFFF');
                ctx.strokeStyle = "#ccc";
                ctx.stroke();
            }
            else
            {
                drawCell(y, x, '#000000');
                ctx.strokeStyle = "#ccc";
                ctx.stroke();
            }
        }
    }
}

canvas.addEventListener('mousedown', handleClick);
function handleClick(event) {
    if (condition)
    {
        return;
    }

    if (way.length > 0){
        ClearExtra();
    }

    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    let row = Math.floor(y / cageSize);
    let col = Math.floor(x / cageSize);

    if (start !== null && start.row === row && start.col === col) {
        start = null;
        drawCell(row, col, '#000000');
        ctx.strokeStyle = "#ccc";
        ctx.stroke();
    } else {
        if (end !== null && end.row === row && end.col === col) {
            end = null;
            drawCell(row, col, '#000000');
            ctx.strokeStyle = "#ccc";
            ctx.stroke();
        } else {
            if (start === null) {
                if (matrix[row][col] == -1)
                {
                    matrix[row][col] = 0;
                }
                start = {row: row, col: col};
                drawCell(row, col, '#0f0');
                ctx.strokeStyle = "#ccc";
                ctx.stroke();
            } else {
                if (end === null) {
                    if (matrix[row][col] == -1)
                    {
                        matrix[row][col] = 0;
                    }
                    end = {row: row, col: col};
                    drawCell(row, col, '#f00');
                    ctx.strokeStyle = "#ccc";
                    ctx.stroke();
                } else{
                    if (matrix[row][col] == -1)
                    {
                        matrix[row][col] = 0;
                        drawCell(row, col, '#000000');
                        ctx.strokeStyle = "#ccc";
                        ctx.stroke();
                    }
                    else {
                        matrix[row][col] = -1;
                        drawCell(row, col, '#FFFFFF');
                        ctx.strokeStyle = "#ccc";
                        ctx.stroke();
                    }
                }
            }
        }
    }

}

function drawCell(row, col, color) {
    ctx.fillStyle = color;
    ctx.fillRect(col * cageSize, row * cageSize, cageSize, cageSize);
}

let avalible = [{y : 0, x : 1}, {y : 0, x : -1},
    {y : 1, x : 0}, {y : -1, x : 0}];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let way = [];
async function astar(){
    if(start == null || end == null){
        alert("Выберите стартовую и конечную точки");
        return;
    }
    condition=true;
    function distance(nowPos, endPos){
        return Math.abs(nowPos[0] - endPos[0]) + Math.abs(nowPos[1] - endPos[1]);
        //return Math.sqrt((nowPos[0] - endPos[0]) ** 2 + (nowPos[1] - endPos[1]) ** 2);
    }
    function choose(queue, end){
        let best = queue[0];
        for (let el of queue){
            if (distance(best, [end.row, end.col]) >= distance(el, [end.row, end.col])){
                best = el;
            }
        }
        return best;
    }

    function isCorrect(position){
        return (position[0] >= 0 && position[0] < canvasSize &&
            position[1] >= 0 && position[1] < canvasSize &&
            matrix[position[0]][position[1]] !== -1);
    }

    let queue = [];
    let visited = [];

    for (let y = 0; y<canvasSize; y++){
        let line = [];
        for (let x = 0; x<canvasSize; x++){
            line.push([-1, -1, canvasSize * canvasSize + 100, false]);
        }
        visited.push(line);
    }

    queue.push([start.row, start.col]);
    visited[start.row][start.col] = [0, 0, 0, true];
    let wave = 0;
    while(queue.length > 0){
        let nowPos = choose(queue, end.row, end.col);
        queue.splice(queue.indexOf(nowPos),1);
        visited[nowPos[0]][nowPos[1]][3] = true;

        let moves = avalible.map(move =>
            [move.y + nowPos[0], move.x + nowPos[1]]);

        moves = moves.filter(isCorrect);
        for (let nowMove of moves){
            if (!visited[nowMove[0]][nowMove[1]][3]){
                queue.push(nowMove);
                visited[nowMove[0]][nowMove[1]][3] = true;
                drawCell(nowMove[0], nowMove[1], "#C5C6C7");
                findDraw.push([nowMove[0], nowMove[1]]);
                await sleep(delay);
            }
            if (visited[nowMove[0]][nowMove[1]][2] > visited[nowPos[0]][nowPos[1]][2] + 1){
                visited[nowMove[0]][nowMove[1]] = [nowPos[0], nowPos[1], visited[nowPos[0]][nowPos[1]][2] + 1, visited[nowMove[0]][nowMove[1]][3]];
            }
        }

        if (nowPos[0] === end.row && nowPos[1] === end.col){
            let wayBack = nowPos;
            while (wayBack[0] !== start.row || wayBack[1] !== start.col){
                way.unshift(wayBack);
                wayBack = [visited[wayBack[0]][wayBack[1]][0], visited[wayBack[0]][wayBack[1]][1]];
            }
            way.unshift(wayBack);
            break;
        }
    }

    ShowPath();
}

async function ShowPath(){
    condition=true;
    if(way.length === 0){
        alert(`No path from [${start.row}, ${start.col}] to [${end.row}, ${end.col}]
`);
    }
    /*console.log(way);*/
    let wave = 0;
    for (let nowPix of way){
        drawCell(nowPix[0], nowPix[1], "#66FCF1");
        await  sleep(delay);
        wave += 1;
    }
    condition = false;
}

async function ClearExtra(){
    for(let moves of findDraw){
        drawCell(moves[0], moves[1], '#000000');
    }
    for (let moves of way){
        drawCell(moves[0], moves[1], '#000000');
    }
    findDraw = [];
    way = [];
    start = null;
    end = null;
}

function clearCanvas(){
    if (!condition)
    {
        start = null;
        end = null;
        matrix = createMatrix();
        way = [];
        showCanvas();
    }
}