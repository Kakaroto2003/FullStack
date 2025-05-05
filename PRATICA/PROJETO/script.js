// jogo.js

// ——————————————————————————————————————————————————————————
// 1) SETUP INICIAIS
// ——————————————————————————————————————————————————————————
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Controles
const keys = {};

// Listas de objetos
const bullets = [];
const enemies = [];

// Estado de jogo
let lastShot = 0;
let wave = 1;
let spawnTimer = 0;
let powerUpTimer = 0;
let gameStarted = false;

// ——————————————————————————————————————————————————————————
// 2) LOADING SPRITES
// ——————————————————————————————————————————————————————————
function loadSprite(src) {
  const img = new Image();
  img.src = src;
  return img;
}

const sprites = {
  player: {
    idle:  loadSprite('sprites/player_idle.png'),
    walk:  loadSprite('sprites/player_walk.png'),
    jump:  loadSprite('sprites/player_jump.png'),
    frameWidth:  48,  // largura de cada frame no sprite sheet
    frameHeight: 64,  // altura de cada frame
    idleFrames:  4,
    walkFrames:  8,
    jumpFrames:  4,
  },
  bullet: loadSprite('sprites/bullet_player.png'),
  enemy: {
    ground: loadSprite('sprites/enemy_ground.png'),
    air:    loadSprite('sprites/enemy_air.png'),
    frameWidth:  48,
    frameHeight: 48,
    frames:      4
  }
};

// ——————————————————————————————————————————————————————————
// 3) PLAYER
// ——————————————————————————————————————————————————————————
const player = {
  x: 100,
  y: canvas.height - sprites.player.frameHeight,
  width: sprites.player.frameWidth,
  height: sprites.player.frameHeight,
  vx: 0,
  vy: 0,
  speed: 4,
  jumping: false,
  color: 'white',       // cor do hitbox auxiliar
  animTime: 0,          // contador de tempo para animação
  state: 'idle',        // 'idle' | 'walk' | 'jump'
};

// ——————————————————————————————————————————————————————————
// 4) EVENTOS DE TECLADO
// ——————————————————————————————————————————————————————————
document.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
});
document.addEventListener('keyup', e => {
  keys[e.key.toLowerCase()] = false;
});

// ——————————————————————————————————————————————————————————
// 5) INICIAR JOGO
// ——————————————————————————————————————————————————————————
document.getElementById('startButton').addEventListener('click', () => {
  if (!gameStarted) {
    gameStarted = true;
    powerUpTimer = Date.now();
    requestAnimationFrame(loop);
  }
});

// ——————————————————————————————————————————————————————————
// 6) LOOP PRINCIPAL
// ——————————————————————————————————————————————————————————
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// ——————————————————————————————————————————————————————————
// 7) UPDATE: LÓGICA DE JOGO
// ——————————————————————————————————————————————————————————
function update() {
  if (!gameStarted) return;

  // 7.1) MOVIMENTO HORIZONTAL
  player.vx = 0;
  if (keys['arrowright'] || keys['d']) {
    player.vx = player.speed;
    player.state = 'walk';
  } else if (keys['arrowleft'] || keys['a']) {
    player.vx = -player.speed;
    player.state = 'walk';
  } else if (!player.jumping) {
    player.state = 'idle';
  }

  // 7.2) PULO
  if ((keys['arrowup'] || keys['w']) && !player.jumping) {
    player.vy = -16;
    player.jumping = true;
    player.state = 'jump';
  }

  // Aplica física
  player.x += player.vx;
  player.y += player.vy;
  player.vy += 1; // gravidade

  // Colisão com chão
  const groundY = canvas.height - player.height;
  if (player.y > groundY) {
    player.y = groundY;
    player.vy = 0;
    player.jumping = false;
    if (player.vx === 0) player.state = 'idle';
  }

  // Limites laterais
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  // 7.3) ATIRAR
  if (keys[' '] && Date.now() - lastShot > 300) {
    bullets.push({
      x: player.x + player.width - 10,
      y: player.y + player.height/2 - 5,
      width: 10,
      height: 5,
      speed: 8
    });
    lastShot = Date.now();
  }

  // Atualiza balas
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].x += bullets[i].speed;
    if (bullets[i].x > canvas.width) bullets.splice(i,1);
  }

  // 7.4) SPAWN DE INIMIGOS
  spawnTimer += 1;
  if (spawnTimer > 1200 / wave) { // a cada intervalo reduzido por wave
    spawnTimer = 0;
    spawnEnemy();
  }

  // Atualiza inimigos
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.x += e.vx;
    e.y += e.vy;
    // remove se sair da tela
    if (e.x < -50 || e.x > canvas.width + 50 || e.y > canvas.height + 50) {
      enemies.splice(i,1);
    }
  }

  // 7.5) POWER‑UP
  if (Date.now() - powerUpTimer > 60000) {
    powerUpTimer = Date.now();
    player.speed += 1;
    player.color = 'gold';
    setTimeout(() => player.color = 'white', 10000);
  }
}

// ——————————————————————————————————————————————————————————
// 8) FUNÇÕES AUXILIARES
// ——————————————————————————————————————————————————————————

// Cria inimigo aleatório (ground ou air)
function spawnEnemy() {
  const isAir = Math.random() < 0.4;
  const size = sprites.enemy.frameWidth;
  const e = {
    x: isAir ? Math.random() * canvas.width : (Math.random()<0.5 ? -size : canvas.width+size),
    y: isAir ? -size : canvas.height - size,
    vx: isAir ? (Math.random()<0.5? -2 : 2) : (player.x < canvas.width/2 ? 2 : -2),
    vy: isAir ? 2 : 0,
    type: isAir ? 'air' : 'ground',
    animTime: 0
  };
  enemies.push(e);
  wave++;
}

// Desenha um frame de sprite sheet
function drawSprite(img, sx, sy, sw, sh, dx, dy, dw, dh) {
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

// ——————————————————————————————————————————————————————————
// 9) DRAW: RENDERIZAÇÃO
// ——————————————————————————————————————————————————————————
function draw() {
  // Limpa tela
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 9.1) Desenha player animado
  let sheet, frames;
  if (player.state === 'walk') {
    sheet  = sprites.player.walk;
    frames = sprites.player.walkFrames;
  } else if (player.state === 'jump') {
    sheet  = sprites.player.jump;
    frames = sprites.player.jumpFrames;
  } else {
    sheet  = sprites.player.idle;
    frames = sprites.player.idleFrames;
  }

  // qual frame mostrar?
  const frameIndex = Math.floor(player.animTime / 5) % frames;
  player.animTime++;
  drawSprite(
    sheet,
    frameIndex * sprites.player.frameWidth, 0,
    sprites.player.frameWidth, sprites.player.frameHeight,
    player.x, player.y,
    player.width, player.height
  );

  // 9.2) Desenha balas
  ctx.fillStyle = 'red';
  bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

  // 9.3) Desenha inimigos
  enemies.forEach(e => {
    const enemySheet = sprites.enemy[e.type];
    const idx = Math.floor(e.animTime / 10) % sprites.enemy.frames;
    e.animTime++;
    drawSprite(
      enemySheet,
      idx * sprites.enemy.frameWidth, 0,
      sprites.enemy.frameWidth, sprites.enemy.frameHeight,
      e.x, e.y,
      sprites.enemy.frameWidth, sprites.enemy.frameHeight
    );
  });

  // 9.4) Texto de power‑up
  ctx.fillStyle = player.color;
  ctx.font = '12px "Press Start 2P"';
  if (player.color === 'gold') {
    ctx.fillText('POWER‑UP!', 10, 20);
  }
}
