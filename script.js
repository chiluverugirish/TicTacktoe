document.addEventListener('DOMContentLoaded', () => {
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const currentTurnDisplay = document.getElementById('current-turn');
    const startGameButton = document.getElementById('startGame');
    let currentPlayer = 'X';
    let player1Name = '';
    let player2Name = '';

    startGameButton.addEventListener('click', () => {
        player1Name = player1Input.value;
        player2Name = player2Input.value;
        updateCurrentTurnDisplay();
        $('#playerModal').modal('hide');
    });

    function updateCurrentTurnDisplay() {
        const playerName = currentPlayer === 'X' ? player1Name : player2Name;
        currentTurnDisplay.textContent = `It's ${playerName}'s turn (${currentPlayer})`;
    }

    function triggerConfetti() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#bb0000', '#ffffff']
        });
    }

    function handleWin() {
        // ...existing code...
        triggerConfetti();
        // ...existing code...
    }

    const cells = document.querySelectorAll('#game-board div');
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (cell.textContent === '') {
                cell.textContent = currentPlayer;
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateCurrentTurnDisplay();
            }
        });
    });

    updateCurrentTurnDisplay();
});
