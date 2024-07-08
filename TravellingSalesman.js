function travelingSalesman(matrix) {
  function calculatePathCost(matrix, path) {
    let cost = 0;
    for (let i = 0; i < path.length - 1; i++) {
      cost += matrix[path[i]][path[i + 1]];
    }
    cost += matrix[path[path.length - 1]][path[0]];
    return cost;
  }

  function generateRandomPath(n) {
    let path = [...Array(n).keys()];
    path.sort(() => Math.random() - 0.5);
    return path;
  }

  const cities = matrix.length;
  let minPath = generateRandomPath(cities);
  let minCost = calculatePathCost(matrix, minPath);

  const maxIterations = 1000;
  for (let iter = 0; iter < maxIterations; iter++) {
    let randomPath = generateRandomPath(cities);
    let currentCost = calculatePathCost(matrix, randomPath);
    if (currentCost < minCost) {
      minCost = currentCost;
      minPath = randomPath;
    }
  }

  return { path: minPath, cost: minCost };
}

const matrix = [
  [0, 22, 41, 82, 53, 48],
  [18, 0, 14, 19, 90, 75],
  [73, 49, 0, 61, 42, 59],
  [36, 67, 33, 0, 63, 72],
  [34, 66, 29, 19, 0, 78],
  [43, 55, 49, 61, 69, 0],
];

const result = travelingSalesman(matrix);
console.log(result);
