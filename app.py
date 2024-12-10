from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Connessione al database SQLite
def init_db():
    conn = sqlite3.connect('finale.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS partite (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT,
            punteggioA INTEGER,
            punteggioB INTEGER,
            vincitore TEXT,
            giocatoriA TEXT,
            giocatoriB TEXT
        )
    ''')
    conn.commit()
    conn.close()

# Rotta principale
@app.route('/')
def index():
    return render_template('index.html')

# Rotta per salvare i risultati
@app.route('/salva_risultato', methods=['POST'])
def salva_risultato():
    data = request.json  # Prendi i dati come JSON
    data_partita = data.get('data')
    punteggioA = data.get('punteggioA')
    punteggioB = data.get('punteggioB')
    vincitore = data.get('vincitore')
    giocatoriA = data.get('giocatoriA')
    giocatoriB = data.get('giocatoriB')

    # Verifica che tutti i dati siano presenti
    if not all([data_partita, punteggioA, punteggioB, vincitore, giocatoriA, giocatoriB]):
        return jsonify({'status': 'error', 'message': 'Dati incompleti'}), 400

    # Salva i risultati nel database
    conn = sqlite3.connect('finale.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO partite (data, punteggioA, punteggioB, vincitore, giocatoriA, giocatoriB)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (data_partita, punteggioA, punteggioB, vincitore, giocatoriA, giocatoriB))
    conn.commit()
    conn.close()

    return jsonify({'status': 'success', 'message': 'Risultato salvato correttamente'})

# Rotta per ottenere lo storico delle partite
@app.route('/storico', methods=['GET'])
def storico():
    conn = sqlite3.connect('finale.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM partite ORDER BY id DESC')
    partite = cursor.fetchall()
    conn.close()

    return jsonify(partite)

# Avvia il server
if __name__ == "__main__":
    init_db()  # Inizializza il database all'avvio
    app.run(host='0.0.0.0', port=3000)
