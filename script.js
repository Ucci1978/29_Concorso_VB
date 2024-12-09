let questions = []; // Array per le domande
let countdownTimer = 60; // Tempo in secondi (cambiato il nome della variabile)
let correctAnswers = 0; // Numero di risposte corrette
let incorrectAnswers = 0; // Numero di risposte sbagliate
let totalQuestions = 0; // Numero totale di domande
const reviewList = []; // Lista delle domande da ripassare
const users = []; // Array per gestire gli utenti

// Aggiungi un nuovo utente o aggiorna un utente esistente
function addUser(username) {
    if (!username) {
        console.error("Nome utente non valido");
        return;
    }
    const existingUser = users.find(user => user.name === username);
    if (!existingUser) {
        // Se l'utente non esiste, lo aggiungiamo
        users.push({ 
            name: username, 
            correctAnswers: 0, 
            incorrectAnswers: 0, 
            totalQuestions: 0 
        });
        console.log(`Utente aggiunto: ${username}`);
    } else {
        console.log(`Utente già esistente: ${username}`);
    }
}

// Aggiorna i dati di un utente dopo una risposta
function updateUser(username, isCorrect) {
    const user = users.find(user => user.name === username);
    if (user) {
        user.totalQuestions++;
        if (isCorrect) {
            user.correctAnswers++;
        } else {
            user.incorrectAnswers++;
        }
        console.log(`Dati aggiornati per ${username}:`, user);
    } else {
        console.error(`Utente non trovato: ${username}`);
    }
}

// Carica il file CSV e genera il quiz
document.getElementById('load-selected-file').addEventListener('click', function () {
    const fileInput = document.getElementById('file-selector');
    const selectedFile = fileInput.files[0]; // Prendi il primo file selezionato

    if (!selectedFile) {
    console.error("Nessun file selezionato.");
    alert("Per favore, seleziona un file CSV.");
    return; // Interrompe l'esecuzione se non c'è nessun file
}

    console.log("Caricamento del file:", selectedFile.name); // Debug

    // Usa FileReader per leggere il contenuto del file
    const reader = new FileReader();
    reader.onload = function (event) {
        const csvText = event.target.result; // Contenuto del file
        Papa.parse(csvText, {
    		header: false,
		skipEmptyLines: true,
    		complete: function (results) {
        		questions = results.data;

        // Controllo: Verifica se ci sono domande
        if (!questions || questions.length === 0) {
            console.error("Il file CSV non contiene dati validi.");
            alert("Errore: Il file CSV non contiene domande!");
            return; // Interrompe l'esecuzione se non ci sono dati
        }

        console.log("Domande caricate:", questions); // Debug
        generateQuiz();
        startTimer(); // Avvia il timer una volta caricato il quiz
    },
    error: function (err) {
        console.error("Errore nella conversione del CSV:", err);
    }
});

    };

    reader.onerror = function (err) {
        console.error("Errore durante la lettura del file:", err);
    };

    reader.readAsText(selectedFile); // Leggi il file come testo
});

// Verifica se il percorso è corretto
function checkFile(selectedFile) {
    if (!selectedFile) {
        console.error("Nessun file selezionato.");
        return;
    }
}

// Genera il quiz con le domande caricate
function generateQuiz() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = ''; // Resetta il contenuto

    questions.forEach((question, index) => {
        const qDiv = document.createElement('div');
        qDiv.classList.add('question-container');
        qDiv.innerHTML = ` 
            <h3>Domanda ${index + 1}: ${question[0]}</h3>
            <ul>
                ${question.slice(1, 5).map((opt, i) => ` 
                    <li>
                        <input type="radio" name="q${index}" value="${i + 1}" id="q${index}-${i + 1}" />
                        <label for="q${index}-${i + 1}" class="option">${opt}</label>
                    </li>
                `).join('')}

            </ul>
        `;
        container.appendChild(qDiv);

        // Aggiunge l'evento per verificare la risposta
        const options = qDiv.querySelectorAll('input[type="radio"]');
        options.forEach(option => {
            option.addEventListener('change', () => {
                checkAnswer(index, option.value, qDiv);
            });
        });
    });
}

// Controlla la risposta e aggiorna i contatori
function checkAnswer(questionIndex, selectedValue, qDiv) {
    const correctAnswer = questions[questionIndex][5]; // Colonna F del CSV (risposta corretta)
    const isCorrect = selectedValue == correctAnswer;

    updateCounters(isCorrect); // Aggiorna i contatori
    const username = document.getElementById("username").value; // Recupera l'utente corrente
    if (username) {
        updateUser(username, isCorrect); // Aggiorna i dati utente solo se il nome utente è valido
    }

    // Evidenzia le risposte corrette e sbagliate
    const options = qDiv.querySelectorAll('label.option');
    options.forEach((label, i) => {
        const optionValue = i + 1;
        if (optionValue == correctAnswer) {
            label.style.color = 'green'; // Risposta corretta
        } else if (optionValue == selectedValue) {
            label.style.color = 'red'; // Risposta errata
        } else {
            label.style.color = ''; // Resetta lo stile
        }
    });

    if (!isCorrect) {
        // Aggiungi la domanda alla lista di ripasso
        addToReviewList(questions[questionIndex]);
    }
}

// Aggiunge la domanda sbagliata alla lista di ripasso
function addToReviewList(question) {
    reviewList.push(question);
    console.log("Aggiunta al ripasso:", question);
}

// Avvia il timer
function startTimer() {
    const timerElement = document.getElementById("timer");
    const interval = setInterval(() => {
        countdownTimer--; // Riduce il timer
        const minutes = Math.floor(countdownTimer / 60); // Calcola i minuti
        const seconds = countdownTimer % 60; // Calcola i secondi

        // Mostra il timer in formato mm:ss
        timerElement.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (countdownTimer <= 0) {
            clearInterval(interval); // Ferma il timer
            alert("Tempo scaduto!");
            showResults(); // Mostra il riepilogo
        }
    }, 1000); // Esegui ogni secondo
}

// Aggiorna i contatori
function updateCounters(isCorrect) {
    totalQuestions++;
    if (isCorrect) {
        correctAnswers++;
    } else {
        incorrectAnswers++;
    }
    const statsElement = document.getElementById("stats");
    statsElement.innerText = 
        `Domande risposte: ${totalQuestions}, Corrette: ${correctAnswers}, Sbagliate: ${incorrectAnswers}`;
}

// Mostra i risultati finali
function showResults() {
    alert(`Quiz terminato!\nDomande totali: ${totalQuestions}\nCorrette: ${correctAnswers}\nSbagliate: ${incorrectAnswers}`);
    console.log("Domande da ripassare:", reviewList);
    console.log("Dati degli utenti:", users);
}
