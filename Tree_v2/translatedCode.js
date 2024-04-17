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


let ent = 0.05;
/*/!*Обновление порога энропии*!/
// порог энтропии, при достижении которого следует остановить построение дерева
const entropy = document.getElementById("entropy");
const entropyDemo = document.getElementById("entropyDemo");
let ent = parseFloat(entropy.value);
entropyDemo.innerHTML = ent;
entropy.oninput = function () {
    entropyDemo.innerHTML = this.value;
    ent = parseFloat(entropy.value);
}*/


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


/*Созданеи высплывающего списка выбора категории построения дерева*/
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
    let checkedArr = [];
    for (i = 0; i < arr.length; i++) {
        if (document.getElementById(arr[i]).checked) {
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
    // отвечает за построение дерева решений
    // сюда в первую очередб переходит начальный config и trainingSet
    function n(config) {
        //видоизмение игноров ['person'] -> {'person': true}
        var d = config.ignoredAttributes;
        var a = {};
        if (d) for (var f in d) a[d[f]] = !0;

        this.root = v({
            trainingSet: config.trainingSet,
            ignoredAttributes: a,
            categoryAttr: config.categoryAttr || "category",
            minItemsCount: config.minItemsCount || 1,
            entropyThrehold: config.entropyThrehold || 0.01,
            maxTreeDepth: config.maxTreeDepth || 70
        })
    }

    // лес деревьев
    function p(b, c) {
        for (var e = b.trainingSet, d = [], a = 0; a < c; a++)
            d[a] = [];

        for (a = e.length - 1; 0 <= a; a--)
            d[a % c].push(e[a]);

        e = [];

        for (a = 0; a < c; a++) {
            b.trainingSet = d[a];
            var f = new n(b);
            e.push(f)
        }

        this.trees = e
    }

    // считает сколько в train объектов данной категории
    function q(trainSet, categories) {
        let e = {};

        for (let d = trainSet.length - 1; 0 <= d; d--)
            e[trainSet[d][categories]] = 0;

        for (let d = trainSet.length - 1; 0 <= d; d--)
            e[trainSet[d][categories]] += 1;

        return e
    }

    //  энтропия Шенонна
    function ShannonEntropy(trainSet, categories) {
        var e = q(trainSet, categories);
        var d = 0;
        var a;

        for (var f in e) {
            a = e[f] / trainSet.length;
            d -= a * Math.log(a);
        }

        return d
    }

    // возврящает категорию с наиб количеством объектов в ней
    function x(trainSet, categories) {
        // е например  {female:0, male:1}
        var e = q(trainSet, categories);
        let d = 0;
        var a;

        for (let f in e) {
            if (e[f] > d) {
                d = e[f];
                a = f;
            }
        }

        return a
    }

    // сюда приходит адаптированный config
    function v(config) {
        var trainSet = config.trainingSet;
        var categories = config.categoryAttr;
        var mxTreeD = config.maxTreeDepth;
        var n = config.ignoredAttributes;

        // если мы дошли до максимальной глубины дерева (или изн глубина 0)?
        // или ????????????????
        // то вызываем Х

        // как понимаю нужно для листов

        // возвращаент категорию объединяющую большинство оставшихся объектов
        if (0 === mxTreeD || trainSet.length <= config.minItemsCount)
            return {category: x(trainSet, categories)};

        var e = ShannonEntropy(trainSet, categories);

        // видимо снова лист
        if (e <= config.entropyThrehold)
            return {category: x(trainSet, categories)};

        var m = {};
        var a = {gain: 0};
        for (let y = 0; y < trainSet.length; y++) {
            let p = trainSet[y]; // строчка тренировки

            for (let k in p) {
                // смотрим только среди категорий не для поиска
                // и не игнорируемых
                if (k === categories || n[k])
                    continue;


                let s = p[k];
                let t = "number" == typeof s ? ">=" : "==";

                var r = k + t + s; // "category" >=/== 'value'

                if (!m[r]) {
                    m[r] = true;

                    r = D[t];

                    // проверяет сколько подходящих под категорию и сколько нет
                    let g = {match: [], notMatch: []};
                    for (var u = void 0, C = void 0, A = 0; A < trainSet.length; A++) {
                        u = trainSet[A];
                        C = u[k];
                        r(C, s) ? g.match.push(u) : g.notMatch.push(u);
                    }

                    // энтропии для обоих
                    let l = ShannonEntropy(g.match, categories);
                    let z = ShannonEntropy(g.notMatch, categories);
                    let h = 0;
                    h += l * g.match.length;
                    h += z * g.notMatch.length;
                    h /= trainSet.length;
                    l = e - h;

                    if (l > a.gain) {
                        a = g;
                        a.predicateName = t;
                        a.predicate = r;
                        a.attribute = k;
                        a.pivot = s;
                        a.gain = l
                    }
                }
            }
        }

        if (!a.gain)
            return {category: x(trainSet, categories)};

        config.maxTreeDepth = mxTreeD - 1;

        // рекурсивно разбиваем оставшиеся множества
        config.trainingSet = a.match;
        trainSet = v(config);

        config.trainingSet = a.notMatch;
        config = v(config);

        return {
            attribute: a.attribute,
            predicate: a.predicate,
            predicateName: a.predicateName,
            pivot: a.pivot,
            match: trainSet,
            notMatch: config,
            matchedCount: a.match.length,
            notMatchedCount: a.notMatch.length
        }
    }

    n.prototype.predict = function (b) {
        a:{
            for (var c = this.root, e, d, a; ;) {
                if (c.category) {
                    b = c.category;
                    break a
                }
                e = c.attribute;
                e = b[e];
                d = c.predicate;
                a = c.pivot;
                c = d(e, a) ? c.match : c.notMatch
            }
        }
        return b
    };

    p.prototype.predict = function (b) {
        var c = this.trees, e = {},
            d;
        for (d in c) {
            var a = c[d].predict(b);
            e[a] = e[a] ? e[a] + 1 : 1
        }
        return e
    };

    var D = {
        "==": function (b, c) {
            return b === c
        },

        ">=": function (b, c) {
            return b >= c
        }
    };

    return {DecisionTree: n, RandomForest: p};
}();

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


function doItStupidPC() {
    if (data.length === 0) {
        alert("You are the stupid man! You need to give me a file!");
        return;
    }

    if (selEl == undefined) {
        selEl = names[0];
    }

    var config = {
        trainingSet: data,
        categoryAttr: selEl,
        /*categoryAttr: document.getElementById('categoryAttr').selectElement.value*/
        ignoredAttributes: checkCheckbox(names),
        maxTreeDepth: mtd,
        entropyThrehold: ent,
        // порог количества элементов обучающей выборки, при достижении которого следует остановить построение дерева
        minItemsCount: 3
    };

// построение дерева принятия решений:
    var decisionTree = new dt.DecisionTree(config);

// вот так можно пострить лес принятия решений:
    var numberOfTrees = 3;
    /*    var randomForest = new dt.RandomForest(config, numberOfTrees);*/

    /*var comic = {person: 'Comic guy', hairLength: 8, weight: 290, age: 38};*/

    var decisionTreePrediction = decisionTree.predict(comic);
// результатом классификации с использованием дерева принятия решений
// является название класса, к которому следует отнести классифицируемый объект

    /*    var randomForestPrediction = randomForest.predict(comic);*/
// результатом классификации с использованием леса деревьев принятия решений
// есть объект, полями которого являются названия классов,
// а значениями полей - является количество деревьев, которые "проголосовали" за то,
// что классифицируемый объект принадлежит к соответствующему классу
//
// таким образом - чем больше деревьев проголосовало за какой-то класс,
// тем больше вероятность того, что объект относится к данному классу

// Displaying predictions
    /*document.getElementById('testingItem').innerHTML = JSON.stringify(comic, null, 0);*/
    document.getElementById('decisionTreePrediction').innerHTML = JSON.stringify(decisionTreePrediction, null, 0);
    /*document.getElementById('randomForestPrediction').innerHTML = JSON.stringify(randomForestPrediction, null, 0);*/

// Displaying Decision Tree
    console.log(decisionTree);
    document.getElementById('displayTree').innerHTML = treeToHtml(decisionTree.root);

}

