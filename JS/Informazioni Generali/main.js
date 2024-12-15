function startInfoGen() {
    fetch('PHP/getters.php?action=getOrari')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.length === 0) {
                console.error("Nessun dato ricevuto.");
                return;
            }

            // Popolamento dei dati statici
            document.getElementById('orariBiblioteca').innerHTML = data[0]["orarioBiblioteca"];
            document.getElementById('orariSegreteria').innerHTML = data[0]["orarioSegreteria"];
            document.getElementById('orarioPaninaro').innerHTML = data[0]["orarioPaninaro"];

            // Gestione orari psicologo
            let orarioPsicologoITI = data[0]["orarioPsicologoITI"];
            let orarioPsicologoIPSIA = data[0]["orarioPsicologoIPSIA"];
            let giornoPsicologoITI = orarioPsicologoITI.split(";")[1];
            let giornoPsicologoIPSIA = orarioPsicologoIPSIA.split(";")[1];
            orarioPsicologoITI = orarioPsicologoITI.split(";")[0];
            orarioPsicologoIPSIA = orarioPsicologoIPSIA.split(";")[0];
            
            document.getElementById('doveOrarioPsicologoITI').innerHTML = orarioPsicologoITI;
            document.getElementById('doveOrarioPsicologoIPSIA').innerHTML = orarioPsicologoIPSIA;
            document.getElementById('giornoPsicologoITI').innerHTML = giornoPsicologoITI;
            document.getElementById('giornoPsicologoIPSIA').innerHTML = giornoPsicologoIPSIA;

            // Gestione orari biblioteca
            let bibliotecaOrari = data[0]["orarioBiblioteca"].split("<br>");
            if (bibliotecaOrari.length === 2) {
                [giornoInizioBiblioteca, giornoFineBiblioteca] = bibliotecaOrari[0].split(" - ");
                [oraInizioBiblioteca, oraFineBiblioteca] = bibliotecaOrari[1].split(" - ");
            }

            // Gestione orari segreteria con fasce multiple
            let segreteriaOrari = data[0]["orarioSegreteria"].split("<br>");
            oraInizioSegreteria = [];
            oraFineSegreteria = [];
            segreteriaOrari.forEach(orario => {
                let [inizio, fine] = orario.split(" - ");
                oraInizioSegreteria.push(inizio);
                oraFineSegreteria.push(fine);
            });

            startStati();
            startPaninaro();
        })
        .catch(error => {
            console.error('Errore nella richiesta degli orari:', error);
        });

    fetch('PHP/getters.php?action=getMeteo')
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            let temperatura = parseInt(data.temperatura);
            let umidita = parseInt(data.umidita);
            let vento = parseInt(data.vento);
            let icona = data.icona;
        
            if (icona.charAt(icona.length - 1) === "n") {
                icona = icona.slice(0, -1) + "d";
            }
            document.getElementById('temperaturaMeteo').innerHTML = `${temperatura}°C`;
            document.getElementById('umiditaMeteo').innerHTML = `${umidita}%`;
            document.getElementById('ventoMeteo').innerHTML = `${vento} km/h`;
        
            document.getElementById("immagineMeteo").src = `IMG/Immagini%20Sito/Classico/SimboliMeteo/${icona}.png`;
        })
        .catch(error => {
            console.error('Errore nella richiesta del meteo:', error);
        });
}

function startStati() {
    let oraAttuale = new Date();
    let ora = oraAttuale.getHours();
    let minuti = oraAttuale.getMinutes();
    let giorno = oraAttuale.getDay() || 7; // Domenica diventa 7

    let StatoSegreteria = document.getElementById('statoSegreteria');
    let StatoBiblioteca = document.getElementById('statoBiblioteca');

    let [hInizioBiblio, mInizioBiblio] = oraInizioBiblioteca.split(":").map(Number);
    let [hFineBiblio, mFineBiblio] = oraFineBiblioteca.split(":").map(Number);

    giornoInizioBiblioteca = convertiGiorno(giornoInizioBiblioteca);
    giornoFineBiblioteca = convertiGiorno(giornoFineBiblioteca);

    // Controllo segreteria con più fasce orarie
    let segreteriaAperta = oraInizioSegreteria.some((inizio, index) => {
        let [hInizio, mInizio] = inizio.split(":").map(Number);
        let [hFine, mFine] = oraFineSegreteria[index].split(":").map(Number);

        return (ora > hInizio || (ora === hInizio && minuti >= mInizio)) &&
               (ora < hFine || (ora === hFine && minuti <= mFine));
    });

    if (segreteriaAperta && giorno !== 6 && giorno !== 7) {
        StatoSegreteria.innerHTML = "-- ORA APERTA --";
        StatoSegreteria.className = "aperto";
    } else {
        StatoSegreteria.innerHTML = "-- ORA CHIUSA --";
        StatoSegreteria.className = "chiuso";
    }

    // Controllo biblioteca
    if ((giorno >= giornoInizioBiblioteca && giorno <= giornoFineBiblioteca) &&
        ((ora > hInizioBiblio || (ora === hInizioBiblio && minuti >= mInizioBiblio)) &&
         (ora < hFineBiblio || (ora === hFineBiblio && minuti <= mFineBiblio)))) {
        StatoBiblioteca.innerHTML = "-- ORA APERTA --";
        StatoBiblioteca.className = "aperto";
    } else {
        StatoBiblioteca.innerHTML = "-- ORA CHIUSA --";
        StatoBiblioteca.className = "chiuso";
    }
}

function convertiGiorno(giorno) {
    switch (giorno) {
        case "Lunedì": return 1;
        case "Martedì": return 2;
        case "Mercoledì": return 3;
        case "Giovedì": return 4;
        case "Venerdì": return 5;
        case "Sabato": return 6;
        case "Domenica": return 7;
        default: return 0;
    }
}

function startPaninaro() {
    fetch('PHP/getters.php?action=getPaninaro')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.length === 0) {
                console.error("Nessun dato ricevuto.");
                return;
            }

            //per ogni riga presente in data viene creato un elemento nella tabella listaMerende
            data.forEach(riga => {
                let rigaMenu = document.createElement('tr');
                let colonnaTesto = document.createElement('td');
                let colonnaPrezzo = document.createElement('td');
                
                if(riga["tipo"]=="categoria"){
                    colonnaTesto.className = "categoria";
                    //tutto in maiuscolo
                    colonnaTesto.innerHTML = riga["nome"].toUpperCase();
                }else if(riga["tipo"]=="prodotto"){
                    colonnaTesto.className = "prodotto";
                    //tutto in maiuscolo
                    colonnaTesto.innerHTML = ". "+riga["nome"].toUpperCase();
                    colonnaPrezzo.className = "prezzo";
                    colonnaPrezzo.innerHTML = "€ "+riga["prezzo"];
                }

                rigaMenu.appendChild(colonnaTesto);
                rigaMenu.appendChild(colonnaPrezzo);
                document.getElementById('listaMerende').appendChild(rigaMenu);  
            });
        })
        .catch(error => {
            console.error('Errore nella richiesta del paninaro:', error);
        });
}

startInfoGen();