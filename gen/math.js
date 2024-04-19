function swapArr(a, i, j) {
    let temp = a[i];
    a[i] = a[j];
    a[j] = temp;
}


// Calculate distance
function getDistance(a, pointOrder) {
    let sum = 0;
    for (let i = 0; i < pointOrder.length - 1; i++) {
        let ptA = a[pointOrder[i]];
        let ptB = a[pointOrder[i + 1]];
        let d = dist(ptA.x, ptA.y, ptB.x, ptB.y);
        sum += d;
    }
    return sum;
}


function timeCalc(x) {
    return 4000 / (x * 100) + 50;
}
