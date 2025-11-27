// ==========================================================
// 1. DATI CONTENDENTI (Aggiornati con Star, Macro e UTH)
// ==========================================================

// URL segnaposto per le carte non ancora caricate su Imgur
const segnapostoCarta = "https://i.imgur.com/u5jS5xU.png"; 

const contendenti = [
    // Star: 8 vittorie e 2 sconfitte
    { nome: "Star", vittorie: 8, sconfitte: 2, cartaPreferita: "https://i.imgur.com/TbiFjV5.png" },
    
    // Macro: 4 vittorie e 2 sconfitte
    { nome: "Macro", vittorie: 4, sconfitte: 2, cartaPreferita: "https://i.imgur.com/vo34BeT.png" },
    
    // Gli altri contendenti (0-0) usano il segnaposto finché non li aggiorni
    { nome: "Marco", vittorie: 0, sconfitte: 0, cartaPreferita: segnapostoCarta },
    { nome: "Powerox", vittorie: 0, sconfitte: 0, cartaPreferita: "https://ygomjson.untapped.gg/art/full/en-us/512/crv/1546123.webp" },
    { nome: "Carmine", vittorie: 0, sconfitte: 0, cartaPreferita: segnapostoCarta },
    // UTH: 0 vittorie e 0 sconfitte, carta ora presente
    { nome: "UTH", vittorie: 0, sconfitte: 0, cartaPreferita: "https://imgur.com/2IXxycV.png" },
    { nome: "Bomberman", vittorie: 0, sconfitte: 0, cartaPreferita: segnapostoCarta },
    { nome: "Lepreviverna", vittorie: 0, sconfitte: 0, cartaPreferita: "https://m.media-amazon.com/images/I/71pOTYKXjhL.jpg" }
];

let ordinamentoCorrente = 'percentuale'; // Chiave predefinita: ordina per Percentuale Vittorie
let direzioneCorrente = 'desc'; // Direzione predefinita: decrescente (dal più alto al più basso)


// Funzione che crea il blocco HTML per un contendente sul podio
function creaBloccoPodio(contendente, posizione, classeCSS) {
    // Non mostra il blocco podio se il contendente non ha ancora duellato
    if (!contendente || contendente.totale === 0) return ''; 
    
    return `
        <div class="podio-blocco ${classeCSS}">
            <div class="podio-info">
                <img src="${contendente.cartaPreferita}" alt="Carta Preferita di ${contendente.nome}" class="carta-preferita">
                <h3>${contendente.nome}</h3>
                <p>V: ${contendente.vittorie} / S: ${contendente.sconfitte}</p>
            </div>
            <div class="numero-posizione">${posizione}</div>
        </div>
    `;
}

// Funzione che genera il podio scenico
function generaPodio(classificaOrdinata) {
    const podioContainer = document.getElementById('podio-container');
    
    // I primi 3 classificati dopo l'ordinamento
    const primo = classificaOrdinata[0];
    const secondo = classificaOrdinata[1];
    const terzo = classificaOrdinata[2];

    // L'ordine nel codice HTML è 2° -> 1° -> 3° per posizionarli correttamente con CSS Flexbox
    const podioHTML = `
        ${creaBloccoPodio(secondo, 2, 'second-place-podio')}
        ${creaBloccoPodio(primo, 1, 'first-place-podio')}
        ${creaBloccoPodio(terzo, 3, 'third-place-podio')}
    `;

    podioContainer.innerHTML = podioHTML;
}


// Funzione principale: esegue calcoli, ordina e genera sia il Podio che la Tabella
function generaClassifica() {
    // A. CALCOLA E AGGIORNA I DATI (Totale e Percentuale)
    contendenti.forEach(c => {
        c.totale = c.vittorie + c.sconfitte;
        c.percentuale = (c.totale > 0) ? (c.vittorie / c.totale) * 100 : 0;
    });

    // B. ORDINA LA CLASSIFICA
    contendenti.sort((a, b) => {
        let valoreA = a[ordinamentoCorrente];
        let valoreB = b[ordinamentoCorrente];
        
        // Regola 1: Se entrambi hanno 0 duelli, li ordiniamo per nome
        if (a.totale === 0 && b.totale === 0) {
            return a.nome.localeCompare(b.nome);
        }
        // Regola 2: I contendenti con 0 duelli vanno sempre in fondo
        if (a.totale === 0) return 1;
        if (b.totale === 0) return -1;
        
        // Regola 3: Se ordiniamo per nome (stringa)
        if (typeof valoreA === 'string') {
            return (direzioneCorrente === 'asc') ? valoreA.localeCompare(valoreB) : valoreB.localeCompare(valoreA);
        }

        // Regola 4: Ordina numericamente
        return (direzioneCorrente === 'asc') ? valoreA - valoreB : valoreB - valoreA;
    });
    
    // Genera prima il Podio con la lista ordinata
    generaPodio(contendenti);

    // C. GENERA LA TABELLA COMPLETA
    const corpoTabella = document.getElementById('corpo-classifica');
    corpoTabella.innerHTML = ''; // Pulisce il corpo della tabella prima di inserire i nuovi dati

    contendenti.forEach((c, index) => {
        const posizione = index + 1;
        // Evidenzia i primi 3 solo se hanno partecipato ad almeno un duello
        const classeRiga = (posizione <= 3 && c.totale > 0) ? 'first-place' : ''; 

        const riga = `
            <tr class="${classeRiga}">
                <td>${posizione}</td>
                <td>${c.nome}</td>
                <td>${c.vittorie}</td>
                <td>${c.sconfitte}</td>
                <td>${c.totale}</td>
                <td>${c.percentuale.toFixed(1)}%</td>
            </tr>
        `;
        
        corpoTabella.innerHTML += riga;
    });
}


// ==========================================================
// ORDINAMENTO INTERATTIVO AL CLICK E INIZIALIZZAZIONE
// ==========================================================

function ordinaPer(chiave) {
    // Inverte la direzione se si clicca sulla stessa colonna, altrimenti imposta DESC
    if (ordinamentoCorrente === chiave) {
        direzioneCorrente = (direzioneCorrente === 'asc') ? 'desc' : 'asc';
    } else {
        ordinamentoCorrente = chiave;
        direzioneCorrente = 'desc';
    }
    
    // Rigenera l'intera classifica (Podio e Tabella)
    generaClassifica();
}

// Inizializza la classifica e imposta i listener di click all'apertura della pagina
document.addEventListener('DOMContentLoaded', () => {
    generaClassifica(); 
    
    const intestazioni = document.querySelectorAll('thead th');
    // Le chiavi corrispondono ai nomi delle proprietà nell'array JS
    const chiavi = ['posizione', 'nome', 'vittorie', 'sconfitte', 'totale', 'percentuale']; 

    intestazioni.forEach((th, index) => {
        const chiave = chiavi[index];

        // Rende cliccabili solo le colonne con dati che possono essere ordinati
        if (chiave !== 'posizione') { 
            th.classList.add('sortable'); 
            th.addEventListener('click', () => ordinaPer(chiave));
        }
    });

});

