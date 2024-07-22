
document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("gameBoard");
    const message = document.getElementById("message");
    const rows = 6;
    const columns = 7;
    let currentPlayer = "red";
    const board = Array(rows).fill(null).map(() => Array(columns).fill(null));
    let gameActive = true;

    // Create game board UI
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", handleClick);
            gameBoard.appendChild(cell);
        }
    }

    function handleClick(event) {
        if (!gameActive) return;

        const col = parseInt(event.target.dataset.col);
        if (makeMove(col)) {
            if (checkWin()) {
                endGame(currentPlayer + " wins!");
            } else if (checkDraw()) {
                endGame("Draw!");
            } else {
                currentPlayer = "yellow";
                aiMove();
            }
        }
    }

    function aiMove() {
        if (!gameActive) return;

        let bestCol = findBestMove();
        
        if (makeMove(bestCol)) {
            if (checkWin()) {
                endGame(currentPlayer + " wins!");
            } else if (checkDraw()) {
                endGame("Draw!");
            } else {
                currentPlayer = "red";
            }
        }
    }

    function findBestMove() {
        // Check for immediate win
        for (let col = 0; col < columns; col++) {
            if (isValidMove(col)) {
                if (wouldWin(col, currentPlayer)) {
                    return col;
                }
            }
        }

        // Block opponent's winning move
        for (let col = 0; col < columns; col++) {
            if (isValidMove(col)) {
                if (wouldWin(col, "red")) {
                    return col;
                }
            }
        }

        // Prefer center column
        if (isValidMove(3)) {
            return 3;
        }

        // Choose a random valid column
        let validCols = [];
        for (let col = 0; col < columns; col++) {
            if (isValidMove(col)) {
                validCols.push(col);
            }
        }
        return validCols[Math.floor(Math.random() * validCols.length)];
    }

    function wouldWin(col, player) {
        // Simulate the move
        let row = findEmptyRow(col);
        if (row === -1) return false;

        board[row][col] = player;

        // Check for win
        let win = checkWin();

        // Undo the move
        board[row][col] = null;

        return win;
    }

    function findEmptyRow(col) {
        for (let row = rows - 1; row >= 0; row--) {
            if (!board[row][col]) {
                return row;
            }
        }
        return -1;
    }

    function isValidMove(col) {
        return board[0][col] === null;
    }

    function makeMove(col) {
        for (let row = rows - 1; row >= 0; row--) {
            if (!board[row][col]) {
                board[row][col] = currentPlayer;
                const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
                cell.classList.add(currentPlayer);
                return true;
            }
        }
        return false;
    }

    function checkWin() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                if (board[row][col]) {
                    if (
                        checkDirection(row, col, 0, 1, 4) ||  // horizontal
                        checkDirection(row, col, 1, 0, 4) ||  // vertical
                        checkDirection(row, col, 1, 1, 4) ||  // diagonal down-right
                        checkDirection(row, col, 1, -1, 4)    // diagonal down-left
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function checkDirection(row, col, dx, dy, count) {
        const player = board[row][col];
        for (let i = 0; i < count; i++) {
            if (row < 0 || row >= rows || col < 0 || col >= columns || board[row][col] !== player) {
                return false;
            }
            row += dx;
            col += dy;
        }
        return true;
    }

    function checkDraw() {
        return board[0].every(cell => cell !== null);
    }

    function endGame(result) {
        gameActive = false;
        message.innerHTML = `<div id="winnerMessage">${result.toUpperCase()}</div>`;
        if (result !== "Draw!") {
            createSparkles();
        }
    }

    function createSparkles() {
        const sparkleContainer = document.createElement('div');
        sparkleContainer.classList.add('sparkles');
        document.body.appendChild(sparkleContainer);

        const colors = ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#00f'];

        for (let i = 0; i < 100; i++) {
            const sparkle = document.createElement('div');
            sparkle.classList.add('sparkle');
            sparkle.style.left = Math.random() * 100 + 'vw';
            sparkle.style.top = Math.random() * 100 + 'vh';
            sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            sparkleContainer.appendChild(sparkle);

            setTimeout(() => sparkle.remove(), 4000);
        }
    }
});
