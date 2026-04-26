//NEED TO REFACTOR THIS INTO A "CLASS" TO USE TEMP ONES FOR SOLVER
// DO THIS BEFORE ANYTHING ELSE


//Array containing every word that the answer could still be
let possibleWords: String[]
// 5 rows representing the 5 letter word, 26 columns representing alphabet
// 0 means no info, 1 means letter goes in this position
// 2 means letter can't go in this position, 3 means letter is in the word and could be in this position
let knownInfo:  number[][]
//collection of every yellow letter
let neededLetters: number[]



//sets possibleWords to words.csv and knownInfo to a zero 5x26 matrix
//argument should always be the parsed words.csv Array
export function initialize(words: String[]){
    //possibleWords reset
    possibleWords = words
    //knownInfo reset
    //Probably a better way to do this
    knownInfo = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]

    neededLetters = []
}


//infoUpdate helper function use updated knownInfo array to remove all immpossible words 
function removeWords(){
    //loop thorugh current possibleWords
    for(let i = 0; i < possibleWords.length; i++){
        let isPossible = 0

        //loop through each letter of the possible word
        for(let j = 0; j < 5; j++){
            //get letter at j as a number
            let letter = possibleWords[i].substring(j,j + 1) as unknown as number -("a" as unknown as number)
            //remove letter if knownInfo position is 2
            if(knownInfo[j][letter] == 2){
                possibleWords.splice(i,1)
                i--;
            }
            //increment isPossible if position is 3
            if(knownInfo[j][letter] == 3){
                isPossible++
            }
        }
        //if the word does not contain enough possible letters, remove it
        //todo: edge case error where word contains multiple letters but not every letter in neededletters
        //i. e. neededletters = [p,i], apple will not be deleted
        if(isPossible < neededLetters.length){
            possibleWords.splice(i,1)
            i--
        }
    }
}




//Takes guess and updates knownInfo, same numbers as knownInfo
//If word is crane and guess is creak info should be [1,1,3,3,2]
export function infoUpdate(info: number[], guess: String){
    //words.csv has Capitalized letters that can mess with math
    guess.toLowerCase()

    //todo make more efficent
    for(let i = 0; i < 5; i++){
        //gets difference between letter and 'a' to give x pos in matrix (might not work)
        let letter = guess.substring(i,i + 1) as unknown as number -("a" as unknown as number)  

        switch (info[i]){
            //no case 0 because every guess gives information
            //letter is in the right position
            case 1:
                //loop down row setting everything to 2 execpt the correct letter
                for(let j = 0; j < 26; j++){
                    //
                    if(j == letter){
                        knownInfo[i][j] = 1
                    }else { 
                        knownInfo[i][j] = 2
                    }
                }
                break
            //letter is not in word
            case 2:
                //loop down column setting 2 for everything
                for(let j = 0; j < 5; j++)
                    knownInfo[j][letter] = 2
                break
            //letter is in word but not in this position
            case 3:
                //check if letter is already 2(green guess previously)
                if( knownInfo[i][letter] == 2)
                    break
                //set guessed letter to 2 and all other info-less in column to 3
                for(let j = 0; j < 4; j++){
                    if(j == i){
                        knownInfo[j][letter] = 2
                    } else if(knownInfo[j][letter] == 0){
                        knownInfo[j][letter] = 3
                    }
                }
                neededLetters.push(letter)
                break
        }
        //call helper to remove immpossible words
        removeWords();   
    }
}



