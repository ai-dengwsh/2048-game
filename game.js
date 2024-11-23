class Game2048 {
    constructor() {
        this.board = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.gameBoard = document.getElementById('game-board');
        this.scoreDisplay = document.getElementById('score');
        this.newGameButton = document.getElementById('new-game');

        this.newGameButton.addEventListener('click', () => this.initGame());
        document.addEventListener('keydown', this.handleKeyPress.bind(this));

        this.initGame();
    }

    initGame() {
        this.board = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.scoreDisplay.textContent = this.score;
        this.addRandomTile();
        this.addRandomTile();
        this.renderBoard();
    }

    addRandomTile() {
        const emptyCells = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c] === 0) {
                    emptyCells.push({r, c});
                }
            }
        }

        if (emptyCells.length > 0) {
            const {r, c} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                if (this.board[r][c] !== 0) {
                    tile.textContent = this.board[r][c];
                    tile.classList.add(`tile-${this.board[r][c]}`);
                }
                this.gameBoard.appendChild(tile);
            }
        }
    }

    handleKeyPress(event) {
        const key = event.key;
        let moved = false;

        switch(key) {
            case 'ArrowUp':
                moved = this.moveUp();
                break;
            case 'ArrowDown':
                moved = this.moveDown();
                break;
            case 'ArrowLeft':
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
                moved = this.moveRight();
                break;
            default:
                return;
        }

        if (moved) {
            this.addRandomTile();
            this.renderBoard();
            this.checkGameStatus();
        }
    }

    moveLeft() {
        let moved = false;
        for (let r = 0; r < 4; r++) {
            const row = this.board[r].filter(val => val !== 0);
            for (let c = 0; c < row.length - 1; c++) {
                if (row[c] === row[c + 1]) {
                    row[c] *= 2;
                    this.score += row[c];
                    row.splice(c + 1, 1);
                    moved = true;
                }
            }
            while (row.length < 4) row.push(0);
            if (JSON.stringify(row) !== JSON.stringify(this.board[r])) moved = true;
            this.board[r] = row;
        }
        this.scoreDisplay.textContent = this.score;
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let r = 0; r < 4; r++) {
            const row = this.board[r].filter(val => val !== 0);
            for (let c = row.length - 1; c > 0; c--) {
                if (row[c] === row[c - 1]) {
                    row[c] *= 2;
                    this.score += row[c];
                    row.splice(c - 1, 1);
                    moved = true;
                }
            }
            while (row.length < 4) row.unshift(0);
            if (JSON.stringify(row) !== JSON.stringify(this.board[r])) moved = true;
            this.board[r] = row;
        }
        this.scoreDisplay.textContent = this.score;
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let c = 0; c < 4; c++) {
            const column = [
                this.board[0][c], 
                this.board[1][c], 
                this.board[2][c], 
                this.board[3][c]
            ].filter(val => val !== 0);

            for (let r = 0; r < column.length - 1; r++) {
                if (column[r] === column[r + 1]) {
                    column[r] *= 2;
                    this.score += column[r];
                    column.splice(r + 1, 1);
                    moved = true;
                }
            }

            while (column.length < 4) column.push(0);
            
            for (let r = 0; r < 4; r++) {
                if (this.board[r][c] !== column[r]) moved = true;
                this.board[r][c] = column[r];
            }
        }
        this.scoreDisplay.textContent = this.score;
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let c = 0; c < 4; c++) {
            const column = [
                this.board[0][c], 
                this.board[1][c], 
                this.board[2][c], 
                this.board[3][c]
            ].filter(val => val !== 0);

            for (let r = column.length - 1; r > 0; r--) {
                if (column[r] === column[r - 1]) {
                    column[r] *= 2;
                    this.score += column[r];
                    column.splice(r - 1, 1);
                    moved = true;
                }
            }

            while (column.length < 4) column.unshift(0);
            
            for (let r = 0; r < 4; r++) {
                if (this.board[r][c] !== column[r]) moved = true;
                this.board[r][c] = column[r];
            }
        }
        this.scoreDisplay.textContent = this.score;
        return moved;
    }

    checkGameStatus() {
        // Check for 2048 win condition
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c] === 2048) {
                    alert('Congratulations! You won!');
                    return;
                }
            }
        }

        // Check if game is over (no moves possible)
        if (!this.canMove()) {
            alert('Game Over! No more moves possible.');
        }
    }

    canMove() {
        // Check if any cell is empty
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c] === 0) return true;
            }
        }

        // Check for possible merges horizontally
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 3; c++) {
                if (this.board[r][c] === this.board[r][c + 1]) return true;
            }
        }

        // Check for possible merges vertically
        for (let c = 0; c < 4; c++) {
            for (let r = 0; r < 3; r++) {
                if (this.board[r][c] === this.board[r + 1][c]) return true;
            }
        }

        return false;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});
