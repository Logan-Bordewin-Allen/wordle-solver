import { parse } from '/parse.js';
import { initialize, infoUpdate } from '/guessSolver.js';




const gameBoard = document.getElementById('gameBoard');
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const refresh = document.getElementById('refresh');
const inputs = [];
const results = [];


let solutionWord = '';

function initializeGame() {
    for (let i = 0; i < 30; i++) { // 6 attempts, 5 letters each
        let cell = document.createElement('div');
        cell.classList.add('cell');
        let y = Math.floor(i / 5);
        let x = i - y * 5;

        if(inputs.length > y && inputs[y][x]) {
            const result = results[y][x] === "+" ? "correct" : results[y][x] === "x" ? "semi-correct" : "incorrect";
            cell.textContent = inputs[y][x].toUpperCase();
            cell.classList.add(result);
        }
        gameBoard.appendChild(cell);
    }

    guessButton.disabled = true;

    fetch("words.csv")
    .then(res => res.text())
    .then(csv => {
        const parsedWords = parse(csv);


        const randInt = Math.floor(Math.random() * parsedWords.length);
        solutionWord = parsedWords[randInt][0].toLowerCase();

        console.log(solutionWord);

        guessButton.disabled = false;
    });
    
}

function validate(word) {

    const resultRow = [];

    const wordArr = word.split('');
    const solutionWordArr = solutionWord.split('');

    for (let i = 0; i < 5; i++){
        
        if (wordArr[i] === solutionWordArr[i]){
            resultRow.push("+");
        }
        else if (solutionWordArr.includes(wordArr[i])){
            resultRow.push("-");
        }
        else {
            resultRow.push(".");
        }
    }

    // win con
    if(word === solutionWord){

        console.log("you win");
    }

    results.push(resultRow);
    inputs.push(wordArr);

    refreshGame();

}

function refreshGame() {
  const cells = gameBoard.getElementsByClassName('cell');
    for (let i = 0; i < 30; i++) { // 6 attempts, 5 letters each
        let cell = cells[i];
        let y = Math.floor(i / 5);
        let x = i - y * 5;
      if(inputs.length > y && inputs[y][x]) {
        const result = results[y][x] === "+" ? "correct" : results[y][x] === "x" ? "semi-correct" : "incorrect";
        cell.textContent = inputs[y][x].toUpperCase();
        cell.classList.add(result);
      }
    }
}




// Event listener for the guess button
guessButton.addEventListener('click', function() {
    let guess = guessInput.value.toLowerCase();
    if (guess.length === 5) {
        validate(guess);
        
    } 
    else {
        alert('Please enter a 5-letter word.');
    }
    guess = '';
    guessInput.value = "";
});



guessInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        let guess = guessInput.value.toLowerCase();
        if (guess.length === 5) {
            validate(guess);
            
        } 
        else {
            alert('Please enter a 5-letter word.');
        }
        guess = '';
        guessInput.value = "";
    }
});


refresh.addEventListener('click', function() {
    inputs.length = 0;
    results.length = 0;
    solutionWord = '';
    gameBoard.innerHTML = "";
    for (let i = 0; i < 30; i++) { // 6 attempts, 5 letters each
        let cell = document.createElement('div');
        cell.classList.add('cell');
        let y = Math.floor(i / 5);
        let x = i - y * 5;

        if(inputs.length > y && inputs[y][x]) {
            const result = results[y][x] === "+" ? "correct" : results[y][x] === "x" ? "semi-correct" : "incorrect";
            cell.textContent = inputs[y][x].toUpperCase();
            cell.classList.add(result);
        }
        gameBoard.appendChild(cell);
    }
    guessButton.disabled = true;

    fetch("words.csv")
    .then(res => res.text())
    .then(csv => {
        const parsedWords = parse(csv);


        const randInt = Math.floor(Math.random() * parsedWords.length);
        solutionWord = parsedWords[randInt][0].toLowerCase();

        console.log(solutionWord);

        guessButton.disabled = false;
    });
    refreshGame();
});


initializeGame();