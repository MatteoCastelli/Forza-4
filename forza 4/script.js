let row = 6;
let col = 7;
let card = document.getElementsByClassName("card");
let contenitore = document.getElementById('contenitore');
let color = "Y";
let name1, name2;
let turn = document.getElementById("turn")
document.body.style.overflow = 'hidden';
let cnt = 0;

//riempe la matrice di 0
let matrice = [];
for (let i = 0; i < col; i++) {
    matrice[i] = [];
    for (let y = 0; y < row; y++) {
        matrice[i][y] = 0;
    }
}

for (let r = 0; r < row; r++) {
    for (let c = 0; c < col; c++) {

        let card = document.createElement('div');
        card.className = 'card';
        card.id = `row${r}col${c}`;
        contenitore.appendChild(card);

        card.addEventListener("click", () => {
            cnt++
            let lowestRow = checkLowest(c);
            let card = document.getElementById(`row${lowestRow}col${c}`);

            if (color == "Y") {
                matrice[c][lowestRow] = "Y";
                card.style.backgroundColor = 'yellow';
                color = "R";
                turn.innerHTML = "TURNO DI: " + name2;
                turn.style.backgroundColor = "lightcoral";
            } else {
                matrice[c][lowestRow] = "R";
                card.style.backgroundColor = 'red';
                color = "Y";
                turn.innerHTML = "TURNO DI: " + name1;
                turn.style.backgroundColor = "rgb(255, 255, 139)";
            }

            card.style.pointerEvents = 'none';
            console.log(matrice);

            //cerca la combinazione ad ogni click
            let winner = checkCombo(matrice);
            if (winner) {
                document.getElementById('homeButton').style.backgroundColor='green'
                turn.style.backgroundColor='lightgreen'
                if (winner === "Y") {
                    risultato(name1, name2, 'normale'); 
                    turn.innerHTML = name1 + " HA VINTO";
                    
                } else {
                    risultato(name2, name1, 'normale');
                    turn.innerHTML = name2 + " HA VINTO";
                }
                document.getElementById("contenitore").style.pointerEvents = 'none';
            }

            if (cnt == 42) {
                risultato(name2, name1, 'pareggio')
                document.getElementById('homeButton').style.backgroundColor='orange';
                turn.style.backgroundColor='orange';
                turn.innerHTML = "PAREGGIO!";
                document.getElementById("contenitore").style.pointerEvents = 'none';
            }

        });
    }
}

//trova la card più bassa uguale a 0 (diversa da Y o R)
function checkLowest(col) {
    for (let row = matrice[col].length - 1; row >= 0; row--) {
        if (matrice[col][row] === 0) {
            return row;
        }
    }
}

//controllo combinazione
function checkCombo(matrice) {
    let rows = matrice[0].length;
    let cols = matrice.length;

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            if (checkDirection(row, col, 0, 1) || checkDirection(row, col, 1, 0) || checkDirection(row, col, 1, 1) || checkDirection(row, col, 1, -1)) {
                return matrice[col][row];
            }
        }
    }
    return null;

    function checkDirection(row, col, deltaRow, deltaCol) {
        let start = matrice[col][row];
        if (start === 0) return false;

        for (let i = 1; i < 4; i++) {
            let newRow = row + deltaRow * i;
            let newCol = col + deltaCol * i;
            if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols || matrice[newCol][newRow] !== start) {
                return false;
            }
        }
        return true;
    }
}

//mostra la home page
document.getElementById("home").classList.remove('hidden');

//pulsante gioca
document.getElementById("gioca").addEventListener("click", () => {
    document.getElementById("nomi").classList.remove('hidden');
    document.getElementById("home").classList.add('hidden');
    
    //inserire il primo nome
    document.getElementById('nameForm1').addEventListener('submit', function (event) {
        event.preventDefault();
        name1 = document.getElementById('nameInput1').value;
        salvaNome(name1);

        document.getElementById('nameForm1').classList.add('hidden');
        document.getElementById('nameForm2').classList.remove('hidden');
    });

    //inserire il secondo nome
    document.getElementById('nameForm2').addEventListener('submit', function (event) {
        event.preventDefault();
        name2 = document.getElementById('nameInput2').value;
        salvaNome(name2);

        document.getElementById('nameForm2').classList.add('hidden');
        document.getElementById('nomi').classList.add('hidden');

        document.getElementById("contenitore").classList.remove('hidden');
        document.getElementById('homeButton').classList.remove('hidden');
        document.getElementById('turn').classList.remove('hidden');

        turn.innerHTML = "TURNO DI: " + name1;
    });

    //tornare alla home mentre si sta inserendo il primo nome
    document.getElementById('backButton1').addEventListener('click', function () {
        if (localStorage.getItem('userName1')) {
            localStorage.removeItem('userName1');
        }
        document.getElementById('nomi').classList.add('hidden');
        document.getElementById('home').classList.remove('hidden');
    });

    //tornare a inserire il primo nome mentre si sta inserendo il secondo
    document.getElementById('backButton2').addEventListener('click', function () {
        document.getElementById('nameForm2').classList.add('hidden');
        document.getElementById('nameForm1').classList.remove('hidden');
    });

    //salvare il nome
    function salvaNome(name) {
        var names = JSON.parse(localStorage.getItem('userNames')) || [];
        names.push(name);
        localStorage.setItem('userNames', JSON.stringify(names));
    }
});

//uscire dal gioco
document.getElementById("homeButton").addEventListener("click", () => {
    location.reload();
});

//mostra il registro partite
document.getElementById("registro").addEventListener("click", () => {
    document.body.style.overflow = 'visible';
    document.getElementById("home").classList.add('hidden');
    document.getElementById('nameForm1').classList.add('hidden');
    document.getElementById("nom").classList.remove('hidden');
    registro();
});

//esce dal registro partite
document.getElementById("esci").addEventListener("click", () => {
    document.getElementById("home").classList.remove('hidden')
    document.getElementById('nameForm1').classList.remove('hidden');
    document.getElementById("nom").classList.add('hidden');
    document.body.style.overflow = 'hidden';
    document.documentElement.scrollTop = 0;
})

//regole
document.getElementById("btnRegole").addEventListener("click", () => {
    document.getElementById("home").classList.add('hidden')
    document.getElementById("regole").classList.remove('hidden');
});

//esce dalle regole
document.getElementById("capito").addEventListener("click", () => {
    document.getElementById("home").classList.remove('hidden');
    document.getElementById("regole").classList.add('hidden');
});

//mostra le partite nel registro
function registro() {
    
    let listaNomi = document.getElementById('listaNomi');
    listaNomi.innerHTML = ""; 
    listaNomi.innerHTML += `<li class="header">GIOCATORE 1</li> <li class="header">GIOCATORE 2</li> <li class="header">DATA</li>`;

    let partite = JSON.parse(localStorage.getItem('partite')).reverse() || [].reverse();
    partite.forEach((game) => {
        if(game.result == "normale"){
            listaNomi.innerHTML += `<li style="color:darkgreen">${game.winner}</li> <li style="color:red">${game.loser}</li><li>${game.date}</li>`;
        }else{
            listaNomi.innerHTML += `<li style="color:orange">${game.winner}</li> <li style="color:orange">${game.loser}</li><li>${game.date}</li>`;
        }
    });
}

//salva i risultati quando finisce la partita 
function risultato(winner, loser, risultato) {
    let partite = JSON.parse(localStorage.getItem('partite')) || [];
    let data = new Date().toLocaleDateString('it-IT');
    
    partite.push({
        winner: winner,
        loser: loser,
        date: data,
        result: risultato
    });

    localStorage.setItem('partite', JSON.stringify(partite));
}