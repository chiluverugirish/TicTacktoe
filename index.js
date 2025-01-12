const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Initialize bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Store games in memory (you can switch to MongoDB later)
const games = new Map();

// Bot commands
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const gameId = Math.random().toString(36).substr(2, 9);

    // Create new game
    games.set(gameId, {
        id: gameId,
        board: Array(9).fill(null),
        currentPlayer: 'X',
        status: 'active'
    });

    // Send game link
    const gameUrl = `${process.env.WEBAPP_URL}?gameId=${gameId}`;
    bot.sendMessage(chatId, 'Click here to play Tic-tac-toe:', {
        reply_markup: {
            inline_keyboard: [[
                { text: 'Play Game', web_app: { url: gameUrl }}
            ]]
        }
    });
});

// Game API endpoints
app.get('/api/game/:gameId', (req, res) => {
    const game = games.get(req.params.gameId);
    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
});

app.post('/api/game/:gameId/move', (req, res) => {
    const { position } = req.body;
    const game = games.get(req.params.gameId);

    if (!game || game.status !== 'active') {
        return res.status(400).json({ error: 'Invalid game' });
    }

    if (game.board[position] !== null) {
        return res.status(400).json({ error: 'Invalid move' });
    }

    // Make move
    game.board[position] = game.currentPlayer;

    // Check for winner
    const winner = checkWinner(game.board);
    if (winner) {
        game.status = 'completed';
        game.winner = winner;
    } else if (!game.board.includes(null)) {
        game.status = 'completed';
        game.winner = 'draw';
    } else {
        game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
    }

    res.json(game);
});

function checkWinner(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));