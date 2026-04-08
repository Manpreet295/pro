let hangman = {
    wordList: [],
    currentWord: "",
    currentHint: "",
    guessed: [],
    wrongGuesses: 0,
    maxWrong: 6,
    gameLive: true,
    
    images: [
        "images/clean_hangman0.png",
        "images/clean_hangman1.png",
        "images/clean_hangman2.png",
        "images/clean_hangman3.png",
        "images/clean_hangman4.png",
        "images/clean_hangman5.png",
        "images/clean_hangman6.png"
    ],
    
    loadData: function() {
        fetch("../words.json")
            .then(function(res) {
                return res.json();
            })
            .then(function(data) {
                hangman.wordList = data;
                hangman.startGame();
            })
            .catch(function() {
                hangman.wordList = [
                    { word: "javascript", hint: "Programming language" },
                    { word: "hangman", hint: "Name of game" }
                ];
                hangman.startGame();
            });
    },
    
    startGame: function() {
        let rand = Math.floor(Math.random() * this.wordList.length);
        this.currentWord = this.wordList[rand].word.toLowerCase();
        this.currentHint = this.wordList[rand].hint;
        this.guessed = [];
        this.wrongGuesses = 0;
        this.gameLive = true;
        
        document.getElementById("letterInput").disabled = false;
        document.getElementById("guessBtn").disabled = false;
        document.getElementById("letterInput").value = "";
        document.getElementById("letterInput").focus();
        
        this.showWord();
        this.showHint();
        this.showImage();
        this.showUsed();
        this.showRemaining();
        this.clearMsg();
    },
    
    showWord: function() {
        let output = "";
        for (let i = 0; i < this.currentWord.length; i++) {
            let letter = this.currentWord[i];
            if (this.guessed.includes(letter)) {
                output += letter + " ";
            } else {
                output += "_ ";
            }
        }
        document.getElementById("wordBox").innerHTML = output.toUpperCase();
    },
    
    showHint: function() {
        document.getElementById("hint").innerHTML = this.currentHint;
    },
    
    showImage: function() {
        document.getElementById("hangmanImg").src = this.images[this.wrongGuesses];
    },
    
    showUsed: function() {
        let container = document.getElementById("usedLetters");
        container.innerHTML = "";
        for (let i = 0; i < this.guessed.length; i++) {
            let span = document.createElement("span");
            span.innerHTML = this.guessed[i].toUpperCase();
            container.appendChild(span);
        }
    },
    
    showRemaining: function() {
        let left = this.maxWrong - this.wrongGuesses;
        document.getElementById("remaining").innerHTML = left;
    },
    
    clearMsg: function() {
        let msgDiv = document.getElementById("gameMessage");
        msgDiv.innerHTML = "";
        msgDiv.className = "";
    },
    
    winGame: function() {
        let msgDiv = document.getElementById("gameMessage");
        msgDiv.innerHTML = "YOU WIN! The word was " + this.currentWord.toUpperCase();
        msgDiv.className = "win";
        this.gameLive = false;
        document.getElementById("letterInput").disabled = true;
        document.getElementById("guessBtn").disabled = true;
    },
    
    loseGame: function() {
        let msgDiv = document.getElementById("gameMessage");
        msgDiv.innerHTML = "GAME OVER! The word was " + this.currentWord.toUpperCase();
        msgDiv.className = "lose";
        this.gameLive = false;
        document.getElementById("letterInput").disabled = true;
        document.getElementById("guessBtn").disabled = true;
    },
    
    checkWin: function() {
        let allFound = true;
        for (let i = 0; i < this.currentWord.length; i++) {
            if (!this.guessed.includes(this.currentWord[i])) {
                allFound = false;
                break;
            }
        }
        if (allFound && this.gameLive) {
            this.winGame();
            return true;
        }
        return false;
    },
    
    checkLose: function() {
        if (this.wrongGuesses >= this.maxWrong && this.gameLive) {
            this.loseGame();
            return true;
        }
        return false;
    },
    
    processLetter: function(letter) {
        if (!this.gameLive) {
            return;
        }
        
        if (!letter || letter.length !== 1 || !letter.match(/[a-z]/i)) {
            this.showTemp("Type a single letter");
            return;
        }
        
        letter = letter.toLowerCase();
        
        if (this.guessed.includes(letter)) {
            this.showTemp("You already tried " + letter);
            return;
        }
        
        this.guessed.push(letter);
        this.showUsed();
        
        if (this.currentWord.includes(letter)) {
            this.showWord();
            this.showTemp(letter + " is correct!");
            this.checkWin();
        } else {
            this.wrongGuesses++;
            this.showImage();
            this.showRemaining();
            this.showTemp(letter + " is wrong");
            this.checkLose();
        }
        
        document.getElementById("letterInput").value = "";
        document.getElementById("letterInput").focus();
    },
    
    showTemp: function(msg) {
        let tempDiv = document.getElementById("tempMsg");
        if (!tempDiv) {
            tempDiv = document.createElement("div");
            tempDiv.id = "tempMsg";
            tempDiv.className = "tempMsg";
            document.querySelector(".guess-box").after(tempDiv);
        }
        tempDiv.innerHTML = msg;
        tempDiv.style.opacity = "1";
        
        setTimeout(function() {
            tempDiv.style.opacity = "0";
            setTimeout(function() {
                if (tempDiv.innerHTML === msg) {
                    tempDiv.innerHTML = "";
                }
            }, 400);
        }, 1400);
    }
};

function doGuess() {
    let input = document.getElementById("letterInput");
    hangman.processLetter(input.value);
}

function doReset() {
    hangman.startGame();
}

document.addEventListener("DOMContentLoaded", function() {
    hangman.loadData();
    document.getElementById("guessBtn").addEventListener("click", doGuess);
    document.getElementById("resetBtn").addEventListener("click", doReset);
    document.getElementById("letterInput").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            doGuess();
        }
    });
});