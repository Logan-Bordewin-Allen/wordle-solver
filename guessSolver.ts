// NEED TO REFACTOR THIS INTO A "CLASS" TO USE TEMP ONES FOR SOLVER
// DO THIS BEFORE ANYTHING ELSE

//OK I DID IT ARE YOU HAPPY


// Array containing every word that the answer could still be
let possibleWords: String[]
//Dictionary array
let dictionary: String[]
// 5 rows representing the 5 letter word, 26 columns representing alphabet
// 0 means no info, 1 means letter goes in this position
// 2 means letter can't go in this position, 3 means letter is in the word and could be in this position
let knownInfo:  number[][]



// sets possibleWords to words.csv and knownInfo to a zero 5x26 matrix
// argument should always be the parsed words.csv Array
export function initialize(words: String[]){
    // possibleWords reset
    possibleWords = words
    dictionary = words
    // Probably a better way to do this
    knownInfo = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]

}


export function takeGuess(guessInfo:number[], guess:String){
    knownInfo = infoUpdate(guessInfo,guess,knownInfo)
}


function toArray(guess: String, answer: String): number[]{
    let guessArr = []
    let answerArr = []
    let output = []
    for(let i = 0; i < 5;i++){
        guessArr.push(guess.substring(i,i+1) as unknown as number - ("a" as unknown as number))
        answerArr.push(answer.substring(i,i+1) as unknown as number - ("a" as unknown as number))
    }
    for(let i = 0; i < 5;i++){
        if(guessArr[i] == answerArr[i]){
            output.push(1)
        } else if (guessArr[i] in answerArr){
            output.push(3)
        } else{
            output.push(2)
        }
    }
    return output
}


// infoUpdate helper function use updated knownInfo array to remove all impossible words 
function removeWords(pos: String[], info: number[][]): String[]{
    
    // loop thorugh current possibleWords
    for(let i = 0; i < pos.length; i++){
        let letters = []
        // loop through each letter of the possible word
        for(let j = 0; j < 5; j++){
            // get letter at j as a number
            let letter = pos[i].substring(j,j + 1) as unknown as number -("a" as unknown as number)
            // remove letter if knownInfo position is 2
            if(knownInfo[j][letter] == 2){
                pos.splice(i,1)
                i--;
            }
            letters.push(letter);
        }
        // if the word does not contain enough possible letters, remove it
        for(let i = 0; i < info[6].length;i++){  
            if(info[6][i] = 1){
                for(let j = 0; j < letters.length; j++){
                    if(letters[j] = i){
                        letters.splice(j,1)
                        break
                    }
                }
            }
        }
        if(letters.length != 0){
            pos.splice(i,1)
            i--
        }
    }
    return pos
}




// Takes guess and outputs new array, same numbers as knownInfo
// If word is crane and guess is creak info should be [1,1,3,3,2]
function infoUpdate(info: number[], guess: String, knownInfoArr: number[][]): number[][]{
    // words.csv has Capitalized letters that can mess with math
    guess.toLowerCase()
    let output = knownInfoArr
    // todo make more efficent
    for(let i = 0; i < 5; i++){
        // gets difference between letter and 'a' to give x pos in matrix (might not work)
        let letter = guess.substring(i,i + 1) as unknown as number -("a" as unknown as number)  

        switch (info[i]){
            // no case 0 because every guess gives information
            // letter is in the right position
            case 1:
                // loop down row setting everything to 2 execpt the correct letter
                for(let j = 0; j < 26; j++){
                    //
                    if(j == letter){
                        output[i][j] = 1
                    }else { 
                        output[i][j] = 2
                    }
                }
                break
            // letter is not in word
            case 2:
                // loop down column setting 2 for everything
                for(let j = 0; j < 5; j++)
                    output[j][letter] = 2
                break
            // letter is in word but not in this position
            case 3:
                // check if letter is already 2(green guess previously)
                if( output[i][letter] == 2)
                    break
                // set guessed letter to 2 and all other info-less in column to 3
                for(let j = 0; j < 5; j++){
                    if(j == i){
                        output[j][letter] = 2
                    } else if(output[j][letter] == 0){
                        output[j][letter] = 3
                    }
                }
                output[5][letter] = 1
                break
        }
        
    }
    return output as number[][] 
}

export function generateGuess(): String{
    let minid = -1
    let min = dictionary.length
    for(let i = 0; i < dictionary.length;i++){
        let posWords = 0
        for(let j = 0; j < possibleWords.length;j++){
            posWords += removeWords(possibleWords,infoUpdate(toArray(dictionary[i],possibleWords[j]),dictionary[i],knownInfo)).length
        }
        if(posWords < min){
            min = posWords
            minid = i
        }
    }

    return dictionary[minid]
}