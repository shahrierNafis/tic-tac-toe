huPlayer = "o";
aiPlayer = "x";
currentPlayer = huPlayer;
board = [];
playingWithAi = true;

const boardHTML = document.querySelectorAll(".spot");
gameboard = (function () {
  function clearBoard() {
    //clear board array
    board.length = 0;
    //clear boardHTML and make all spot clickable
    boardHTML.forEach((spot) => {
      spot.firstChild.innerText = "";
      spot.classList.remove("clicked");
    });
    currentPlayer = huPlayer;
    document.body.className = "";
    document.querySelector("#player1").style.border = "";
    document.querySelector("#player2").style.border = "";
  }

  function changeBoard(spot, marker) {
    // return if the marker is already set
    if (!spot.firstChild.innerText == "") return;
    //set marker
    spot.firstChild.innerText = marker;
    //get index from spot element
    let index = spot.dataset.index;
    board[index] = marker;
  }
  return { clearBoard, changeBoard };
})();

gameLogic = (function () {
  boardHTML.forEach((spot) => {
    //start
    spot.addEventListener("click", (event) => {
      //human
      turn(event.target, currentPlayer);
      if (playingWithAi && !checkWin(board, currentPlayer) && !checkTie()) {
        //ai
        turn(bestSpot(), aiPlayer);
      }
    });
  });
  function turn(spot, player) {
    //make spot unclickable
    spot.classList.add("clicked");
    //set marker
    gameboard.changeBoard(spot, player);
    declareWinner();
    //switch players
    currentPlayer = currentPlayer == huPlayer ? aiPlayer : huPlayer;
  }
  function bestSpot() {
    index = minimax(board, aiPlayer).index;
    //get spot element with index
    spot = document.querySelector(`[data-index="${index}"]`);
    return spot;
  }
  function emptySquares() {
    let array = [];
    for (let index = 0; index < 9; index++) {
      //push to array if marker not set
      if (!board[index]) array.push(index);
    }
    return array;
  }
  //returns the best move for player
  function minimax(newBoard, player) {
    let availSpots = emptySquares();

    if (checkWin(newBoard, huPlayer)) {
      return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }
    let bestMove = {};
    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
      let move = {};
      move.index = availSpots[i];
      //make move
      newBoard[availSpots[i]] = player;
      //get best move for huPlayer
      if (player == aiPlayer) {
        let result = minimax(newBoard, huPlayer);
        move.score = result.score;
      } else {
        //get best move for aiPlayer
        let result = minimax(newBoard, aiPlayer);
        move.score = result.score;
      }
      //undo move
      newBoard[availSpots[i]] = undefined;
      moves.push(move);
    }
    // find the best move
    if (player === aiPlayer) {
      bestMove.score = -Infinity;
      moves.forEach((move) => {
        if (move.score > bestMove.score) {
          bestMove = move;
        }
      });
    } else {
      bestMove.score = Infinity;
      moves.forEach((move) => {
        if (move.score < bestMove.score) {
          bestMove = move;
        }
      });
    }
    return bestMove;
  }
  function declareWinner() {
    winingIndexes = checkWin(board, currentPlayer);
    if (winingIndexes) {
      boardHTML.forEach((spot) => {
        spot.classList.add("clicked");
      });
      //change background
      winingIndexes.forEach((i) => {
        if (board[i] == "o") {
          document.body.classList.add("player1Win");
          document.querySelector("#player1").style.border =
            "5px darkslategray solid";
        } else {
          document.body.classList.add("player2Win");
          document.querySelector("#player2").style.border =
            "5px darkslategray solid";
        }
      });
    } else if (checkTie()) alert("Tie");
  }

  function checkTie() {
    return emptySquares().length == 0;
  }
  //check the board if played won and return wining indexes
  function checkWin(b, player) {
    for (let i = 0; i < 3; i++) {
      if (b[i] == player)
        if (b[i + 3] == player)
          if (b[i + 6] == player) return [i, i + 3, i + 6];
    }
    for (let i of [0, 3, 6]) {
      if (b[i] == player)
        if (b[i + 1] == player)
          if (b[i + 2] == player) return [i, i + 1, i + 2];
    }
    if (b[0] == player)
      if (b[4] == player) if (b[8] == player) return [0, 4, 8];
    if (b[2] == player)
      if (b[4] == player) if (b[6] == player) return [2, 4, 6];
  }
  return {};
})();
//switch opponent
document.querySelector("#computer").addEventListener("change", (event) => {
  if (event.target.checked) {
    document.querySelector("#player2").innerText = "Computer : X";
    playingWithAi = true;
  } else {
    document.querySelector("#player2").innerText = "Player 2 : X";
    playingWithAi = false;
  }
  gameboard.clearBoard();
});
