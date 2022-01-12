// Create an array of objects containing the questions, possible answers, and correct answer.
var questionArray = [
    {
        question: "question1",
        options: {
            1: "a",
            2: "b",
            3: "c",
            4: "d"
        },
        correct: 4
    },
    {
        question: "question2",
        options: {
            1: "a",
            2: "b",
            3: "c",
            4: "d"
        },
        correct: 4
    },
    {
        question: "question3",
        options: {
            1: "a",
            2: "b",
            3: "c",
            4: "d"
        },
        correct: 4
    }
]
// #region VARIABLES
// Pull the quiz section div in
var quizSection = document.getElementById('quiz');
// Pull the time remaining span in
var timeSpan = document.getElementById('timeRemaining');
// create a global variable to pass the correct answer between questions.
var correct
// Create some tracking variables for the quiz
var correctAnswers = 0;
var incorrectAnswers = 0;
// Create a timing tracker for the quiz
var timeRemaining = questionArray.length*5;
var timerID;
// #endregion

// Generate an array keeping track of the index numbers of unasked questions
var unaskedQuestionIndexes = [];
for (var i = 0; i < questionArray.length; i++) {
    unaskedQuestionIndexes.push(i);
}
function createElement({element = '', id = '', content, value, type, cssClass}) {
    var newElement = document.createElement(element);
    newElement.id = id;
    newElement.textContent = content;
    if (element==='input') {
        newElement.value = null;
    } else {
        newElement.value = value;
    }
    newElement.type = type;
    newElement.classList.add(cssClass);
    return newElement;
}
// Function to generate welcome screen
function generateWelcomeScreen() {
    var quizTitle = createElement({element: 'h2', id: 'quizTitle', content: 'Coding Quiz Challenge!'});
    var quizInstructions = createElement({element:'p', id: 'quizInstructions', content: "Test your skills with this coding quiz! Answer all of the questions in the time limit. \n Be careful though! Wrong answers will remove time!"});
    var quizButton = createElement({element: 'button', id: 'quizButton', content: 'Start Quiz'});
    quizSection.replaceChildren(quizTitle, quizInstructions, quizButton);
    timeSpan.textContent = 'Time: '+timeRemaining+'s';
}
// Function to dyamically generate the quiz elements
function generateQuizElements() {
    // generate a question and option elements
    var question = createElement({element: 'h3', id: 'question'});
    var option1 = createElement({element: 'button', id: 'option1', value: 1, cssClass: 'quizButton'});
    var option2 = createElement({element: 'button', id: 'option2', value: 2, cssClass: 'quizButton'});
    var option3 = createElement({element: 'button', id: 'option3', value: 3, cssClass: 'quizButton'});
    var option4 = createElement({element: 'button', id: 'option4', value: 4, cssClass: 'quizButton'});
    quizSection.replaceChildren(question, option1, option2, option3, option4);
}
// Function to populate random quiz questions and options
function populateQuizQuestion() {
    // get random index to select the question to populate
    var randomIndex = Math.floor(Math.random()*unaskedQuestionIndexes.length);
    // Use the randomly generated index to select a question index from the unused question array
    var questionIndex = unaskedQuestionIndexes[randomIndex];
    // Remove the question index from the available indexes list
    unaskedQuestionIndexes.splice(randomIndex, 1);
    // Populate the elements with content from the randomly selected question object
    question.textContent = questionArray[questionIndex].question;
    option1.textContent = questionArray[questionIndex].options[1];
    option2.textContent = questionArray[questionIndex].options[2];
    option3.textContent = questionArray[questionIndex].options[3];
    option4.textContent = questionArray[questionIndex].options[4];
    // get the correct answer for the generated question
    correct = questionArray[questionIndex].correct;
}
// Function to check the selected answer against the stored correct answer
function checkCorrectAnswer(answer) {
    if (answer == correct) {
        correctAnswers++;
    } else {
        incorrectAnswers++;
        if (timeRemaining >=5) {
            timeRemaining -= 5;
        } else {
            clearInterval(timerID);
            generateResults();
        }
    }
}
// Function to calculate the results of the quiz
function generateResults() {
    var finalScore = (Math.round(100*correctAnswers/questionArray.length));
    var doneMessage = createElement({element: 'h3', id: 'doneMessage', content: 'All Done!'});
    var scoreMessage = createElement({element: 'p', id: 'scoreMessage', content: 'You final score is: ' + finalScore});
    var initialsMessage = createElement({element: 'span', id: 'initialsMessage', content: 'Enter your initials here: '});
    var enterInitials = createElement({element: 'input', id: 'enterInitials', type: 'input'});
    var submitButton = createElement({element: 'button', id: 'submitButton', content: 'Submit', value: finalScore});
    quizSection.replaceChildren(doneMessage, scoreMessage, initialsMessage, enterInitials, submitButton);
}
// Function to run object value comparisons for the leaderboard
function compareScores(a, b) {
    const score1 = parseInt(a[Object.keys(a)[0]], 10);
    const score2 = parseInt(b[Object.keys(b)[0]], 10);
    let comparison = 0;
    if(score1 > score2) {
        comparison = -1;
    } else if (score1 < score2) {
        comparison = 1;
    }
    return comparison;
}
// Functon to generate the leader board
function generateLeaderBoard(score, initials) {
    console.log(initials);
    // empty the quiz section
    quizSection.replaceChildren();
    localStorage.setItem('leaderboard', '[{"SX": "100"},{"YR": "60"},{"TV": "180"}]');
    // set the new leaderboard item
    if (localStorage.getItem('leaderboard')) {
        
        var leaderBoardList = JSON.parse(localStorage.getItem('leaderboard'));
        leaderBoardList.push({initials: score});
        // sort the leaderboard list
        leaderBoardList.sort(compareScores);
    }
    var elementList = [];
    for (var i = 0; i < leaderBoardList.length; i++) {
        var leaderScore = createElement({element: 'p', content: Object.keys(leaderBoardList[i]) + ':   ' + leaderBoardList[i][Object.keys(leaderBoardList[i])]});
        elementList.push(leaderScore);
    }
    for (var i = 0; i < elementList.length; i++) {
        quizSection.appendChild(elementList[i]);
    }
}
// Function to perform actions inside the quiz countdown timer
function quizTimer() {
    if (timeRemaining > 0) {
        timeRemaining--;
        timeSpan.textContent = 'Time: '+timeRemaining+'s';
    } else {
        clearInterval(timerID);
        generateResults();
    }
}
// Generate the welcome screen
generateWelcomeScreen();
// add a delegated event listener for dynamically created buttons
document.addEventListener('click', function(e) {
    // check for quiz option button clicks
    if (e.target.id=='option1' || e.target.id=='option2' || e.target.id=='option3' || e.target.id=='option4') {
        checkCorrectAnswer(e.target.value);
        if ( unaskedQuestionIndexes.length > 0) {
            populateQuizQuestion();
        } else {
            clearInterval(timerID);
            generateResults();
        }
    } 
    // check for start quiz button click
    else if (e.target.id=='quizButton') {
        generateQuizElements();
        populateQuizQuestion();
        timerID = setInterval(quizTimer, 1000);
    } 
    // check for high score submit button click
    else if (e.target.id =='submitButton') {
        if (enterInitials.value.match("[a-zA-Z]+")) {
            generateLeaderBoard(e.target.value, enterInitials.value)
        } else if (enterInitials.value) {
            if (!document.getElementById('errorMessage')) {
                var errorMessage = createElement({element: 'p', id: 'errorMessage', content: 'Please only use letters for your initials.', cssClass: 'errorMessage'});
                initialsMessage.prepend(errorMessage);
            } else {
                document.getElementById('errorMessage').textContent = 'Please only use letters for your initials.';
            }
        } else if (!document.getElementById('errorMessage')) {
            var errorMessage = createElement({element: 'p', id: 'errorMessage', content: 'Please input your initials.', cssClass: 'errorMessage'});
            initialsMessage.prepend(errorMessage);
        } else {
            document.getElementById('errorMessage') = 'Please input your initials.';
        }
    }
})