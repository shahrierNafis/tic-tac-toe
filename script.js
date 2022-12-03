gameboard = (function () {
    const gameboard = []
    const gameboardUi = document.querySelectorAll(".spot");
    function clearBoard() {
        gameboard.length = 0
        gameboardUi.forEach((spot) => { spot.firstChild.innerText = "" })
    }
    function updateGameboad(spot, marker) {
        if (!spot.firstChild.innerText == "") return
        let index = spot.dataset.index;
        gameboard[index] = marker
        spot.firstChild.innerText = marker
    }
    return { gameboard, gameboardUi, clearBoard, updateGameboad }
})();
function player(name, marker) {
    return { name, marker }
};
gameLogic = (function () {
    const player1 = player("player1", "o")
    const player2 = player("player2", "x")
    currentPlayer = player1
    gameboard.gameboardUi.forEach((spot) => {
        spot.addEventListener("click", () => {
            gameboard.updateGameboad(spot, currentPlayer.marker)
            checkWin(currentPlayer);
            currentPlayer = (currentPlayer == player1) ? player2 : player1
        })
    })

    function checkWin(currentPlayer) {
        if (checkColumWin() || checkRowWin() || checkXWin0() || checkXWin2())
            alert(currentPlayer.name + "Wins");
    }

    function checkColumWin() {
        for (let i = 0; i < 3; i++) {
            const marker = (gameboard.gameboard[i]) ? gameboard.gameboard[i] : "Y";
            if (gameboard.gameboard[i + 3] == marker)
                if (gameboard.gameboard[i + 6] == marker)
                    return true;
        }
    }
    function checkRowWin() {
        for (let i of [0, 3, 6]) {
            const marker = (gameboard.gameboard[i]) ? gameboard.gameboard[i] : "Y";
            if (gameboard.gameboard[i + 1] == marker)
                if (gameboard.gameboard[i + 2] == marker)
                    return true;
        }
    }
    function checkXWin0() {
        const marker = (gameboard.gameboard[0]) ? gameboard.gameboard[0] : "Y";
        if (gameboard.gameboard[4] == marker)
            if (gameboard.gameboard[8] == marker)
                return true;
    }
    function checkXWin2() {
        const marker = (gameboard.gameboard[2]) ? gameboard.gameboard[2] : "Y";
        if (gameboard.gameboard[4] == marker)
            if (gameboard.gameboard[6] == marker)
                return true;
    }
    return {}
})()
