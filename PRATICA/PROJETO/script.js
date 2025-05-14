const enemyImage = new Image();
enemyImage.src = 'assets/enemy.png';


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player, bullets = [], enemies = [], enemyBullets = [];
let gameStarted = false;
let powerUpInterval;
let startTime;

const gameDuration = 7 * 60 * 1000; // 7 minutos

class Player {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height - 60;
    this.width = 30;
    this.height = 40;
    this.speed = 4;
    this.color = '#00ffcc';
    this.hp = 100;
    this.maxHp = 100;
    this.canShoot = true;
  }

  move(dir) {
    if (dir === 'left') this.x -= this.speed;
    if (dir === 'right') this.x += this.speed;
    this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
  }

  shoot() {
    if (this.canShoot) {
      bullets.push(new Bullet(this.x + this.width / 2 - 2, this.y));
      this.canShoot = false;
      setTimeout(() => this.canShoot = true, 300);
    }
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp < 0) this.hp = 0;
  }

  draw() {
    // Corpo
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Cabeça
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.x + 5, this.y - 10, 20, 10);
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 4;
    this.speed = 8;
  }

  update() {
    this.y -= this.speed;
  }

  draw() {
    // Rastro do tiro
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + 10);
    gradient.addColorStop(0, '#ffcc00');
    gradient.addColorStop(1, '#ff0000');
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.size, 10);
  }
}

class Enemy {
  constructor() {
    this.x = Math.random() * (canvas.width - 30);
    this.y = -30;
    this.width = 30;
    this.height = 30;
    this.speed = 1.5 + Math.random() * 1;
    this.shootInterval = setInterval(() => this.shoot(), 2000 + Math.random() * 1500);
  }

  update() {
    this.y += this.speed;
  }

  shoot() {
    if (this.y > 0 && gameStarted) {
      enemyBullets.push(new EnemyBullet(this.x + this.width / 2, this.y + this.height));
    }
  }

  draw() { ctx.drawImage(enemyImage, this.x, this.y, this.width, this.height);
    ctx.fill();
  }
}

class EnemyBullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 5;
    this.speed = 3.5;
  }

  update() {
    this.y += this.speed;
  }

  draw() {
    ctx.fillStyle = '#ff3333';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function spawnEnemyWave(count = 4) {
  for (let i = 0; i < count; i++) {
    enemies.push(new Enemy());
  }
}

function drawHUD() {
  ctx.fillStyle = '#333';
  ctx.fillRect(20, 20, 100, 10);
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(20, 20, player.hp, 10);
  ctx.strokeStyle = '#fff';
  ctx.strokeRect(20, 20, 100, 10);

  const timeLeft = Math.max(0, gameDuration - (Date.now() - startTime));
  const seconds = Math.floor(timeLeft / 1000);
  ctx.fillStyle = '#fff';
  ctx.font = '10px Arial';
  ctx.fillText('Tempo: ' + seconds + 's', canvas.width - 120, 30);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();

  bullets.forEach((b, i) => {
    b.update();
    b.draw();
    if (b.y < 0) bullets.splice(i, 1);
  });

  enemies.forEach((e, i) => {
    e.update();
    e.draw();
    if (e.y > canvas.height) enemies.splice(i, 1);
    bullets.forEach((b, j) => {
      if (b.x > e.x && b.x < e.x + e.width && b.y < e.y + e.height) {
        clearInterval(e.shootInterval);
        enemies.splice(i, 1);
        bullets.splice(j, 1);
      }
    });
  });

  enemyBullets.forEach((eb, i) => {
    eb.update();
    eb.draw();
    if (
      eb.x > player.x &&
      eb.x < player.x + player.width &&
      eb.y > player.y &&
      eb.y < player.y + player.height
    ) {
      player.takeDamage(10);
      enemyBullets.splice(i, 1);
    }
    if (eb.y > canvas.height) enemyBullets.splice(i, 1);
  });

  drawHUD();

  if (player.hp <= 0) return endGame("lose");
  const elapsed = Date.now() - startTime;
  if (elapsed >= gameDuration) endGame("win");
}

function gameLoop() {
  update();
  if (gameStarted) requestAnimationFrame(gameLoop);
}

function endGame(result) {
  clearInterval(powerUpInterval);
  enemies.forEach(e => clearInterval(e.shootInterval));
  alert(result === "win" ? "Você venceu!" : "Game Over");
  gameStarted = false;
}

function addPowerUpAndEnemies() {
  player.speed += 0.3;
  spawnEnemyWave(3);
}

document.addEventListener('keydown', (e) => {
  if (!gameStarted) return;
  if (e.key === 'ArrowLeft' || e.key === 'a') player.move('left');
  if (e.key === 'ArrowRight' || e.key === 'd') player.move('right');
  if (e.key === ' ' || e.key === 'Spacebar') player.shoot();
});

document.getElementById('startButton').addEventListener('click', () => {
  if (gameStarted) return;
  gameStarted = true;
  player = new Player();
  bullets = [];
  enemies = [];
  enemyBullets = [];
  startTime = Date.now();
  spawnEnemyWave(5);
  powerUpInterval = setInterval(addPowerUpAndEnemies, 60000);
  gameLoop();
});