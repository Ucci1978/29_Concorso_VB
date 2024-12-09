// Carica il file CSV e genera il quiz
document.getElementById('load-selected-file').addEventListener('click', function () {
    const fileInput = document.getElementById('file-selector');
    
    // Aggiungi il controllo per verificare se è stato selezionato un file
    if (fileInput.files.length === 0) {
        console.error("Nessun file selezionato");
        return; // Esce dalla funzione se nessun file è stato selezionato
    }

    const selectedFile = fileInput.files[0]; // Prendi il primo file selezionato
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
