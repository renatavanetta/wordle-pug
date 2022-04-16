const keyboard = document.getElementById('keyboard-area');
const popUp = document.querySelector('.pop-up')
popUp.style.display='none';

let line = 0;
let column = 0;
var userId = null;
let processing = false;

document.addEventListener("keydown", myEventHandler);

function myEventHandler(event){

    switch(event.key){
        case 'Enter':
            checkWord(); break;
        case 'Backspace':
            deleteLetter(); break;
        default:
            writeLetter(event.key); break;
    }
}

window.onload = function(){
    start();
}

async function start() {
    if(userId == null){
        axios.get('https://wordle-clone-1-0.herokuapp.com/userId')
            .then(response => {
                userId = response.data.id;
                axios.post('https://wordle-clone-1-0.herokuapp.com/startGame', ({id: userId}))
                    .then(response => {
                    })
            })
    }
}

function handleClick(letter) {

    if(letter === 'BACKSPACE'){
        deleteLetter();
        return;
    }

    if(letter === 'ENTER'){
        checkWord();
        return;
    }

    writeLetter(letter);
}


function writeLetter(letter) {
    if(letter.length != 1){
        writeMessage('you can only type letters.')
        return;
    }

    if (!((letter >= 'a' && letter <= 'z') || (letter >= 'A' && letter <= 'Z'))){
        writeMessage('you can only type letters.')
        return;
    }

    if(line < 6 && column < 5){
        const tile = document.getElementById('line-' + line + '-column-' + column)
        tile.textContent = letter;
        tile.setAttribute('content', letter);
        column++;
    }
}

function deleteLetter() {
    if(column > 0){
        column--;
        const tile = document.getElementById('line-' + line + '-column-' + column)
        tile.textContent = '';
        tile.setAttribute('content', '');
    }
}

async function playAgain() {
    axios.post('https://wordle-clone-1-0.herokuapp.com/startGame', ({id: userId}))
        .then(response => {
            if(response.data.message = 'new game starting'){
                popUp.style.display='none';
            }
        })

    clearTiles();
}

async function deleteUser() {
    axios.post('https://wordle-clone-1-0.herokuapp.com/deleteUser', ({id: userId}))
        .then(response => {
            writeMessage('Bye Bye :)');
            popUp.style.display='none';
        })
}

async function clearTiles() {
    line = 0;
    column = 0;

    for(let line=0; line<6; line++){
        for(let column=0; column<5; column++){
            const tile = document.getElementById('line-' + line + '-column-' + column)
            tile.textContent = '';
            tile.style.backgroundColor = '';
            tile.setAttribute('content', '');
        }
    }

    let keyboard = document.getElementById('keyboard-area').querySelectorAll('button')
    for(let a=0; a < keyboard.length; a++){
        keyboard[a].style.backgroundColor = '#d3d6da';
    }
}

async function checkWord() {

    let word = "";


    if(processing == false){

        processing = true;

        if(column === 5){
            for(let a=0; a<5; a++){
                const tile = document.getElementById('line-' + line + '-column-' + a)
                const letter = typeof tile.textContent == 'string'? tile.textContent : tile.innerText;
                word += letter;
            }

            let url = `https://wordle-clone-1-0.herokuapp.com/checkword/`;

            axios.post(url, {sentWord: word, id: userId})
                .then(response => {
                    if(response.data.message == 'word do not exist in list'){
                        writeMessage('word do not exist in list. Try another.');
                        line = response.data.line;
                        processing = false;
                        return
                    }

                    if(response.data.wordChecker.status == "gameOver"){
                        writeMessage('Word was: ' + response.data.wordChecker.pastWord);
                        popUp.style.display='';
                        const divPlayed = document.querySelectorAll('.statistic1');
                        divPlayed[0].innerText = String(response.data.wordChecker.numberOfPlays)
                        const divStreak = document.querySelectorAll('.statistic2');
                        divStreak[0].innerText = String(response.data.wordChecker.currentStreak);
                        processing = false;
                        return
                    }

                    if(response.data.wordChecker.status == "win"){
                        for(let a=0; a<5; a++){
                            document.getElementById('line-' + line + '-column-' + a).style.backgroundColor = "green";
                        }

                        popUp.style.display='';
                        const divPlayed = document.querySelectorAll('.statistic1');
                        divPlayed[0].innerText = String(response.data.wordChecker.numberOfPlays)
                        const divStreak = document.querySelectorAll('.statistic2');
                        divStreak[0].innerText = String(response.data.wordChecker.currentStreak);
                        processing = false;
                        return
                    }

                    for(let a=0; a<5; a++){
                        document.getElementById('line-' + line + '-column-' + a).style.backgroundColor = response.data.wordChecker[a];
                    }

                    let b = 0;

                    for(let a=5; a<10; a++){
                        let letter = response.data.wordChecker[a]
                        if(b == b) {
                            document.getElementById(letter).style.backgroundColor = response.data.wordChecker[b]
                        }
                        b++;
                    }

                    line++;
                    column=0;
                    processing = false;
                })
        }
        else{
            writeMessage('You need to type a 5 letter word.');
            processing = false;
        }
    }
}

function writeMessage(message) {
    const message_element = document.querySelector('.message-container')
    const message_p = document.createElement('p');
    message_p.textContent = message;
    message_element.append(message_p);
    setTimeout(() => message_element.removeChild(message_p), 2000);
}

