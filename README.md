# Progetto "Archetipi": Metodologia di Sviluppo di un Sistema di Profilazione Emotiva

## Panoramica del Progetto

L'idea di questo progetto nasce da un'intuizione semplice, quasi un appunto personale, dopo la visione di un film:

> Dopo aver visto il film Follemente, mi sono chiesto quali potevano essere gli attori che interpretano le mie emozioni: da qui l'idea di creare un'applicazione web che dia 4 attori che vadano a rappresentare le proprie emozioni, in base alle risposte su alcune domande.

Da questa scintilla iniziale, l'obiettivo si è evoluto. Quella che era "una cosa semplice" è diventata un'esplorazione approfondita sulla possibilità di creare un sistema di profilazione emotiva autentico e sfumato.

Questo repository documenta il processo di ricerca, sviluppo e calibrazione del sistema finale, il cui scopo è duplice:
1.  **Analizzare e categorizzare** attori e attrici italiani secondo un framework di archetipi emotivi.
2.  **Creare un'esperienza utente** (un quiz) in grado di generare un profilo emotivo per l'utente e associarlo ai suoi "corrispettivi" cinematografici.

Questo documento serve come prova dello studio e del processo metodologico iterativo che ha portato alla definizione del sistema.

## Fase 1: Definizione del Framework Analitico e degli Archetipi

Il primo passo è stato costruire le fondamenta teoriche del sistema.

* **L'Ispirazione:** Partendo dall'analisi dei personaggi del film "Follemente", sono stati identificati **quattro assi emotivi principali** che guidano il comportamento umano.

* **L'Ostacolo:** Le definizioni iniziali erano soggettive e si rischiava di applicarle in modo incoerente.

* **La Soluzione:** Formalizzare questi quattro assi emotivi in un framework solido. Si è stabilito che, sebbene gli assi siano 4, la loro rappresentazione si declina in modo diverso a seconda del genere. Sono stati quindi definiti **8 archetipi**, che rappresentano le controparti maschili e femminili di ogni asse, permettendo un'analisi più ricca e sfumata. La svolta è stata comprendere la natura **"protettiva"** di `Scheggia` e `Valium`, giustificando i loro comportamenti di ritiro come meccanismi di difesa dal dolore.

### Gli 8 Archetipi Emotivi (organizzati per Asse)

| Asse Emotivo                | Archetipo Maschile | Archetipo Femminile | Descrizione Chiave                            |
| :-------------------------- | :----------------- | :------------------ | :-------------------------------------------- |
| **Logica & Controllo** | `Professore`       | `Alfa`              | Guida, regola, conoscenza, gestione.          |
| **Sentimento & Connessione**| `Romeo`            | `Giulietta`         | Empatia, amore, idealismo, cura.              |
| **Istinto & Impulso** | `Eros`             | `Trilli`            | Passione, azione immediata, spontaneità.      |
| **Protezione & Ritiro** | `Scheggia`         | `Valium`            | Durezza, cinismo, anestesia emotiva, difesa. |


#### 1. Asse della Logica e del Controllo
* **`Professore` (Maschile):** Rappresenta la logica, la regola e la conoscenza. È la parte che analizza, pianifica e cerca di comprendere il mondo attraverso la ragione.
* **`Alfa` (Femminile):** È la controparte del `Professore`. Rappresenta la leadership, la forza e il controllo. È la donna che guida, organizza e gestisce con autorevolezza.

#### 2. Asse del Sentimento e della Connessione
* **`Romeo` (Maschile):** Incarna il sentimento, l'idealismo romantico e l'empatia. È la parte che segue il cuore e mette i legami al di sopra della logica.
* **`Giulietta` (Femminile):** È la controparte di `Romeo`. Rappresenta la sensibilità, l'amore puro e la cura. Può esprimere il sentimento in modo viscerale e potente.

#### 3. Asse dell'Istinto e dell'Impulso
* **`Eros` (Maschile):** È l'archetipo dell'istinto, della passione fisica e dell'azione impulsiva. Cerca l'intensità e la gratificazione immediata.
* **`Trilli` (Femminile):** È la controparte di `Eros`. Rappresenta l'impulso, la giocosità e la creatività caotica. Si manifesta attraverso la spontaneità e gesti non mediati dalla ragione.

#### 4. Asse della Protezione e del Ritiro
* **`Scheggia` (Maschile):** Rappresenta la parte ferita, cinica e disillusa. È un archetipo **protettivo** che si manifesta con rabbia repressa o ritiro per evitare ulteriore sofferenza.
* **`Valium` (Femminile):** È la controparte dello `Scheggia`. È l'archetipo **protettivo** che si manifesta attraverso l'anestesia emotiva, il distacco o la paralisi di fronte a un'ansia troppo grande.

---

## Fase 2: Sviluppo dell'Agente AI e Creazione del Dataset

Per analizzare decine di attori in modo coerente, è stato sviluppato e calibrato un agente AI personalizzato ("gem").

### Il Processo di Test e Validazione Iterativa

Lo sviluppo non è stato un processo lineare, ma un ciclo continuo di **generazione, analisi e calibrazione**. Ogni versione delle istruzioni dell'agente AI è stata testata generando un dataset di prova. L'analisi critica di questi risultati ha permesso di identificare debolezze specifiche, risolte nelle versioni successive:

* **Validazione Iniziale:** I primi test hanno rivelato un'eccessiva prevalenza dell'archetipo `Romeo` per personaggi maschili genericamente emotivi. **Soluzione:** Rafforzamento della definizione di `Scheggia` come archetipo della sofferenza e della rabbia.
* **Analisi dei Casi Complessi:** Il test sull'attrice Anna Magnani ha mostrato un'errata classificazione come `Trilli` (istinto) invece che `Giulietta` (sentimento viscerale). **Soluzione:** Raffinamento delle definizioni per distinguere l'espressione potente di un sentimento profondo dall'impulso puro.
* **Gestione delle Ambiguità:** Il testing ha evidenziato che i punteggi potevano risultare in pareggi. **Soluzione:** Introduzione del campo `primaryEmotion` e di una regola di spareggio qualitativa per l'IA, che deve scegliere l'archetipo più iconico per l'attore.

---

## Fase 3: Progettazione del Quiz di Profilazione

Questa fase ha definito l'esperienza utente, trasformando una serie di domande in un vero e proprio motore per generare profili psicologici sfumati.

* **L'Ostacolo 1 - Il Rischio di Profili "Piatti":** Un quiz semplice avrebbe potuto generare profili utente con un solo archetipo dominante, rendendo il matching banale.
* **Soluzione 1 - Il Principio delle "Ricette Miste":** Si è stabilito che ogni opzione di risposta a una domanda del quiz non corrisponde a un singolo archetipo, ma è una "ricetta" che mescola i punteggi di più archetipi, garantendo un profilo finale sempre sfumato.

* **L'Ostacolo 2 - La "Desiderabilità Sociale" e il Rischio di Risposte False:** È emersa una criticità fondamentale: gli utenti tendono a evitare risposte che li descrivono in modo negativo, anche se veritiere (un fenomeno noto come *Social Desirability Bias*). Una risposta che costringe ad "autodenunciarsi" come debole o cinico verrebbe scartata, falsando il test.
* **Soluzione 2 - Il Principio della "Razionalizzazione Giustificata":** La soluzione è stata riscrivere le risposte "negative" (`Scheggia`/`Valium`) non come ammissioni di debolezza, ma come **strategie di auto-protezione intelligenti e razionalizzate**. Questo rende ogni opzione "sceglibile" perché offre all'utente una narrazione che preserva la propria dignità, pur rivelando la sua vera tendenza psicologica.

---

## Fase 4: La Logica di Matching Finale

L'algoritmo che collega l'utente all'attore è il culmine del progetto.

1.  **Profilazione Utente:** Il quiz genera un profilo utente con punteggi per tutti gli archetipi.
2.  **Filtro Primario:** Il sistema isola l'archetipo primario dell'utente.
3.  **Matching Vettoriale:** Il sistema confronta l'**intero "vettore" di punteggi** dell'utente con quello di ogni attore candidato con la stessa emozione primaria. L'attore con il profilo più simile (la cui "impronta digitale emotiva" ha la distanza minore da quella dell'utente) viene selezionato come il "match" perfetto.

Questo processo garantisce un risultato profondamente personalizzato.