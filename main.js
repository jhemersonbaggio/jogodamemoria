const totalCards = 36; // Total de cartas (12 trios)
const totalPairs = 12;  // Total de trios
let flippedCards = [];
let pairsFound = 0;
let remainingTime = 60;  
let timer;
let busy = false; // Para impedir clique rápido
const gameBoard = document.getElementById('game-board');
const pairsCount = document.getElementById('pairs-count');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart');

// Emojis base
const baseEmojis = ['😄','😞','😡','😲','😌','😃','😒','😨','🤔','😏','😎','😬'];

// Cria array de trios
const emotions = baseEmojis.flatMap(e => [e,e,e]);

// Embaralha as cartas
function shuffleCards(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Cria o tabuleiro
function createBoard() {
    gameBoard.innerHTML = '';
    const shuffledCards = shuffleCards([...emotions]);

    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.card = card;
        cardElement.dataset.flipped = 'false';

        const emoji = document.createElement('span');
        emoji.textContent = card;
        emoji.classList.add('emoji');
        cardElement.appendChild(emoji);

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

// Vira a carta
function flipCard() {
    if (busy) return;
    const clickedCard = this;

    if (clickedCard.dataset.flipped === 'true') return;

    clickedCard.dataset.flipped = 'true';
    clickedCard.classList.add('flipped');
    flippedCards.push(clickedCard);

    if (flippedCards.length === 3) {
        busy = true;
        setTimeout(checkMatch, 1000);
    }
}

// Verifica trios
function checkMatch() {
    const [firstCard, secondCard, thirdCard] = flippedCards;

    if (firstCard.dataset.card === secondCard.dataset.card &&
        secondCard.dataset.card === thirdCard.dataset.card) {

        pairsFound++;
        pairsCount.textContent = `${pairsFound}/${totalPairs} trios encontrados`;

        firstCard.style.visibility = 'hidden';
        secondCard.style.visibility = 'hidden';
        thirdCard.style.visibility = 'hidden';

        if (pairsFound === totalPairs) {
            clearInterval(timer);
            alert(`Parabéns! Você encontrou todos os trios em ${60 - remainingTime} segundos!`);
        }
    } else {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        thirdCard.classList.remove('flipped');

        firstCard.dataset.flipped = 'false';
        secondCard.dataset.flipped = 'false';
        thirdCard.dataset.flipped = 'false';
    }

    flippedCards = [];
    busy = false;
}

// Cronômetro
function startTimer() {
    timer = setInterval(() => {
        remainingTime--;
        timerDisplay.textContent = remainingTime;
        if (remainingTime <= 0) {
            clearInterval(timer);
            alert('Tempo esgotado! Você não encontrou todos os trios.');
        }
    }, 1000);
}

// Inicia o jogo
function startGame() {
    pairsFound = 0;
    remainingTime = 60;
    pairsCount.textContent = `${pairsFound}/${totalPairs} trios encontrados`;
    timerDisplay.textContent = remainingTime;

    createBoard();
    startTimer();

    startBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
}

// Reinicia o jogo
function restartGame() {
    clearInterval(timer);
    startGame();
}

// Eventos
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
