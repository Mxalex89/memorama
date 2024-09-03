document.addEventListener("DOMContentLoaded", () => {
    const words = [
        "café con pan", "películas", "palomitas", "atardecer",
        "flor", "mar", "montaña", "nieve"
    ];
    const gameBoard = document.getElementById("game-board");
    let timerElement = document.getElementById("timer");
    let messageElement = document.getElementById("message");
    const popup = document.getElementById("popup");
    const closePopup = document.getElementById("close");
    let timer;
    let timeLeft = 60; // Tiempo en segundos
    let firstCard = null;
    let secondCard = null;
    let matchedPairs = 0;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createCards() {
        gameBoard.innerHTML = ''; // Limpiar el tablero antes de crear nuevas cartas
        let cards = words.concat(words); // Crear pares de cartas
        cards = shuffle(cards);
        cards.forEach(word => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.word = word;
            card.addEventListener("click", flipCard);
            gameBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (this.classList.contains("flipped") || secondCard) return;
        this.textContent = this.dataset.word; // Muestra la palabra al voltear
        this.classList.add("flipped");

        if (!firstCard) {
            firstCard = this;
        } else {
            secondCard = this;
            checkForMatch();
        }
    }

    function checkForMatch() {
        if (firstCard.dataset.word === secondCard.dataset.word) {
            matchedPairs++;
            resetCards();
            if (matchedPairs === words.length) {
                clearInterval(timer);
                showPopup(); // Muestra la ventana emergente al ganar
            }
        } else {
            setTimeout(() => {
                firstCard.textContent = "";
                secondCard.textContent = "";
                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");
                resetCards();
            }, 1000);
        }
    }

    function resetCards() {
        firstCard = null;
        secondCard = null;
    }

    function startTimer() {
        timeLeft = 60; // Reiniciar el tiempo a 60 segundos
        timerElement.textContent = `Tiempo: ${timeLeft} segundos`;
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Tiempo: ${timeLeft} segundos`;
            if (timeLeft === 0) {
                clearInterval(timer);
                messageElement.textContent = "¡Se acabó el tiempo!";
                setTimeout(resetGame, 2000); // Reinicia el juego después de 2 segundos
            }
        }, 2000); // Cambiamos el intervalo a 2000 ms (2 segundos)
    }

    function showPopup() {
        popup.classList.add("visible");
        createHearts();
    }

    function createHearts() {
        const heartsContainer = document.querySelector(".hearts");
        heartsContainer.innerHTML = ''; // Limpiar corazones previos
        for (let i = 0; i < 50; i++) {
            const heart = document.createElement("div");
            heart.classList.add("heart");
            heart.style.left = Math.random() * 100 + "vw";
            heart.style.animationDelay = Math.random() * 3 + "s";
            heartsContainer.appendChild(heart);
        }
    }

    closePopup.addEventListener("click", () => {
        popup.classList.remove("visible");
        resetGame(); // Reinicia el juego al cerrar la ventana emergente
    });

    function resetGame() {
        matchedPairs = 0;
        messageElement.textContent = '';
        createCards();
        startTimer();
    }

    createCards();
    startTimer();
});
