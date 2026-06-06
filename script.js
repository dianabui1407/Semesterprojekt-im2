const oracleBtn = document.getElementById('oracle-btn');
const oracleInput = document.getElementById('oracle-input');
const cardsContainer = document.getElementById('cards-container');

let isShowingResult = false;
const lottieUrl = "https://lottie.host/172d858f-c3d6-4dd5-9fcb-57fa8d239f23/k5ChEbbK4Y.json";

oracleBtn.addEventListener('click', async () => {
    if (!oracleInput.value.trim() && !isShowingResult) {
        alert('Please ask the oracle a question first!');
        return;
    }
    if (!oracleInput.value.includes('?') && !isShowingResult) {
        alert('Please ask a question that ends with a question mark.');
        return;
    }

    if (!isShowingResult) {
        oracleBtn.innerText = 'Loading...';
        oracleBtn.disabled = true;

        try {
            const response = await fetch('https://tarotapi.dev/api/v1/cards/random?n=3');
            const data = await response.json();

            cardsContainer.innerHTML = '';

            data.cards.forEach((card, index) => {
                const cardWrapper = document.createElement('div');
                cardWrapper.classList.add('card-wrapper');

                const imageUrl = `img/${card.name_short}.png`;
                
                cardWrapper.innerHTML = `
                    <div class="card-inner">
                        <div class="card-front">
                            <img src="${imageUrl}" alt="${card.name}">
                        </div>
                        <div class="card-back">
                            <h3>${card.name}</h3>
                            <p><strong>Meaning:</strong> ${card.meaning_up.substring(0, 120)}...</p>
                        </div>
                    </div>
                `;

                const lottiePlayer = document.createElement('lottie-player');
                lottiePlayer.setAttribute('src', lottieUrl);
                lottiePlayer.setAttribute('background', 'transparent');
                lottiePlayer.setAttribute('speed', '1');
                lottiePlayer.setAttribute('loop', '');
                lottiePlayer.setAttribute('autoplay', '');
                
                lottiePlayer.classList.add('lottie-effect', `lottie-effect-${index + 1}`);

                cardWrapper.appendChild(lottiePlayer);
                
                cardsContainer.appendChild(cardWrapper);
            });

            cardsContainer.classList.remove('hidden');
            oracleBtn.innerText = 'REDO';
            isShowingResult = true;

        } catch (error) {
            console.error('Error loading the tarot cards:', error);
            alert('The oracle is currently unavailable. Please try again in a moment.');
            oracleBtn.innerText = 'ASK';
        } finally {
            oracleBtn.disabled = false;
        }
    } else {
        cardsContainer.classList.add('hidden');
        oracleInput.value = '';
        oracleBtn.innerText = 'ASK';
        isShowingResult = false;
    }
});