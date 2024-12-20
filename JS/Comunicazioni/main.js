function startComunicazioni() {
    document.body.style.backgroundColor = "#0E284B";
    checkServer();
    fetch('PHP/getters.php?action=getComunicazioni')
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            load(data);
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
        });
}

function load(data) {
    (data.length);
    if (data.length < 4) {
        let i
        for (i = 1; i < data.length; i++) {
            document.getElementById('numeroComunicazione' + i).innerHTML = data[i].Numero;
            document.getElementById('titoloComunicazione' + i).innerHTML = data[i].Titolo;
            document.getElementById('testoComunicazione' + i).innerHTML = data[i].Corpo;
            document.getElementById('professoreComunicazione' + i).innerHTML = data[i].Prof;
        }
        for (i; i < 4; i++) {
            document.getElementById('numeroComunicazione' + i).innerHTML = data[0].Numero;
            document.getElementById('titoloComunicazione' + i).innerHTML = data[0].Titolo;
            document.getElementById('testoComunicazione' + i).innerHTML = data[0].Corpo;
            document.getElementById('professoreComunicazione' + i).innerHTML = data[0].Prof;
        }
    } else {
        //elimino il primo elemento dell'array
        data.shift();
        //generop 3 numeri casuali diversi da 1 fino all'ultimo indice dell'array
        let numeri = [];
        while (numeri.length < 3) {
            let numero = Math.floor(Math.random() * data.length);
            if (!numeri.includes(numero)) {
                numeri.push(numero);
            }
        }
        for (let i = 1; i <= 3; i++) {
            document.getElementById('numeroComunicazione' + i).innerHTML = data[numeri[i - 1]].Numero;
            document.getElementById('titoloComunicazione' + i).innerHTML = data[numeri[i - 1]].Titolo;
            document.getElementById('testoComunicazione' + i).innerHTML = data[numeri[i - 1]].Corpo;
            document.getElementById('professoreComunicazione' + i).innerHTML = data[numeri[i - 1]].Prof;
        }
    }
}

function startComunicazioniNat() {
    document.body.style.backgroundColor = "#222";
    checkServer();
    fetch('PHP/getters.php?action=getComunicazioni')
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            loadNat(data);
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
        });
}

function loadNat(data) {
    if (data.length < 4) {
        let i
        for (i = 1; i < data.length; i++) {
            document.getElementById('numeroComunicazione' + i + "Nat").innerHTML = data[i].Numero;
            document.getElementById('titoloComunicazione' + i + "Nat").innerHTML = data[i].Titolo;
            document.getElementById('testoComunicazione' + i + "Nat").innerHTML = data[i].Corpo;
            document.getElementById('professoreComunicazione' + i + "Nat").innerHTML = data[i].Prof;
        }
        for (i; i < 4; i++) {
            document.getElementById('numeroComunicazione' + i + "Nat").innerHTML = data[0].Numero;
            document.getElementById('titoloComunicazione' + i + "Nat").innerHTML = data[0].Titolo;
            document.getElementById('testoComunicazione' + i + "Nat").innerHTML = data[0].Corpo;
            document.getElementById('professoreComunicazione' + i + "Nat").innerHTML = data[0].Prof;
        }
    } else {
        //elimino il primo elemento dell'array
        data.shift();
        //generop 3 numeri casuali diversi da 1 fino all'ultimo indice dell'array
        let numeri = [];
        while (numeri.length < 3) {
            let numero = Math.floor(Math.random() * data.length);
            if (!numeri.includes(numero)) {
                numeri.push(numero);
            }
        }
        for (let i = 1; i <= 3; i++) {
            document.getElementById('numeroComunicazione' + i + "Nat").innerHTML = data[numeri[i - 1]].Numero;
            document.getElementById('titoloComunicazione' + i + "Nat").innerHTML = data[numeri[i - 1]].Titolo;
            document.getElementById('testoComunicazione' + i + "Nat").innerHTML = data[numeri[i - 1]].Corpo;
            document.getElementById('professoreComunicazione' + i + "Nat").innerHTML = data[numeri[i - 1]].Prof;
        }
    }
}

function startComunicazioniHall() {
    document.body.style.backgroundColor = '#0C0622';
    checkServer();
    fetch('PHP/getters.php?action=getComunicazioni')
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            loadHall(data);
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
        });
}

function loadHall(data) {
    if (data.length < 4) {
        let i
        for (i = 1; i < data.length; i++) {
            document.getElementById('numeroComunicazione' + i + "Hall").innerHTML = data[i].Numero;
            document.getElementById('titoloComunicazione' + i + "Hall").innerHTML = data[i].Titolo;
            document.getElementById('testoComunicazione' + i + "Hall").innerHTML = data[i].Corpo;
            document.getElementById('professoreComunicazione' + i + "Hall").innerHTML = data[i].Prof;
        }
        for (i; i < 4; i++) {
            document.getElementById('numeroComunicazione' + i + "Hall").innerHTML = data[0].Numero;
            document.getElementById('titoloComunicazione' + i + "Hall").innerHTML = data[0].Titolo;
            document.getElementById('testoComunicazione' + i + "Hall").innerHTML = data[0].Corpo;
            document.getElementById('professoreComunicazione' + i + "Hall").innerHTML = data[0].Prof;
        }
    } else {
        //elimino il primo elemento dell'array
        data.shift();
        //generop 3 numeri casuali diversi da 1 fino all'ultimo indice dell'array
        let numeri = [];
        while (numeri.length < 3) {
            let numero = Math.floor(Math.random() * data.length);
            if (!numeri.includes(numero)) {
                numeri.push(numero);
            }
        }
        for (let i = 1; i <= 3; i++) {
            document.getElementById('numeroComunicazione' + i + "Hall").innerHTML = data[numeri[i - 1]].Numero;
            document.getElementById('titoloComunicazione' + i + "Hall").innerHTML = data[numeri[i - 1]].Titolo;
            document.getElementById('testoComunicazione' + i + "Hall").innerHTML = data[numeri[i - 1]].Corpo;
            document.getElementById('professoreComunicazione' + i + "Hall").innerHTML = data[numeri[i - 1]].Prof;
        }
    }
}