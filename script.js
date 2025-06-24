let score = 0;
let timeLeft = 60;
let lives = 4;
let droplets = 0;
let gameInterval;
let timerInterval;

const scoreEl = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const livesEl = document.getElementById("lives");
const container = document.getElementById("game-container");
const dropsArea = document.getElementById("drops-area");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const confettiContainer = document.getElementById("confetti-container");

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);

function startGame() {
  score = 0;
  timeLeft = 60;
  lives = 4;
  droplets = 0;
  updateUI();
  confettiContainer.innerHTML = "";
  resetBtn.style.display = "inline-block";
  startBtn.style.display = "none";

  timerInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft + 's';
    if (timeLeft <= 0) {
      endGame(score >= 90);
    }
  }, 1000);

  gameInterval = setInterval(() => {
    createDrop();
  }, 300);
}

function updateUI() {
  scoreEl.textContent = score;
  timeDisplay.textContent = timeLeft + 's';
  livesEl.innerHTML = '';
  for (let i = 0; i < lives; i++) {
    const img = document.createElement('img');
    img.src = 'img/emptyjerrycan.png';
    img.alt = 'Jerry Can';
    img.className = 'life-jerrycan';
    livesEl.appendChild(img);
  }
  const fill = document.getElementById("water-fill");
  if (fill) {
    fill.style.height = `${score}%`;
  }
}

function createDrop() {
  const drop = document.createElement("div");
  const isGood = Math.random() > 0.3;
  drop.classList.add("water-drop");
  drop.classList.add(isGood ? "good" : "bad");
  // Make big droplets much larger for better distinction
  const size = isGood ? (Math.random() > 0.5 ? 80 : 40) : (Math.random() > 0.5 ? 80 : 40);
  drop.style.width = size + "px";
  drop.style.height = size + "px";
  drop.style.left = Math.random() * (dropsArea.offsetWidth - size) + "px";

  drop.addEventListener("click", () => handleClick(drop, isGood, size));
  drop.addEventListener("animationend", () => drop.remove());

  dropsArea.appendChild(drop);
}

function handleClick(drop, isGood, size) {
  drop.remove();
  if (isGood) {
    score += size === 60 ? 10 : 5;
    droplets++;
    if (score >= 90) {
      endGame(true);
    }
  } else {
    if (size === 60) {
      lives--;
    } else {
      score = Math.max(0, score - 10);
    }
    if (lives <= 0) {
      endGame(false);
    }
  }
  updateUI();
}

function endGame(won) {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  if (won) {
    showConfetti();
    setTimeout(() => {
      alert("Congratulations! You just helped in collecting water for those who don’t have access.");
    }, 500);
  } else {
    alert("Game Over. Try again!");
  }
  startBtn.style.display = "block";
  resetBtn.style.display = "none";
}

function resetGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  score = 0;
  timeLeft = 60;
  lives = 4;
  droplets = 0;
  updateUI();
  confettiContainer.innerHTML = "";
  startBtn.style.display = "block";
  resetBtn.style.display = "inline-block";
  document.querySelectorAll('.water-drop').forEach(d => d.remove());
}

function showConfetti() {
  confettiContainer.innerHTML = '';
  for (let i = 0; i < 80; i++) {
    const conf = document.createElement('div');
    conf.className = 'confetti';
    conf.style.left = Math.random() * 100 + '%';
    conf.style.background = `hsl(${Math.random()*360}, 80%, 60%)`;
    conf.style.animationDelay = (Math.random() * 0.5) + 's';
    confettiContainer.appendChild(conf);
  }
  setTimeout(() => { confettiContainer.innerHTML = ''; }, 2500);
}