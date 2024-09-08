document.addEventListener('DOMContentLoaded', () => {
    const startQuizButton = document.getElementById('start-quiz');
    const introContainer = document.getElementById('intro');
    const quizContainer = document.getElementById('quiz');
    const resultsModal = document.getElementById('results');
    const resultsText = document.getElementById('results-text');
    const playAgainButton = document.getElementById('play-again');
    const timerElement = document.getElementById('timer');
    const questionNumberElement = document.getElementById('question-number');
    const questionTextElement = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const submitButton = document.getElementById('submit');
    const answeredStatus = document.getElementById('answered-status');
    const notAnsweredStatus = document.getElementById('not-answered-status');
    const markedStatus = document.getElementById('marked-status');
    const questionNumbersContainer = document.getElementById('question-numbers');
    const timerDuration = 10 * 60;

    const questionData = [
        { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correct: "4" },
        { question: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], correct: "Paris" },
        { question: "What is the boiling point of water?", options: ["90°C", "100°C", "110°C", "120°C"], correct: "100°C" },
        { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Apparatus"], correct: "Mitochondria" },
        { question: "What is the largest planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], correct: "Jupiter" },
        { question: "What is the smallest prime number?", options: ["0", "1", "2", "3"], correct: "2" },
        { question: "What is the square root of 16?", options: ["2", "4", "8", "16"], correct: "4" },
        { question: "What is the currency of the United States?", options: ["Euro", "Dollar", "Pound", "Yen"], correct: "Dollar" },
        { question: "What is the largest ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: "Pacific" },
        { question: "What is the chemical symbol for water?", options: ["H2", "O2", "H2O", "HO"], correct: "H2O" }
    ];

    let currentQuestion = 1;
    let answers = {};

    function updateQuestion(questionIndex) {
        currentQuestion = questionIndex;
        const question = questionData[questionIndex - 1];
        questionNumberElement.textContent = `Question No: ${questionIndex}`;
        questionTextElement.textContent = question.question;
        optionsContainer.innerHTML = '';
        question.options.forEach(option => {
            const optionElement = document.createElement('label');
            optionElement.className = 'option';
            optionElement.innerHTML = `<input type="radio" name="answer" value="${option}"> ${option}`;
            if (answers[questionIndex] && answers[questionIndex].answer === option) {
                optionElement.querySelector('input').checked = true;
            }
            optionsContainer.appendChild(optionElement);
        });
    }

    function updateSidebar() {
        const answeredCount = Object.keys(answers).length;
        const notAnsweredCount = questionData.length - answeredCount;
        const markedCount = Object.values(answers).filter(answer => answer.marked).length;
        answeredStatus.textContent = `${answeredCount} Answered`;
        notAnsweredStatus.textContent = `${notAnsweredCount} Not Answered`;
        markedStatus.textContent = `${markedCount} Marked for Review`;
        questionNumbersContainer.innerHTML = '';
        questionData.forEach((_, index) => {
            const questionNumberElement = document.createElement('div');
            questionNumberElement.className = 'question-number';
            questionNumberElement.textContent = index + 1;
            if (answers[index + 1]) {
                questionNumberElement.classList.add(answers[index + 1].marked ? 'marked' : 'answered');
            }
            questionNumberElement.addEventListener('click', () => {
                updateQuestion(index + 1);
            });
            questionNumbersContainer.appendChild(questionNumberElement);
        });
    }

    function startTimer(duration, display) {
        let timer = duration, minutes, seconds;
        const interval = setInterval(() => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = `Time Left: ${minutes}:${seconds}`;

            if (--timer < 0) {
                clearInterval(interval);
                submitQuiz();
            }
        }, 1000);
    }

    function submitQuiz() {
        quizContainer.style.display = 'none';
        resultsModal.style.display = 'block';
        let score = 0;
        questionData.forEach((question, index) => {
            if (answers[index + 1] && answers[index + 1].answer === question.correct) {
                score++;
            }
        });
        resultsText.textContent = `You scored ${score} out of ${questionData.length}`;
    }

    startQuizButton.addEventListener('click', () => {
        introContainer.style.display = 'none';
        quizContainer.style.display = 'flex';
        updateQuestion(1);
        updateSidebar();
        startTimer(timerDuration, timerElement);
    });

    prevButton.addEventListener('click', () => {
        if (currentQuestion > 1) {
            updateQuestion(currentQuestion - 1);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentQuestion < questionData.length) {
            updateQuestion(currentQuestion + 1);
        }
    });

    submitButton.addEventListener('click', submitQuiz);

    optionsContainer.addEventListener('change', (event) => {
        const selectedOption = event.target.value;
        answers[currentQuestion] = { answer: selectedOption, marked: false };
        updateSidebar();
    });

    playAgainButton.addEventListener('click', () => {
        resultsModal.style.display = 'none';
        introContainer.style.display = 'block';
        answers = {};
        updateSidebar();
    });
});
