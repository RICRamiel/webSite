function calcDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)).toFixed(2);
}


function calcAllDist(path){
    let sum = 0;
    for(let node of path){
        sum+=node[1];
    }
    return sum;
}



function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}
