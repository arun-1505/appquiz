// Quiz data
const quizData = [
  {
    question: "What is the correct way to declare a variable in JavaScript?",
    answers: [
      "var myVariable;",
      "variable myVariable;",
      "v myVariable;",
      "declare myVariable;"
    ],
    correct: 0,
    explanation: "The 'var' keyword is used to declare variables in JavaScript. You can also use 'let' or 'const' in modern JavaScript."
  },
  {
    question: "Which method is used to add an element to the end of an array?",
    answers: ["append()", "push()", "add()", "insert()"],
    correct: 1,
    explanation: "The push() method adds one or more elements to the end of an array and returns the new length of the array."
  },
  {
    question: "What does '===' operator do in JavaScript?",
    answers: [
      "Assigns a value",
      "Compares values only",
      "Compares both value and type",
      "Compares type only"
    ],
    correct: 2,
    explanation: "The '===' operator performs strict equality comparison, checking both value and type without type coercion."
  },
  {
    question: "Which of the following is NOT a JavaScript data type?",
    answers: ["String", "Boolean", "Float", "Number"],
    correct: 2,
    explanation: "JavaScript doesn't have a specific 'Float' data type. Numbers in JavaScript are all of type 'Number', whether they're integers or floating-point."
  },
  {
    question: "What is the output of: console.log(typeof null)?",
    answers: ["null", "undefined", "object", "boolean"],
    correct: 2,
    explanation: "This is a well-known quirk in JavaScript. typeof null returns 'object', which is considered a bug but has been kept for backward compatibility."
  },
  {
    question: "Which method is used to remove the last element from an array?",
    answers: ["pop()", "remove()", "delete()", "splice()"],
    correct: 0,
    explanation: "The pop() method removes the last element from an array and returns that element."
  },
  {
    question: "What is a closure in JavaScript?",
    answers: [
      "A way to close the browser",
      "A function that has access to variables in its outer scope",
      "A method to end a loop",
      "A way to close a file"
    ],
    correct: 1,
    explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned."
  },
  {
    question: "Which keyword is used to create a constant in JavaScript?",
    answers: ["constant", "const", "final", "static"],
    correct: 1,
    explanation: "The 'const' keyword is used to declare constants in JavaScript. Once assigned, the value cannot be reassigned."
  },
  {
    question: "What does the 'this' keyword refer to in JavaScript?",
    answers: [
      "The current function",
      "The global object",
      "The object that owns the code",
      "The previous object"
    ],
    correct: 2,
    explanation: "The 'this' keyword refers to the object that owns the code. Its value depends on how and where it's called."
  },
  {
    question: "Which method converts a JSON string into a JavaScript object?",
    answers: ["JSON.stringify()", "JSON.parse()", "JSON.convert()", "JSON.object()"],
    correct: 1,
    explanation: "JSON.parse() converts a JSON string into a JavaScript object. JSON.stringify() does the opposite."
  }
];

// Quiz state
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let quizStarted = false;

// DOM elements
const startScreen = document.getElementById('startScreen');
const quizContent = document.getElementById('quizContent');
const quizControls = document.getElementById('quizControls');
const results = document.getElementById('results');
const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const feedbackElement = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const questionCounter = document.getElementById('questionCounter');
const progressBar = document.getElementById('progressBar');
const totalQuestionsElement = document.getElementById('totalQuestions');

// Initialize quiz
function initQuiz() {
  totalQuestionsElement.textContent = quizData.length;
  updateProgress();
}

// Start quiz
function startQuiz() {
  quizStarted = true;
  startScreen.classList.add('hidden');
  quizContent.classList.remove('hidden');
  quizControls.classList.remove('hidden');
  loadQuestion();
}

// Load current question
function loadQuestion() {
  const question = quizData[currentQuestion];
  selectedAnswer = null;
  
  questionCounter.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
  updateProgress();
  
  questionElement.textContent = question.question;
  answersElement.innerHTML = '';
  feedbackElement.classList.remove('show');
  nextBtn.disabled = true;
  
  question.answers.forEach((answer, index) => {
    const answerElement = document.createElement('div');
    answerElement.className = 'answer';
    answerElement.textContent = answer;
    answerElement.onclick = () => selectAnswer(index);
    answersElement.appendChild(answerElement);
  });
}

// Select an answer
function selectAnswer(answerIndex) {
  if (selectedAnswer !== null) return; 
  
  selectedAnswer = answerIndex;
  const question = quizData[currentQuestion];
  const answerElements = document.querySelectorAll('.answer');
  
  answerElements.forEach(el => el.classList.add('disabled'));
  answerElements[answerIndex].classList.add('selected');
  
  setTimeout(() => {
    answerElements[question.correct].classList.add('correct');
    
    if (answerIndex !== question.correct) {
      answerElements[answerIndex].classList.add('incorrect');
    }
    
    showFeedback(answerIndex === question.correct, question.explanation);
    
    if (answerIndex === question.correct) {
      score++;
    }
    
    nextBtn.disabled = false;
    
  }, 300);
}

// Show feedback
function showFeedback(isCorrect, explanation) {
  feedbackElement.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
  feedbackElement.innerHTML = `
    <strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect!'}</strong><br>
    ${explanation}
  `;
  
  setTimeout(() => {
    feedbackElement.classList.add('show');
  }, 100);
}

// Next question
function nextQuestion() {
  currentQuestion++;
  
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

// Update progress bar
function updateProgress() {
  const progress = (currentQuestion / quizData.length) * 100;
  progressBar.style.width = `${progress}%`;
}

// Show results
function showResults() {
  quizContent.classList.add('hidden');
  quizControls.classList.add('hidden');
  results.classList.remove('hidden');
  
  progressBar.style.width = '100%';
  const percentage = Math.round((score / quizData.length) * 100);
  
  document.getElementById('scoreCircle').textContent = `${score}/${quizData.length}`;
  document.getElementById('scoreText').textContent = `Your Score: ${score} out of ${quizData.length} (${percentage}%)`;
  
  const performanceMessage = document.getElementById('performanceMessage');
  let message = '';
  let messageClass = '';
  
  if (percentage >= 90) {
    message = '🎉 Excellent! You have a strong understanding of JavaScript!';
    messageClass = 'excellent';
  } else if (percentage >= 70) {
    message = '👍 Good job! You have a solid grasp of JavaScript fundamentals.';
    messageClass = 'good';
  } else if (percentage >= 50) {
    message = '📚 Not bad! Keep studying to improve your JavaScript skills.';
    messageClass = 'average';
  } else {
    message = '💪 Keep learning! Practice more to strengthen your JavaScript knowledge.';
    messageClass = 'poor';
  }
  
  performanceMessage.textContent = message;
  performanceMessage.className = `performance-message ${messageClass}`;
}

// Restart quiz
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  selectedAnswer = null;
  quizStarted = false;
  
  results.classList.add('hidden');
  startScreen.classList.remove('hidden');
  progressBar.style.width = '0%';
}

// Initialize on load
initQuiz();
