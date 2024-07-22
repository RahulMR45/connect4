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
        for (let row = rows - 1; row >= 0; row--) {
            if (!board[row][col]) {
                board[row][col] = currentPlayer;
                const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
                cell.classList.add(currentPlayer);
                if (checkWin(row, col)) {
                    endGame(currentPlayer + " wins!");
                } else if (checkDraw()) {
                    endGame("Draw!");
                } else {
                    currentPlayer = currentPlayer === "red" ? "yellow" : "red";
                }
                return;
            }
        }
    }

    function checkWin(row, col) {
        const directions = [
            [0, 1],  
            [1, 0],
            [1, 1],
            [1, -1]
        ];

        return directions.some(([dx, dy]) => 
            checkDirection(row, col, dx, dy) + checkDirection(row, col, -dx, -dy) - 1 >= 4
        );
    }

    function checkDirection(row, col, dx, dy) {
        let count = 0;
        while (
            row >= 0 && row < rows &&
            col >= 0 && col < columns &&
            board[row][col] === currentPlayer
        ) {
            count++;
            row += dx;
            col += dy;
        }
        return count;
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