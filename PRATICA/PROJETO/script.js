const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player, bullets = [], enemies = [], explosions = [], groundExplosions = [];
let score = 0, lives = 3;
let gameStarted = false;
let keys = {};
let enemyInterval;

// Imagens
const backgroundImage = new Image();
backgroundImage.src = 'background.png';

const playerImage = new Image();
playerImage.src = 'tanque.png';

const enemyImage = new Image();
enemyImage.src = 'inimigo.png';

const bulletImage = new Image();
bulletImage.src = 'tiro.png';

const explosionImage = new Image();
explosionImage.src = 'explosao.png';

const groundExplosionImage = new Image();
groundExplosionImage.src = 'explosao2.png';

class Player {
  constructor() {
    this.width = 125;
    this.height = 125;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height - 20;
    this.speed = 7;
    this.canShoot = true;
  }

  move(direction) {
    if (direction === 'left') this.x -= this.speed;
    if (direction === 'right') this.x += this.speed;
    this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
  }

  shoot() {
    if (this.canShoot) {
      bullets.push(new Bullet(this.x + this.width / 2 - 15, this.y));
      this.canShoot = false;
      setTimeout(() => this.canShoot = true, 200);
    }
  }

  draw() {
    ctx.drawImage(playerImage, this.x, this.y, this.width, this.height);
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 70;
    this.speed = 12;
  }

  update() {
    this.y -= this.speed;
  }

  draw() {
    ctx.drawImage(bulletImage, this.x, this.y, this.width, this.height);
  }
}

class Enemy {
  constructor() {
    this.width = 80;
    this.height = 80;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = -this.height;
    this.speed = 1 + Math.random() * 1.5;
  }

  update() {
    this.y += this.speed;
  }

  draw() {
    ctx.drawImage(enemyImage, this.x, this.y, this.width, this.height);
  }
}

class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 100;
    this.life = 50;
  }

  update() {
    this.life--;
  }

  draw() {
    ctx.drawImage(explosionImage, this.x, this.y, this.size, this.size);
  }

  isAlive() {
    return this.life > 0;
  }
}

class GroundExplosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 150;
    this.life = 75;
  }

  update() {
    this.life--;
  }

  draw() {
    ctx.drawImage(groundExplosionImage, this.x, this.y, this.size, this.size);
  }

  isAlive() {
    return this.life > 0;
  }
}

function spawnEnemyWave(count = 4) {
  for (let i = 0; i < count; i++) {
    enemies.push(new Enemy());
  }
}

function drawHUD() {
  ctx.fillStyle = '#fff';
  ctx.font = '16px "Press Start 2P", Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Score: ${score}`, 20, 30);
  ctx.textAlign = 'right';
  ctx.fillText(`Vidas: ${lives}`, canvas.width - 20, 30);
  ctx.textAlign = 'start';
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ff4444';
  ctx.font = '32px "Press Start 2P", Arial';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
  ctx.fillStyle = '#fff';
  ctx.font = '16px "Press Start 2P", Arial';
  ctx.fillText(`Pontuação: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText('Pressione START ou [ESPAÇO] para jogar!', canvas.width / 2, canvas.height / 2 + 40);
  ctx.textAlign = 'start';
}

function update() {
  if (!gameStarted) return;

  // Movimento
  if (keys['arrowleft'] || keys['a']) player.move('left');
  if (keys['arrowright'] || keys['d']) player.move('right');

  // Fundo
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  player.draw();

  bullets.forEach((b) => {
    b.update();
    b.draw();
  });

  enemies.forEach((e, i) => {
    e.update();
    e.draw();

    // Quando inimigo atinge o chão
    if (e.y + e.height > canvas.height - 20) {
      groundExplosions.push(new GroundExplosion(e.x + e.width / 2 - 60, canvas.height - 170));
      enemies.splice(i, 1);
      lives--;
    }

    // Colisão com bala
    bullets.forEach((b, j) => {
      if (b.x < e.x + e.width && b.x + b.width > e.x &&
          b.y < e.y + e.height && b.y + b.height > e.y) {
        explosions.push(new Explosion(e.x + e.width / 2 - 20, e.y + e.height / 2 - 20));
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
      }
    });
  });

  explosions.forEach((exp, i) => {
    exp.update();
    exp.draw();
    if (!exp.isAlive()) explosions.splice(i, 1);
  });

  groundExplosions.forEach((exp, i) => {
    exp.update();
    exp.draw();
    if (!exp.isAlive()) groundExplosions.splice(i, 1);
  });

  drawHUD();

  if (lives <= 0) {
    endGame();
    drawGameOver();
  }
}

function gameLoop() {
  update();
  if (gameStarted) requestAnimationFrame(gameLoop);
}

function endGame() {
  gameStarted = false;
  clearInterval(enemyInterval);
}

document.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
  if ((e.key === ' ' || e.key === 'Spacebar') && gameStarted) player.shoot();
});

document.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

document.getElementById('startButton').addEventListener('click', () => {
  if (gameStarted) return;
  player = new Player();
  bullets = [];
  enemies = [];
  explosions = [];
  groundExplosions = [];
  score = 0;
  lives = 3;
  gameStarted = true;
  spawnEnemyWave(3);
  enemyInterval = setInterval(() => spawnEnemyWave(4), 3000);
  gameLoop();
});
