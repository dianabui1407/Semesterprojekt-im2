const oracleBtn = document.getElementById('oracle-btn');
const oracleInput = document.getElementById('oracle-input');
const cardsContainer = document.getElementById('cards-container');

// Zustand der App (ob wir gerade das Ergebnis sehen oder nicht)
let isShowingResult = false;

oracleBtn.addEventListener('click', async () => {
    // Validierung: Wurde etwas eingegeben?
    if (!oracleInput.value.trim() && !isShowingResult) {
        alert('Bitte stelle zuerst eine Frage an das Orakel!');
        return;
    }

    if (!isShowingResult) {
        // --- ZUSTAND: ASK GEKLICKT ---
        oracleBtn.innerText = 'Loading...';
        oracleBtn.disabled = true;

        try {
            // 3 zufällige Karten von der API abrufen
            const response = await fetch('https://tarotapi.dev/api/v1/cards/random?n=3');
            
            // HIER WAR DER FEHLER: .json() statt .getJson()
            const data = await response.json(); 
            
            // Container leeren
            cardsContainer.innerHTML = '';
            
            data.cards.forEach(card => {
                const cardWrapper = document.createElement('div');
                cardWrapper.classList.add('card-wrapper');

                // Zuverlässige Bild-Quelle für die Rider-Waite Karten (Nutzt den Kurznamen der Karte)
                const imageUrl = `https://raw.githubusercontent.com/wfa/tarot-api/master/static/cards/${card.name_short}.jpg`;

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
            console.error('Fehler beim Laden der Tarot-Karten:', error);
            alert('Das Orakel ist gerade überlastet. Versuche es gleich noch einmal.');
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