let towers = [[], [], []];
let diskCount = 3;
let moveCount = 0;
let timerInterval = null;
let timeElapsed = 0;

const moveCounter = document.getElementById("moveCount");
const minMovesCounter = document.getElementById("minMoves");
const diskInput = document.getElementById("diskCount");
const completionMessage = document.getElementById("completionMessage");
const timerDisplay = document.getElementById("timer");

function initializeGame() {
  towers = [[], [], []];
  for (let i = diskCount; i > 0; i--) {
    towers[0].push(i);
  }
  renderGame();
  moveCount = 0;
  timeElapsed = 0;
  updateInfo();
  completionMessage.textContent = "";
  resetTimer();
  startTimer();
}

function renderGame() {
  document.querySelectorAll(".tower").forEach((tower, index) => {
    tower.innerHTML = '<div class="rod"></div>';
    towers[index].forEach((diskSize, position) => {
      const disk = document.createElement("div");
      disk.className = "disk";
      disk.style.width = `${diskSize * 20}px`;
      disk.style.bottom = `${position * 22}px`;
      disk.textContent = diskSize;
      disk.draggable = true;
      disk.dataset.size = diskSize;
      tower.appendChild(disk);
    });
  });
  addDragAndDropListeners();
}

function updateInfo() {
  moveCounter.textContent = moveCount;
  minMovesCounter.textContent = Math.pow(2, diskCount) - 1;
}

function restartGame() {
  diskCount = parseInt(diskInput.value);
  initializeGame();
}

function addDragAndDropListeners() {
  document.querySelectorAll(".disk").forEach(disk => {
    disk.addEventListener("dragstart", dragStart);
  });

  document.querySelectorAll(".tower").forEach(tower => {
    tower.addEventListener("dragover", dragOver);
    tower.addEventListener("drop", dropDisk);
  });
}

let draggedDisk = null;

function dragStart(e) {
  draggedDisk = e.target;
  draggedDisk.classList.add("dragging");
}

function dragOver(e) {
  e.preventDefault();
}

function dropDisk(e) {
  const targetTower = e.currentTarget;
  const targetTowerIndex = parseInt(targetTower.dataset.tower);

  if (
    !towers[targetTowerIndex].length ||
    parseInt(draggedDisk.dataset.size) < towers[targetTowerIndex][towers[targetTowerIndex].length - 1]
  ) {
    const sourceTowerIndex = parseInt(draggedDisk.parentElement.dataset.tower);
    towers[sourceTowerIndex].pop();
    towers[targetTowerIndex].push(parseInt(draggedDisk.dataset.size));
    moveCount++;
    draggedDisk.classList.remove("dragging");
    draggedDisk = null;
    renderGame();
    updateInfo();
    checkCompletion();
  } else {
    alert("Invalid move! Larger disks cannot be placed on smaller disks.");
    draggedDisk.classList.remove("dragging");
    draggedDisk = null;
  }
}

function checkCompletion() {
  if (towers[2].length === diskCount) {
    stopTimer();
    completionMessage.textContent = `Well Done! You completed the game in ${moveCount} moves and ${formatTime(timeElapsed)}.`;
  }
}

function solveGame() {
  const moves = [];
  function hanoi(n, from, to, aux) {
    if (n === 0) return;
    hanoi(n - 1, from, aux, to);
    moves.push([from, to]);
    hanoi(n - 1, aux, to, from);
  }
  hanoi(diskCount, 0, 2, 1);

  let i = 0;
  function animate() {
    if (i < moves.length) {
      const [from, to] = moves[i];
      towers[to].push(towers[from].pop());
      renderGame();
      moveCount++;
      updateInfo();
      i++;
      setTimeout(animate, 500);
    } else {
      checkCompletion();
    }
  }
  animate();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeElapsed++;
    timerDisplay.textContent = formatTime(timeElapsed);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  stopTimer();
  timeElapsed = 0;
  timerDisplay.textContent = formatTime(timeElapsed);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

initializeGame();