function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const dropToken = (row, col, player) => {
    if (board[row][col].getValue() === " ") {
      board[row][col].addToken(player);
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, dropToken, printBoard };
}

function Cell() {
  let value = " ";

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();
  const players = [
    {
      name: playerOneName,
      token: "X",
    },
    {
      name: playerTwoName,
      token: "O",
    },
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const playRound = (row, col) => {
    const cellValue = board.getBoard()[row][col].getValue();

    if (cellValue === " ") {
      console.log(
        `Placing ${activePlayer.name}'s token at row ${row}, column ${col}...`
      );
      board.dropToken(row, col, activePlayer.token);

      if (checkWin()) {
        board.printBoard();
        console.log(`${activePlayer.name} wins!`);
        return true;
      } else if (checkDraw()) {
        board.printBoard();
        console.log("It's a draw!");
        return true;
      } else {
        switchPlayerTurn();
        printNewRound();
      }
    } else {
      console.log("Invalid move. Cell is already occupied.");
      return false;
    }
    console.log(`Win is: ${checkWin()}`);
  };

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const checkWin = () => {
    const boardValues = board.getBoard();

    // Check rows
    const checkRows = boardValues.some((row) => {
      return row.every((cell) => cell.getValue() === activePlayer.token);
    });

    // Check columns
    const checkColumns = boardValues[0]
      .map((_, i) =>
        boardValues.every((row) => row[i].getValue() === activePlayer.token)
      )
      .some(Boolean);

    // Check diagonals
    const checkDiagonals =
      (boardValues[0][0].getValue() === activePlayer.token &&
        boardValues[1][1].getValue() === activePlayer.token &&
        boardValues[2][2].getValue() === activePlayer.token) ||
      (boardValues[0][2].getValue() === activePlayer.token &&
        boardValues[1][1].getValue() === activePlayer.token &&
        boardValues[2][0].getValue() === activePlayer.token);

    return checkRows || checkColumns || checkDiagonals;
  };

  const checkDraw = () => {
    const boardValues = board.getBoard();
    for (let row of boardValues) {
      for (let cell of row) {
        if (cell.getValue() === " ") {
          return false;
        }
      }
    }
    return true;
  };

  const printNewRound = () => {
    board.printBoard();
    console.log(`${activePlayer.name}'s turn.`);
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: () => board.getBoard(),
    checkWin,
    checkDraw,
  };
}

const game = GameController();
const cells = document.querySelectorAll(".cell");
const turnElement = document.querySelector(".turn");
const resultMessage = document.querySelector(".result-message");

// Function to handle player's move when a cell is clicked
function makeMove(row, col) {
  if (!game.playRound(row, col)) return; // Return if the move is invalid

  disableCellClicks();

  if (game.checkWin()) {
    resultMessage.textContent = `${game.getActivePlayer().name} wins!`;
  } else if (game.checkDraw()) {
    resultMessage.textContent = "It's a draw!";
  }

  // Disable clicking on the selected cell
  cells[row * 3 + col].style.pointerEvents = "none";
}

// Function to update the UI after a move
function updateBoardUI() {
  const board = game.getBoard();
  cells.forEach((cell, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    cell.textContent = board[row][col].getValue();
    // Update the current player's turn text
    turnElement.textContent = `Current Player's Turn: ${
      game.getActivePlayer().name
    }`;
  });
}

cells.forEach((cell, index) => {
  const row = Math.floor(index / 3);
  const col = index % 3;
  cell.addEventListener("click", () => {
    makeMove(row, col);
    updateBoardUI();
  });
});

// Function to disable cell clicks after the game ends
function disableCellClicks() {
  cells.forEach((cell) => {
    cell.style.pointerEvents = "none";
  });
}
