import { parse } from '/parse.js';

const numWords = 2309;

fetch("words.csv")
    .then(res => res.text())
    .then(csv => {
        const parsedWords = parse(csv);
        console.log(parsedWords);

        const randInt = Math.round(Math.random()*numWords);
        document.getElementById("word").innerHTML = parsedWords[randInt];
    });
