let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

// Mode selection buttons and screens
let vsHumanBtn = document.getElementById("vs-human");
let vsAiBtn = document.getElementById("vs-ai");
let mainGame = document.querySelector("main");
let modeSelection = document.querySelector(".mode-selection");

// Back button
let backBtn = document.querySelector("#back-btn");

let turn0 = true;
let gameMode = "";

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

// Game mode button events
vsHumanBtn.addEventListener("click", () => {
    gameMode = "human";
    modeSelection.classList.add("hide");
    mainGame.classList.remove("hide");
    enableBoxes();
});

vsAiBtn.addEventListener("click", () => {
    gameMode = "ai";
    modeSelection.classList.add("hide");
    mainGame.classList.remove("hide");
    enableBoxes();
});

// Resetting the game
const resetGame = () => {
    turn0 = true; // Human starts
    enableBoxes();
    msgContainer.classList.add("hide");
};

// Box click logic (for both human vs human and human vs AI)
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (box.innerText !== "") return;  // Don't allow clicks on occupied boxes

        if (gameMode === "human") {
            // Human move (Alternates between O and X)
            if (turn0) {
                box.innerText = "O";
            } else {
                box.innerText = "X";
            }
            turn0 = !turn0;
            checkWinner();
        } else if (gameMode === "ai") {
            // Human move (Alternates between O and X)
            if (turn0) {
                box.innerText = "O";
                turn0 = false;
                box.disabled = true; // Disable the clicked box
                checkWinner();

                // Let UI update before AI move
                setTimeout(() => {
                    if (!checkWinner()) {
                        aiMove();  // AI makes its move after human
                    }
                }, 100); // Slight delay to allow rendering

            }
        }
    });
});

// Disable all boxes
const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

// Enable all boxes and reset inner text
const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
};

const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

// Check for a winner
const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                showWinner(pos1Val);
                return true;
            }
        }
    }
    return false;
};

// Minimax algorithm for AI's best move
const minimax = (board, depth, isMaximizing) => {
    let winner = checkWinner(board);
    if (winner === "X") return 10 - depth;
    if (winner === "O") return depth - 10;
    if (isBoardFull(board)) return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = "";
            }
        }
        return best;
    }
};

// Check if the board is full
const isBoardFull = (board) => {
    return board.every((box) => box !== "");
};

// Find the best move for AI
const findBestMove = (board) => {
    let bestVal = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "X";
            let moveVal = minimax(board, 0, false);
            board[i] = "";
            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
};

// AI move logic
const aiMove = () => {
    let board = Array.from(boxes).map((box) => box.innerText);
    let bestMove = findBestMove(board);

    boxes[bestMove].innerText = "X";
    boxes[bestMove].disabled = true;
    turn0 = true; // Now it's the human's turn again
    checkWinner();
};

// Event listeners for reset and new game
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

// Back button functionality
backBtn.addEventListener("click", () => {
    mainGame.classList.add("hide");
    msgContainer.classList.add("hide");
    modeSelection.classList.remove("hide");
    enableBoxes();
    turn0 = true;
    gameMode = "";
});
