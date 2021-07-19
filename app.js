/* Game Obj {
    {board : [gameboard], reset(), determine winner(), add move()},
    {player1: name: name, marker: marker, setName(), getName()}
    {player2: name: name, marker: marker, setName(), getName()}

}
*/
const gameBoard = (() => {
  let board = [[], [], []];

  const currentPlayer = { one: true };

  let winningPlayer;

  const switchPlayer = () => {
    currentPlayer.one = !currentPlayer.one;
  };

  //Add move to array
  const addMoveToArray = (x, y) => {
    currentPlayer.one ? (board[y][x] = 1) : (board[y][x] = 2);
  };

  //Add move to array and document
  const addMove = (e) => {
    if (winningPlayer) return;
    const x = e.target.dataset.square;
    const y = e.target.parentElement.dataset.row;
    if (board[y][x] === 1 || board[y][x] === 2) return;
    addMoveToArray(x, y);
    displayController.updateMove(x, y);
    switchPlayer();
    isGameOver();
  };
  //Clear Game Board
  const reset = () => {
    board.map((row) => row.splice(0, 3));
    displayController.resetBoard();
    gameEnd.innerText = "";
    winningPlayer = 0;
  };

  const checkRows = () => {
    board.forEach((row, i) => {
      if (row.length < 3) return;
      if (row[0] === row[1] && row[0] === row[2]) {
        row[0] == 1 ? (winningPlayer = playerOne) : (winningPlayer = playerTwo);
        winner(winningPlayer, "row", i);
      }
    });
  };

  const checkColumns = () => {
    board.forEach((row, i) => {
      if (!board[0][i]) return;
      if (board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
        board[0][i] == 1
          ? (winningPlayer = playerOne)
          : (winningPlayer = playerTwo);
        winner(winningPlayer, "column", i);
      }
    });
  };

  const checkDiagonals = () => {
    if (board[0][0]) {
      if (board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
        board[0][0] == 1
          ? (winningPlayer = playerOne)
          : (winningPlayer = playerTwo);
        winner(winningPlayer, "diagonal", "downAndRight");
      }
    }
    if (board[2][0]) {
      if (board[2][0] === board[1][1] && board[2][0] === board[0][2]) {
        board[2][0] == 1
          ? (winningPlayer = playerOne)
          : (winningPlayer = playerTwo);
        winner(winningPlayer, "diagonal", "upAndRight");
      }
    }
  };

  const isBoardFull = () => {
    if (board[0].length === 3 && board[1].length === 3 && board[2].length === 3)
      tie();
  };

  const tie = () => {
    winningPlayer = "";
    winner("Tie");
  };

  const isGameOver = () => {
    checkRows();
    checkColumns();
    checkDiagonals();
    if (!winningPlayer) isBoardFull();
  };

  const winner = (winningPlayer, direction, winLine) => {
    displayController.endGame(winningPlayer, direction, winLine);
  };

  return { board, currentPlayer, reset, addMove };
})();

const displayController = (() => {
  //Adds move to document
  const updateMove = (x, y) => {
    const row = document.querySelector(`div[data-row="${y}"]`);
    const square = row.querySelector(`div[data-square="${x}"]`);
    gameBoard.currentPlayer.one
      ? (square.innerText = playerOne.marker)
      : (square.innerText = playerTwo.marker);
  };

  //Clears Board
  const resetBoard = () => {
    squares.forEach((square) => {
      square.innerText = "";
      square.classList.remove("win");
    });
  };

  const endGame = (winningPlayer, direction, winLine) => {
    displayWinner(winningPlayer, direction, winLine);
  };

  const displayWinner = (winningPlayer, direction, winLine) => {
    if (direction === "row") {
      squares.forEach((square) => {
        if (square.dataset.row == winLine) square.classList.toggle("win");
      });
    }
    if (direction === "column") {
      squares.forEach((square) => {
        if (square.dataset.square == winLine) square.classList.toggle("win");
      });
    }
    if (direction === "diagonal") {
      if (winLine == "downAndRight") {
        diagonalOne.forEach((square) => square.classList.toggle("win"));
      }
      if (winLine == "upAndRight") {
        diagonalTwo.forEach((square) => square.classList.toggle("win"));
      }
    }
    if (winningPlayer === "Tie") return (gameEnd.innerText = "Tie Game");
    gameEnd.innerText = `${winningPlayer.name} Wins`;
  };

  //Reveal Board

  const revealBoard = () => {
    playerEntry.classList.toggle("hidden");
    gameBoardElement.classList.toggle("hidden");
  };

  //Two Player Game
  const twoPlayerSelect = () => {
    const buttons = document.querySelector("#playerSelect", ".playerSelect");
    buttons.classList.toggle("hidden");
    playerEntry.classList.toggle("hidden");
  };
  return { endGame, revealBoard, twoPlayerSelect, resetBoard, updateMove };
})();

const players = (() => {
  const playerFactory = (name, marker) => {
    return { name, marker };
  };

  const playerFactoryExecute = () => {
    const playerOneName = playerOneInput.value || "player one";
    const playerTwoName = playerTwoInput.value || "player two";
    playerOne = playerFactory(playerOneName, "X");
    playerTwo = playerFactory(playerTwoName, "O");
  };

  const createPlayers = () => {
    playerFactoryExecute();
    displayController.revealBoard();
  };
  return { createPlayers };
})();

//Click listeners
const squares = document.querySelectorAll(".square");
squares.forEach((square) =>
  square.addEventListener("click", gameBoard.addMove)
);

const gameEnd = document.querySelector("#gameEnd");
const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", gameBoard.reset);

const singlePlayer = document.querySelector("#singlePlayer");
const twoPlayer = document.querySelector("#twoPlayer");
const gameBoardElement = document.querySelector(".board");
const playerEntry = document.querySelector("#playerEntry");
const playerOneInput = document.querySelector("#playerOneInput");
const playerTwoInput = document.querySelector("#playerTwoInput");
const diagonalOne = document.querySelectorAll(`[data-diagonalOne]`);
const diagonalTwo = document.querySelectorAll(`[data-diagonalTwo]`);
const submitPlayers = document.querySelector("#submitPlayers");
submitPlayers.addEventListener("click", players.createPlayers);

twoPlayer.addEventListener("click", displayController.twoPlayerSelect);

/* const steven = playerFactory("steven", "X");
const olivia = playerFactory("olivia", "O");
 */
