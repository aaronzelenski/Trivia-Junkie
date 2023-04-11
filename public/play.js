(function(){
    // Functions
    function buildQuiz(){
      // variable to store the HTML output
      const output = [];
  
      // for each question...
      myQuestions.forEach(
        (currentQuestion, questionNumber) => {
  
          // variable to store the list of possible answers
          const answers = [];
  
          // and for each available answer...
          for(letter in currentQuestion.answers){
  
            // ...add an HTML radio button
            answers.push(
              `<label>
                <input type="radio" name="question${questionNumber}" value="${letter}">
                ${letter} :
                ${currentQuestion.answers[letter]}
              </label>`
            );
          }
  
          // add this question and its answers to the output
          output.push(
            `<div class="slide">
              <div class="question"> ${currentQuestion.question} </div>
              <div class="answers"> ${answers.join("")} </div>
            </div>`
          );
        }
      );
  
      // finally combine our output list into one string of HTML and put it on the page
      quizContainer.innerHTML = output.join('');

      slides = document.querySelectorAll(".slide");
      currentSlide = 0;

      showSlide(currentSlide);
    }
  
    function showResults(){
  
      // gather answer containers from our quiz
      const answerContainers = quizContainer.querySelectorAll('.answers');
      let isCorrect;
  
      myQuestions.forEach( (currentQuestion, questionNumber) => {
  
        const answerContainer = answerContainers[questionNumber];
        const selector = `input[name=question${questionNumber}]:checked`;
        const userAnswer = (answerContainer.querySelector(selector) || {}).value;
  
        if(userAnswer === currentQuestion.correctAnswer){
          answerContainers[questionNumber].style.color = 'lightgreen';
          isCorrect = true;
        }
        else{
          answerContainers[questionNumber].style.color = 'red';
          isCorrect = false;
        }
      });

      return isCorrect;
    }

    // function saveScore(score) {
    //   const userName = this.getPlayerName();
    //   let scores = [];
    //   const scoresText = localStorage.getItem('scores');
    //   if (scoresText) {
    //     scores = JSON.parse(scoresText);
    //   }
    //   scores = updateScores(userName, score, scores);
  
    //   localStorage.setItem('scores', JSON.stringify(scores));
    // }

    // function updateScores(userName, score, scores) {
    //   const date = new Date().toLocaleDateString();
    //   const newScore = { name: userName, score: score, date: date };
  
    //   let found = false;
    //   for (const [i, prevScore] of scores.entries()) {
    //     if (score > prevScore.score) {
    //       scores.splice(i, 0, newScore);
    //       found = true;
    //       break;
    //     }
    //   }
  
    //   if (!found) {
    //     scores.push(newScore);
    //   }
  
    //   if (scores.length > 10) {
    //     scores.length = 10;
    //   }
  
    //   return scores;
    // }

    // updateScore(*numCorrect) {
    //   const scoreEl = document.querySelector('#score');
    //   scoreEl.textContent = score;
    // }
  
    function showSlide(n) {
      slides[currentSlide].classList.remove('active-slide');
      slides[n].classList.add('active-slide');
      currentSlide = n;
      
      submitButton.style.display = 'inline-block';
    }

    // async function playGame() {

    //   let correct = true;
    //   let score = 0;
      
    //   while (correct) {

    //     await waitUserInput();
    //     correct = showResults();

    //     if (correct) {
    //       score += 1;
    //       //change submit button text
          
    //       await waitUserInput();
    //       getNewQuestion();
    //       //change submit button text back
    //     }
    //     else {
    //       saveScore(score);
    //       //change button to Play again
    //       await waitUserInput();
    //       location.reload();
    //     }

    //   }
    // }

    // async function waitUserInput() {
    //   while (next === false) await timeout(50); // pause script but avoid browser to freeze ;)
    //   next = false;
    // }

    function getPlayerName() {
      return localStorage.getItem('userName') ?? 'Mystery player';
    }

    async function saveScore(score) {
      const userName = getPlayerName();
      const date = new Date().toLocaleDateString();
      const newScore = { name: userName, score: score, date: date };

      try {
        const response = await fetch('/api/score', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(newScore),
        });

        // Store what the service gave us as the high scores
        const scores = await response.json();
        localStorage.setItem('scores', JSON.stringify(scores));
      } catch {
        // If there was an error then just track scores locally
        updateScoresLocal(newScore);
      }
    }

    function updateScoresLocal(newScore) {
      let scores = [];
      const scoresText = localStorage.getItem('scores');
      if (scoresText) {
        scores = JSON.parse(scoresText);
      }

      let found = false;
      for (const [i, prevScore] of scores.entries()) {
        if (newScore > prevScore.score) {
          scores.splice(i, 0, newScore);
          found = true;
          break;
        }
      }

      if (!found) {
        scores.push(newScore);
      }

      if (scores.length > 10) {
        scores.length = 10;
      }

      localStorage.setItem('scores', JSON.stringify(scores));
    }


    function getNewQuestion() {

      callService("https://opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=multiple", questionBuilder);
    
    }
    
    function callService(url, displayCallback) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          displayCallback(data);
        });
    }

    function questionBuilder(data){

      let correctAnswer = "";
      let question = "";
      let incorrectAnswer = [];
    
      
      question = data.results[0].question;
    
      correctAnswer = data.results[0].correct_answer;
    
      for(let i = 0; i < 3; i++){
        incorrectAnswer.push(data.results[0].incorrect_answers[i])
      }
    
      console.log(question);
      console.log(correctAnswer);
      console.log(incorrectAnswer);
    
      myQuestions.pop();
      myQuestions.push({
        question: question.toString(),
        answers: {
          a: correctAnswer.toString(),
          b: incorrectAnswer[0].toString(),
          c: incorrectAnswer[1].toString(),
          d: incorrectAnswer[2].toString()
        },
        correctAnswer: "a"
      })
      buildQuiz();
      return;
    }

    function gameTest() {
      if (n === 1) {
        correct = showResults();
        if (correct) {
          n = 2;
          score += 1;
          document.querySelector('#submit').textContent = 'Next Question'
          document.querySelector('#score').textContent = "Score: " + score

        }
        else {
          saveScore(score);
          n = 3;
          document.querySelector('#submit').textContent = 'Play Again'
        }
      }
      else if (n === 2) {
        getNewQuestion();
        document.querySelector('#submit').textContent = 'Submit'
        n = 1;
      }
      else {
        location.reload();
      }
    }
  
    // Variables
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit');
    const myQuestions = [];
    // const timeout = async ms => new Promise(res => setTimeout(res, ms));
    // this is to be changed on user input
    let n = 1;
    let correct = true;
    let score = 0;
    let slides;
    let currentSlide;
      

    // $('#submit').click(() => next = true);
    getNewQuestion();

    submitButton.addEventListener("click", gameTest);
  
    // while (correct) {
    //   const slides = document.querySelectorAll(".slide");
    //   let currentSlide = 0;
  
      
    //   showSlide(currentSlide);
  
    
      
    // previousButton.addEventListener("click", showPreviousSlide);
    // nextButton.addEventListener("click", showNextSlide);
  })();
