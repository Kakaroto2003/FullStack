const canvas = document.getElementById("meuCanvas");
const ctx = canvas.getContext("2d");

// Fundo: Céu verde claro
ctx.fillStyle = "#98FB98";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Estrada: Retângulo cinza na parte inferior
ctx.fillStyle = "gray";
ctx.fillRect(0, 200, canvas.width, 100);

// Lago: Forma com curva no canto inferior esquerdo
ctx.fillStyle = "#3399FF";
ctx.beginPath();
ctx.moveTo(0, 200);
ctx.lineTo(0, 300);
ctx.lineTo(80, 300);
ctx.quadraticCurveTo(80, 240, 0, 200);
ctx.fill();

// Sol: Círculo amarelo no canto superior direito
ctx.beginPath();
ctx.arc(240, 60, 25, 0, 2 * Math.PI);
ctx.fillStyle = "yellow";
ctx.fill();

// Casa: Corpo da casa (retângulo marrom)
ctx.fillStyle = "#8B4513";
ctx.fillRect(125, 140, 50, 60);

// Telhado: Triângulo vermelho
ctx.fillStyle = "#FF6347";
ctx.beginPath();
ctx.moveTo(125, 140);
ctx.lineTo(175, 140);
ctx.lineTo(150, 110);
ctx.closePath();
ctx.fill();

// Porta: Retângulo marrom escuro
ctx.fillStyle = "#5A3A1D";
ctx.fillRect(145, 165, 10, 35);

// Janelas: Dois quadrados azul claro
ctx.fillStyle = "#87CEFA";
ctx.fillRect(130, 150, 10, 10);
ctx.fillRect(160, 150, 10, 10);

// Função para desenhar árvores
function desenharArvore(xTronco, yTronco) {
  // Tronco
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(xTronco, yTronco, 10, 30);
  // Copa: Círculo verde
  ctx.beginPath();
  ctx.arc(xTronco + 5, yTronco, 15, 0, 2 * Math.PI);
  ctx.fillStyle = "green";
  ctx.fill();
}

// Árvores: uma à esquerda e outra à direita
desenharArvore(60, 170);
desenharArvore(230, 170);

