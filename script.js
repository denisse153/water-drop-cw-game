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
  document.getElementById('score').textContent = score;
  document.getElementById('time').textContent = timeLeft + 's';
  const livesContainer = document.getElementById('lives');
  livesContainer.innerHTML = '';
  for (let i = 0; i < lives; i++) {
    const img = document.createElement('img');
    img.src = 'img/emptyjerrycan.png'; // Make sure this path matches your jerrycan image
    img.alt = 'Jerrycan';
    img.className = 'life-jerrycan'; // Add a class for styling
    livesContainer.appendChild(img);
  }
  const fill = document.getElementById("water-fill");
  if (fill) {
    fill.style.height = `${score}%`;
  }
}

function createDrop(brownChance = 0.3) {
  const drop = document.createElement('div');

  // Use brownChance to determine color
  const isBlue = Math.random() > brownChance;
  drop.className = 'water-drop ' + (isBlue ? 'blue-drop' : 'brown-drop');

  // Randomly assign size
  const isBig = Math.random() > 0.5;
  const size = isBig ? 60 : 40;
  drop.style.width = size + 'px';
  drop.style.height = size + 'px';

  drop.style.left = Math.random() * (100 - size / 4) + '%';
  drop.style.top = '0px';

  // Remove drop when animation ends
  drop.addEventListener('animationend', () => {
    drop.remove();
  });

  // Collect on pointerdown/touchstart
  const collect = () => {
    drop.remove();
    if (isBlue && !isBig) {
      score += 5; // Blue small
    } else if (isBlue && isBig) {
      score += 10; // Blue big
    } else if (!isBlue && !isBig) {
      score -= 10; // Brown small
    } else if (!isBlue && isBig) {
      lives = Math.max(0, lives - 1); // Brown big
    }
    updateUI();
  };
  drop.addEventListener('pointerdown', collect);
  drop.addEventListener('touchstart', collect);

  document.getElementById('drops-area').appendChild(drop);
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

function loseLife() {
  lives--;
  updateUI();
  if (lives <= 0) {
    endGame(false);
  }
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