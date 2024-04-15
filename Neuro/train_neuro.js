let inputLayer = new Array(784);
let firstHiddenLayer = new Array(100);
let secondHiddenLayer = new Array(100);
let outputLayer = new Array(10);

let weights1 = new Array(100);
let weights2 = new Array(100);
let weights3 = new Array(10);

for (let w = 0; w<100; w++) {
    weights1[w] = new Array(784);
    weights2[w] = new Array(100);
    for (let p = 0; p < 784; p++){
        weights1[w][p] = Math.floor(Math.random())
    }
    for (let p = 0; p < 100; p++){
        weights2[w][p] = Math.floor(Math.random())
    }
}

for (let w = 0; w<10; w++) {
    weights3[w] = new Array(100);
    for (let p = 0; p < 100; p++){
        weights3[w][p] = Math.floor(Math.random())
    }
}

let reader = new FileReader();
reader.readAsText('');

reader.onload = function () {
    nowFile = reader.result;
    data = makeTree(nowFile);
    createCheckbox(names, 'ignoredAttr');
    createSelect(names, 'categoryAttr');
}
let file =
function trainWeights(file){

}
function makeTree(inputData) {
    let newTree = [];
    let allTextLines = inputData.split(/\r\n|\n/);
    names = allTextLines[0].split(',');
    for (var i = 1; i < allTextLines.length; i++) {
        var line = allTextLines[i].split(',');
        var oneLine = {};
        for (var j = 0; j < line.length; j++) {
            var inp = +line[j];
            oneLine[names[j]] = (isNaN(inp)) ? line[j] : inp;
        }
        newTree.push(oneLine);
    }
    return newTree;
}