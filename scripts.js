let array = [];
let delay = 500;
let chart;
const barColors = Array(100).fill('#007bff');

function initializeChart() {
  const ctx = document.getElementById('visualization').getContext('2d');
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: array.map((_, i) => i + 1),
      datasets: [{
        label: 'Array Elements',
        data: array,
        backgroundColor: barColors,
        borderColor: '#ccc',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        x: { beginAtZero: true },
        y: { beginAtZero: true }
      }
    }
  });
}

function updateChart(activeIndices = [], swappingIndices = [], i = -1, j = -1, iteration = -1) {
  barColors.fill('#007bff');
  activeIndices.forEach(index => barColors[index] = '#ffeb3b');
  swappingIndices.forEach(index => barColors[index] = '#ff5733');
  chart.data.datasets[0].data = array;
  chart.data.datasets[0].backgroundColor = barColors;
  chart.update();
  const infoDiv = document.getElementById("info");
  infoDiv.innerHTML = `i: ${i}, j: ${j}, iteration: ${iteration}`;
}

async function startSort() {
  const arrayInput = document.getElementById("arrayInput").value;
  array = arrayInput.split(',').map(Number);
  initializeChart();
  const algorithm = document.getElementById("algorithm").value;
  switch (algorithm) {
    case "shellsort": await shellSort(); break;
    case "insertionsort": await insertionSort(); break;
    case "selectionsort": await selectionSort(); break;
    case "bubblesort": await bubbleSort(); break;
  }
}

async function shellSort() {
  const n = array.length;
  let gap = Math.floor(n / 2);
  let iteration = 0;
  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      const temp = array[i];
      let j = i;
      while (j >= gap && array[j - gap] > temp) {
        array[j] = array[j - gap];
        updateChart([j, j - gap], [], i, j, iteration++);
        await sleep(delay);
        j -= gap;
      }
      array[j] = temp;
      updateChart([i, j], [], i, j, iteration++);
      await sleep(delay);
    }
    gap = Math.floor(gap / 2);
  }
  updateChart();
}

async function insertionSort() {
  const n = array.length;
  let iteration = 0;
  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      updateChart([j + 1, j], [], i, j, iteration++);
      await sleep(delay);
      j--;
    }
    array[j + 1] = key;
    updateChart([i, j + 1], [], i, j + 1, iteration++);
    await sleep(delay);
  }
  updateChart();
}

async function selectionSort() {
  const n = array.length;
  let iteration = 0;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
      updateChart([i, j, minIndex], [], i, j, iteration++);
      await sleep(delay);
    }
    [array[i], array[minIndex]] = [array[minIndex], array[i]];
    updateChart([i, minIndex], [i, minIndex], i, minIndex, iteration++);
    await sleep(delay);
  }
  updateChart();
}

async function bubbleSort() {
  const n = array.length;
  let iteration = 0;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        updateChart([j, j + 1], [j, j + 1], i, j, iteration++);
        await sleep(delay);
      } else {
        updateChart([j, j + 1], [], i, j, iteration++);
        await sleep(delay);
      }
    }
  }
  updateChart();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
