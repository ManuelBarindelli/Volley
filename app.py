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
            vincitore TEXT
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
    data = request.json
    data_partita = data['data']
    punteggioA = data['punteggioA']
    punteggioB = data['punteggioB']
    vincitore = data['vincitore']

    # Salva i risultati nel database
    conn = sqlite3.connect('finale.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO partite (data, punteggioA, punteggioB, vincitore)
        VALUES (?, ?, ?, ?)
    ''', (data_partita, punteggioA, punteggioB, vincitore))
    conn.commit()
    conn.close()

    return jsonify({'status': 'success'})

# Avvia il server
if __name__ == "__main__":
    init_db()  # Inizializza il database all'avvio
    app.run(host='0.0.0.0', port=3000)
