function calculateFitness() {
    for (var i = 0; i < popSize; i++) {
        population[i] = shuffle(order);
        var dist = getDistance(cities, population[i]);
        fitness[i] = 1 / (dist + 1);
        if (minDistance > dist) {
            minDistance = dist;
            bestPath = population[i];
        }
    }
    return bestPath;
}


function normalizeFitness() {
    var sum = 0;
    for (var i = 0; i < fitness.length; i++) {
        sum += fitness[i];
    }
    var total = 0;
    for (var i = 0; i < fitness.length; i++) {
        fitness[i] = fitness[i] / sum;
    }
}

function pickOne(list, prob) {
    var i = 0;
    var r = random(1);
    while (r > 0) {
        r = r - prob[i];
        i++;
    }
    i--;
    return list[i].slice();
}


function generateNext() {
    var newPopulation = [];
    for (var i = 0; i < population.length; i++) {
        var orderA = pickOne(population, fitness);
        var orderB = pickOne(population, fitness);
        selectedOrder = crossOver(orderA.slice(), orderB.slice());
        mutate(selectedOrder, 0.005);
        newPopulation[i] = population;
    }

    population = newPopulation;

}

function crossOver(orderA, orderB) {
    var start = floor(random(orderA.length));
    var end = floor(start + 1, orderA.length);
    var result = orderA.slice(start, end);
    for (var i = 0; i < orderB.length; i++) {
        if (!result.includes(orderB[i])) {
            result.push(orderB[i]);
        }
    }
    return result;
}


function mutate(a, rate) {
    for (var i = 0; i < totalCities; i++) {
        if (random(1) < rate) {
            var indexA = floor(random(totalCities));
            var indexB = (indexA + 1) % totalCities
            swapArr(a, indexA, indexB);
        }
    }
}
