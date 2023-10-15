/*
* variablen
*
*/

var config = {
    width: 800,
    height: 600,
};

// Variable, um den Spielstatus zu verfolgen
var gameOver = false;

// Variable, um den Spielstatus zu verfolgen
var gameStarted = false;

var lives = 3; // Anzahl der Leben

// Paddle-Objekt
var paddle = {
    x: 300, // Anfangsposition des Paddels auf der x-Achse
    y: 100, // Anfangsposition des Paddels auf der y-Achse
    width: 90, // Breite des Paddels
    height: 140, // Höhe des Paddels
};

// Geschoss-Objekt
var bullet = {
    x: 200, // x-Position des Geschosses (wird relativ zur Paddle-Position aktualisiert)
    y: 100, // y-Position des Geschosses (wird relativ zur Paddle-Position aktualisiert)
    width: 132, // Breite des Geschosses
    height: -40, // Höhe des Geschosses                                                                 TODO: Schießen die wirklich genau und treffen auch noch korrekt? Angepasst von 80 auf -40
    dy: 20, // Geschwindigkeit des Geschosses in y-Richtung
    isFired: false, // Gibt an, ob das Geschoss abgefeuert wurde
};

// Geschoss-Objekt2
var bulletZwei = {
    x: 0, // x-Position des Geschosses (wird relativ zur Paddle-Position aktualisiert)
    y: 0, // y-Position des Geschosses (wird relativ zur Paddle-Position aktualisiert)
    width: 1, // Breite des Geschosses
    height: -40, // Höhe des Geschosses                                                                 TODO: Schießen die wirklich genau und treffen auch noch korrekt? Angepasst von 80 auf -40
    dy: 20, // Geschwindigkeit des Geschosses in y-Richtung
    isFired: false, // Gibt an, ob das Geschoss abgefeuert wurde
};




// Abrufen des table (Spielfeld) Elemets aus dem HTML
var table = document.getElementById("pong-table");


// Abrufen des Paddle (Spielfigur) Elemets aus dem HTML
var paddleElement = document.getElementById("paddle");


// Abrufen des Ufo Elemets aus dem HTML
//var ufoElement = document.getElementById("ufo");


// Geschoss-Element
var bulletElement = document.createElement("div");
bulletElement.className = "bullet";
table.appendChild(bulletElement); // Füge das Geschoss-Element dem Table-Element hinzu



// Zweites Geschoss-Element
var bulletElementZwei = document.createElement("div");
bulletElementZwei.className = "bullet";
table.appendChild(bulletElementZwei); // Füge das zweite Geschoss-Element dem Table-Element hinzu





/*
* Coin- und Level-Count
*
*/

//Zählen, wie viele Coins eingesammelt wurden und gibt Ergebnis zurück an HTML
var coinCount = 0; // Zählervariable
var coinCountElement = document.getElementById("coinCountElement"); // Element für den Zähler im HTML

var levelCount = 1;
var levelCountElement = document.getElementById("levelElement");





/*
* Sounds
*
*/

function playCoinSound() {
    var audio = new Audio("collectcoin-6075.mp3");
    audio.addEventListener("canplaythrough", function() {
        audio.volume = 0.03; // Setze die Lautstärke auf 0.5 (50% der vollen Lautstärke)
        audio.play();
    });
}

function playCollisionSound() {
    var audio = new Audio("CollisionSound.mp3");
    audio.addEventListener("canplaythrough", function() {
        audio.volume = 0.03; // Setze die Lautstärke auf 0.5 (50% der vollen Lautstärke)
        audio.play();
    });
}

function playExplosionSound() {
    var audio = new Audio("explosion-6055.mp3");
    audio.addEventListener("canplaythrough", function() {
        audio.volume = 0.03; // Setze die Lautstärke auf 0.5 (50% der vollen Lautstärke)
        audio.play();
    });
}

function playGunSound() {
    var audio = new Audio("blaster-2-81267.mp3");
    audio.addEventListener("canplaythrough", function() {
        audio.volume = 0.002; // Setze die Lautstärke auf 0.5 (50% der vollen Lautstärke)
        audio.play();
    });
}

function ufoSound() {
    var audio = new Audio("teleport-90323.mp3");
    audio.addEventListener("canplaythrough", function() {
        audio.volume = 0.03; // Setze die Lautstärke auf 0.5 (50% der vollen Lautstärke)
        audio.play();
    });
}




/*
* Ufo und ufoBullet
*
*/

var ufos = [];

// Funktion zum Erzeugen einer ufoBullet
function createUFOBullet(x, y) {
    var ufoBullet = {
        x: x, // Startposition der ufoBullet (x-Position des UFOs)
        y: y, // Startposition der ufoBullet (y-Position des UFOs)
        width: 10, // Breite der ufoBullet
        height: 10, // Höhe der ufoBullet
        dy: 0, // Geschwindigkeit der ufoBullet in y-Richtung
        isFired: false, // Flag, ob die ufoBullet abgefeuert wurde oder nicht
        element: null // Referenz auf das DOM-Element der ufoBullet
    };

    // Erzeuge ein DOM-Element für die ufoBullet
    var ufoBulletElement = document.createElement("div");
    ufoBulletElement.className = "ufoBullet";
    table.appendChild(ufoBulletElement);
    ufoBullet.element = ufoBulletElement;

    return ufoBullet;
}


// Erstelle eine ufoBullet beim Erzeugen eines UFOs
function createUFO() {
    var ufo = {
        x: -90, // Startposition des UFOs außerhalb des linken Bildschirmrands
        y: Math.random() * (table.clientHeight / 3), // Zufällige y-Position. Unten werden 200px Platz gelassen und oben auch 200px
        width: 90, // Breite des UFOs
        height: 140, // Höhe des UFOs
        dy: 3, // Geschwindigkeit des UFOs in y-Richtung
        ufoBullet: null, // Referenz auf die ufoBullet des UFOs
        element: null, // Referenz auf das DOM-Element des UFOs
        isHitted: false,    //wurde das Ufo schon getroffen?
    };

    // Erzeuge ein DOM-Element für das UFO
    var ufoElement = document.createElement("div");
    ufoElement.className = "ufo";
    table.appendChild(ufoElement);
    ufo.element = ufoElement;

    // Erzeuge eine ufoBullet für das UFO
    var ufoBullet = createUFOBullet(ufo.x, ufo.y);
    ufo.ufoBullet = ufoBullet;

    // Feuere die ufoBullet nach einer random Zeit ab
    var randomDelay = Math.random() * 2000 + 500;
    setTimeout(function() {
        ufo.ufoBullet.isFired = true;
        ufo.ufoBullet.dy = 5; // Geschwindigkeit der ufoBullet nach unten
    }, randomDelay);

    // Füge das Ufo zum Array hinzu
    ufos.push(ufo);
}


// Funktion zum Bewegen und Aktualisieren des UFOs
function updateUFO() {
  for (var i = ufos.length - 1; i >= 0; i--) {
    var ufo = ufos[i];

    // Bewege das UFO nach rechts
    ufo.x += ufo.dy;

    // Überprüfe Kollision mit den Geschossen
    if (
        bullet.isFired &&                       // Überprüfe, ob das erste Geschoss abgefeuert wurde
        !ufo.isHitted &&                         // Überprüfe, ob das UFO noch nicht zuvor getroffen wurde
        ufo.x + ufo.width >= bullet.x &&         // Überprüfe, ob sich das UFO horizontal mit dem ersten Geschoss überschneidet
        ufo.x <= bullet.x + bullet.width &&      // Überprüfe, ob sich das UFO horizontal mit dem ersten Geschoss überschneidet
        ufo.y + ufo.height >= bullet.y &&        // Überprüfe, ob sich das UFO vertikal mit dem ersten Geschoss überschneidet
        ufo.y <= bullet.y + bullet.height        // Überprüfe, ob sich das UFO vertikal mit dem ersten Geschoss überschneidet
    ) {

    if (!ufo.isHitted) {
        // Das UFO wurde von diesem Geschoss getroffen, markiere es als getroffen
        ufo.isHitted = true;
    }    

    if (!ufo.ufoBullet.isFired) {
        // Das UFO wurde von diesem Geschoss getroffen und hat noch kein UFO-Geschoss abgefeuert
        playExplosionSound();               // Sound abspielen
        ufo.element.remove();               // Entferne das UFO 
        ufo.ufoBullet.element.remove();     // Entferne das Geschoss
        ufos.splice(i, 1);                  // Entferne das UFO aus dem ufos-Array
        bullet.isFired = false;             // Setze die isFired-Eigenschaft des ersten Geschosses auf false, um es anzuhalten
    } else {
        // Das UFO wurde von diesem Geschoss getroffen, hat jedoch bereits ein UFO-Geschoss abgefeuert
        playExplosionSound();               // Spiele den Explosionssound ab
        ufo.element.remove();               // Entferne nur das UFO, das Geschoss bleibt unverändert
    }

    // Erzeuge ein Coin-Objekt an der Position des getroffenen UFOs
    var coin = createCoin(ufo.x, ufo.y);

    // Bewege das Coin-Objekt nach unten
    moveCoin(coin);
    }

    if (
      bulletZwei.isFired && !ufo.isHitted &&
      ufo.x + ufo.width >= bulletZwei.x &&
      ufo.x <= bulletZwei.x + bulletZwei.width &&
      ufo.y + ufo.height >= bulletZwei.y &&
      ufo.y <= bulletZwei.y + bulletZwei.height
    ) {

    if (!ufo.isHitted) {
        ufo.isHitted = true;
    } 
    
    if (!ufo.ufoBullet.isFired) {
        // Das UFO wurde von diesem Geschoss getroffen und hat noch kein UFO-Geschoss abgefeuert
        playExplosionSound(); // Sound abspielen
        ufo.element.remove();
        ufo.ufoBullet.element.remove();
        ufos.splice(i, 1);
        bulletZwei.isFired = false;
    } else {
        playExplosionSound();
        ufo.element.remove();
    }
    // Erzeuge ein Coin-Objekt an der Position des getroffenen UFOs
    var coin = createCoin(ufo.x, ufo.y);

    // Bewege das Coin-Objekt nach unten
    moveCoin(coin);
    }


    // Überprüfe, ob das UFO das untere Ende des Spielfelds erreicht hat
    if (ufo.y >= table.clientHeight) {
        // UFO ist außerhalb des Spielfelds, entferne das UFO
        ufo.element.remove();
        ufos.splice(i, 1);
        } else {
        // Bewege die UFO-Bullet mit dem UFO, solange sie nicht abgefeuert wurde
        if (!ufo.ufoBullet.isFired) {
            ufo.ufoBullet.x = ufo.x;
            ufo.ufoBullet.y = ufo.y;
            ufo.ufoBullet.element.style.transform = `translate(${ufo.ufoBullet.x}px, ${ufo.ufoBullet.y}px)`;
        } else {
            // Bewege die UFO-Bullet gerade nach unten, wenn sie abgefeuert wurde
            ufo.ufoBullet.y += ufo.ufoBullet.dy;
            ufo.ufoBullet.element.style.transform = `translate(${ufo.ufoBullet.x}px, ${ufo.ufoBullet.y}px)`;
    
            // Überprüfe, ob die UFO-Bullet das Paddle trifft
            if (
            ufo.ufoBullet.x + ufo.ufoBullet.width >= paddle.x &&
            ufo.ufoBullet.x <= paddle.x + paddle.width &&
            ufo.ufoBullet.y + ufo.ufoBullet.height >= paddle.y &&
            ufo.ufoBullet.y <= paddle.y + paddle.height
            ) {
            // UFO-Bullet trifft das Paddle, entferne die UFO-Bullet
            playExplosionSound()
            ufo.ufoBullet.element.remove();
            ufo.ufoBullet.isFired = false;
            loseLife();
            }
    
            // Überprüfe, ob die UFO-Bullet das untere Ende des Spielfelds erreicht hat
            if (ufo.ufoBullet.y >= table.clientHeight) {
            // UFO-Bullet ist außerhalb des Spielfelds, entferne die UFO-Bullet
            ufo.ufoBullet.element.remove();
            ufo.ufoBullet.isFired = false;
            } else {
            // Bewege die UFO-Bullet weiterhin gerade nach unten
            ufo.ufoBullet.element.style.transform = `translate(${ufo.ufoBullet.x}px, ${ufo.ufoBullet.y}px)`;
            }
        }
    
        // Aktualisiere die Position des UFOs im DOM
        ufo.element.style.transform = `translate(${ufo.x}px, ${ufo.y}px)`;
        }
    }
}





/*
* Asteroid
*
*/

// Array mit den Asteroiden
var asteroids = [];

// Funktion zum Erzeugen eines Asteroiden
function createAsteroid() {
    var asteroid = {
        x: Math.random() * (table.clientWidth - 40), // Zufällige x-Position des Asteroiden
        y: -210, // Startposition des Asteroiden am oberen Rand des Spielfelds
        width: 90, // Breite des Asteroiden
        height: 80, // Höhe des Asteroiden
        dy: 3, // Geschwindigkeit des Asteroiden in y-Richtung
        element: null // Referenz auf das DOM-Element des Asteroiden
    };

    // Erzeuge ein DOM-Element für den Asteroiden
    var asteroidElement = document.createElement("div");
    asteroidElement.className = "asteroid";
    table.appendChild(asteroidElement);
    asteroid.element = asteroidElement;

    // Füge den Asteroiden zum Array hinzu
    asteroids.push(asteroid);
}


// Funktion zum Bewegen und Aktualisieren der Asteroiden
function updateAsteroids() {
    for (var i = asteroids.length - 1; i >= 0; i--) {
        var asteroid = asteroids[i];

        // Bewege den Asteroiden nach unten
        asteroid.y += asteroid.dy;

        // Überprüfe Kollision mit dem Paddle
        if (
            asteroid.x + asteroid.width >= paddle.x &&
            asteroid.x <= paddle.x + paddle.width &&
            asteroid.y + asteroid.height >= paddle.y &&
            asteroid.y <= paddle.y + paddle.height
        ) {
            // Asteroid trifft das Paddle, entferne den Asteroiden
            playCollisionSound()
            asteroid.element.remove();
            asteroids.splice(i, 1);

            // Ziehe ein Leben ab und lasse den Bildschirm wackeln
            loseLife();
        }

        // Überprüfe Kollision mit den Geschossen
        if (
            bullet.isFired &&
            asteroid.x + asteroid.width >= bullet.x &&
            asteroid.x <= bullet.x + bullet.width &&
            asteroid.y + asteroid.height >= bullet.y &&
            asteroid.y <= bullet.y + bullet.height
        ) {
            // Asteroid wird von erstem Geschoss getroffen, entferne den Asteroiden und das Geschoss
            asteroid.element.remove();
            asteroids.splice(i, 1);
            bullet.isFired = false;
            playExplosionSound(); // Sound abspielen

            // Erzeuge ein Coin-Objekt an der Position des getroffenen Asteroiden
            var coin = createCoin(asteroid.x, asteroid.y);

            // Bewege das Coin-Objekt nach unten
            moveCoin(coin);
        }

        if (
            bulletZwei.isFired &&
            asteroid.x + asteroid.width >= bulletZwei.x &&
            asteroid.x <= bulletZwei.x + bulletZwei.width &&
            asteroid.y + asteroid.height >= bulletZwei.y &&
            asteroid.y <= bulletZwei.y + bulletZwei.height
        ) {
            // Asteroid wird von zweitem Geschoss getroffen, entferne den Asteroiden
            asteroid.element.remove();
            asteroids.splice(i, 1);
            bulletZwei.isFired = false;
            playExplosionSound(); // Sound abspielen

            // Erzeuge ein Coin-Objekt an der Position des getroffenen Asteroiden
            var coin = createCoin(asteroid.x, asteroid.y);

            // Bewege das Coin-Objekt nach unten
            moveCoin(coin);
        }

        // Überprüfe, ob der Asteroid das untere Ende des Spielfelds erreicht hat
        if (asteroid.y >= table.clientHeight) {
            // Asteroid ist außerhalb des Spielfelds, entferne den Asteroiden
            asteroid.element.remove();
            asteroids.splice(i, 1);
        }

        // Aktualisiere die Position des Asteroiden im DOM
        asteroid.element.style.transform = `translate(${asteroid.x}px, ${asteroid.y}px)`;
    }
}





/*
* Coin
*
*/

// Funktion zum Erzeugen eines Coin-Objekts
function createCoin(x, y) {
    var coin = {
        x: x, // x-Position des Coins
        y: y, // y-Position des Coins
        width: 40, // Breite des Coins
        height: 40, // Höhe des Coins
        dy: 1, // Geschwindigkeit des Coins in y-Richtung
        element: null // Referenz auf das DOM-Element des Coins
    };

    // Erzeuge ein DOM-Element für das Coin-Objekt
    var coinElement = document.createElement("div");
    coinElement.className = "coin";
    table.appendChild(coinElement);
    coin.element = coinElement;

    // Rückgabe des erstellten Coin-Objekts
    return coin;
}

// Funktion zum Bewegen des Coin-Objekts
function moveCoin(coin) {
    var coinInterval = setInterval(function() {

        if (gameOver) {
            clearInterval(coinInterval); // Beende das Intervall, wenn das Spiel vorbei ist
            return;
        }

        coin.y += coin.dy;

        // Überprüfe Kollision mit dem Paddle
        if (
            coin.x + coin.width >= paddle.x &&
            coin.x <= paddle.x + paddle.width &&
            coin.y + coin.height >= paddle.y &&
            coin.y <= paddle.y + paddle.height
        ) {
            // Coin wurde eingesammelt
            coin.element.remove(); // Entferne das Coin-Objekt vom DOM
            coinCount++;
            clearInterval(coinInterval); // Beende die Bewegung
            playCoinSound(); // Sound abspielen
        }

        // Überprüfe, ob das Coin-Objekt den unteren Rand des Spielfelds erreicht hat
        if (coin.y >= table.clientHeight) {
            // Coin-Objekt ist außerhalb des Spielfelds, beende die Bewegung
            coin.element.remove(); // Entferne das Coin-Objekt vom DOM
            clearInterval(coinInterval);
        }

        // Aktualisiere die Position des Coin-Objekts im DOM
        coin.element.style.transform = `translate(${coin.x}px, ${coin.y}px)`;
    }, coin.interval);
}





/*
* Bomben
*
*/

// Funktion zum Erzeugen eines UFOs
var bombs = [];

// Funktion zum Erzeugen einer Bombe
function createBomb() {
    var bomb = {
        x: Math.random() * (table.clientWidth - 40), // Zufällige x-Position der Bombe
        y: -210, // Startposition der Bombe am oberen Rand des Spielfelds
        width: 30, // Breite der Bombe
        height: 80, // Höhe der Bombe
        dy: 4.5, // Geschwindigkeit der Bombe in y-Richtung
        element: null // Referenz auf das DOM-Element der Bombe
    };

    // Erzeuge ein DOM-Element für die Bombe
    var bombElement = document.createElement("div");
    bombElement.className = "bomb";
    table.appendChild(bombElement);
    bomb.element = bombElement;

    // Füge die Bombe zum Array hinzu
    bombs.push(bomb);
}

// Funktion zum Bewegen und Aktualisieren der Bomben
function updateBombs() {
    for (var i = bombs.length - 1; i >= 0; i--) {
        var bomb = bombs[i];

        // Bewege die Bombe nach unten
        bomb.y += bomb.dy;

        // Überprüfe Kollision mit dem Paddle
        if (
            bomb.x + bomb.width >= paddle.x &&
            bomb.x <= paddle.x + paddle.width &&
            bomb.y + bomb.height >= paddle.y &&
            bomb.y <= paddle.y + paddle.height
        ) {
            // Bombe trifft das Paddle, entferne die Bombe
            bomb.element.remove();
            bombs.splice(i, 1);

            playExplosionSound(); // Sound abspielen
            // Ziehe ein Leben ab und lasse den Bildschirm wackeln
            loseLife();
        }

        // Überprüfe Kollision mit den Geschossen
        if (
            bullet.isFired &&
            bomb.x + bomb.width >= bullet.x &&
            bomb.x <= bullet.x + bullet.width &&
            bomb.y + bomb.height >= bullet.y &&
            bomb.y <= bullet.y + bullet.height
        ) {
            // Bombe wird von erstem Geschoss getroffen, entferne die Bombe und das Geschoss
            bomb.element.remove();
            bombs.splice(i, 1);
            bullet.isFired = false;
            playExplosionSound(); // Sound abspielen
        }

        if (
            bulletZwei.isFired &&
            bomb.x + bomb.width >= bulletZwei.x &&
            bomb.x <= bulletZwei.x + bulletZwei.width &&
            bomb.y + bomb.height >= bulletZwei.y &&
            bomb.y <= bulletZwei.y + bulletZwei.height
        ) {
            // Bombe wird von zweitem Geschoss getroffen, entferne die Bombe
            bomb.element.remove();
            bombs.splice(i, 1);
            bulletZwei.isFired = false;
            playExplosionSound(); // Sound abspielen
        }

        // Überprüfe, ob die Bombe das untere Ende des Spielfelds erreicht hat
        if (bomb.y >= table.clientHeight) {
            // Bombe ist außerhalb des Spielfelds, entferne die Bombe
            bomb.element.remove();
            bombs.splice(i, 1);
        }

        // Aktualisiere die Position der Bombe im DOM
        bomb.element.style.transform = `translate(${bomb.x}px, ${bomb.y}px)`;
    }
}





/*
*  Wenn man ein Leben verliert
*
*/

function loseLife() {
    // Überprüfen, ob das Spiel bereits beendet ist
    if (gameOver) {
        return;
    }

    // Ziehe ein Leben ab
    lives--;

    // Aktualisiere die Anzeige für die Anzahl der Leben im HTML
    var livesElement = document.getElementById("livesElement");
    livesElement.textContent = "Lives: " + lives;

    // Lasse den Bildschirm wackeln
    table.classList.add("shake");

    // Entferne das Wackeln nach einer kurzen Verzögerung
    setTimeout(function() {
        table.classList.remove("shake");
    }, 600);

    if (lives === 0){
        // Zeige die "Game Over"-Nachricht an
        showModal();
        gameOver = true; // Spielstatus auf "beendet" setzen
    }
}





/*
*
* Game Start und restart Funktionionen
*/

function startGame() {
    hideModal1(); // Verstecke das Modal
    gameStarted = true;
    gameLoop();
}

// Wiederholungsfunktion
function restartGame() {
    hideModal();
    hideModal2();
    location.reload();
}





/*
*
* Die Modals "Start Game", "Game over" und "you've won"
* Modal 1 ist das Start Modal
* Modal ist das Game Over Modal
* Modal 2 ist das You've won Modal
*/

function showStartModal() {
    var modal = document.getElementById("myModal1");
    modal.style.display = "block";

    // Event-Listener für den "Go"-Button
    var goButton = document.getElementById("goButton");
    goButton.addEventListener("click", startGame);
}

// Verstecke das Modal
function hideModal1() {
    var modal = document.getElementById("myModal1");
    modal.style.display = "none";
}

////////////////////////////////////////////////////////

function showModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
}

// Event-Listener für den Restart-Button
var restartButton = document.getElementById("restartButton");
restartButton.addEventListener("click", restartGame);

// Verstecke das Modal
function hideModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

////////////////////////////////////////////////////////

function showModal2() {
    var modal = document.getElementById("myModal2");
    modal.style.display = "block";
}

// Event-Listener für den Restart-Button
var restartButton2 = document.getElementById("restartButton2");
restartButton2.addEventListener("click", restartGame);

// Verstecke das Modal
function hideModal2() {
    var modal = document.getElementById("myModal2");
    modal.style.display = "none";
}





/*
*
* Spiel-Loop
*/

function gameLoop() {
    // Überprüfen, ob das Spiel bereits gestartet ist
    if (!gameStarted) {
        showStartModal(); // Zeige das Modal vor dem Spielstart
        return;
    }

    // Überprüfen, ob das Spiel bereits beendet ist
    if (gameOver) {
        return;
    }


    // Bewege das Paddel nach unten
    if (paddle.y + paddle.height < table.clientHeight) {
        paddle.y += 7; // Geschwindigkeit der Paddelbewegung nach unten
    }

    // Bewege das Paddel nach links
    if (paddle.x > 0 && leftKeyPressed) {
        paddle.x -= 12; // Geschwindigkeit der Paddelbewegung nach links
    }

    // Bewege das Paddel nach rechts
    if (paddle.x + paddle.width < table.clientWidth && rightKeyPressed) {
        paddle.x += 12; // Geschwindigkeit der Paddelbewegung nach rechts
    }

    // Schieße das erste Geschoss
    if (upKeyPressed && !bullet.isFired) {
        bullet.isFired = true;
        bullet.x = paddle.x + paddle.width / 2 - bullet.width / 2;
        bullet.y = paddle.y - bullet.height;
        playGunSound(); // Sound abspielen
    }

    // Schieße das zweite Geschoss
    if (downKeyPressed && !bulletZwei.isFired) {
        bulletZwei.isFired = true;
        bulletZwei.x = paddle.x + paddle.width / 2 - bulletZwei.width / 2;
        bulletZwei.y = paddle.y - bulletZwei.height;
        playGunSound(); // Sound abspielen
    }

    // Bewege das erste Geschoss nach oben
    if (bullet.isFired && bullet.y > 0) {
        bullet.y -= bullet.dy;
    } else if (!bullet.isFired) {
        bullet.y = paddle.y - bullet.height;
    } else {
        bullet.isFired = false;
    }

    // Bewege das zweite Geschoss nach oben
    if (bulletZwei.isFired && bulletZwei.y > 0) {
        bulletZwei.y -= bulletZwei.dy;
    } else if (!bulletZwei.isFired) {
        bulletZwei.y = paddle.y - bulletZwei.height;
    } else {
        bulletZwei.isFired = false;
    }

    // Aktualisiere die Position des ersten Geschosses
    if (bullet.isFired && bullet.y > 0) {
        bullet.y -= bullet.dy;
    } else if (!bullet.isFired) {
        bullet.y = paddle.y - bullet.height;
        bullet.x = paddle.x + paddle.width / 2 - bullet.width / 2;
    } else {
        bullet.isFired = false;
    }

    // Aktualisiere die Position des zweiten Geschosses
    if (bulletZwei.isFired && bulletZwei.y > 0) {
        bulletZwei.y -= bulletZwei.dy;
    } else if (!bulletZwei.isFired) {
        bulletZwei.y = paddle.y - bulletZwei.height;
        bulletZwei.x = paddle.x + paddle.width / 2 - bulletZwei.width / 2;
    } else {
        bulletZwei.isFired = false;
    }

    // Aktualisiere die Positionen des Balls, des Paddels und der Geschosse im DOM
    paddleElement.style.transform = `translate(${paddle.x}px, ${paddle.y}px)`;
    bulletElement.style.transform = `translate(${paddle.x + paddle.width / 2 - bullet.width / 2}px, ${bullet.y}px)`;
    bulletElementZwei.style.transform = `translate(${paddle.x + paddle.width / 2 - bulletZwei.width / 2}px, ${bulletZwei.y}px)`;


    // Erzeuge neue Asteroiden
    if (Math.random() < 0.02) {
        createAsteroid();
    }

    // Aktualisiere die Asteroiden
    updateAsteroids();

    // Aktualisiere die Coinzahl
    coinCountElement.innerHTML = "Coins: " + coinCount;


    if (coinCount === 10 && levelCount === 1) {
        // Erzeuge das Level 2 Fenster
        var level2Window = document.createElement("div");
        level2Window.className = "level-window";
        level2Window.textContent = "Level 2";
        document.body.appendChild(level2Window);

        // Zeige das Fenster für 1 Sekunde an
        setTimeout(function() {
            level2Window.style.display = "none";
        }, 4000);

        coinCount = 0; // Setze die Coin-Zahl auf 0
        coinCountElement.textContent = "Coins: " + coinCount;
        levelCount = 2;
        levelCountElement.textContent = "Level: " + levelCount;
    }

    if (coinCount === 15 && levelCount === 2) {
        // Erzeuge das Level 3 Fenster
        var level3Window = document.createElement("div");
        level3Window.className = "level-window";
        level3Window.textContent = "Level 3";
        document.body.appendChild(level3Window);

        // Zeige das Fenster für 1 Sekunde an
        setTimeout(function() {
            level3Window.style.display = "none";
        }, 4000);

        coinCount = 0; // Setze die Coin-Zahl auf 0
        coinCountElement.textContent = "Coins: " + coinCount;
        levelCount = 3;
        levelCountElement.textContent = "Level: " + levelCount;
    }

    if (coinCount === 20 && levelCount === 3){
        // Zeige die "Game Over"-Nachricht an
        showModal2();
        gameOver = true; // Spielstatus auf "beendet" setzen
    }

    // Erzeuge Ufos in Level 2 und 3
    if (Math.random() < 0.015 && (levelCount === 2 || levelCount === 3)) {
        ufoSound();
        createUFO();
    }
    updateUFO();

    // Erzeuge Bombel in Level 3
    if (Math.random() < 0.015 && levelCount === 3) {
        createBomb();
    }
    updateBombs();

    // Wiederhole die Spiel-Loop
    requestAnimationFrame(gameLoop);
}





/*
* Tastatursteuerung
*
*/

var leftKeyPressed = false;
var rightKeyPressed = false;
var upKeyPressed = false;
var downKeyPressed = false;

document.addEventListener("keydown", function (event) {
    if (event.code === "ArrowLeft") {
        leftKeyPressed = true;
    } else if (event.code === "ArrowRight") {
        rightKeyPressed = true;
    } else if (event.code === "ArrowUp") {
        upKeyPressed = true;
    } else if (event.code === "ArrowDown") {
        downKeyPressed = true;
    }
});

document.addEventListener("keyup", function (event) {
    if (event.code === "ArrowLeft") {
        leftKeyPressed = false;
    } else if (event.code === "ArrowRight") {
        rightKeyPressed = false;
    } else if (event.code === "ArrowUp") {
        upKeyPressed = false;
    } else if (event.code === "ArrowDown") {
        downKeyPressed = false;
    }
});





/*
* Starte das Spiel
*
*/
gameLoop();