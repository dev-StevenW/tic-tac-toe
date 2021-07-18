/* Game Obj {
    {board : [gameboard], reset(), determine winner(), add move()},
    {player1: name: name, marker: marker, setName(), getName()}
    {player2: name: name, marker: marker, setName(), getName()}

}
*/
const gameBoard = (() => {
  let board = [[], [], []];

  const currentPlayer = { one: true };

  const switchPlayer = () => {
    currentPlayer.one = !currentPlayer.one;
  };

  //Add move to array
  const addMoveToArray = (x, y) => {
    currentPlayer.one ? (board[y][x] = 1) : (board[y][x] = 2);
  };

  //Add move to array and document
  const addMove = (e) => {
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
  };

  const checkRows = () => {
    board.forEach((row) => {
      if (row.length < 3) return;
      if (row[0] === row[1] && row[0] === row[2]) console.log("Winner ROW");
    });
  };

  const checkColumns = () => {
    board.forEach((row, i) => {
      if (!board[0][i]) return;
      if (board[0][i] === board[1][i] && board[0][i] === board[2][i])
        console.log("Winner COLUM");
    });
  };

  const checkDiagonals = () => {
    if (board[0][0]) {
      if (board[0][0] === board[1][1] && board[0][0] === board[2][2])
        console.log("Winner Diagonal 1");
    }
    if (board[2][0]) {
      if (board[2][0] === board[1][1] && board[2][0] === board[0][2])
        console.log("Winner diagonal");
    }
  };

  const isGameOver = () => {
    checkRows();
    checkColumns();
    checkDiagonals();
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
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.innerText = "";
    });
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
  return { revealBoard, twoPlayerSelect, resetBoard, updateMove };
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
const rows = document.querySelectorAll(".square");
rows.forEach((row) => row.addEventListener("click", gameBoard.addMove));

const gameEnd = document.querySelector("#gameEnd");
const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", gameBoard.reset);

const singlePlayer = document.querySelector("#singlePlayer");
const twoPlayer = document.querySelector("#twoPlayer");
const gameBoardElement = document.querySelector(".board");
const playerEntry = document.querySelector("#playerEntry");
const playerOneInput = document.querySelector("#playerOneInput");
const playerTwoInput = document.querySelector("#playerTwoInput");

const submitPlayers = document.querySelector("#submitPlayers");
submitPlayers.addEventListener("click", players.createPlayers);

twoPlayer.addEventListener("click", displayController.twoPlayerSelect);

/* const steven = playerFactory("steven", "X");
const olivia = playerFactory("olivia", "O");
 */
