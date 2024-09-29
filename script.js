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
    ];
    let activePlayer = players[0];
    let moveCount = 0; 

    const switchPlayer = () => activePlayer = activePlayer === players[0] ? players[1] : players[0];
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = function(row, column) {
        printNewRound();
        gameBoard.printBoard();
        let player = getActivePlayer();

        if (!gameBoard.playMove(row, column, player.token)) {
            console.log("Invalid move, try again.");
            return;
        }

        moveCount++; 

        let result = checkWin();
        if (result != " ") {
            console.log(`Player ${result} wins the round!`);
            gameBoard.printBoard();
            gameBoard.resetBoard();
            moveCount = 0; 
            activePlayer = players[0];
            announcer.textContent = `Player ${result} wins the round!`;
            return;
        }

        if (moveCount === 9) {
            console.log("It's a draw!");
            gameBoard.printBoard();
            gameBoard.resetBoard();
            moveCount = 0; 
            activePlayer = players[0];
            announcer.textContent = "Game drawn.";
            return;
        }
        
        switchPlayer();
        announcer.textContent = `${getActivePlayer().name}'s turn.`;
    };

    const checkWin = function() {
        const board = gameBoard.getBoard();

        for (let i = 0; i < 3; i++) {
            if ((board[i][0] === "X" || board[i][0] === "O") &&
                board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                return board[i][0];
            }
            if ((board[0][i] === "X" || board[0][i] === "O") &&
                board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                return board[0][i];
            }
        }

        if ((board[0][0] === "X" || board[0][0] === "O") && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            return board[0][0];
        }
        if ((board[0][2] === "X" || board[0][2] === "O") && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
            return board[0][2];
        }

        return " ";
    };

    return { switchPlayer, checkWin, playRound, printNewRound, getActivePlayer, getBoard: gameBoard.getBoard };
};


const ScreenController = function() {
    const game = GameController();
    let board  = game.getBoard();
    let cells  = document.querySelectorAll(".cell");

    const updateScreen = function() {
        for (let i = 0; i < 9; i++) {
            let row = Math.floor(i / 3);
            let col = i % 3;
            let cell = cells[i];

            cell.innerHTML = '';

            if (board[row][col] == "X") {
                const img = document.createElement("img");
                img.src = 'resources/cross.svg';
                img.style.width  = '80px';
                img.style.height = '80px';
                cell.appendChild(img);
            } else if (board[row][col] == "O") {
                const img = document.createElement("img");
                img.src = 'resources/circle.svg';
                img.style.width  = '80px';
                img.style.height = '80px';
                cell.appendChild(img);
            }
        }
    };

    for (let i = 0; i < 9; i++) {
        let cell = cells[i];
        cell.addEventListener("click", function() {
            let rowPos = Math.floor(i / 3);
            let colPos = i % 3;


            if (board[rowPos][colPos] == " ") {
                game.playRound(rowPos, colPos); 
                updateScreen();
            }
        });
    }

    updateScreen();
};

const screenController = ScreenController();
const announcer = document.querySelector(".announcer");