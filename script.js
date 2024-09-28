const GameBoard = (function() {
    const board   = [];
    const rows    = 3;
    const columns = 3;

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(" ");
        }
    }

    const getBoard = () => board;
    const printBoard = function() {
        console.log("     1     2     3")
        for (let i = 0; i < rows; i++) {
            console.log((i+1) + " -> " + board[i][0] + '  |  ' + board[i][1] + '  |  ' + board[i][2]);
            if (i < 2) console.log("     -------------");
        }
    }
    const playMove = function(row, column, token) {
        if (row > 2 || row < 0 || column > 2 || column < 0 || board[row][column] != " ") {
            console.log("Please enter valid coordinates.");
            return false;
        }
        board[row][column] = token;
        return true;
    }
    const resetBoard = function() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j] = " ";
            }
        }
    }
    return {getBoard, printBoard, playMove, resetBoard};
});

const GameController = function() {
    let gameBoard = GameBoard();
    const players = [
        {
            name: "Player X",
            token: "X"
        },
        {
            name: "Player O",
            token: "O"
        }
    ]
    let activePlayer = players[0];
    const switchPlayer = () => activePlayer = activePlayer === players[0] ? players[1] : players[0];
    const getActivePlayer = () => activePlayer;
    const printNewRound = () => {
        console.log(`${getActivePlayer().name}'s turn.`);
    }
    const playRound = function() {
        for (let i = 0; i < 9; i++) {
            printNewRound();
            gameBoard.printBoard();
            let player = getActivePlayer();

            let condition = false;
            do {
                let row    = parseInt(prompt("Enter the row (1-3): ")) - 1;
                let column = parseInt(prompt("Enter the column (1-3): ")) - 1;
                condition  = !gameBoard.playMove(row, column, player.token);

            } while (condition);

            let result = checkWin();
            if (result != " ") {
                console.log(`Player ${result} wins the round!`);
                gameBoard.printBoard();
                gameBoard.resetBoard();
                return; // Exit after a win
            }
            switchPlayer();
        }

        console.log("It's a draw!");
        gameBoard.printBoard();
        gameBoard.resetBoard();
    }
    const checkWin = function() {
        const board = gameBoard.getBoard();

        for (let i = 0; i < 3; i++) {
            if ((board[i][0] == "X" || board[i][0] == "O") &&
                board[i][0] == board[i][1] && board[i][1] == board[i][2]) {
                return board[i][0];
            }
            if ((board[0][i] == "X" || board[0][i] == "O") &&
                board[0][i] == board[1][i] && board[1][i] == board[2][i]) {
                return board[0][i];
            }
        }

        if ((board[0][0] == "X" || board[0][0] == "O") && board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
            return board[0][0];
        }
        if ((board[0][2] == "X" || board[0][2] == "O") && board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
            return board[0][2];
        }
        return " ";
    }

    return {switchPlayer, checkWin, playRound, printNewRound, getActivePlayer};
};

const game = GameController();
game.playRound();
