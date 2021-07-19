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
    displayController.switchPlayer();
  };

  //Check if square is taken, if not add move to array and dom
  const addMove = (e) => {
    if (winningPlayer) return;
    const x = e.target.dataset.square;
    const y = e.target.parentElement.dataset.row;
    if (board[y][x] === 1 || board[y][x] === 2) return;
    addMoveToArray(x, y);
    displayController.updateMove(x, y);
    isGameOver();
    if (!winningPlayer) switchPlayer();
  };

  //Add move to array
  const addMoveToArray = (x, y) => {
    currentPlayer.one ? (board[y][x] = 1) : (board[y][x] = 2);
  };

  //Clear Game Board
  const reset = () => {
    board.map((row) => row.splice(0, 3));
    displayController.resetBoard();
    gameEnd.innerText = "";
    if (winningPlayer) {
      winningPlayer = 0;
      switchPlayer();
    }
  };

  //End game conditions
  const isGameOver = () => {
    checkRows();
    checkColumns();
    checkDiagonals();
    if (!winningPlayer) isBoardFull();
  };

  //Check each row for win
  const checkRows = () => {
    board.forEach((row, i) => {
      if (row.length < 3) return;
      if (row[0] === row[1] && row[0] === row[2]) {
        row[0] == 1 ? (winningPlayer = playerOne) : (winningPlayer = playerTwo);
        winner(winningPlayer, "row", i);
      }
    });
  };

  //Check each column for win
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

  //Check diagonal lines for win
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

  //Check if the game ends in a tie
  const isBoardFull = () => {
    let row1 = board[0].filter((square) => (square > 0 ? true : false));
    let row2 = board[1].filter((square) => (square > 0 ? true : false));
    let row3 = board[2].filter((square) => (square > 0 ? true : false));
    if (row1.length === 3 && row2.length === 3 && row3.length === 3) tie();
  };

  const tie = () => {
    winningPlayer = "";
    winner("Tie");
  };

  //If win or tie, send info to display controller for dom manipulation
  const winner = (winningPlayer, direction, winLine) => {
    displayController.endGame(winningPlayer, direction, winLine);
  };

  return { board, currentPlayer, reset, addMove };
})();

const displayController = (() => {
  //Reveal Board
  const revealBoard = () => {
    playerEntry.classList.toggle("hidden");
    gameBoardElement.classList.toggle("hidden");
    playerOneDisplay.innerText = `${playerOne.name}: ${playerOne.marker}`;
    playerTwoDisplay.innerText = `${playerTwo.name}: ${playerTwo.marker}`;
    playerDisplay.classList.toggle("hidden");
  };

  //Two Player Game
  const twoPlayerSelect = () => {
    const buttons = document.querySelector("#playerSelect", ".playerSelect");
    buttons.classList.toggle("hidden");
    playerEntry.classList.toggle("hidden");
    typewriter.classList.toggle("typewriter");
  };

  //Adds move to document
  const updateMove = (x, y) => {
    const row = document.querySelector(`div[data-row="${y}"]`);
    const square = row.querySelector(`div[data-square="${x}"]`);
    gameBoard.currentPlayer.one
      ? (square.innerText = playerOne.marker)
      : (square.innerText = playerTwo.marker);
  };

  //Switch player on display
  const switchPlayer = () => {
    playerOneWrap.classList.toggle("highlighted");
    playerTwoWrap.classList.toggle("highlighted");
  };
  //Clears Board
  const resetBoard = () => {
    squares.forEach((square) => {
      square.innerText = "";
      square.classList.remove("win");
    });
  };

  const addScore = (winningPlayer) => (winningPlayer.score += 1);

  const endGame = (winningPlayer, direction, winLine) => {
    displayWinner(winningPlayer, direction, winLine);
    addScore(winningPlayer);
    playerOneScore.innerText = `Score: ${playerOne.score}`;
    playerTwoScore.innerText = `Score: ${playerTwo.score}`;
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

  return {
    switchPlayer,
    endGame,
    revealBoard,
    twoPlayerSelect,
    resetBoard,
    updateMove,
  };
})();

const players = (() => {
  const playerFactory = (name, marker) => {
    return { name, marker, score: 0 };
  };

  const playerFactoryExecute = () => {
    const playerOneName = playerOneInput.value || "Player One";
    const playerTwoName = playerTwoInput.value || "Player Two";
    playerOne = playerFactory(playerOneName, "X");
    playerTwo = playerFactory(playerTwoName, "O");
  };

  const createPlayers = () => {
    playerFactoryExecute();
    displayController.revealBoard();
  };

  return { createPlayers };
})();

//Selectors
const gameBoardElement = document.querySelector(".board");
const gameEnd = document.querySelector("#gameEnd");
const squares = document.querySelectorAll(".square");
const diagonalOne = document.querySelectorAll(`[data-diagonalOne]`);
const diagonalTwo = document.querySelectorAll(`[data-diagonalTwo]`);
const resetButton = document.querySelector("#reset");
const singlePlayer = document.querySelector("#singlePlayer");
const twoPlayer = document.querySelector("#twoPlayer");
const playerEntry = document.querySelector("#playerEntry");
const playerOneInput = document.querySelector("#playerOneInput");
const playerTwoInput = document.querySelector("#playerTwoInput");
const submitPlayers = document.querySelector("#submitPlayers");
const playerDisplay = document.querySelector("#playerDisplay");
const playerOneWrap = document.querySelector("#playerOneWrap");
const playerOneDisplay = document.querySelector("#playerOneDisplay");
const playerOneScore = document.querySelector("#playerOneScore");
const playerTwoWrap = document.querySelector("#playerTwoWrap");
const playerTwoDisplay = document.querySelector("#playerTwoDisplay");
const playerTwoScore = document.querySelector("#playerTwoScore");
const typewriter = document.querySelector("#typewriter");

//Click listeners
squares.forEach((square) =>
  square.addEventListener("click", gameBoard.addMove)
);
resetButton.addEventListener("click", gameBoard.reset);
submitPlayers.addEventListener("click", players.createPlayers);
twoPlayer.addEventListener("click", displayController.twoPlayerSelect);
