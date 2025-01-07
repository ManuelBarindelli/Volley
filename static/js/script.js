document.getElementById('giocaPartita').addEventListener('click', giocaPartita);

// Definizione dei ruoli disponibili
const ruoli = ["Palleggiatore", "Centrale", "Schiacciatore", "Libero", "Opposto"];

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

// Funzione per visualizzare i giocatori di una squadra con checkbox per assenze
function visualizzaGiocatori(idLista, giocatori) {
    const lista = document.getElementById(idLista);
    lista.innerHTML = ''; // Resetta la lista

    giocatori.forEach((giocatore, index) => {
        const li = document.createElement('li');
        const label = document.createElement('label');
        label.textContent = `${giocatore.nome} (${giocatore.ruolo})`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${idLista}_assenza_${index}`;
        checkbox.classList.add('assenza');

        li.appendChild(label);
        li.appendChild(checkbox);
        lista.appendChild(li);
    });
}

visualizzaGiocatori('giocatoriA', giocatoriA);
visualizzaGiocatori('giocatoriB', giocatoriB);

// Funzione per contare i giocatori assenti
function contaAssenti(idLista) {
    const checkboxes = document.querySelectorAll(`#${idLista} .assenza`);
    let assenti = 0;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            assenti++;
        }
    });
    return assenti;
}

// Funzione per caricare lo storico delle partite dal server
async function caricaStorico() {
    const listaStorico = document.getElementById('storicoPartite');
    listaStorico.innerHTML = '';

    try {
        const response = await fetch('http://localhost:3000/partite');
        const partite = await response.json();

        partite.forEach(partita => {
            const li = document.createElement('li');
            li.textContent = `Data: ${partita.data} | Squadra A: ${partita.punteggioA} - Squadra B: ${partita.punteggioB} | ${partita.vincitore}`;
            listaStorico.appendChild(li);
        });
    } catch (error) {
        console.error('Errore nel caricamento dello storico:', error);
    }
}

// Funzione per inviare i dati della partita al server
async function salvaPartita(partita) {
    try {
        const response = await fetch('http://localhost:3000/partite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(partita),
        });

        if (!response.ok) {
            throw new Error('Errore durante il salvataggio della partita.');
        }
    } catch (error) {
        console.error('Errore:', error);
    }
}

// Funzione per giocare la partita e calcolare il risultato
async function giocaPartita() {
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

    const partita = {
        data: dataPartita,
        punteggioA: punteggioSquadraA,
        punteggioB: punteggioSquadraB,
        vincitore: vincitore,
    };

    await salvaPartita(partita);
    caricaStorico();
}

// Carica lo storico delle partite salvato quando la pagina viene caricata
document.addEventListener('DOMContentLoaded', caricaStorico);

