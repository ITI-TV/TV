<?php

//avvio sessione
session_start();

$APIopenWeather = "c45a48658f5924fddcf7a98580dd5abf";

function connectDatabase() {
    require ('infoAccess.php');

    $conn = new mysqli($serverConn, $usernameConn, $passwordConn, $dbnameConn);

    if ($conn->connect_error) {
        die(json_encode(array("error" => "Connessione al database fallita: " . $conn->connect_error)));
    }

    return $conn;
}

function deleteOldEntries($conn, $tag, $table) {
    $sql = "DELETE FROM $table WHERE Data_fine < CURDATE() AND tag = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $tag);
    $stmt->execute();
    $stmt->close();
}

function deleteOldEntriesComponentiAggiuntivi($conn, $table) {
    $sql = "DELETE FROM $table WHERE Data_fine < CURDATE()";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        die(json_encode(array("error" => "Errore nella preparazione della query: " . $conn->error)));
    }

    $stmt->execute();
    $stmt->close();
}

function getEntriesComunicazioni($conn, $tag, $table) {
    $sql = "SELECT * FROM $table WHERE tag = ? AND (Data_inizio <= CURDATE() OR Data_inizio IS NULL)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $tag);
    $stmt->execute();
    $result = $stmt->get_result();

    $rows = array();
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    $stmt->close();
    return $rows;
}

function getEntriesComponentiAggiuntivi($conn, $table){
    $sql = "SELECT * FROM $table WHERE (Data_inizio <= CURDATE() OR Data_inizio IS NULL)";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $rows = array();
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    $stmt->close();
    return $rows;
}

function getEntriesEventiGiornalieri($conn) {
    $sql = "SELECT * FROM eventi_giornalieri WHERE Mese = MONTH(CURDATE()) AND Giorno = DAY(CURDATE())";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $rows = array();
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    $stmt->close();
    return $rows;
}

function getEntriesProgrammazione($conn){
    $sql = "SELECT * FROM `programmazione`";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $rows = array();
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    $stmt->close();
    return $rows;
}

function getEmergenze() {
    $conn = connectDatabase();
    deleteOldEntries($conn, 'emergenza', 'comunicazione');
    $rows = getEntriesComunicazioni($conn, 'emergenza', 'comunicazione');
    $conn->close();
    header('Content-Type: application/json');
    echo json_encode($rows);
}

function getNews() {
    $conn = connectDatabase();
    deleteOldEntries($conn, 'news', 'comunicazione');
    $rows = getEntriesComunicazioni($conn, 'news', 'comunicazione');
    $conn->close();
    header('Content-Type: application/json');
    echo json_encode($rows);
}

function getComponentiAggiuntivi() {
    $conn = connectDatabase();
    deleteOldEntriesComponentiAggiuntivi($conn, 'componenti_aggiuntivi');
    $rows = getEntriesComponentiAggiuntivi($conn, 'componenti_aggiuntivi');
    $conn->close();
    header('Content-Type: application/json');
    echo json_encode($rows);
}

function getEventiGiornalieri() {
    $conn = connectDatabase();
    $rows = getEntriesEventiGiornalieri($conn);
    $conn->close();
    header('Content-Type: application/json');
    echo json_encode($rows);
}

function getComunicazioni() {
    $conn = connectDatabase();
    deleteOldEntries($conn, 'comunicazione', 'comunicazione');
    $rows = getEntriesComunicazioni($conn, 'comunicazione', 'comunicazione');
    $conn->close();
    header('Content-Type: application/json');
    echo json_encode($rows);
}

function getProgrammazione(){
    $conn = connectDatabase();
    $rows = getEntriesProgrammazione($conn);
    $conn->close();
    header('Content-Type: application/json');
    echo json_encode($rows);
}

function getOrari(){
    $conn = connectDatabase();
    $sql = "SELECT * FROM orari";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $rows = array();
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    $stmt->close();
    $conn->close();
    header('Content-Type: application/json');
    echo json_encode($rows);
}

function getMeteo() {
    //controllo se i dati in sessione salvati sono di più di 10 minuti fa
    if (!isset($_SESSION['meteo']) || time() - $_SESSION['meteo']['timestamp'] >= 600) {
        //prendo le informazioni meteo della città di ferrara tramite API openWeather sono in modalità giorno
        $url = "http://api.openweathermap.org/data/2.5/weather?q=Ferrara,it&units=metric&appid=$GLOBALS[APIopenWeather]";
        $response = @file_get_contents($url);
        
        if ($response !== false) {
            $data = json_decode($response, true);
            
            $meteo = array(
                "temperatura" => $data['main']['temp'],
                "umidita" => $data['main']['humidity'],
                "vento" => $data['wind']['speed'],
                "icona" => $data['weather'][0]['icon']
            );
            
            //salva i dati meteo in una variabile di sessione
            $_SESSION['meteo'] = $meteo;
            $_SESSION['meteo']['timestamp'] = time();
        } else {
            // Se non riesco a contattare l'API, uso i dati della sessione anche se vecchi
            if (isset($_SESSION['meteo'])) {
                $meteo = $_SESSION['meteo'];
            } else {
                $meteo = array("error" => "Impossibile ottenere i dati meteo e nessun dato precedente disponibile.");
            }
        }
    } else {
        $meteo = $_SESSION['meteo'];
    }
    header('Content-Type: application/json');
    echo json_encode($meteo);
}

function getPaninaro(){
    $conn = connectDatabase();
    $sql = "SELECT * FROM paninaro";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $rows = array();
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    $stmt->close();
    $conn->close();
    header('Content-Type: application/json');
    echo json_encode($rows);
}

if (isset($_GET['action'])) {
    if ($_GET['action'] == 'getEmergenze') {
        getEmergenze();
        require ('GestoreNumeroPagine.php');
    } elseif ($_GET['action'] == 'getNews') {
        getNews();
        require ('GestoreNumeroPagine.php');
    } elseif ($_GET['action'] == 'getComponentiAggiuntivi') {
        getComponentiAggiuntivi();
        require ('GestoreNumeroPagine.php');
    } elseif ($_GET['action'] == 'getEventiGiornalieri') {
        getEventiGiornalieri();
        require ('GestoreNumeroPagine.php');
    } elseif ($_GET['action'] == 'getComunicazioni') {
        getComunicazioni();
        require ('GestoreNumeroPagine.php');
    } elseif ($_GET['action'] == 'getProgrammazione') {
        require ('GestoreNumeroPagine.php');
        getProgrammazione();
    } elseif ($_GET['action'] == 'getOrari'){
        require ('GestoreNumeroPagine.php');
        getOrari();
    } elseif ($_GET['action'] == 'getMeteo'){
        require ('GestoreNumeroPagine.php');
        getMeteo();
    } elseif ($_GET['action'] == 'getPaninaro'){
        require ('GestoreNumeroPagine.php');
        getPaninaro();
    } else {
        echo json_encode(array("error" => "Azione non valida"));
    }
} else {
    echo json_encode(array("error" => "Azione non specificata"));
}