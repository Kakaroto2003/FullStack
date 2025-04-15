p1 = document.getElementById('p1').innerHTML;
console.log(p1);

document.getElementById('p1').innerHTML = "Novo Texto"

//Exemplo 1: Idade

// let nome = prompt("Digite o seu nome!");
// let idade = prompt("Digite a sua idade!");
// let ano_atual = 2025;

// let ano_nasc = ano_atual - idade;

// let resp_ex1 = 'Olá ' + nome + ', seu ano de nascimento é: ' + ano_nasc + '!';
// document.getElementById('Ex1').innerHTML = resp_ex1;

//Exemplo 2: Função

 function ImprimeFrase (Frase){
     document.getElementById('Ex2').innerHTML = Frase;
 }

 ImprimeFrase('Hello World!!!');

// function imprimefrase (){
//     document.getElementById('Ex2').innerHTML = 'Olá Mundo!!!';
// }

// imprimefrase();

//Exemplo 3: Soma

function mult(a, b){
    return a * b;
}

function soma(a, b){
     return a + b;
 }
 let c = soma(4,6);
 console.log(c);
 console.log(soma(3,2));
 console.log(soma(16,-17));

//Exemplo de Input

function ex_input(){
  let v = document.getElementById('entrada_usuario').value;

  document.getElementById('Ex2').innerHTML = v;
}

//Exercicio2

function ex2(){
    let num = document.getElementById('ex2_num').value;

    let resp = '';
    console.log('Resposta ex2');
    for (let i = 0; i <= num; i++){
        console.log(i);
        resp += i + ' ';
    }

    document.getElementById('ex2_resp').innerHTML = resp;

}

function ex3(){
    let num1 = parseInt(document.getElementById('ex3_num1').value);
    let num2 = parseInt(document.getElementById('ex3_num2').value);

    resp = soma(num1,num2);
    document.getElementById('ex3_resp').innerHTML = resp;

}

function ex4(){
    let num1 = parseInt(document.getElementById('ex4_num1').value);
    let num2 = parseInt(document.getElementById('ex4_num2').value);

    if(num1 < 0 || num2 < 0){
        resp = soma(num1,num2);
    }
    else{
        resp = mult(num1,num2);
    }

    document.getElementById('ex4_resp').innerHTML = resp;

}