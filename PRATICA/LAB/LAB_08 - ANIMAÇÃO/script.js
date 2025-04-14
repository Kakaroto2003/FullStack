const canvas = document.getElementById('meuCanvas');
const ctx = canvas.getContext('2d');

const img = new Image();
img.src = 'Mouse.png';

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

const imgWidth = 40;
const imgHeight = 40;

// Garante que a imagem fique dentro do canvas
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  mouseX = clamp(x, imgWidth / 2, canvas.width - imgWidth / 2);
  mouseY = clamp(y, imgHeight / 2, canvas.height - imgHeight / 2);
});

function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, mouseX - imgWidth / 2, mouseY - imgHeight / 2, imgWidth, imgHeight);
  requestAnimationFrame(desenhar);
}

img.onload = () => {
  desenhar();
};
