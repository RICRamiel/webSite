let data = [];
let names = [];
let comic = [];


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


/*Обновление порога энропии*/
// порог энтропии, при достижении которого следует остановить построение дерева
const entropy = document.getElementById("entropy");
const entropyDemo = document.getElementById("entropyDemo");
let ent = parseFloat(entropy.value);
entropyDemo.innerHTML = ent;
entropy.oninput = function () {
    entropyDemo.innerHTML = this.value;
    ent = parseFloat(entropy.value);
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
        /*TreeData(TreeAndRoot, "#tree");*/
    }
})


/*Чтение данный для прохода по дереву*/
document.getElementById("input").addEventListener("change", function () {
    let reader = new FileReader();
    reader.readAsText(document.getElementById("input").files[0]);

    reader.onload = function () {
        nowFile = reader.result;
        comic = nowFile.split(",");
    }
})


/*!!!Не равботает*/
/*Созданеи высплывающего списка выбора категории построения дерева*/
function createSelect(arr, id){
    let str = '';
    for (i = 0; i < arr.length; i++){
        str = str + '<option value='+names[i]+'>'+names[i]+'</option>';
    }
    document.getElementById(id).innerHTML = '<label>Set category for search: <select>'+str +'</select></label>';
}


/*Создание чекбоксов для выбора игнорируемых атрибутов*/
function createCheckbox(arr, id){
    document.getElementById(id).innerHTML = '<label>Set ignored attributes:</label>';
    let ign = document.querySelector("#ignoredAttr");
    for (var i = 0; i < arr.length; i++){
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
function checkCheckbox(arr){
    let checkedArr = [];
    for (i = 0; i < arr.length; i++){
        if (document.getElementById(arr[i]).checked){
            checkedArr.push(arr[i]);
        }
    }
    return checkedArr;
}


/*Разбиение тренировочных данных на категории*/
function makeTree(inputData) {
    var newTree = [];
    var allTextLines = inputData.split(/\r\n|\n/);
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

var dt = function () {
    function n(config) {
        var trainSet = v, minItem = config.trainingSet, category = config.ignoredAttributes, entr = {};
        if (category) for (var mxDepth in category) entr[category[mxDepth]] = !0;
        this.root = trainSet({
            trainingSet: minItem,
            ignoredAttributes: entr,
            categoryAttr: config.categoryAttr || "category",
            minItemsCount: config.minItemsCount || 1,
            entropyThrehold: config.entropyThrehold || 0.01,
            maxTreeDepth: config.maxTreeDepth || 70
        })
    }

    function p(config, trainSet) {
        for (var minItem = config.trainingSet, category = [], entr = 0; entr < trainSet; entr++) category[entr] = [];
        for (entr = minItem.length - 1; 0 <= entr; entr--) category[entr % trainSet].push(minItem[entr]);
        minItem = [];
        for (entr = 0; entr < trainSet; entr++) {
            config.trainingSet = category[entr];
            var mxDepth = new n(config);
            minItem.push(mxDepth)
        }
        this.trees = minItem
    }

    function q(config, trainSet) {
        for (var minItem = {}, category = config.length - 1; 0 <= category; category--) minItem[config[category][trainSet]] = 0;
        for (category = config.length - 1; 0 <= category; category--) minItem[config[category][trainSet]] += 1;
        return minItem
    }

    function w(config, trainSet) {
        var minItem = q(config, trainSet), category = 0, entr, mxDepth;
        for (mxDepth in minItem) entr = minItem[mxDepth] / config.length, category += -entr * Math.log(entr);
        return category
    }

    function x(config, trainSet) {
        var minItem = q(config, trainSet), category = 0, entr, mxDepth;
        for (mxDepth in minItem) minItem[mxDepth] > category && (category = minItem[mxDepth], entr = mxDepth);
        return entr
    }

    function v(config) {
        var trainSet = config.trainingSet, 
            minItem = config.minItemsCount, 
            category = config.categoryAttr, 
            entr = config.entropyThrehold, 
            mxDepth = config.maxTreeDepth,
            ignSet = config.ignoredAttributes;

        if (0 === mxDepth || trainSet.length <= minItem) return {category: x(trainSet, category)};
        minItem = w(trainSet, category);
        if (minItem <= entr) return {category: x(trainSet, category)};
        for (var m = {}, entr = {gain: 0},
                 y = trainSet.length - 1; 0 <= y; y--) {
            var p = trainSet[y], k;
            for (k in p) if (k != category && !ignSet[k]) {
                var s = p[k], t;
                t = "number" == typeof s ? ">=" : "==";
                var r = k + t + s;
                if (!m[r]) {
                    m[r] = !0;
                    var r = D[t], g;
                    g = trainSet;
                    for (var l = k, z = r, h = s, q = [], B = [], u = void 0, C = void 0, A = g.length - 1; 0 <= A; A--) u = g[A], C = u[l], z(C, h) ? q.push(u) : B.push(u);
                    g = {match: q, notMatch: B};
                    l = w(g.match, category);
                    z = w(g.notMatch, category);
                    h = 0;
                    h += l * g.match.length;
                    h += z * g.notMatch.length;
                    h /= trainSet.length;
                    l = minItem - h;
                    l > entr.gain && (entr = g, entr.predicateName = t, entr.predicate = r, entr.attribute = k, entr.pivot = s, entr.gain = l)
                }
            }
        }
        if (!entr.gain) return {category: x(trainSet, category)};
        config.maxTreeDepth = mxDepth - 1;
        config.trainingSet = entr.match;
        trainSet = v(config);
        config.trainingSet = entr.notMatch;
        config = v(config);
        return {
            attribute: entr.attribute,
            predicate: entr.predicate,
            predicateName: entr.predicateName,
            pivot: entr.pivot,
            match: trainSet,
            notMatch: config,
            matchedCount: entr.match.length,
            notMatchedCount: entr.notMatch.length
        }
    }

    n.prototype.predict = function (config) {
        entr:{
            for (var trainSet = this.root, minItem, category, entr; ;) {
                if (trainSet.category) {
                    config = trainSet.category;
                    break entr
                }
                minItem = trainSet.attribute;
                minItem = config[minItem];
                category = trainSet.predicate;
                entr = trainSet.pivot;
                trainSet = category(minItem, entr) ? trainSet.match : trainSet.notMatch
            }
            config = void 0
        }
        return config
    };
    p.prototype.predict = function (config) {
        var trainSet = this.trees, minItem = {},
            category;
        for (category in trainSet) {
            var entr = trainSet[category].predict(config);
            minItem[entr] = minItem[entr] ? minItem[entr] + 1 : 1
        }
        return minItem
    };
    var D = {
        "==": function (config, trainSet) {
            return config == trainSet
        }, ">=": function (config, trainSet) {
            return config >= trainSet
        }
    }, m = {};
    m.DecisionTree = n;
    m.RandomForest = p;
    return m
}();


function doItStupidPC() {
    if (data.length === 0) {
        alert("You are the stupid man! You need to give me a file!");
        return;
    }

    /*почемуто не работает*/
    const selectElement = document.getElementById('categoryAttr');
    const selectedFruit = selectElement.value;
    console.log(selectedFruit);
    var config = {
        trainingSet: data,
        categoryAttr: 'sex',
        /*categoryAttr: document.getElementById('categoryAttr').selectElement.value*/
        ignoredAttributes: checkCheckbox(names),
        maxTreeDepth: mtd,
        entropyThrehold: ent,
        // порог количества элементов обучающей выборки, при достижении которого следует остановить построение дерева
        minItemsCount: 1
    };

// построение дерева принятия решений:
    var decisionTree = new dt.DecisionTree(config);

// вот так можно пострить лес принятия решений:
    var numberOfTrees = 3;
    var randomForest = new dt.RandomForest(config, numberOfTrees);

    var comic = {person: 'Comic guy', hairLength: 8, weight: 290, age: 38};

    var decisionTreePrediction = decisionTree.predict(comic);
// результатом классификации с использованием дерева принятия решений
// является название класса, к которому следует отнести классифицируемый объект

    var randomForestPrediction = randomForest.predict(comic);
// результатом классификации с использованием леса деревьев принятия решений
// есть объект, полями которого являются названия классов,
// а значениями полей - является количество деревьев, которые "проголосовали" за то,
// что классифицируемый объект принадлежит к соответствующему классу
//
// таким образом - чем больше деревьев проголосовало за какой-то класс,
// тем больше вероятность того, что объект относится к данному классу

// Displaying predictions
    document.getElementById('testingItem').innerHTML = JSON.stringify(comic, null, 0);
    document.getElementById('decisionTreePrediction').innerHTML = JSON.stringify(decisionTreePrediction, null, 0);
    document.getElementById('randomForestPrediction').innerHTML = JSON.stringify(randomForestPrediction, null, 0);

// Displaying Decision Tree
    console.log(decisionTree);
    document.getElementById('displayTree').innerHTML = treeToHtml(decisionTree.root);


// Recursive (DFS) function for displaying inner structure of decision tree
    function treeToHtml(tree) {

        // only leafs containing category
        if (tree.category) {
            return ['<ul>',
                '<li>',
                '<a href="#">',
                '<b>', tree.category, '</b>',
                '</a>',
                '</li>',
                '</ul>'].join('');
        }

        return ['<ul>',
            '<li>',
            '<a href="#">',
            '<b>', tree.attribute, ' ', tree.predicateName, ' ', tree.pivot, ' ?</b>',
            '</a>',
            '<ul>',
            '<li>',
            '<a href="#">yes</a>',
            treeToHtml(tree.match),
            '</li>',
            '<li>',
            '<a href="#">no</a>',
            treeToHtml(tree.notMatch),
            '</li>',
            '</ul>',
            '</li>',
            '</ul>'].join('');
    }
}

