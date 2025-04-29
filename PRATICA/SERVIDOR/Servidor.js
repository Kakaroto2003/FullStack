require("colors");
let bodyParser = require("body-parser")


// inclui o módulo http
var http = require('http');
// inclui o módulo express
var express = require('express');

// cria a variável app, pela qual acessaremos
// os métodos / funções existentes no framework
// express
var app = express () ;
app.use(bodyParser.urlencoded({extended: false }))
app.use(bodyParser.json())

// método use() utilizado para definir em qual
// pasta estará o conteúdo estático
app. use(express.static('./public'));

// cria o servidor
var server = http.createServer(app);

// define o número da porta que o servidor ouvirá
server.listen(80);

// mensagem exibida no console para debug
console. log ("servidor rodando...");

console.log("Olá Mundo!".rainbow);


// Exemplos de GET e POST

app.get("/inicio", function(requisição, reposta){
    reposta.redirect('Aula_1 HTML/index.html')
})

app.post('/inicio', function(requisição, resposta){
    resposta.redirect('Aula_1 HTML/index.html')
})

app.get('/cadastrar', function(requisição, resposta){
    let nome = requisição.query.Nome;
    let email = requisição.query.Email;
    let senha = requisição.query.Senha;
    let nascimento = requisição.query.Nascimento;

    console.log(nome, email, senha, nascimento);

    resposta.render('Resposta.ejs',
         {mensagem: "Usuário cadastrado com sucesso!", usuário: nome, login: email})
})

app.post('/cadastrar', function(requisição, resposta){
    let nome = requisição.body.Nome;
    let email = requisição.body.Email;
    let senha = requisição.body.Senha;
    let nascimento = requisição.body.Nascimento;

    console.log(nome, email, senha, nascimento);

    resposta.render('Resposta.ejs',
        {mensagem: "Usuário cadastrado com sucesso!", usuário: nome, login: email})
})

app.get('/for_ejs', function(requisição, resposta){
    let num = requisição.query.num;
    resposta.render('Exemplo_FOR.ejs', {tamanho: num});
})