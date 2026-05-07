const playerHand = document.getElementById("player-hand");
const computerHand = document.getElementById("computer-hand");

const result = document.getElementById("result");
const countdown = document.getElementById("countdown");

const playerScoreEl = document.getElementById("player-score");
const computerScoreEl = document.getElementById("computer-score");
const tiesScoreEl = document.getElementById("ties-score");

const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", resetGame);

let playerScore = 0;
let computerScore = 0;
let ties = 0;

const choices = ["rock", "paper", "scissors"];

function getComputerChoice() {
    return choices[Math.floor(Math.random() * 3)];
}

function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function winner(p, c) {
    if (p === c) return "tie";
    if (
        (p === "rock" && c === "scissors") ||
        (p === "paper" && c === "rock") ||
        (p === "scissors" && c === "paper")
    ) return "player";
    return "computer";
}

function setHands(playerChoice, computerChoice) {
    playerHand.src = `../ROCK-PAPER-SCISSORS/src/img/player-${playerChoice}.png`;
    computerHand.src = `../ROCK-PAPER-SCISSORS/src/img/computer-${computerChoice}.png`;
}


function resetGame() {
    // reset scores
    playerScore = 0;
    computerScore = 0;
    ties = 0;

    playerScoreEl.textContent = 0;
    computerScoreEl.textContent = 0;
    tiesScoreEl.textContent = 0;

    // reset text
    result.textContent = "Choose your move";
    countdown.textContent = "";

    // reset hands
    setHands("rock", "rock");

    // reset position
    playerHand.classList.remove("move-left", "shake");
    computerHand.classList.remove("move-right", "shake");
}

async function play(playerChoice) {

    const computerChoice = getComputerChoice();

    result.textContent = "";

    const buttons = document.querySelectorAll("button[data-choice]");
    buttons.forEach(b => b.disabled = true);

    setHands("rock", "rock")
    
    // START shaking immediately
    playerHand.classList.add("shake", "move-left");
    computerHand.classList.add("shake", "move-right");

    // Countdown WHILE shaking
    for (let i of ["3", "2", "1", "SHOOT!"]) {
        countdown.textContent = i;
        await delay(500);
    }

    countdown.textContent = "";

    // STOP shaking
    playerHand.classList.remove("shake");
    computerHand.classList.remove("shake");

    // SHOW actual hands immediately after countdown
    setHands(playerChoice, computerChoice);

    // WAIT 0.5 sec BEFORE showing result
    await delay(500);

    const res = winner(playerChoice, computerChoice);

    if (res === "player") {
        result.textContent = "YOU WIN 🎉";
        playerScore++;
    } else if (res === "computer") {
        result.textContent = "COMPUTER WINS 💥";
        computerScore++;
    } else {
        result.textContent = "TIE 🤝";
        ties++;
    }

    playerScoreEl.textContent = playerScore;
    computerScoreEl.textContent = computerScore;
    tiesScoreEl.textContent = ties;

    buttons.forEach(b => b.disabled = false);
}

// button events
document.querySelectorAll("button[data-choice]").forEach(btn => {
    btn.addEventListener("click", () => play(btn.dataset.choice));
});
