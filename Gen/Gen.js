function calculateFitness() {
    for (let i = 0; i < popSize; i++) {
        population[i] = shuffle(order);
        let dist = getDistance(cities, population[i]);
        fitness[i] = 1 / (dist + 1);
        if (minDistance > dist) {
            minDistance = dist;
            bestPath = population[i];
        }
    }
    return bestPath;
}


function normalizeFitness() {
    let sum = 0;
    for (let i = 0; i < fitness.length; i++) {
        sum += fitness[i];
    }
    let total = 0;
    for (let i = 0; i < fitness.length; i++) {
        fitness[i] = fitness[i] / sum;
    }
}

function pickOne(list, prob) {
    let i = 0;
    let r = random(1);
    while (r > 0) {
        r = r - prob[i];
        i++;
    }
    i--;
    return list[i].slice();
}


function generateNext() {
    let newPopulation = [];
    for (let i = 0; i < population.length; i++) {
        let orderA = pickOne(population, fitness);
        let orderB = pickOne(population, fitness);
        selectedOrder = crossOver(orderA.slice(), orderB.slice());
        mutate(selectedOrder, mutateProcent);
        newPopulation[i] = population;
    }

    population = newPopulation;

}

function crossOver(orderA, orderB) {
    let start = floor(random(orderA.length));
    let end = floor(start + 1, orderA.length);
    let result = orderA.slice(start, end);
    for (let i = 0; i < orderB.length; i++) {
        if (!result.includes(orderB[i])) {
            result.push(orderB[i]);
        }
    }
    return result;
}


function mutate(a, rate) {
    for (let i = 0; i < totalCities; i++) {
        if (random(1) < rate) {
            let indexA = floor(random(totalCities));
            let indexB = (indexA + 1) % totalCities
            swapArr(a, indexA, indexB);
        }
    }
}
