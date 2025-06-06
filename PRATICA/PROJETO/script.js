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

// Carrega as imagens usadas no jogo
const imagemCoracao = new Image();
imagemCoracao.src = 'imagens/coracao.png';

const imagemFundo = new Image();
imagemFundo.src = 'imagens/background_rd.png';

const imagemJogador = new Image();
imagemJogador.src = 'imagens/tanque.png';

const imagemInimigo = new Image();
imagemInimigo.src = 'imagens/inimigo.png';

const imagemTiro = new Image();
imagemTiro.src = 'imagens/tiro.png';

const imagemExplosao = new Image();
imagemExplosao.src = 'imagens/explosao.png';

const imagemExplosaoChao = new Image();
imagemExplosaoChao.src = 'imagens/explosao2.png';

// Classe que representa o jogador
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

// Classe para representar os tiros
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

// Classe para os inimigos
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

// Classe para explosões
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

// Classe para explosões no chão
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

// Cria inimigos em "ondas"
function gerarOndaInimigos(quantidade = 4) {
  for (let i = 0; i < quantidade; i++) {
    inimigos.push(new Inimigo());
  }
}

// Desenha pontuação e vidas (corações à direita)
function desenharInterface() {
  contexto.fillStyle = '#fff';
  contexto.font = '16px "Press Start 2P", Arial';
  contexto.textAlign = 'left';
  contexto.fillText(`Pontuação: ${pontuacao}`, 20, 30);

  for (let i = 0; i < vidas; i++) {
    contexto.drawImage(imagemCoracao, tela.width - 40 - i * 40, 10, 30, 30);
  }
}

// Tela de fim de jogo
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

// Atualiza o jogo
function atualizar() {
  if (!jogoIniciado || jogoPausado) return;

  if (teclas['arrowleft'] || teclas['a']) jogador.mover('esquerda');
  if (teclas['arrowright'] || teclas['d']) jogador.mover('direita');

  contexto.drawImage(imagemFundo, 0, 0, tela.width, tela.height);
  jogador.desenhar();

  tiros.forEach((t, i) => {
    t.atualizar();
    t.desenhar();
    // Remove tiros que saíram da tela
    if (t.y + t.altura < 0) tiros.splice(i, 1);
  });

  inimigos.forEach((i, idx) => {
    i.atualizar();
    i.desenhar();

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
      }
    });
  });

  explosoes.forEach((e, idx) => {
    e.atualizar();
    e.desenhar();
    if (!e.estaViva()) explosoes.splice(idx, 1);
  });

  explosoesChao.forEach((e, idx) => {
    e.atualizar();
    e.desenhar();
    if (!e.estaViva()) explosoesChao.splice(idx, 1);
  });

  desenharInterface();

  if (vidas <= 0) {
    finalizarJogo();
    desenharGameOver();
  }
}

// Loop do jogo (com controle para rodar só um loop)
function loopDoJogo() {
  if (!jogoIniciado) {
    loopRodando = false;
    return;
  }
  loopRodando = true;
  atualizar();
  requestAnimationFrame(loopDoJogo);
}

// Funções para iniciar e parar intervalo de inimigos
function iniciarIntervaloInimigos() {
  if (intervaloInimigos) return; // evita múltiplos intervalos
  intervaloInimigos = setInterval(() => {
    if (!jogoPausado && jogoIniciado) {
      gerarOndaInimigos(4);
    }
  }, 3500); // 3,5 segundos entre ondas, ajuste o tempo aqui
}

function pararIntervaloInimigos() {
  clearInterval(intervaloInimigos);
  intervaloInimigos = null;
}

// Finaliza o jogo
function finalizarJogo() {
  jogoIniciado = false;
  pararIntervaloInimigos();
}

// Eventos de teclado
document.addEventListener('keydown', (e) => {
  teclas[e.key.toLowerCase()] = true;
  if ((e.key === ' ' || e.key === 'Spacebar') && jogoIniciado) jogador.atirar();
});

document.addEventListener('keyup', (e) => {
  teclas[e.key.toLowerCase()] = false;
});

// Inicia o jogo ao clicar no botão
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

// Pausa e retoma na troca de aba
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    jogoPausado = true;
    pararIntervaloInimigos();
  } else {
    jogoPausado = false;
    iniciarIntervaloInimigos();
    if (!loopRodando) loopDoJogo();
  }
});
