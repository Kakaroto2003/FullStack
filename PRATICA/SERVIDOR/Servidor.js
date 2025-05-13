require("colors");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const uri = 'mongodb+srv://caioalexandre8000:Caio14082003@caioalexandre.qtavtvo.mongodb.net/?retryWrites=true&w=majority&appName=CaioAlexandre';

const app = express();

// Middlewares
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Conectar ao banco antes de iniciar o servidor
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const db = client.db("exemplo_bd");
    const usuarios = db.collection("usuarios");

    // Rota inicial
    app.get('/', (req, res) => {
      res.redirect('LAB/Project.html');
    });

    app.get('/cadastra', (req, res) => {
      res.redirect('LAB/LAB_8 - GET_POST_TEMPLATE/cadastro.html');
    });

    app.get('/login', (req, res) => {
      res.redirect('LAB/LAB_8 - GET_POST_TEMPLATE/login.html');
    });

    // Cadastrar usuário (GET via querystring)
    app.get('/cadastrar', (req, res) => {
      const { nome, email, senha, nascimento } = req.query;
      console.log(nome, email, senha, nascimento);

      res.render('resposta.ejs', {
        mensagem: "Usuário cadastrado com sucesso!",
        usuario: nome,
        login: email
      });
    });

    // Cadastrar usuário (POST com inserção no Mongo)
    app.post('/resposta', (req, res) => {
      const { nome, email, senha, nascimento } = req.body;
      const data = { db_nome: nome, db_email: email, db_senha: senha, db_nascimento: nascimento };

      usuarios.insertOne(data, (err) => {
        if (err) {
          res.render('resposta.ejs', {
            mensagem: "Erro ao cadastrar usuário!",
            usuario: nome,
            login: email
          });
        } else {
          res.render('resposta.ejs', {
            mensagem: "Usuário cadastrado com sucesso!",
            usuario: nome,
            login: email
          });
        }
      });
    });

    // Login
    app.post('/login', function(requisicao, resposta){
        let email = requisicao.body.email;
        let senha = requisicao.body.senha;
    
        let data = {db_email: email, db_senha: senha};
        usuarios.find(data).toArray(function(err, items){
            if (items.length == 0) {
                resposta.render('login.ejs', {mensagem: "Usuário/senha não encontrado!"})
            } else if (err) {
                resposta.render('login.ejs', {mensagem: "Erro ao logar usuário!"})
            } else {
                resposta.render('resposta_usuario.ejs', {mensagem: "Usuário logado com sucesso!", usuario: items[0].db_nome, login: items[0].db_email})
            }
        });
    });
    

    // Atualizar usuário
    app.post('/atualizar_usuario', (req, res) => {
      const filtro = { db_email: req.body.email, db_senha: req.body.senha };
      const atualizacao = { $set: { db_senha: req.body.novasenha } };

      usuarios.updateOne(filtro, atualizacao, (err, result) => {
        if (err) {
          res.render('resposta_usuario.ejs', { mensagem: "Erro ao atualizar usuário!" });
        } else if (result.modifiedCount === 0) {
          res.render('resposta_usuario.ejs', { mensagem: "Usuário/senha não encontrado!" });
        } else {
          res.render('resposta_usuario.ejs', { mensagem: "Usuário atualizado com sucesso!" });
        }
      });
    });

    // Remover usuário
    app.post('/remover_usuario', (req, res) => {
      const filtro = { db_email: req.body.email, db_senha: req.body.senha };

      usuarios.deleteOne(filtro, (err, result) => {
        if (err) {
          res.render('resposta_usuario.ejs', { mensagem: "Erro ao remover usuário!" });
        } else if (result.deletedCount === 0) {
          res.render('resposta_usuario.ejs', { mensagem: "Usuário/senha não encontrado!" });
        } else {
          res.render('resposta_usuario.ejs', { mensagem: "Usuário removido com sucesso!" });
        }
      });
    });

    // Exemplo de uso de EJS com for
    app.get('/for_ejs', (req, res) => {
      const num = parseInt(req.query.num);
      res.render('exemplo_for.ejs', { tamanho: num });
    });

    // Iniciar servidor após a conexão com o banco
    const server = http.createServer(app);
    server.listen(80, () => {
      console.log("Servidor rodando...".rainbow);
    });
  })
  .catch(err => {
    console.error("Erro ao conectar ao MongoDB:", err);
  });

