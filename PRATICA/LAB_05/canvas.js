const canvas = document.getElementById('meuCanvas');
const ctx = canvas.getContext('2d');

function desenhar_quadrado(x, y, tamanho, cor) {
  ctx.fillStyle = cor;
  ctx.fillRect(x, y, tamanho, tamanho);
}

function desenhar_linha(x1, y1, x2, y2, cor) {
  ctx.strokeStyle = cor;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function desenhar_arco(x, y, raio, inicio, fim, cor) {
  ctx.strokeStyle = cor;
  ctx.beginPath();
  ctx.arc(x, y, raio, inicio, fim);
  ctx.stroke();
}

function escrever(texto, x, y, cor) {
  ctx.fillStyle = cor;
  ctx.font = "16px Arial";
  ctx.fillText(texto, x, y);
}

function desenhar_figura() {
  desenhar_quadrado(0, 0, 50, 'blue');
  desenhar_quadrado(250, 0, 50, 'red');
  desenhar_quadrado(125, 125, 50, 'red');
  desenhar_quadrado(0, 250, 50, 'yellow');
  desenhar_quadrado(250, 250, 50, 'black');
  desenhar_quadrado(40, 100, 20, 'cyan');
  desenhar_quadrado(240, 100, 20, 'cyan');

  desenhar_arco(150, 150, 20, 0, 2 * Math.PI, 'cyan');
  desenhar_arco(60, 200, 15, 0, 2 * Math.PI, 'yellow');
  desenhar_arco(240, 200, 15, 0, 2 * Math.PI, 'yellow');

  desenhar_linha(50, 0, 150, 150, 'blue');
  desenhar_linha(250, 0, 150, 150, 'red');
  desenhar_linha(0, 150, 300, 150, 'black');
  desenhar_linha(150, 150, 150, 300, 'black');

  desenhar_arco(150, 150, 40, Math.PI, 0, 'green');
  desenhar_arco(150, 150, 60, Math.PI, 0, 'green');
  desenhar_arco(150, 150, 80, Math.PI, 0, 'green');

  escrever("Canvas", 120, 50, 'black');
}

desenhar_figura();
