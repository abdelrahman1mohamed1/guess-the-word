// game name analyse
const gameName = 'guess the word';
document.title = gameName;
document.querySelector('.header').innerHTML= gameName;
document.querySelector('footer').innerHTML= `${gameName} by abdelrahman mohamed`;


const messageArea = document.querySelector('.message');


// setting game rules 
let numberOfLetters = 6; 
let numberOftries = 6; 
let currentTry = 1; 
let numberOfHints = 4;

// manage words 


let words = ['zigzag','pizzle', 'nodles', 'horror', 'expert' , 'island' , 'faster' , 'leader', 'babies', 
    'eagles' ,'fabric' ,'hacked' , 'tables' , 'vacuum' , 'qiblah'];
let wordToGuess = words[Math.floor(Math.random()* words.length)].toLowerCase();

// console.log(wordToGuess)

function generateInputs () {
    const inputsContainer = document.querySelector('.inputs');
    for(let i = 1; i <= numberOftries; i++) {
        const tryDiv = document.createElement('div');
        tryDiv.classList.add(`try${i}`);
        tryDiv.innerHTML = `<span> try ${i}</span>`;

        for(let j = 1; j <= numberOfLetters; j++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.setAttribute("maxlength" , "1");
            input.id = `guess-${i}-letter-${j}`;
            tryDiv.appendChild(input);
        }


        
        
        if(i !== 1) tryDiv.classList.add("disabled-inputs");

        inputsContainer.appendChild(tryDiv);


        const inputsDisabled = document.querySelectorAll('.disabled-inputs input');

        inputsDisabled.forEach((input) => (input.disabled = true));

    



    }
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input, index) => {
        input.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
        })

        input.addEventListener("keydown", function (event) {
            const currentIndex = Array.from(inputs).indexOf(event.target);

            // console.log(currentIndex)

            if(event.key === 'ArrowRight') {
                const nextInput = currentIndex + 1;
                if(nextInput < inputs.length) inputs[nextInput].focus();
            }
       
            else if(event.key === 'ArrowLeft') {
                const prevInput = currentIndex - 1;
                if(prevInput >= 0) inputs[prevInput].focus();
            }
            else if(event.key === 'Enter') {
                const nextInput = currentIndex + 1;
                if(nextInput < inputs.length) inputs[nextInput].focus();
            }
            else         if (input.value !== "") { // Check if the current input is "done"
                const nextIndex = index + 1;
                const skipIndex = index + 2;
    
                if (nextIndex < inputs.length) {
                    if (inputs[nextIndex].value !== "") {
                        // If the next input already has a value, jump two inputs ahead
                        if (skipIndex < inputs.length) {
                            inputs[skipIndex].focus();
                        }
                    } else {
                        // Otherwise, focus the immediate next input
                        inputs[nextIndex].focus();
                    }
                }
            }

  
        })
    })

    


    inputsContainer.children[0].children[1].focus();


}
console.log(wordToGuess)


function handleGuesses() {
    let allCorrect = true; // Track if all letters are correct

    for (let i = 1; i <= numberOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const guessedLetter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];

        // Clear previous classes
        inputField.classList.remove('in-place', 'not-place', 'no');

        if (guessedLetter === actualLetter && guessedLetter !== '') {
            inputField.classList.add('in-place'); // Correct position
        } else if (wordToGuess.includes(guessedLetter) && guessedLetter !== '') {
            inputField.classList.add('not-place'); // Correct letter, wrong position
            allCorrect = false; // Not a win yet
        } else {
            inputField.classList.add('no'); // Incorrect letter
            allCorrect = false; // Not a win yet
        }
    }

    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    const filledInputs = Array.from(enabledInputs).filter((input) => input.value.trim() !== "").length;

    // Check win condition
    if (allCorrect && filledInputs === numberOfLetters) {
        displayWinMessage();
    } else {
        moveToNextRow();
    }
}

// replay button

let replayBtn = document.querySelector('.replay');

replayBtn.addEventListener('click', function () {
    location.reload();
    console.log(1)
})

const checkBtn = document.querySelector('.check-btn');
const hintBtn = document.querySelector('.hint-btn');
hintBtn.children[0].innerHTML = numberOfHints;


// hint manage

function hintHandler() {
    if (numberOfHints > 0) {
        numberOfHints--;
        hintBtn.children[0].innerHTML = numberOfHints;


        const enabledInputs = document.querySelectorAll("input:not([disabled])");

        const emptyInputs = Array.from(enabledInputs).filter((input) => input.value === "");

        // console.log(emptyInputs)

        if (emptyInputs.length > 0) {
            const randomIndex = Math.floor(Math.random()*emptyInputs.length);
            const randomInput = emptyInputs[randomIndex];

            const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
            // console.log(indexToFill)
            // console.log(randomIndex)

            if (indexToFill !== -1) {
                randomInput.value = wordToGuess[indexToFill].toUpperCase();
            }
        }


        if(numberOfHints <= 0) {
            hintBtn.disabled= true;
        }
    }
}



function backspaceHandler(event) {

    if (event.key === "Backspace") {
        const enabledInputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(enabledInputs).indexOf(document.activeElement);
        console.log(currentIndex)

        if (currentIndex > 0) {
            const currentInput = enabledInputs[currentIndex];
            const prevInput = enabledInputs[currentIndex - 1];

            currentInput.value = '';
            prevInput.focus();
            
        }
    }
 
}


function displayWinMessage() {
    messageArea.innerHTML = `You win! The word was <strong>${wordToGuess}</strong>`;
    messageArea.classList.add("message-win");

    // Disable all inputs
    const allInputs = document.querySelectorAll("input");
    allInputs.forEach((input) => (input.disabled = true));

    // Disable buttons
    checkBtn.disabled = true;
    hintBtn.disabled = true;

    // Reveal replay button
    replayBtn.classList.remove("hidden");
}
function moveToNextRow() {
    const currentRow = document.querySelector(`.try${currentTry}`);
    const currentInputs = document.querySelectorAll(`.try${currentTry} input`);

    // Add `disabled-inputs` to the current row
    currentRow.classList.add("disabled-inputs");
    currentInputs.forEach((input) => (input.disabled = true)); // Disable inputs in current row

    currentTry++; // Increment to the next try

    const nextRow = document.querySelector(`.try${currentTry}`);
    if (nextRow) {
        // Enable the next row and focus the first input
        nextRow.classList.remove("disabled-inputs");
        const nextInputs = document.querySelectorAll(`.try${currentTry} input`);
        nextInputs.forEach((input) => (input.disabled = false));
        nextInputs[0].focus();
    }

    // Add `disabled-inputs` to the previous row if it exists
    const prevRow = document.querySelector(`.try${currentTry - 2}`);
    if (prevRow) {
        prevRow.classList.add("disabled-inputs");
    }

    // Handle losing condition if no next row exists
    if (!nextRow) {
        displayLoseMessage(); // No more tries left
    }
}

function displayLoseMessage() {
    messageArea.innerHTML = `You lose! The word was <strong>${wordToGuess}</strong>`;
    messageArea.classList.add("message-lose");

    // Disable buttons
    checkBtn.disabled = true;
    hintBtn.disabled = true;

    // Reveal replay button
    replayBtn.classList.remove("hidden");
}


document.addEventListener('keydown', backspaceHandler)

hintBtn.addEventListener('click', () => {
    hintHandler()
})

checkBtn.addEventListener('click',  () => {
    handleGuesses()
})
window.onload =  () => {
    generateInputs();
};
