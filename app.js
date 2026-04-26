import { parse } from '/parse.js';

const words = "words.csv";

const parsedWords = parse(words);
console.log(parsedWords);