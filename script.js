const container = document.getElementById("array-container");
let array = [];
let stopRequested = false;
let sortingTask = null;
let delay = 110; 

const speedSlider = document.getElementById("speedSlider");
speedSlider.addEventListener("input", () => {
  delay = 510 - Number(speedSlider.value); 
});

function generateArray(size = 20) {
  array = [];
  container.innerHTML = "";
  for (let i = 0; i < size; i++) {
    const value = Math.floor(Math.random() * 350) + 50;
    array.push(value);

    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value}px`;
    container.appendChild(bar);
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getBars() {
  return document.querySelectorAll(".bar");
}

async function swap(i, j) {
  if (stopRequested) throw "Stopped";
  const bars = getBars();
  bars[i].classList.add("selected");
  bars[j].classList.add("selected");

  await sleep(delay);
  if (stopRequested) throw "Stopped";

  [array[i], array[j]] = [array[j], array[i]];
  bars[i].style.height = `${array[i]}px`;
  bars[j].style.height = `${array[j]}px`;

  bars[i].classList.remove("selected");
  bars[j].classList.remove("selected");

  await sleep(delay);
}

// --- Sorting Algorithms ---

async function bubbleSort() {
  try {
    const bars = getBars();
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        if (stopRequested) throw "Stopped";

        bars[j].classList.add("selected");
        bars[j + 1].classList.add("selected");

        await sleep(delay);

        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          bars[j].style.height = `${array[j]}px`;
          bars[j + 1].style.height = `${array[j + 1]}px`;
        }

        bars[j].classList.remove("selected");
        bars[j + 1].classList.remove("selected");

        await sleep(delay / 2);
      }
    }
  } catch (e) {}
}

async function selectionSort() {
  try {
    const bars = getBars();
    for (let i = 0; i < array.length; i++) {
      let min = i;
      for (let j = i + 1; j < array.length; j++) {
        if (stopRequested) throw "Stopped";
        bars[min].classList.add("selected");
        bars[j].classList.add("selected");

        await sleep(delay);
        if (array[j] < array[min]) {
          bars[min].classList.remove("selected");
          min = j;
        } else {
          bars[j].classList.remove("selected");
        }
      }

      if (min !== i) {
        await swap(i, min);
      } else {
        bars[min].classList.remove("selected");
      }
    }
  } catch (e) {}
}

async function insertionSort() {
  try {
    const bars = getBars();
    for (let i = 1; i < array.length; i++) {
      let j = i;
      while (j > 0 && array[j] < array[j - 1]) {
        if (stopRequested) throw "Stopped";
        bars[j].classList.add("selected");
        bars[j - 1].classList.add("selected");
        await sleep(delay);
        await swap(j, j - 1);
        bars[j].classList.remove("selected");
        bars[j - 1].classList.remove("selected");
        j--;
      }
    }
  } catch (e) {}
}

async function mergeSort(start = 0, end = array.length - 1) {
  if (stopRequested) throw "Stopped";
  if (start >= end) return;

  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  const left = array.slice(start, mid + 1);
  const right = array.slice(mid + 1, end + 1);

  let i = 0, j = 0, k = start;
  const bars = getBars();

  while (i < left.length && j < right.length) {
    if (stopRequested) throw "Stopped";
    bars[k].classList.add("selected");
    await sleep(delay);

    if (left[i] <= right[j]) {
      array[k] = left[i++];
    } else {
      array[k] = right[j++];
    }

    bars[k].style.height = `${array[k]}px`;
    bars[k].classList.remove("selected");
    k++;
  }

  while (i < left.length) {
    if (stopRequested) throw "Stopped";
    bars[k].classList.add("selected");
    await sleep(delay);
    array[k] = left[i++];
    bars[k].style.height = `${array[k]}px`;
    bars[k].classList.remove("selected");
    k++;
  }

  while (j < right.length) {
    if (stopRequested) throw "Stopped";
    bars[k].classList.add("selected");
    await sleep(delay);
    array[k] = right[j++];
    bars[k].style.height = `${array[k]}px`;
    bars[k].classList.remove("selected");
    k++;
  }
}

async function quickSort(start = 0, end = array.length - 1) {
  if (stopRequested) throw "Stopped";
  if (start < end) {
    let p = await partition(start, end);
    await quickSort(start, p - 1);
    await quickSort(p + 1, end);
  }
}

async function partition(start, end) {
  const pivot = array[start];
  let i = start + 1;
  const bars = getBars();

  for (let j = start + 1; j <= end; j++) {
    if (stopRequested) throw "Stopped";

    bars[i].classList.add("selected");
    bars[j].classList.add("selected");

    await sleep(delay);

    if (array[j] < pivot) {
      await swap(i, j);
      i++;
    }

    bars[i - 1].classList.remove("selected");
    bars[j].classList.remove("selected");
  }

  await swap(start, i - 1);
  return i - 1;
}

// --- Controls ---

async function startSort() {
  stopRequested = false;
  const algorithm = document.getElementById("algorithm").value;

  const sortMap = {
    bubble: bubbleSort,
    selection: selectionSort,
    insertion: insertionSort,
    merge: mergeSort,
    quick: quickSort
  };

  sortingTask = sortMap[algorithm]();

  try {
    await sortingTask;
  } catch (e) {
    console.log("Sorting stopped.");
  }
}

async function stopSort() {
  stopRequested = true;
  if (sortingTask) {
    try {
      await sortingTask;
    } catch (e) {}
  }
  generateArray(20);
}

generateArray(20);
