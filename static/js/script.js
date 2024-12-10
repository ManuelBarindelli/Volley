document.getElementById('giocaPartita').addEventListener('click', giocaPartita);

// Nomi dei giocatori per la Squadra A
const giocatoriA = [
    { nome: "Salvo Gabriele", ruolo: "Palleggiatore" },
    { nome: "Barindelli Manuel", ruolo: "Centrale" },
    { nome: "Narciso Nicolò", ruolo: "Schiacciatore" },
    { nome: "Bramani Laura", ruolo: "Libero" },
    { nome: "Ghisolfi Andrea", ruolo: "Opposto" },
    { nome: "Palazzo David", ruolo: "Palleggiatore" },
    { nome: "Zorzan Sara", ruolo: "Centrale" },
    { nome: "Tonet Matteo", ruolo: "Schiacciatore" },
    { nome: "Yachou Yassin", ruolo: "Libero" }
];

// Nomi dei giocatori per la Squadra B
const giocatoriB = [
    { nome: "Gumiero Alessandro", ruolo: "Palleggiatore" },
    { nome: "Locatelli Daniele", ruolo: "Centrale" },
    { nome: "Rigamonti Andrea Umer", ruolo: "Schiacciatore" },
    { nome: "Fontana Michele", ruolo: "Opposto" },
    { nome: "Mascheroni Martina", ruolo: "Palleggiatore" },
    { nome: "Boddli Matteo", ruolo: "Centrale" },
    { nome: "Ricali Lorenzo", ruolo: "Schiacciatore" },
    { nome: "Jabir Ali", ruolo: "Libero" }
];

// Funzione per giocare la partita e calcolare il risultato
function giocaPartita() {
    const dataPartita = document.getElementById('dataPartita').value;
    let punteggioSquadraA = parseInt(document.getElementById('punteggioAInput').value);
    let punteggioSquadraB = parseInt(document.getElementById('punteggioBInput').value);

    if (!dataPartita) {
        alert("Inserisci la data della partita.");
        return;
    }

    if (isNaN(punteggioSquadraA) || isNaN(punteggioSquadraB)) {
        alert("Inserisci punteggi validi per entrambe le squadre.");
        return;
    }

    const assentiSquadraA = contaAssenti('giocatoriA');
    const assentiSquadraB = contaAssenti('giocatoriB');

    punteggioSquadraA -= assentiSquadraA * 7;
    punteggioSquadraB -= assentiSquadraB * 7;

    punteggioSquadraA = Math.max(0, punteggioSquadraA);
    punteggioSquadraB = Math.max(0, punteggioSquadraB);

    document.getElementById('punteggioA').textContent = `Punteggio Squadra A: ${punteggioSquadraA}`;
    document.getElementById('punteggioB').textContent = `Punteggio Squadra B: ${punteggioSquadraB}`;

    let vincitore;
    if (punteggioSquadraA > punteggioSquadraB) {
        vincitore = 'Squadra A ha vinto!';
    } else if (punteggioSquadraB > punteggioSquadraA) {
        vincitore = 'Squadra B ha vinto!';
    } else {
        vincitore = 'La partita è finita in pareggio!';
    }
    document.getElementById('vincitore').textContent = vincitore;

    // Raccogli i nomi dei giocatori attivi (non assenti)
    const giocatoriAttiviA = giocatoriA.filter((giocatore, index) => !document.getElementById(`giocatoriA_assenza_${index}`).checked);
    const giocatoriAttiviB = giocatoriB.filter((giocatore, index) => !document.getElementById(`giocatoriB_assenza_${index}`).checked);

    const giocatoriAInfo = giocatoriAttiviA.map(g => g.nome).join(", ");
    const giocatoriBInfo = giocatoriAttiviB.map(g => g.nome).join(", ");

    // Chiamata al backend per salvare i risultati
    fetch('/salva_risultato', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: dataPartita,
            punteggioA: punteggioSquadraA,
            punteggioB: punteggioSquadraB,
            vincitore: vincitore,
            giocatoriA: giocatoriAInfo,
            giocatoriB: giocatoriBInfo
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert("Risultato salvato correttamente!");
        } else {
            alert("Errore nel salvataggio del risultato.");
        }
    })
    .catch(error => {
        console.error("Errore durante la richiesta:", error);
        alert("Si è verificato un errore.");
    });
}

// Funzione per caricare lo storico delle partite dal backend
function caricaStorico() {
    fetch('/storico')
        .then(response => response.json())
        .then(partite => {
            const listaStorico = document.getElementById('storicoPartite');
            listaStorico.innerHTML = '';
            partite.forEach(partita => {
                const li = document.createElement('li');
                li.textContent = `Data: ${partita[1]} | Squadra A: ${partita[2]} - Squadra B: ${partita[3]} | Vincitore: ${partita[4]} | Giocatori A: ${partita[5]} | Giocatori B: ${partita[6]}`;
                listaStorico.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Errore nel caricamento dello storico:", error);
        });
}

// Carica lo storico delle partite salvato quando la pagina viene caricata
document.addEventListener('DOMContentLoaded', caricaStorico);
