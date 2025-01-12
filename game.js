document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get("gameId");
    const board = document.getElementById("board");
    const statusDisplay = document.getElementById("status");
    let gameState = null;

    // Initialize Telegram WebApp
    const tg = window.Telegram.WebApp;
    tg.expand();

    // Fetch initial game state
    fetchGameState();

    // Add click handlers to cells
    board.addEventListener("click", (e) => {
        if (!e.target.classList.contains("cell")) return;

        const position = e.target.dataset.index;
        makeMove(position);
    });

    async function fetchGameState() {
        try {
            const response = await fetch(`/api/game/${gameId}`);
            gameState = await response.json();
            updateBoard();
        } catch (error) {
            console.error("Error fetching game state:", error);
        }
    }

    async function makeMove(position) {
        try {
            const response = await fetch(`/api/game/${gameId}/move`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ position }),
            });

            gameState = await response.json();
            updateBoard();
        } catch (error) {
            console.error("Error making move:", error);
        }
    }

    function updateBoard() {
        // Update cells
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell, index) => {
            cell.textContent = gameState.board[index] || "";
        });

        // Update status
        if (gameState.status === "completed") {
            if (gameState.winner === "draw") {
                statusDisplay.textContent = "It's a draw!";
            } else {
                statusDisplay.textContent = `Player ${gameState.winner} wins!`;
            }
        } else {
            statusDisplay.textContent = `Current player: ${gameState.currentPlayer}`;
        }
    }
});
