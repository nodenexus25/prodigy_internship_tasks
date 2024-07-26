const cells = document.querySelectorAll('[data-cell]');
const messageElement = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const playAgainstAIButton = document.getElementById('playAgainstAI');
const playAgainstPlayerButton = document.getElementById('playAgainstPlayer');
let circleTurn;
let vsAI = false;

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

startGame();

restartButton.addEventListener('click', startGame);
playAgainstAIButton.addEventListener('click', () => { vsAI = true; startGame(); });
playAgainstPlayerButton.addEventListener('click', () => { vsAI = false; startGame(); });

function startGame() {
    circleTurn = false;
    cells.forEach(cell => {
        cell.classList.remove('x');
        cell.classList.remove('o');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setMessage('');
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? 'o' : 'x';
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (vsAI && circleTurn) {
            aiMove();
        }
    }
}

function aiMove() {
    const availableCells = [...cells].filter(cell => !cell.classList.contains('x') && !cell.classList.contains('o'));
    if (availableCells.length === 0) return;
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    placeMark(randomCell, 'o');
    if (checkWin('o')) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
    }
}

function endGame(draw) {
    if (draw) {
        setMessage('Draw!');
    } else {
        setMessage(`${circleTurn ? "O's" : "X's"} Wins!`);
    }
    cells.forEach(cell => cell.removeEventListener('click', handleClick));
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('o');
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function setMessage(message) {
    messageElement.innerText = message;
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}
