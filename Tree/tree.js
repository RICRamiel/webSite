'use strict';

let nowFile;
let TreeAndRoot;
document.getElementById("input").addEventListener("change", function (){
    let reader = new FileReader();
    reader.readAsText(document.getElementById("input").files[0]);

    reader.onload = function (){
        nowFile = reader.result;
        makeTree(nowFile);
        TreeData(TreeAndRoot, "#tree");
    }
})

function makeTree(data){
    var allTextLines = data.split(/\r\n|\n/);

    var root = allTextLines[0].split(',')[0];

    var tree = {};

    for (var i=0; i<allTextLines.length; i++) {
        var line = allTextLines[i].split(',');
        var node = line[0];
        tree[node] = {};
        for (var ii = 1; ii<line.length; ii+=2){
            tree[node][line[ii]] = line[ii+1];
        }
    }
    console.log([root, tree]);
    TreeAndRoot = [root, tree];
    return [root, tree];
}

function TreeData (data, select) {
    var main = document.querySelector(select);
    var treecanvas = document.createElement('div');
    treecanvas.className = 'tree';

    var treeCode = buildTree(TreeAndRoot[1], TreeAndRoot[0]);
    treecanvas.innerHTML = treeCode;
    main.appendChild(treecanvas);
}

function buildTree (obj, node) {
    var treeString = "<li><a href='#'>" + node + "</a>";
    var sons = [];
    if (!(node in obj)){
        return treeString;
    }
    for (const [key, value] of Object.entries(obj[node])){
        sons.push(value);
        console.log(key, value);
    }
    if (sons.length > 0) {
        treeString += "<ul>";
        for (var i in sons) {
            treeString += buildTree(obj, sons[i]);
        }
        treeString += "</ul>";
    }
    console.log(treeString);
    return treeString;
}


/*var tree = {"Root" : {"If1": "Node1", "If2": "Node2"},
    "Node1":{"If3": "Node3", "If4": "Node4"},
    "Node4":{"If5": "Node5", "If6": "Node6", "If7": "Node7"},
};

var node = "Root";
while (true){
    var answer = prompt("What do you want?");
    var check = false;
    for (const [key, value] of Object.entries(tree[node])) {
        if (key == answer){
            var nextNode = value;
            break;
        }
    }
    for ((key) in tree){
        if (key == nextNode){
            check = true;
            node = nextNode;
            break;
        }
    }
    if (!check){
        console.log(nextNode);
        break;
    }
}*/

/*
'use strict';

function TreeData (data, select) {
    var main = document.querySelector(select);
    var treecanvas = document.createElement('div');
    treecanvas.className = 'tree';

    var treeCode = buildTree(data, Object.keys(data)[0]);
    treecanvas.innerHTML = treeCode;
    main.appendChild(treecanvas);
}

function buildTree (obj, node) {
    var treeString = "<li><a href='#'>" + obj[node].value + "</a>";
    var sons = [];
    for (var i in obj) {
        if (obj[i].parent == node)
            sons.push(i);
    }
    if (sons.length > 0) {
        treeString += "<ul>";
        for (var i in sons) {
            treeString += buildTree(obj, sons[i]);
        }
        treeString += "</ul>";
    }
    return treeString;
}
*/
