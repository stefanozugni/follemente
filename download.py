import requests
import os
import re

# --- CONFIGURAZIONE ---
# 1. Inserisci qui la tua chiave API di TMDB che hai ottenuto prima
TMDB_API_KEY = '9f3ee784db8cc4a642d35ba367d857ee'

# 2. Le tue liste di attori e attrici
attori = [
    "Claudio Santamaria", "Rocco Papaleo", "Maurizio Lastrico", "Marco Giallini",
    "Valerio Mastandrea", "Pierfrancesco Favino", "Elio Germano", "Alessandro Borghi",
    "Luca Marinelli", "Edoardo Leo", "Stefano Accorsi", "Riccardo Scamarcio",
    "Giuseppe Battiston", "Toni Servillo", "Adriano Giannini", "Lino Guanciale",
    "Michele Riondino", "Vinicio Marchioni", "Alessandro Roja", "Kim Rossi Stuart",
    "Luca Argentero", "Fabrizio Bentivoglio", "Silvio Orlando", "Antonio Albanese",
    "Sergio Castellitto", "Salvatore Esposito", "Giampaolo Morelli", "Francesco Arca",
    "Marco Bocci", "Alessandro Preziosi", "Domenico Diele", "Filippo Timi", "Raoul Bova"
]

attrici = [
    "Emanuela Fanelli", "Maria Chiara Giannetta", "Claudia Pandolfi", "Vittoria Puccini",
    "Paola Cortellesi", "Margherita Buy", "Jasmine Trinca", "Alba Rohrwacher",
    "Anna Foglietta", "Valeria Bruni Tedeschi", "Micaela Ramazzotti", "Valeria Golino",
    "Kasia Smutniak", "Isabella Ragonese", "Barbora Bobulova", "Giovanna Mezzogiorno",
    "Serena Rossi", "Miriam Leone", "Claudia Gerini", "Sabrina Ferilli",
    "Laura Morante", "Teresa Saponangelo", "Donatella Finocchiaro", "Cristiana Capotondi",
    "Matilda De Angelis", "Benedetta Porcaroli", "Elena Radonicich", "Sara Serraiocco",
    "Pina Turco", "Denise Tantucci", "Laura Chiatti", "Sveva Alviti"
]

# 3. La cartella dove verranno salvate le immagini
DOWNLOAD_DIR = 'immagini_attori'

# --- FUNZIONI DELLO SCRIPT ---

def format_filename(name):
    """Converte 'Nome Cognome' in 'nome-cognome.jpg'."""
    # Rimuove caratteri speciali e mette tutto in minuscolo
    name = name.lower()
    # Sostituisce gli spazi con trattini
    name = re.sub(r'\s+', '-', name)
    return f"{name}.jpg"

def download_image_for_actor(actor_name):
    """Cerca un attore su TMDB, trova la sua foto e la scarica."""
    print(f"--- Inizio ricerca per: {actor_name} ---")
    
    # 1. Cerca l'attore per ottenere il suo ID
    search_url = f"https://api.themoviedb.org/3/search/person?api_key={TMDB_API_KEY}&query={actor_name}&language=it-IT"
    response = requests.get(search_url)
    
    if response.status_code != 200:
        print(f"Errore nella ricerca per {actor_name}. Salto.")
        return

    search_results = response.json().get('results')
    if not search_results:
        print(f"Nessun risultato trovato per {actor_name}. Salto.")
        return
        
    # Prendiamo il primo risultato, che è quasi sempre quello corretto
    person_id = search_results[0]['id']
    profile_path = search_results[0]['profile_path']

    if not profile_path:
        print(f"Nessuna immagine del profilo disponibile per {actor_name}. Salto.")
        return

    # 2. Costruisci l'URL completo dell'immagine in alta qualità
    image_url = f"https://image.tmdb.org/t/p/w500{profile_path}"
    
    # 3. Scarica l'immagine
    print(f"Trovata immagine per {actor_name}. Sto scaricando...")
    image_response = requests.get(image_url)
    
    if image_response.status_code == 200:
        # 4. Crea il nome del file e salva l'immagine
        filename = format_filename(actor_name)
        filepath = os.path.join(DOWNLOAD_DIR, filename)
        
        with open(filepath, 'wb') as f:
            f.write(image_response.content)
        print(f"Immagine salvata come: {filename}\n")
    else:
        print(f"Errore durante il download dell'immagine per {actor_name}. Salto.\n")

# --- ESECUZIONE DELLO SCRIPT ---

if __name__ == '__main__':
    # Crea la cartella di destinazione se non esiste
    if not os.path.exists(DOWNLOAD_DIR):
        os.makedirs(DOWNLOAD_DIR)
        
    lista_completa = attori + attrici
    
    for nome_attore in lista_completa:
        download_image_for_actor(nome_attore)
        
    print("--- Processo completato! ---")