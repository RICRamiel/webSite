var dt = function () {
    function n(b) {
        var c = v, e = b.trainingSet, d = b.ignoredAttributes, a = {};
        if (d) for (var f in d) a[d[f]] = !0;
        this.root = c({
            trainingSet: e,
            ignoredAttributes: a,
            categoryAttr: b.categoryAttr || "category",
            minItemsCount: b.minItemsCount || 1,
            entropyThrehold: b.entropyThrehold || 0.01,
            maxTreeDepth: b.maxTreeDepth || 70
        })
    }

    function p(b, c) {
        for (var e = b.trainingSet, d = [], a = 0; a < c; a++) d[a] = [];
        for (a = e.length - 1; 0 <= a; a--) d[a % c].push(e[a]);
        e = [];
        for (a = 0; a < c; a++) {
            b.trainingSet = d[a];
            var f = new n(b);
            e.push(f)
        }
        this.trees = e
    }

    function q(b,
               c) {
        for (var e = {}, d = b.length - 1; 0 <= d; d--) e[b[d][c]] = 0;
        for (d = b.length - 1; 0 <= d; d--) e[b[d][c]] += 1;
        return e
    }

    function w(b, c) {
        var e = q(b, c), d = 0, a, f;
        for (f in e) a = e[f] / b.length, d += -a * Math.log(a);
        return d
    }

    function x(b, c) {
        var e = q(b, c), d = 0, a, f;
        for (f in e) e[f] > d && (d = e[f], a = f);
        return a
    }

    function v(b) {
        var c = b.trainingSet, e = b.minItemsCount, d = b.categoryAttr, a = b.entropyThrehold, f = b.maxTreeDepth,
            n = b.ignoredAttributes;
        if (0 == f || c.length <= e) return {category: x(c, d)};
        e = w(c, d);
        if (e <= a) return {category: x(c, d)};
        for (var m = {}, a = {gain: 0},
                 y = c.length - 1; 0 <= y; y--) {
            var p = c[y], k;
            for (k in p) if (k != d && !n[k]) {
                var s = p[k], t;
                t = "number" == typeof s ? ">=" : "==";
                var r = k + t + s;
                if (!m[r]) {
                    m[r] = !0;
                    var r = D[t], g;
                    g = c;
                    for (var l = k, z = r, h = s, q = [], B = [], u = void 0, C = void 0, A = g.length - 1; 0 <= A; A--) u = g[A], C = u[l], z(C, h) ? q.push(u) : B.push(u);
                    g = {match: q, notMatch: B};
                    l = w(g.match, d);
                    z = w(g.notMatch, d);
                    h = 0;
                    h += l * g.match.length;
                    h += z * g.notMatch.length;
                    h /= c.length;
                    l = e - h;
                    l > a.gain && (a = g, a.predicateName = t, a.predicate = r, a.attribute = k, a.pivot = s, a.gain = l)
                }
            }
        }
        if (!a.gain) return {category: x(c, d)};
        b.maxTreeDepth = f - 1;
        b.trainingSet = a.match;
        c = v(b);
        b.trainingSet = a.notMatch;
        b = v(b);
        return {
            attribute: a.attribute,
            predicate: a.predicate,
            predicateName: a.predicateName,
            pivot: a.pivot,
            match: c,
            notMatch: b,
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
            b = void 0
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
            return b == c
        }, ">=": function (b, c) {
            return b >= c
        }
    }, m = {};
    m.DecisionTree = n;
    m.RandomForest = p;
    return m
}();

// Training set
var data =
    [{person: 'Homer', hairLength: 0, weight: 250, age: 36, sex: 'male'},
        {person: 'Marge', hairLength: 10, weight: 150, age: 34, sex: 'female'},
        {person: 'Bart', hairLength: 2, weight: 90, age: 10, sex: 'male'},
        {person: 'Lisa', hairLength: 6, weight: 78, age: 8, sex: 'female'},
        {person: 'Maggie', hairLength: 4, weight: 20, age: 1, sex: 'female'},
        {person: 'Abe', hairLength: 1, weight: 170, age: 70, sex: 'male'},
        {person: 'Selma', hairLength: 8, weight: 160, age: 41, sex: 'female'},
        {person: 'Otto', hairLength: 10, weight: 180, age: 38, sex: 'male'},
        {person: 'Krusty', hairLength: 6, weight: 200, age: 45, sex: 'male'}];

var config = {
    // обучающая выборка
    trainingSet: data,

    // название атрибута, который содержит название класса, к которому относится тот или иной элемент обучающей выборки
    categoryAttr: 'sex',

    // масив атрибутов, которые должны игнорироваться при построении дерева
    ignoredAttributes: ['person'],

    // при желании, можно установить ограничения:

    // максимальная высота дерева
    maxTreeDepth: 10

    // порог энтропии, при достижении которого следует остановить построение дерева
    // entropyThrehold: 0.05

    // порог количества элементов обучающей выборки, при достижении которого следует остановить построение дерева
    // minItemsCount: 3
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