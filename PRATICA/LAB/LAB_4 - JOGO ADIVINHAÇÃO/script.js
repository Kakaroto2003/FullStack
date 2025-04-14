let numeroAleatorio = Math.floor(Math.random() * 100);
let numerosBaixos = [];
let numerosAltos = [];
        
function verificarPalpite() {
    let palpite = parseInt(document.getElementById('palpite').value);
    let mensagem = document.getElementById('mensagem');
    let listaBaixos = document.getElementById('numeros-baixos');
    let listaAltos = document.getElementById('numeros-altos');
    
    if (isNaN(palpite) || palpite < 0 || palpite > 99) {
        mensagem.textContent = "Digite um número entre 0 e 99.";
        return;
    }

    if (palpite < numeroAleatorio) {
        mensagem.textContent = "Tente um número maior.";
        document.body.style.backgroundColor = "red";
        if (!numerosBaixos.includes(palpite)) {
            numerosBaixos.push(palpite);
            listaBaixos.textContent = "Números baixos: " + numerosBaixos.join(", ");
        }
    } else if (palpite > numeroAleatorio) {
        mensagem.textContent = "Tente um número menor.";
        document.body.style.backgroundColor = "red";
        if (!numerosAltos.includes(palpite)) {
            numerosAltos.push(palpite);
            listaAltos.textContent = "Números altos: " + numerosAltos.join(", ");
        }
    } else {
        mensagem.textContent = "Parabéns! Você acertou!";
        document.body.style.backgroundColor = "green";
    }
}
