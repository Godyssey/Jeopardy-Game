// Game Logic for Jeopardy Game
//INITIALIZE THE GAME BOARD ON PAGE LOAD
function PlayGame(){
    initCatRow()
    initBoard()
}

document.querySelector('#play').addEventListener('click',buildCategories)
document.querySelector('#play-agn').addEventListener('click',buildCategories)

//BUTTON VARIABLES
const registering = document.querySelector('.registering');
const play = document.querySelector('.play');
const quit = document.querySelector('.quit');
const again = document.querySelector('.play-agn');
const results = document.querySelector('.results');

//CREATE CATEGORY ROW
function initCatRow() {
    let catRow = document.getElementById('category-row')
    for (let i=0; i<5; i++) {
        let box = document.createElement('div')
        box.className = 'clue-box category-box'
        catRow.appendChild(box)
    }
}
//CREATE CLUE BOARD
function initBoard() {
    let board = document.getElementById('clue-board')
    //GENERATE 5 ROWS, THEN PLACE 5 BOXES IN EACH ROW
    for (let i = 0; i < 5; i++) {
        let row = document.createElement('div')
        let boxValue = 100 * (i + 1)
        row.className = 'clue-row'
        for (let j=0; j<5; j++) {
            let box = document.createElement('div')
            box.className = 'clue-box'
            box.textContent = '$' + boxValue
            //box.appendChild( document.createTextNode(boxValue) ) //backwards compatible
            box.addEventListener('click',getClue, false)
            row.appendChild(box)
        }
        board.appendChild(row)
    }
}
//CALL API
function randInt() {
    return Math.floor(Math.random() * (18418) + 1)
}
let catArray = []
function buildCategories () {
    if(!(document.getElementById('category-row').firstChild.innerText == '')) {
        resetBoard()
    }
    const fetchReq1 = fetch(
        `https://jservice.io/api/category?&id=${randInt()}`
    ).then((res) => res.json());
    const fetchReq2 = fetch(
        `https://jservice.io/api/category?&id=${randInt()}`
    ).then((res) => res.json());
    const fetchReq3 = fetch(
        `https://jservice.io/api/category?&id=${randInt()}`
    ).then((res) => res.json());
    const fetchReq4 = fetch(
        `https://jservice.io/api/category?&id=${randInt()}`
    ).then((res) => res.json());
    const fetchReq5 = fetch(
        `https://jservice.io/api/category?&id=${randInt()}`
    ).then((res) => res.json());
    const allData = Promise.all([fetchReq1,fetchReq2,fetchReq3,fetchReq4,fetchReq5])
    allData.then((res) => {
        console.log(res)
        catArray = res
        setCategories(catArray)
    })
}
//RESET BOARD AND $$ AMOUNT IF NEEDED
function resetBoard() {
    let clueParent = document.getElementById('clue-board')
    while (clueParent.firstChild) {
        clueParent.removeChild(clueParent.firstChild)
    }
    let catParent = document.getElementById('category-row')
    while (catParent.firstChild) {
        catParent.removeChild(catParent.firstChild)
    }
    document.getElementById('score').innerText = 0
    initBoard()
    initCatRow()
}
//LOAD CATEGORIES TO THE BOARD
function setCategories (catArray) {
    let element = document.getElementById('category-row')
        let children = element.children;
        for(let i=0; i<children.length; i++) {
            children[i].innerHTML = catArray[i].title
        }
}
//FIGURE OUT WHICH ITEM WAS CLICKED
function getClue (event) {
    let child = event.currentTarget
    child.classList.add('clicked-box')
    let boxValue = child.innerHTML.slice(1)
    let parent = child.parentNode
    let index = Array.prototype.findIndex.call(parent.children, (c) => c === child)
    let cluesList = catArray[index].clues
    let clue = cluesList.find(obj => {
        return obj.value == boxValue
    })
    console.log(clue)
    showQuestion(clue, child, boxValue)
}
//SHOW QUESTION TO USER AND GET THEIR ANSWER!
function showQuestion(clue, target, boxValue) {
    let userAnswer = prompt(clue.question).toLowerCase()
    let correctAnswer = clue.answer.toLowerCase().replace(/<\/?[^>]+(>|$)/g, "")
    let possiblePoints = +(boxValue)
    target.innerHTML = clue.answer
    target.removeEventListener('click',getClue,false)
    checkAnswer(userAnswer, correctAnswer, possiblePoints)
    showAll()
}
// EVALUATE ANSWER AND SHOW TO USER TO CONFIRM
function checkAnswer(userAnswer, correctAnswer, possiblePoints) {
    let evaluateAnswer = (userAnswer == correctAnswer) ? 'correct' : 'incorrect'
    let confirmAnswer = 
    confirm(`For $${possiblePoints}, you answered "${userAnswer}", and the correct answer was "${correctAnswer}". Your answer appears to be ${evaluateAnswer}. Click OK to accept or click Cancel if the answer was not properly evaluated.`)
    awardPoints(evaluateAnswer, confirmAnswer, possiblePoints)
}

//RIGHT / WRONG Variables
var wrongAnswer = 0
var rightAnswer = 0
var totalQuestions = 0

// AWARD POINTS
function awardPoints(evaluateAnswer, confirmAnswer, possiblePoints) {
    if (!(evaluateAnswer == 'incorrect' && confirmAnswer == true)) {
        let target = document.getElementById('score')
        let currentScore = +(target.innerText)
        currentScore += possiblePoints
        target.innerText = currentScore
        rightAnswer += 1
    } else {
        currentScore -= possiblePoints
        target.innerText = currentScore
        wrongAnswer += 1
    }
    totalQuestions += 1
}

//FIND PERCENTAGE SCORE
function findPercentageScore() {
    PlayersData[0].push(" " + totalQuestions + " " + rightAnswer + " " + wrongAnswer);

    var today = new Date();
    var day = String(today.getDate());
    var month = String(today.getMonth() + 1);
    var year = String(today.getFullYear());

    PlayersData[0].push(" " + day + "/" + month + "/" + year);
    var percentageScore = (rightAnswer / totalQuestions) * 100;
    PlayersData[0].push(" "  + percentageScore + "%");
    document.getElementById("showpercentage").innerHTML = PlayersData[0];
}

//SHOW ALL PLAYERS
function showAll() {
    document.getElementById("showallplayers").value = '';
    document.getElementById("showallplayers").innerHTML = PlayersData;
}

//ENABLE BUTTONS
const enableDisable = () => {
    registering.disabled = false;
    document.getElementById("fname").disabled = false;
    document.getElementById("lname").disabled = false;
    document.getElementById("gender").disabled = false;
    document.getElementById("dob").disabled = false;
    document.getElementById("email").disabled = false;
    document.getElementById("street").disabled = false;
    document.getElementById("city").disabled = false;
    document.getElementById("town").disabled = false;
    document.getElementById("country").disabled = false;
    document.getElementById("education").disabled = false;
    document.getElementById("image").disabled = false;
    play.disabled = true;
    quit.disabled = true;
    again.disabled = true;
    results.disabled = true;
};

