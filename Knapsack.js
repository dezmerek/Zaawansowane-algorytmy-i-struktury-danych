function knapsackRecursive(items, capacity) {
  const n = items.length;
  const memo = new Array(n)
    .fill(null)
    .map(() => new Array(capacity + 1).fill(-1));

  function recursiveHelper(index, currentCapacity) {
    if (index === n || currentCapacity === 0) {
      return 0;
    }

    if (memo[index][currentCapacity] !== -1) {
      return memo[index][currentCapacity];
    }

    let { weight, value } = items[index];
    let maxWithoutCurrent = recursiveHelper(index + 1, currentCapacity);
    let maxWithCurrent = 0;

    if (weight <= currentCapacity) {
      maxWithCurrent =
        value + recursiveHelper(index + 1, currentCapacity - weight);
    }

    memo[index][currentCapacity] = Math.max(maxWithoutCurrent, maxWithCurrent);
    return memo[index][currentCapacity];
  }

  recursiveHelper(0, capacity);

  let bestCombination = [];
  let currentCapacity = capacity;
  for (let i = 0; i < n; i++) {
    if (i === n - 1) {
      bestCombination[i] = memo[i][currentCapacity] > 0 ? 1 : 0;
    } else if (memo[i][currentCapacity] !== memo[i + 1][currentCapacity]) {
      bestCombination[i] = 1;
      currentCapacity -= items[i].weight;
    } else {
      bestCombination[i] = 0;
    }
  }

  return bestCombination;
}

// Example usage:
let items = [];
for (let i = 0; i < 100; i++) {
  items.push({
    weight: Math.floor(Math.random() * 81) + 10,
    value: Math.floor(Math.random() * 81) + 10,
  });
}
let capacity = 2500;

let bestCombination = knapsackRecursive(items, capacity);
console.log("Best combination:", bestCombination);
console.log(
  "Total value:",
  bestCombination.reduce(
    (sum, val, idx) => sum + (val ? items[idx].value : 0),
    0
  )
);
console.log(
  "Total weight:",
  bestCombination.reduce(
    (sum, val, idx) => sum + (val ? items[idx].weight : 0),
    0
  )
);
