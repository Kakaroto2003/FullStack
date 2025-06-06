// Obtém o elemento canvas e seu contexto 2D
const tela = document.getElementById('gameCanvas');
const contexto = tela.getContext('2d');

// Declaração de variáveis principais
let jogador, tiros = [], inimigos = [], explosoes = [], explosoesChao = [];
let pontuacao = 0, vidas = 3;
let jogoIniciado = false;
let teclas = {};
let intervaloInimigos;

// Carrega as imagens usadas no jogo
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
    // Define o tamanho e a posição inicial do jogador
    this.largura = 150;
    this.altura = 150;
    this.x = tela.width / 2 - this.largura / 2;
    this.y = tela.height - this.altura - 20;
    this.velocidade = 7;
    this.podeAtirar = true;
  }

  // Move o jogador para esquerda ou direita
  mover(direcao) {
    if (direcao === 'esquerda') this.x -= this.velocidade;
    if (direcao === 'direita') this.x += this.velocidade;
    // Garante que o jogador não saia da tela
    this.x = Math.max(0, Math.min(tela.width - this.largura, this.x));
  }

  // Cria um novo tiro se estiver habilitado
  atirar() {
    if (this.podeAtirar) {
      tiros.push(new Tiro(this.x + this.largura / 2 - 15, this.y)); // Centraliza o tiro no jogador
      this.podeAtirar = false; // Impede disparos contínuos
      setTimeout(() => this.podeAtirar = true, 200); // Espera 200ms para permitir novo tiro
    }
  }

  // Desenha o jogador na tela
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

  // Move o tiro para cima
  atualizar() {
    this.y -= this.velocidade;
  }

  // Desenha o tiro na tela
  desenhar() {
    contexto.drawImage(imagemTiro, this.x, this.y, this.largura, this.altura);
  }
}

// Classe para os inimigos que descem na tela
class Inimigo {
  constructor() {
    this.largura = 70;
    this.altura = 70;
    this.x = Math.random() * (tela.width - this.largura); // Posição aleatória no eixo X
    this.y = -this.altura; // Começa fora da tela (parte de cima)
    this.velocidade = 1 + Math.random() * 1.5; // Velocidade aleatória
  }

  // Move o inimigo para baixo
  atualizar() {
    this.y += this.velocidade;
  }

  // Desenha o inimigo
  desenhar() {
    contexto.drawImage(imagemInimigo, this.x, this.y, this.largura, this.altura);
  }
}

// Classe para explosões quando o inimigo é atingido
class Explosao {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.tamanho = 100;
    this.vida = 50; // Tempo que a explosão permanece na tela
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

// Classe para explosões no chão (quando inimigo chega ao fim)
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

// Desenha pontuação e vidas na tela
function desenharInterface() {
  contexto.fillStyle = '#fff';
  contexto.font = '16px "Press Start 2P", Arial';
  contexto.textAlign = 'left';
  contexto.fillText(`Pontuação: ${pontuacao}`, 20, 30);
  contexto.textAlign = 'right';
  contexto.fillText(`Vidas: ${vidas}`, tela.width - 20, 30);
  contexto.textAlign = 'start';
}

// Desenha a tela de fim de jogo
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

// Função principal que atualiza o jogo
function atualizar() {
  if (!jogoIniciado) return;

  // Controla o movimento do jogador pelas teclas
  if (teclas['arrowleft'] || teclas['a']) jogador.mover('esquerda');
  if (teclas['arrowright'] || teclas['d']) jogador.mover('direita');

  // Desenha o fundo
  contexto.drawImage(imagemFundo, 0, 0, tela.width, tela.height);

  // Desenha o jogador
  jogador.desenhar();

  // Atualiza e desenha cada tiro
  tiros.forEach((t) => {
    t.atualizar();
    t.desenhar();
  });

  // Atualiza inimigos e detecta colisões com tiros ou chegada no chão
  inimigos.forEach((i, idx) => {
    i.atualizar();
    i.desenhar();

    // Se o inimigo passar da tela (chegou ao chão)
    if (i.y + i.altura > tela.height - 20) {
      explosoesChao.push(new ExplosaoChao(i.x + i.largura / 2 - 60, tela.height - 170));
      inimigos.splice(idx, 1);
      vidas--;
    }

    // Verifica colisão com tiros
    tiros.forEach((t, jdx) => {
      if (t.x < i.x + i.largura && t.x + t.largura > i.x &&
          t.y < i.y + i.altura && t.y + t.altura > i.y) {
        explosoes.push(new Explosao(i.x + i.largura / 2 - 20, i.y + i.altura / 2 - 20));
        inimigos.splice(idx, 1);
        tiros.splice(jdx, 1);
        pontuacao += 10;
      }
    });
  });

  // Atualiza as explosões
  explosoes.forEach((e, idx) => {
    e.atualizar();
    e.desenhar();
    if (!e.estaViva()) explosoes.splice(idx, 1);
  });

  // Atualiza explosões do chão
  explosoesChao.forEach((e, idx) => {
    e.atualizar();
    e.desenhar();
    if (!e.estaViva()) explosoesChao.splice(idx, 1);
  });

  // Desenha a interface
  desenharInterface();

  // Verifica se o jogo acabou
  if (vidas <= 0) {
    finalizarJogo();
    desenharGameOver();
  }
}

// Função principal que mantém o jogo rodando em loop
function loopDoJogo() {
  atualizar(); // Atualiza a lógica e os desenhos
  if (jogoIniciado) requestAnimationFrame(loopDoJogo); // Continua o loop se o jogo não tiver acabado
}

// Para o jogo
function finalizarJogo() {
  jogoIniciado = false;
  clearInterval(intervaloInimigos); // Para de gerar inimigos
}

// Captura teclas pressionadas
document.addEventListener('keydown', (e) => {
  teclas[e.key.toLowerCase()] = true;
  // Se pressionar espaço durante o jogo, atira
  if ((e.key === ' ' || e.key === 'Spacebar') && jogoIniciado) jogador.atirar();
});

// Remove teclas soltas
document.addEventListener('keyup', (e) => {
  teclas[e.key.toLowerCase()] = false;
});

// Inicia o jogo ao clicar no botão "start"
document.getElementById('startButton').addEventListener('click', () => {
  if (jogoIniciado) return; // Impede iniciar várias vezes
  jogador = new Jogador();
  tiros = [];
  inimigos = [];
  explosoes = [];
  explosoesChao = [];
  pontuacao = 0;
  vidas = 3;
  jogoIniciado = true;
  gerarOndaInimigos(3); // Primeira onda
  intervaloInimigos = setInterval(() => gerarOndaInimigos(4), 3000); // Novas ondas a cada 3 segundos
  loopDoJogo(); // Inicia o loop do jogo
});
