let questions = [];

document.getElementById('load-selected-file').addEventListener('click', function () {
    const selectedFile = document.getElementById('file-selector').value;

    console.log("Caricamento del file:", selectedFile); // Debug
    fetch(selectedFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Errore nel caricamento del file: ${response.statusText}`);
            }
            return response.text();
        })
        .then(csvText => {
            Papa.parse(csvText, {
                header: false,
                skipEmptyLines: true,
                complete: function (results) {
                    questions = results.data;
                    console.log("Domande caricate:", questions); // Debug
                    generateQuiz();
                },
                error: function (err) {
                    console.error("Errore nella conversione del CSV:", err);
                }
            });
        })
        .catch(err => console.error("Errore durante il caricamento del file:", err));
});

function generateQuiz() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = '';

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

        // Aggiunge l'evento per verificare la risposta immediatamente
        const options = qDiv.querySelectorAll('input[type="radio"]');
        options.forEach(option => {
            option.addEventListener('change', () => checkAnswer(index, option.value, qDiv));
        });
    });
}

function checkAnswer(questionIndex, selectedValue, qDiv) {
    const correctAnswer = questions[questionIndex][5]; // Colonna F del CSV
    const options = qDiv.querySelectorAll('label.option');

    options.forEach((label, i) => {
        const optionValue = i + 1;
        if (optionValue == correctAnswer) {
            // Evidenzia in verde la risposta corretta
            label.style.color = 'green';
        } else if (optionValue == selectedValue) {
            // Evidenzia in rosso la risposta errata
            label.style.color = 'red';
        } else {
            // Resetta lo stile per le altre opzioni
            label.style.color = '';
        }
    });
}
