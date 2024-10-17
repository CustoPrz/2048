let gridSize = 4;
let domElements;
let gameBoard;

function initializeBoard() {
  if (domElements) {
    return;
  }
  domElements = [];
  let tableElement = document.getElementById('field');
  for (let row = 0; row < gridSize; row++) {
    let tableRow = document.createElement('tr');
    let rowElements = [];
    for (let col = 0; col < gridSize; col++) {
      let cell = document.createElement('td');
      cell.setAttribute('class', 'tile');
      tableRow.appendChild(cell);
      rowElements.push(cell);
    }
    domElements.push(rowElements);
    tableElement.appendChild(tableRow);
  }
}

function resetGameBoard() {
  gameBoard = [];
  for (let row = 0; row < gridSize; row++) {
    gameBoard.push(new Array(gridSize).fill(0));
  }
}

function placeRandomTile() {
  let col, row;
  do {
    col = Math.floor(Math.random() * gridSize);
    row = Math.floor(Math.random() * gridSize);
    if (gameBoard[row][col] === 0) {
      gameBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
      break;
    }
  } while (true);
}

function renderBoard() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      let cell = domElements[row][col];
      let value = gameBoard[row][col];
      cell.innerHTML = value === 0 ? '' : String(value);
      cell.setAttribute('data-value', value);
      cell.className = 'tile' + (value > 0 ? ' filled' : '');
    }
  }
}

function mergeAndSlide(arr, length) {
  const removeZeros = a => a.filter(x => x !== 0);

  arr = removeZeros(arr);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      arr[i + 1] = 0;
    }
  }
  arr = removeZeros(arr);
  while (arr.length < length) {
    arr.push(0);
  }
  return arr;
}

function shiftLeft() {
  let hasChanged = false;
  for (let row = 0; row < gridSize; row++) {
    const original = [...gameBoard[row]];
    gameBoard[row] = mergeAndSlide(gameBoard[row], gridSize);
    hasChanged = hasChanged || (gameBoard[row].join(',') !== original.join(','));
  }
  return hasChanged;
}

function flipRow(y1, x1, y2, x2) {
  const temp = gameBoard[y1][x1];
  gameBoard[y1][x1] = gameBoard[y2][x2];
  gameBoard[y2][x2] = temp;
}

function reverseRows() {
  for (let row = 0; row < gridSize; row++) {
    for (let left = 0, right = gridSize - 1; left < right; left++, right--) {
      flipRow(row, left, row, right);
    }
  }
}

function swapRowsAndColumns() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < row; col++) {
      flipRow(row, col, col, row);
    }
  }
}

function performMoveLeft() {
  return shiftLeft();
}

function performMoveRight() {
  reverseRows();
  const hasChanged = performMoveLeft();
  reverseRows();
  return hasChanged;
}

function performMoveUp() {
  swapRowsAndColumns();
  const hasChanged = performMoveLeft();
  swapRowsAndColumns();
  return hasChanged;
}

function performMoveDown() {
  swapRowsAndColumns();
  const hasChanged = performMoveRight();
  swapRowsAndColumns();
  return hasChanged;
}

function checkGameOver() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (gameBoard[row][col] === 0) {
        return false;
      }
    }
  }
  for (let row = 0; row < gridSize - 1; row++) {
    for (let col = 0; col < gridSize - 1; col++) {
      const value = gameBoard[row][col];
      if (value !== 0 && (value === gameBoard[row + 1][col] || value === gameBoard[row][col + 1])) {
        return false;
      }
    }
  }
  return true;
}

document.addEventListener('keydown', function(e) {
  const keyCode = e.keyCode;
  let moveSuccessful;
  switch (keyCode) {
    case 40: moveSuccessful = performMoveDown(); break;
    case 38: moveSuccessful = performMoveUp(); break;
    case 37: moveSuccessful = performMoveLeft(); break;
    case 39: moveSuccessful = performMoveRight(); break;
    default: return;
  }
  if (moveSuccessful) {
    placeRandomTile();
    renderBoard();
  }
  if (checkGameOver()) {
    setTimeout(function() {
      alert('Game over');
      startGame();
    }, 1000);
  }
});

function startGame() {
  initializeBoard();
  resetGameBoard();
  new Array(3).fill(0).forEach(placeRandomTile);
  renderBoard();
}

startGame();
