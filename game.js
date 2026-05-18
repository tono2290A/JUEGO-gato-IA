/* =====================================================
   GAME.JS
===================================================== */

const board =
document.getElementById("board");

const statusText =
document.getElementById("status");

let cells = [];

let gameBoard =
["","","","","","","","",""];

let human = "X";

let ai = "O";

let gameOver = false;

/* DIFICULTAD */

let difficulty = "normal";

/* =====================================================
   COMBINACIONES GANADORAS
===================================================== */

const wins = [

    [0,1,2],
    [3,4,5],
    [6,7,8],

    [0,3,6],
    [1,4,7],
    [2,5,8],

    [0,4,8],
    [2,4,6]
];

/* =====================================================
   MENU DIFICULTAD
===================================================== */

createDifficultyMenu();

function createDifficultyMenu(){

    const menu =
    document.createElement("div");

    menu.style.marginBottom = "20px";

    menu.innerHTML = `

        <button onclick="setDifficulty('easy')">
            Fácil
        </button>

        <button onclick="setDifficulty('normal')">
            Normal
        </button>

        <button onclick="setDifficulty('hard')">
            Difícil
        </button>

    `;

    document.body.insertBefore(menu, board);
}

/* =====================================================
   CAMBIAR DIFICULTAD
===================================================== */

function setDifficulty(level){

    difficulty = level;

    document.body.classList.remove(
        "easy-mode",
        "normal-mode",
        "hard-mode"
    );

    if(level === "easy"){

        document.body.classList.add(
        "easy-mode");
    }

    else if(level === "normal"){

        document.body.classList.add(
        "normal-mode");
    }

    else{

        document.body.classList.add(
        "hard-mode");
    }

    restartGame();
}

/* =====================================================
   CREAR TABLERO
===================================================== */

for(let i = 0; i < 9; i++){

    const cell =
    document.createElement("div");

    cell.classList.add("cell");

    cell.dataset.index = i;

    cell.addEventListener(
        "click",
        playerMove
    );

    board.appendChild(cell);

    cells.push(cell);
}

/* =====================================================
   MOVIMIENTO JUGADOR
===================================================== */

function playerMove(e){

    if(gameOver) return;

    document.getElementById(
    "click").play();

    let index =
    e.target.dataset.index;

    if(gameBoard[index] !== "")
    return;

    gameBoard[index] = human;

    cells[index].innerText = human;

    /* GANADOR */

    let winnerCombo =
    getWinnerCombo(gameBoard,human);

    if(winnerCombo){

        statusText.innerText =
        "¡GANASTE!";

        document.getElementById(
        "Ganar").play();

        highlightWinner(winnerCombo);

        gameOver = true;

        return;
    }

    /* EMPATE */

    if(isDraw()){

        statusText.innerText =
        "EMPATE";

        document.getElementById(
        "empate").play();

        gameOver = true;

        return;
    }

    statusText.innerText =
    "IA pensando...";

    setTimeout(aiMove,500);
}

/* =====================================================
   MOVIMIENTO IA
===================================================== */

function aiMove(){

    let move;

    /* FACIL */

    if(difficulty === "easy"){

        let available = [];

        for(let i=0;i<9;i++){

            if(gameBoard[i] === ""){

                available.push(i);
            }
        }

        move =
        available[Math.floor(
        Math.random() *
        available.length)];
    }

    /* NORMAL */

    else if(difficulty === "normal"){

        if(Math.random() < 0.5){

            let available = [];

            for(let i=0;i<9;i++){

                if(gameBoard[i] === ""){

                    available.push(i);
                }
            }

            move =
            available[Math.floor(
            Math.random() *
            available.length)];

        }else{

            move = bestMove();
        }
    }

    /* DIFICIL */

    else{

        move = bestMove();
    }

    gameBoard[move] = ai;

    cells[move].innerText = ai;

    /* IA GANA */

    let winnerCombo =
    getWinnerCombo(gameBoard,ai);

    if(winnerCombo){

        statusText.innerText =
        "LA IA GANA";

        document.getElementById(
        "Perder").play();

        highlightWinner(winnerCombo);

        gameOver = true;

        return;
    }

    /* EMPATE */

    if(isDraw()){

        statusText.innerText =
        "EMPATE";

        document.getElementById(
        "Empate").play();

        gameOver = true;

        return;
    }

    statusText.innerText =
    "Tu turno";
}

/* =====================================================
   MEJOR JUGADA
===================================================== */

function bestMove(){

    let bestScore = -Infinity;

    let move;

    for(let i=0;i<9;i++){

        if(gameBoard[i] === ""){

            gameBoard[i] = ai;

            let score =
            minimax(gameBoard,0,false);

            gameBoard[i] = "";

            if(score > bestScore){

                bestScore = score;

                move = i;
            }
        }
    }

    return move;
}

/* =====================================================
   MINIMAX
===================================================== */

function minimax(boardState,
depth,isMaximizing){

    if(checkWinner(boardState,ai)){

        return 10 - depth;
    }

    if(checkWinner(boardState,human)){

        return depth - 10;
    }

    if(boardState.every(
        cell => cell !== ""
    )){

        return 0;
    }

    if(isMaximizing){

        let bestScore = -Infinity;

        for(let i=0;i<9;i++){

            if(boardState[i] === ""){

                boardState[i] = ai;

                let score =
                minimax(
                    boardState,
                    depth + 1,
                    false
                );

                boardState[i] = "";

                bestScore =
                Math.max(score,bestScore);
            }
        }

        return bestScore;
    }

    else{

        let bestScore = Infinity;

        for(let i=0;i<9;i++){

            if(boardState[i] === ""){

                boardState[i] = human;

                let score =
                minimax(
                    boardState,
                    depth + 1,
                    true
                );

                boardState[i] = "";

                bestScore =
                Math.min(score,bestScore);
            }
        }

        return bestScore;
    }
}

/* =====================================================
   GANADOR
===================================================== */

function checkWinner(board,player){

    return wins.some(combo => {

        return combo.every(index =>
        board[index] === player);
    });
}

/* =====================================================
   OBTENER COMBO GANADOR
===================================================== */

function getWinnerCombo(board,player){

    for(let combo of wins){

        if(combo.every(index =>
        board[index] === player)){

            return combo;
        }
    }

    return null;
}

/* =====================================================
   RESALTAR GANADOR
===================================================== */

function highlightWinner(combo){

    combo.forEach(index => {

        cells[index].classList.add(
        "winner");
    });
}

/* =====================================================
   EMPATE
===================================================== */

function isDraw(){

    return gameBoard.every(
        cell => cell !== ""
    );
}

/* =====================================================
   REINICIAR
===================================================== */

function restartGame(){

    gameBoard =
    ["","","","","","","","",""];

    gameOver = false;

    statusText.innerText =
    "Tu turno";

    cells.forEach(cell => {

        cell.innerText = "";

        cell.classList.remove(
        "winner");
    });
}