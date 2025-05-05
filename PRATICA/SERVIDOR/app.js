const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 80; 

// Configurações
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rotas
app.get('/', (req, res) => {
  res.send('<h1>Bem-vindo à página de projetos!</h1>');
});

app.get('/cadastra', (req, res) => {
  res.sendFile(path.join(__dirname, 'PUBLIC', 'LAB', 'LAB_8 GET_POST_TEMPLATE', 'cadastro.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'PUBLIC', 'LAB', 'LAB_8 GET_POST_TEMPLATE', 'login.html'));
});

app.post('/resposta', (req, res) => {
  const { usuario, senha } = req.body;
  const status = (usuario && senha) ? 'Login/Cadastro bem-sucedido!' : 'Login inválido';

  res.render('resposta', { usuario, status });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
