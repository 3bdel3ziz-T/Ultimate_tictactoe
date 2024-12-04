import { GameAlert } from './alerts.js';
    
class ThemeManager {
    constructor() {
        this.toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
        this.initTheme();
        this.addEventListeners();
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            if (savedTheme === 'dark') {
                this.toggleSwitch.checked = true;
            }
        }
    }

    addEventListeners() {
        this.toggleSwitch.addEventListener('change', (e) => {
            const theme = e.target.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }
}

export class UltimateTicTacToe {
    constructor() {
        this.currentPlayer = 'X';
        this.boards = Array(9).fill().map(() => Array(9).fill(null));
        this.bigBoard = Array(9).fill(null);
        this.activeBoard = 4; // Start in center board
        this.gameOver = false;
        this.winner = null;
        this.gameAlert = new GameAlert(); 
        this.initializeBoard();
        this.addEventListeners();
        this.updateBoard();
    }

    initializeBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';

        // Create 9 big cells (3x3 grid)
        for (let i = 0; i < 9; i++) {
            const bigCell = document.createElement('div');
            bigCell.className = 'big-cell';
            
            // Create 9 small cells within each big cell
            for (let j = 0; j < 9; j++) {
                const smallCell = document.createElement('div');
                smallCell.className = 'small-cell';
                smallCell.dataset.bigIndex = i;
                smallCell.dataset.smallIndex = j;
                smallCell.dataset.number = j + 1;
                bigCell.appendChild(smallCell);
            }
            
            gameBoard.appendChild(bigCell);
        }

        // Show initial game rules
        if (!localStorage.getItem('rulesShown')) {
            this.showRules();
            localStorage.setItem('rulesShown', 'true');
        }
    }

    addEventListeners() {
        document.getElementById('game-board').addEventListener('click', (e) => {
            const cell = e.target;
            if (cell.classList.contains('small-cell')) {
                const bigIndex = parseInt(cell.dataset.bigIndex);
                const smallIndex = parseInt(cell.dataset.smallIndex);
                this.makeMove(bigIndex, smallIndex);
            }
        });

        document.getElementById('reset').addEventListener('click', () => {
            this.resetGame();
        });

        document.getElementById('rules').addEventListener('click', () => {
            this.showRules();
        });

        // Add keyboard listener
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            if (e.key >= '1' && e.key <= '9' && this.activeBoard !== null) {
                this.makeMove(this.activeBoard,parseInt(e.key) - 1);
            }else if (e.key >= '1' && e.key <= '9' && this.activeBoard === null) {
                const selectedCell = document.querySelectorAll('.big-cell')[parseInt(e.key) - 1]
                if(selectedCell.classList.contains('won-x') === false && selectedCell.classList.contains('won-o') === false) {
                    this.activeBoard = parseInt(e.key) - 1
                    this.updateBoard()
                }
            }
        });
    }
    makeMove(bigIndex, smallIndex) {
        // Check if move is valid
        if (this.gameOver || 
            (this.activeBoard !== null && this.activeBoard !== bigIndex) ||
            this.boards[bigIndex][smallIndex] !== null ||
            this.bigBoard[bigIndex] !== null) {
            return;
        }

        // Make the move
        this.boards[bigIndex][smallIndex] = this.currentPlayer;

        // Check if small board is won
        if (this.checkWin(this.boards[bigIndex])) {
            this.bigBoard[bigIndex] = this.currentPlayer;
            
            // Check if game is won
            if (this.checkWin(this.bigBoard)) {
                this.gameOver = true;
                this.winner = this.currentPlayer;
                this.showGameOver();
            }
        } else if (this.isBoardFull(this.boards[bigIndex])) {
            this.bigBoard[bigIndex] = 'tie';
        }

        // Set next active board
        this.activeBoard = this.bigBoard[smallIndex] === null ? smallIndex : null;

        // Switch players
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        
        // Update display
        this.updateBoard();
        this.updateStatus();
    }

    checkWin(board) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return board[a] && 
                   board[a] === board[b] && 
                   board[a] === board[c];
        });
    }

    isBoardFull(board) {
        return board.every(cell => cell !== null);
    }

    updateBoard() {
        const cells = document.getElementsByClassName('small-cell');
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const index = i * 9 + j;
                const value = this.boards[i][j];
                cells[index].textContent = value || '';
                cells[index].setAttribute('data-content', value || '');
                
                // Reset all special classes
                const bigCell = cells[index].parentElement;
                bigCell.className = 'big-cell';
                
                // Add appropriate classes
                if (this.bigBoard[i]) {
                    bigCell.classList.add(`won-${this.bigBoard[i].toLowerCase()}`);
                }
                if (i === this.activeBoard || this.activeBoard === null) {
                    bigCell.classList.add('active-board');
                }
            }
        }
    }

    updateStatus() {
        const status = document.getElementById('game-status');
        if (this.gameOver) {
            status.textContent = `Player ${this.winner} wins!`;
        } else {
            status.textContent = `Current Player: ${this.currentPlayer}`;
        }
    }

    resetGame() {
        this.currentPlayer = 'X';
        this.boards = Array(9).fill().map(() => Array(9).fill(null));
        this.bigBoard = Array(9).fill(null);
        this.activeBoard = 4;
        this.gameOver = false;
        this.winner = null;
        this.updateBoard();
        this.updateStatus();
    }

    showRules() {
        this.gameAlert.showRules();
    }

    showGameOver() {
        setTimeout(() => {
            this.gameAlert.showGameOver(this.winner);
        }, 100);
    }
}

// Start the game and initialize theme when page loads
window.addEventListener('load', () => {
    new UltimateTicTacToe();
    new ThemeManager();
});
