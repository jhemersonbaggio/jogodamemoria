// script.js

const totalCards = 48; // Total de cartas (16 trios)
const totalPairs = 16;  // Total de trios a encontrar
let flippedCards = [];
let pairsFound = 0;
let remainingTime = 60;  // Tempo em segundos
let timer;
const gameBoard = document.getElementById('game-board');
const pairsCount = document.getElementById('pairs-count');
const timerDisplay = document.getElementById('timer');

// Lista com os emojis dos bonecos (humores)
const emotions = [
    '😄', '😄', '😄', '😞', '😞', '😞', '😡', '😡', '😡', 
    '😲', '😲', '😲', '😌', '😌', '😌', '😃', '😃', '😃', 
    '😒', '😒', '😒', '😨', '😨', '😨', '🤔', '🤔', '🤔', 
    '😏', '😏', '😏', '😎', '😎', '😎', '😬', '😬', '😬', 
    '😐', '😐', '😐', '😂', '😂', '😂', '😅', '😅', '😅', 
];

// Embaralha as cartas
function shuffleCards() {
    return emotions.sort(() => Math.random() - 0.5);
}

// Cria as cartas no jogo
function createBoard() {
    gameBoard.innerHTML = '';  // Limpa o tabuleiro

    const shuffledCards = shuffleCards(); // Embaralha as cartas

    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.card = card;
        cardElement.dataset.flipped = 'false'; // Adiciona uma propriedade para verificar se está virada

        // Criamos um span para mostrar o emoji, mas ele fica escondido
        const emoji = document.createElement('span');
        emoji.textContent = card;
        emoji.classList.add('emoji');
        cardElement.appendChild(emoji);

        // Adiciona evento de clique
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

// Vira a carta quando clicada
function flipCard() {
    const clickedCard = this;

    // Não permite virar mais de 3 cartas
    if (flippedCards.length === 3) return;

    // Verifica se a carta já foi virada
    if (clickedCard.dataset.flipped === 'true') return;

    // Marca a carta como virada
    clickedCard.dataset.flipped = 'true';
    clickedCard.classList.add('flipped');  // Aplica a classe para animar a virada

    // Adiciona a carta na lista de cartas viradas
    flippedCards.push(clickedCard);

    // Se viraram 3 cartas, verifica se são iguais
    if (flippedCards.length === 3) {
        setTimeout(checkMatch, 1000); // Verifica a correspondência depois de 1 segundo
    }
}

// Verifica se as cartas viradas são iguais
function checkMatch() {
    const [firstCard, secondCard, thirdCard] = flippedCards;

    // Se as 3 cartas forem iguais
    if (firstCard.dataset.card === secondCard.dataset.card && secondCard.dataset.card === thirdCard.dataset.card) {
        pairsFound++; // Conta um par encontrado
        pairsCount.textContent = `${pairsFound}/${totalPairs}`;

        // Se encontrou todos os trios
        if (pairsFound === totalPairs) {
            clearInterval(timer); // Para o cronômetro
            alert(`Você encontrou todos os trios! Seu tempo: ${60 - remainingTime} segundos!`);
        }

        // Remove os trios encontrados da tela (esconde as cartas)
        firstCard.style.visibility = 'hidden';
        secondCard.style.visibility = 'hidden';
        thirdCard.style.visibility = 'hidden';
    } else {
        // Se não forem iguais, vira de volta
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        thirdCard.classList.remove('flipped');

        // Marca as cartas como não viradas
        firstCard.dataset.flipped = 'false';
        secondCard.dataset.flipped = 'false';
        thirdCard.dataset.flipped = 'false';
    }

    flippedCards = [];  // Limpa a lista de cartas viradas
}

// Cronômetro
function startTimer() {
    timer = setInterval(() => {
        remainingTime--;
        timerDisplay.textContent = remainingTime;

        // Se o tempo acabar, o jogo termina
        if (remainingTime <= 0) {
            clearInterval(timer);
            alert('Tempo esgotado! Você não encontrou todos os trios.');
        }
    }, 1000);
}

// Reinicia o jogo
function restartGame() {
    pairsFound = 0;
    remainingTime = 60;
    pairsCount.textContent = `${pairsFound}/${totalPairs}`;
    timerDisplay.textContent = remainingTime;

    createBoard();  // Cria as cartas embaralhadas
    startTimer();   // Inicia o cronômetro
}

// Inicia o jogo
restartGame();
