function allocateTasks(N, tasks) {
  let processorSpeeds = [1, 2, 3];
  let processors = Array.from({ length: 3 }, () => ({
    tasks: [],
    weightedTime: 0,
  }));

  for (let i = 0; i < N; i++) {
    let minTimeProcessor = processors.reduce((min, current, index) => {
      return current.weightedTime < processors[min].weightedTime ? index : min;
    }, 0);

    let taskTime = tasks[i];
    let weightedTaskTime = taskTime / processorSpeeds[minTimeProcessor];

    processors[minTimeProcessor].tasks.push(taskTime);
    processors[minTimeProcessor].weightedTime += weightedTaskTime;
  }

  let P1 = processors[0].tasks;
  let P2 = processors[1].tasks;
  let P3 = processors[2].tasks;

  return { P1, P2, P3 };
}

let N = 100;
let tasks = Array.from(
  { length: N },
  () => Math.floor(Math.random() * 81) + 10
);
let result = allocateTasks(N, tasks);

console.log(result);
