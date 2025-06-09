// Obtém o elemento canvas e seu contexto 2D
const tela = document.getElementById('gameCanvas');
const contexto = tela.getContext('2d');

// Declaração de variáveis principais
let jogador, tiros = [], inimigos = [], explosoes = [], explosoesChao = [];
let pontuacao = 0, vidas = 3;
let jogoIniciado = false;
let jogoPausado = false;
let teclas = {};
let intervaloInimigos = null;
let loopRodando = false;
let powerUps = [];
let velocidadeAtiva = false;
let tempoVelocidade = 0;
const DURACAO_VELOCIDADE = 5000; // 5 segundos

const imagemPause = new Image();
imagemPause.src = 'imagens/OUTROS/pause.png';

const botaoPause = {
  x: 20,
  y: 50,
  largura: 50,
  altura: 50,
  imagem: imagemPause,
};

// Carrega as imagens usadas no jogo

// Ícone HUD de velocidade ativa
const iconeVelocidadeHUD = new Image();
iconeVelocidadeHUD.src = 'imagens/OUTROS/rapidez.png'; // ícone ficará no canto da tela

// Sprite de queda do power-up de velocidade
const imagemPowerVelocidade = new Image();
imagemPowerVelocidade.src = 'imagens/POWERUPS/velocidade.png'; // arte que aparece caindo

// Power-up de vida
const imagemPowerVida = new Image();
imagemPowerVida.src = 'imagens/POWERUPS/vida.png';

// Coração (vidas)
const imagemCoracao = new Image();
imagemCoracao.src = 'imagens/OUTROS/coracao.png';

// Plano de fundo
const imagemFundo = new Image();
imagemFundo.src = 'imagens/FUNDO/background_rd.png';

// Jogador
const imagemJogador = new Image();
imagemJogador.src = 'imagens/TANQUES/tanque.png';

// Inimigo
const imagemInimigo = new Image();
imagemInimigo.src = 'imagens/INIMIGOS/inimigo.png';

// Tiro
const imagemTiro = new Image();
imagemTiro.src = 'imagens/TIROS/tiro.png';

// Explosões
const imagemExplosao = new Image();
imagemExplosao.src = 'imagens/OUTROS/explosao.png';

const imagemExplosaoChao = new Image();
imagemExplosaoChao.src = 'imagens/OUTROS/explosao2.png';


class Jogador {
  constructor() {
    this.largura = 150;
    this.altura = 150;
    this.x = tela.width / 2 - this.largura / 2;
    this.y = tela.height - this.altura - 20;
    this.velocidade = 7;
    this.podeAtirar = true;
  }

  mover(direcao) {
    if (direcao === 'esquerda') this.x -= this.velocidade;
    if (direcao === 'direita') this.x += this.velocidade;
    this.x = Math.max(0, Math.min(tela.width - this.largura, this.x));
  }

  atirar() {
    if (this.podeAtirar) {
      tiros.push(new Tiro(this.x + this.largura / 2 - 15, this.y));
      this.podeAtirar = false;
      setTimeout(() => this.podeAtirar = true, 200);
    }
  }

  desenhar() {
    contexto.drawImage(imagemJogador, this.x, this.y, this.largura, this.altura);
  }
}

class Tiro {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.largura = 30;
    this.altura = 70;
    this.velocidade = 12;
  }

  atualizar() {
    this.y -= this.velocidade;
  }

  desenhar() {
    contexto.drawImage(imagemTiro, this.x, this.y, this.largura, this.altura);
  }
}

class Inimigo {
  constructor() {
    this.largura = 70;
    this.altura = 70;
    this.x = Math.random() * (tela.width - this.largura);
    this.y = -this.altura;
    this.velocidade = 1 + Math.random() * 1.5;
  }

  atualizar() {
    this.y += this.velocidade;
  }

  desenhar() {
    contexto.drawImage(imagemInimigo, this.x, this.y, this.largura, this.altura);
  }
}

class Explosao {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.tamanho = 100;
    this.vida = 50;
  }

  atualizar() {
    this.vida--;
  }

  desenhar() {
    contexto.drawImage(imagemExplosao, this.x, this.y, this.tamanho, this.tamanho);
  }

  estaViva() {
    return this.vida > 0;
  }
}

class ExplosaoChao {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.tamanho = 150;
    this.vida = 75;
  }

  atualizar() {
    this.vida--;
  }

  desenhar() {
    contexto.drawImage(imagemExplosaoChao, this.x, this.y, this.tamanho, this.tamanho);
  }

  estaViva() {
    return this.vida > 0;
  }
}

class PowerUpVida {
  constructor(x, y) {
    this.largura = 40;
    this.altura = 40;
    this.x = x;
    this.y = y;
    this.velocidade = 2;
  }

  atualizar() {
    this.y += this.velocidade;
  }

  desenhar() {
    contexto.drawImage(imagemPowerVida, this.x, this.y, this.largura, this.altura);
  }

  colidiuCom(jogador) {
    return (
      this.x < jogador.x + jogador.largura &&
      this.x + this.largura > jogador.x &&
      this.y < jogador.y + jogador.altura &&
      this.y + this.altura > jogador.y
    );
  }
}

class PowerUpVelocidade {
  constructor(x, y) {
    this.largura = 40;
    this.altura = 40;
    this.x = x;
    this.y = y;
    this.velocidade = 2;
  }

  atualizar() {
    this.y += this.velocidade;
  }

  desenhar() {
    contexto.drawImage(imagemPowerVelocidade, this.x, this.y, this.largura, this.altura);
  }

  colidiuCom(jogador) {
    return (
      this.x < jogador.x + jogador.largura &&
      this.x + this.largura > jogador.x &&
      this.y < jogador.y + jogador.altura &&
      this.y + this.altura > jogador.y
    );
  }
}



function gerarOndaInimigos(quantidade = 4) {
  for (let i = 0; i < quantidade; i++) {
    inimigos.push(new Inimigo());
  }
}

function desenharInterface() {
  contexto.fillStyle = '#fff';
  contexto.font = '16px "Press Start 2P", Arial';
  contexto.textAlign = 'left';
  contexto.fillText(`Pontuação: ${pontuacao}`, 20, 30);

  // Corações de vida
  for (let i = 0; i < vidas && i < 5; i++) {
    contexto.drawImage(imagemCoracao, tela.width - 40 - i * 40, 10, 30, 30);
  }

  // Ícone de velocidade ao lado dos corações
  if (velocidadeAtiva) {
    const x = tela.width - 40 - vidas * 40;
    contexto.drawImage(iconeVelocidadeHUD, x, 10, 25, 25);
  }

  // Botão de pause
  contexto.drawImage(botaoPause.imagem, botaoPause.x, botaoPause.y, botaoPause.largura, botaoPause.altura);
}




function ativarVelocidadeTemporaria() {
  tempoVelocidade = Date.now();
  if (!velocidadeAtiva) {
    velocidadeAtiva = true;
    jogador.velocidade *= 1.5;

    // Timer para voltar ao normal
    setTimeout(() => {
      if (Date.now() - tempoVelocidade >= DURACAO_VELOCIDADE) {
        jogador.velocidade /= 1.5;
        velocidadeAtiva = false;
      }
    }, DURACAO_VELOCIDADE + 100); // leve buffer para garantir tempo completo
  } else {
    // apenas reinicia o tempo se já estiver ativo
    tempoVelocidade = Date.now();
  }
}



function desenharGameOver() {
  contexto.fillStyle = 'rgba(0, 0, 0, 0.7)';
  contexto.fillRect(0, 0, tela.width, tela.height);
  contexto.fillStyle = '#ff4444';
  contexto.font = '32px "Press Start 2P", Arial';
  contexto.textAlign = 'center';
  contexto.fillText('FIM DE JOGO', tela.width / 2, tela.height / 2 - 20);
  contexto.fillStyle = '#fff';
  contexto.font = '16px "Press Start 2P", Arial';
  contexto.fillText(`Pontuação: ${pontuacao}`, tela.width / 2, tela.height / 2 + 10);
  contexto.fillText('Pressione START ou [ESPAÇO] para jogar!', tela.width / 2, tela.height / 2 + 40);
  contexto.textAlign = 'start';
}

function desenharPausa() {
  contexto.fillStyle = 'rgba(0, 0, 0, 0.7)';
  contexto.fillRect(0, 0, tela.width, tela.height);
  contexto.fillStyle = '#ffff00';
  contexto.font = '28px "Press Start 2P", Arial';
  contexto.textAlign = 'center';
  contexto.fillText('JOGO PAUSADO', tela.width / 2, tela.height / 2 - 20);
  contexto.fillStyle = '#ffffff';
  contexto.font = '14px "Press Start 2P", Arial';
  contexto.fillText('Pressione [ESPAÇO] para continuar', tela.width / 2, tela.height / 2 + 20);
  contexto.textAlign = 'start';
}

function atualizar() {
  if (!jogoIniciado) return;

  contexto.drawImage(imagemFundo, 0, 0, tela.width, tela.height);
  jogador.desenhar();

  // Tiros
  tiros.forEach((t, i) => {
    if (!jogoPausado) t.atualizar();
    t.desenhar();
    if (t.y + t.altura < 0) tiros.splice(i, 1);
  });

  // Inimigos
  inimigos.forEach((i) => {
    if (!jogoPausado) i.atualizar();
    i.desenhar();
  });

  // Explosões
  explosoes = explosoes.filter(e => {
    if (!jogoPausado) e.atualizar();
    e.desenhar();
    return e.estaViva();
  });

  explosoesChao = explosoesChao.filter(e => {
    if (!jogoPausado) e.atualizar();
    e.desenhar();
    return e.estaViva();
  });

  // Power-ups
  powerUps = powerUps.filter((p) => {
    if (!jogoPausado) p.atualizar();
    p.desenhar();

    if (p.colidiuCom(jogador)) {
      if (p instanceof PowerUpVida) {
        if (vidas < 5) vidas++;
      } else if (p instanceof PowerUpVelocidade) {
        ativarVelocidadeTemporaria();
      }
      return false; // remove o power-up após coleta
    }

    return p.y < tela.height;
  });

  // Desenha HUD (pontuação, vidas, botão pause)
  desenharInterface();

  // Pausa
  if (jogoPausado) {
    desenharPausa();
    return;
  }

  // Movimento
  if (teclas['arrowleft'] || teclas['a']) jogador.mover('esquerda');
  if (teclas['arrowright'] || teclas['d']) jogador.mover('direita');

  // Colisões e pontuação
  inimigos.forEach((i, idx) => {
    if (i.y + i.altura > tela.height - 20) {
      explosoesChao.push(new ExplosaoChao(i.x + i.largura / 2 - 60, tela.height - 170));
      inimigos.splice(idx, 1);
      vidas--;
    }

    tiros.forEach((t, jdx) => {
      if (t.x < i.x + i.largura && t.x + t.largura > i.x &&
          t.y < i.y + i.altura && t.y + t.altura > i.y) {
        explosoes.push(new Explosao(i.x + i.largura / 2 - 20, i.y + i.altura / 2 - 20));
        inimigos.splice(idx, 1);
        tiros.splice(jdx, 1);
        pontuacao += 100;

        // Chance de soltar power-up ao destruir inimigo
        const inimigoX = i.x + i.largura / 2 - 20;
const inimigoY = i.y + i.altura / 2 - 20;

if (Math.random() < 0.2) {
  powerUps.push(new PowerUpVida(inimigoX, inimigoY));
} else if (Math.random() < 0.2) {
  powerUps.push(new PowerUpVelocidade(inimigoX, inimigoY));
}

      }
    });
  });

  // Fim de jogo
  if (vidas <= 0) {
    finalizarJogo();
    desenharGameOver();
  }
}


function loopDoJogo() {
  if (!jogoIniciado) {
    loopRodando = false;
    return;
  }
  loopRodando = true;
  atualizar();
  requestAnimationFrame(loopDoJogo);
}

function iniciarIntervaloInimigos() {
  if (intervaloInimigos) return;
  intervaloInimigos = setInterval(() => {
    if (!jogoPausado && jogoIniciado) gerarOndaInimigos(4);
  }, 3500);
}

function pararIntervaloInimigos() {
  clearInterval(intervaloInimigos);
  intervaloInimigos = null;
}


function finalizarJogo() {
  jogoIniciado = false;
  pararIntervaloInimigos();
}

document.addEventListener('keydown', (e) => {
  teclas[e.key.toLowerCase()] = true;

  if (e.key === ' ' || e.key === 'Spacebar') {
    if (jogoIniciado && jogoPausado) {
      jogoPausado = false;
      iniciarIntervaloInimigos();
      if (!loopRodando) loopDoJogo();
    } else if (jogoIniciado) {
      jogador.atirar();
    }
  }
});

document.addEventListener('keyup', (e) => {
  teclas[e.key.toLowerCase()] = false;
});

tela.addEventListener('click', (e) => {
  const rect = tela.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (
    x >= botaoPause.x &&
    x <= botaoPause.x + botaoPause.largura &&
    y >= botaoPause.y &&
    y <= botaoPause.y + botaoPause.altura
  ) {
    jogoPausado = !jogoPausado;
    if (jogoPausado) pararIntervaloInimigos();
    atualizar();
  }
});

document.getElementById('startButton').addEventListener('click', () => {
  if (jogoIniciado) return;
  jogador = new Jogador();
  tiros = [];
  inimigos = [];
  explosoes = [];
  explosoesChao = [];
  pontuacao = 0;
  vidas = 3;
  jogoIniciado = true;
  jogoPausado = false;
  gerarOndaInimigos(3);
  iniciarIntervaloInimigos();
  if (!loopRodando) loopDoJogo();
});

document.addEventListener('visibilitychange', () => {
  if (jogoIniciado) {
    if (document.hidden) {
      jogoPausado = true;
      pararIntervaloInimigos();
      atualizar(); // desenha a tela de pause
    } else {
      atualizar(); // só redesenha, não despausa
    }
  }
});

