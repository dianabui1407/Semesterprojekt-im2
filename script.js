const oracleBtn = document.getElementById('oracle-btn');
const oracleInput = document.getElementById('oracle-input');
const cardsContainer = document.getElementById('cards-container');

// Zustand der App (ob wir gerade das Ergebnis sehen oder nicht)
let isShowingResult = false;

oracleBtn.addEventListener('click', async () => {
    // Validierung: Wurde etwas eingegeben?
    if (!oracleInput.value.trim() && !isShowingResult) {
        alert('Please ask the oracle a question first!');
        return;
    }
    // Prüfen ob Fragezeichen vorhanden
if (!oracleInput.value.includes('?') && !isShowingResult) {
    alert('Please ask a question that ends with a question mark.');
    return;
}

    if (!isShowingResult) {
        // --- ZUSTAND: ASK GEKLICKT ---
        oracleBtn.innerText = 'Loading...';
        oracleBtn.disabled = true;

        try {
    // 3 zufällige Karten von der API abrufen
    const response = await fetch('https://tarotapi.dev/api/v1/cards/random?n=3');
    const data = await response.json(); 
    
    // Container leeren
    cardsContainer.innerHTML = '';
    
    data.cards.forEach(card => {
        const cardWrapper = document.createElement('div');
        cardWrapper.classList.add('card-wrapper');

        // HIER ERFOLGT DIE MAGIE: 
        // Wir bauen den Pfad dynamisch anhand des API-Kurznamens zusammen.
        // Wenn die API "ar16" liefert, wird daraus "images/ar16.jpg"
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
        cardsContainer.appendChild(cardWrapper);
    });

    // UI umschalten auf "Desktop 2"
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
        // --- ZUSTAND: REDO GEKLICKT (Zurücksetzen auf Desktop 1) ---
        cardsContainer.classList.add('hidden');
        oracleInput.value = ''; // Input leeren
        oracleBtn.innerText = 'ASK';
        isShowingResult = false;
    }
});