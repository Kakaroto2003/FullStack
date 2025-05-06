require("colors");
let bodyParser = require("body-parser")
var http = require('http'); // inclui o módulo http
var express = require('express'); // inclui o módulo express

var mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri = 'mongodb+srv://caioalexandre8000:<wYt6cG9YH6wLtrHB>@caioalexandre.qtavtvo.mongodb.net/?retryWrites=true&w=majority&appName=CaioAlexandre'
const client = new MongoClient(uri, { useNewUrlParser: true });

var dbo = client.db("exemplo_bd");
var usuarios = dbo.collection("usuarios");


// cria a variável app, pela qual acessaremos os métodos / funções existentes no framework express
var app = express () ;
app.use(bodyParser.urlencoded({extended: false }))
app.use(bodyParser.json())

// método use() utilizado para definir em qual pasta estará o conteúdo estático
app. use(express.static('./public'));


var server = http.createServer(app); // cria o servidor
server.listen(80); // define o número da porta que o servidor ouvirá

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

    let data = {db_nome: nome, db_email: email, db_senha: senha, db_nascimento: nascimento}
    usuarios.insertOne(data, function(err){
        if (err){
            resposta.render('Resposta.ejs',
                {mensagem: "Erro ao cadastrar usuário!", usuario: nome, login: email})
        }else{
            resposta.render('Resposta.ejs',
                {mensagem: "Usuário cadastrado com sucesso!", usuario: nome, login: email})
        }
    })

})

/**app.post('/cadastrar', function(requisição, resposta){
    let nome = requisição.body.Nome;
    let email = requisição.body.Email;
    let senha = requisição.body.Senha;
    let nascimento = requisição.body.Nascimento;
    console.log(nome, email, senha, nascimento);

    resposta.render('Resposta.ejs',
        {mensagem: "Usuário cadastrado com sucesso!", usuario: nome, login: email}) 
}) */

app.get('/for_ejs', function(requisição, resposta){
    let num = requisição.query.num;
    resposta.render('Exemplo_FOR.ejs', {tamanho: num});
})

app.post('/login', function(requisição, resposta){
    let email = requisição.body.email;
    let senha = requisição.body.senha;

    console.log(email, senha);

    let data = {db_email: email, db_senha: senha};
    usuarios.find(data).toArray(function(err, items) {
        console.log(items);
        if (items.length == 0) {
          resp.render('resposta_usuario', {resposta: "Usuário/senha não encontrado!"})
        }else if (err) {
          resp.render('resposta_usuario', {resposta: "Erro ao logar usuário!"})
        }else {
          resp.render('resposta_usuario', {resposta: "Usuário logado com sucesso!"})        
        };
      });
  
    });