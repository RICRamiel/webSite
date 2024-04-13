var data = [];
var names = [];
var comic = [];


/*Генерация дерева*/
document.getElementById("gen").addEventListener("click", doItStupidPC);


/*Обновление максимальной глубины дерева*/
const maxTree = document.getElementById("maxTree");
const maxTreeDemo = document.getElementById("maxTreeDemo");
let mtd = parseInt(maxTree.value);
maxTreeDemo.innerHTML = mtd;
maxTree.oninput = function () {
    maxTreeDemo.innerHTML = this.value;
    mtd = parseInt(maxTree.value);
}


/*Чтение тренировочной таблицы*/
document.getElementById("input").addEventListener("change", function () {
    let reader = new FileReader();
    reader.readAsText(document.getElementById("input").files[0]);

    reader.onload = function () {
        nowFile = reader.result;
        data = makeTree(nowFile);
        createCheckbox(names, 'ignoredAttr');
        createSelect(names, 'categoryAttr');
    }
})


/*Чтение данный для прохода по дереву*/
document.getElementById("inputTest").addEventListener("change", function () {
    let reader2 = new FileReader();
    reader2.readAsText(document.getElementById("inputTest").files[0]);

    reader2.onload = function () {
        nowComicFile = reader2.result;
        comic = makeTree(nowComicFile)[0];
        showTest();
    }
})

function showTest() {
    document.getElementById('testingItem').innerHTML = 'Your test input:' + JSON.stringify(comic, null, 1);
}


/*Создание всплывающего списка для выбора категории построения дерева*/
function createSelect(arr, id) {
    let str = '';
    for (i = 0; i < arr.length; i++) {
        str = str + '<option value=' + names[i] + '>' + names[i] + '</option>';
    }
    document.getElementById(id).innerHTML = '<label>Set category for search: <select>' + str + '</select></label>';
}


let selEl;
document.getElementById('categoryAttr').addEventListener('change', (event) => {
    selEl = event.target.value;
});


/*Создание чекбоксов для выбора игнорируемых атрибутов*/
function createCheckbox(arr, id) {
    document.getElementById(id).innerHTML = '<label>Set ignored attributes:</label>';
    let ign = document.querySelector("#ignoredAttr");
    for (var i = 0; i < arr.length; i++) {
        let inp = document.createElement('input');
        inp.setAttribute("type", "checkbox");
        inp.setAttribute('id', arr[i]);
        let lab = document.createElement("label");
        lab.innerText = arr[i];
        ign.appendChild(inp);
        ign.appendChild(lab);
    }
}


/*Какие чекбоксы отметили?*/
function checkCheckbox(arr) {
    let checkedArr = {};
    for (let i = 0; i < arr.length; i++) {
        if (document.getElementById(arr[i]).checked) {
            checkedArr[arr[i]] = true;
        }
    }
    return checkedArr;
}


/*Разбиение тренировочных данных на категории*/
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


// _____________________________________________________________________________________________________________________

// Подсчет элементов в категориях
function countItems(trainSet, category) {
    let numberOfElements = {};

    for (let d = trainSet.length - 1; 0 <= d; d--)
        numberOfElements[trainSet[d][category]] = 0;

    for (let d = trainSet.length - 1; 0 <= d; d--)
        numberOfElements[trainSet[d][category]] += 1;

    return numberOfElements
}


//  энтропия Шенонна
function ShannonEntropy(trainSet, category) {
    let c = countItems(trainSet, category);
    let entropy = 0;
    let p;

    for (let f in c) {
        p = c[f] / trainSet.length;
        entropy -= p * Math.log(p);
    }

    return entropy
}


// возвращает название категории, в зависимости от того каких элементов больше
function leaf(trainSet, category) {
    // е например  {female:0, male:1}
    let e = countItems(trainSet, category);
    let d = 0;
    let a;

    for (let f in e) {
        if (e[f] > d) {
            d = e[f];
            a = f;
        }
    }

    return a
}

let ansColor = "rgb(201, 173, 167)";
let otherColor = "none";

function makeNodes(config, color) {
    let trainSet = config.trainingSet;
    let cat = config.categoryAttr;
    let e = ShannonEntropy(trainSet, cat);

    // если выполняются условия достаточные для листа, то сразу делаю лист
    if (0 === config.maxTreeDepth || trainSet.length <= config.minItemsCount || e <= config.entropyThreshold)
        return {category: leaf(trainSet, cat), NodeColor: color};

    let variants = {};
    let info = {gain: 0};

    for (let y = 0; y < trainSet.length; y++) {
        let p = trainSet[y]; // строчка тренировки
        for (let k in p) {
            if (k === cat || config.ignoredAttributes[k])
                continue;

            let value = p[k]
            let operator = "number" == typeof value ? ">=" : "==";
            let question = k + operator + value;

            if (!variants[question]) {
                variants[question] = true;

                question = op[operator];

                let way = {match: [], notMatch: []};

                for (let u = void 0, C = void 0, i = 0; i < trainSet.length; i++) {
                    u = trainSet[i];
                    C = u[k];
                    question(C, value) ? way.match.push(u) : way.notMatch.push(u);
                }

                // энтропии для обоих
                let matchEnt = ShannonEntropy(way.match, cat);
                let notMatchEnt = ShannonEntropy(way.notMatch, cat);

                let h = 0;
                h += matchEnt * way.match.length;
                h += notMatchEnt * way.notMatch.length;
                h /= trainSet.length;

                let difference = e - h;

                if (difference > info.gain) {
                    info = way;
                    info.predicateName = operator;
                    info.predicate = question;
                    info.attribute = k;
                    info.pivot = value;
                    info.gain = difference;
                }
            }
        }
    }

    // лист
    if (!info.gain)
        return {category: leaf(trainSet, cat), NodeColor: color};

    config.maxTreeDepth--;

    //сразу контролирую по каким веткам идет ответ
    let c1 = otherColor;
    let c2 = otherColor;
    if (color === ansColor){
        op[info.predicateName](comic[info.attribute], info.pivot) ? c1 = ansColor : c2 = ansColor;
    }

    // рекурсивно разветвляем дерево дальше
    config.trainingSet = info.match;
    let matches = makeNodes(config, c1);

    config.trainingSet = info.notMatch;
    let notMatches = makeNodes(config,c2);

    return {
        attribute: info.attribute,
        predicate: info.predicate,
        predicateName: info.predicateName,
        pivot: info.pivot,
        match: matches,
        notMatch: notMatches,
        matchedCount: info.match.length,
        notMatchedCount: info.notMatch.length,
        NodeColor: color
    }
}

// арифметические операторы для узлов-вопросов
let op = {
    "==": function (b, c) {
        return b === c
    },

    ">=": function (b, c) {
        return b >= c
    }
};

function treeToHtml(tree) {

    // листы
    if (tree.category) {
        return ['<ul><li><a style=\"background: ' +  tree.NodeColor +  '\">' +  tree.category + '</a></li></ul>'].join('');
    }

    // остальные узлы
    return ['<ul>',
                '<li>',

                    '<a style=\"background: ' +  tree.NodeColor +  '\">',
                        '<b>', tree.attribute, ' ', tree.predicateName, ' ', tree.pivot, ' ?</b>',
                    '</a>',

                    '<ul>',
                        '<li>',
                            '<a style=\"background: ' +  tree.match.NodeColor +  '\"> yes </a>',
                            treeToHtml(tree.match),
                        '</li>',
                        '<li>',
                            '<a style=\"background: ' +  tree.notMatch.NodeColor +  '\"> no </a>',
                            treeToHtml(tree.notMatch),
                        '</li>',
                    '</ul>',

                '</li>',
            '</ul>'].join('');
}


function doItStupidPC() {
    if (data.length === 0) {
        alert("You are the stupid man! You need to give me a file!");
        return;
    }

    let config = {
        trainingSet: data,
        ignoredAttributes: checkCheckbox(names),
        categoryAttr: selEl || names[0],
        minItemsCount: 1,
        entropyThreshold: 0.05,
        maxTreeDepth: mtd || 70
    };

    let decisionTree = makeNodes(config, ansColor);
    console.log(decisionTree);
    document.getElementById('displayTree').innerHTML = treeToHtml(decisionTree);
}

