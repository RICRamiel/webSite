function swapArr(a, i, j) {
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
}


// Calculate distance
function getDistance(a, pointOrder) {
    var sum = 0;
    for (var i = 0; i < pointOrder.length - 1; i++) {
        var ptA = a[pointOrder[i]];
        var ptB = a[pointOrder[i + 1]];
        var d = dist(ptA.x, ptA.y, ptB.x, ptB.y);
        sum += d;
    }
    return sum;
}


function timeCalc(x) {
    return 4000 / (x * 1000) + 50;
}
