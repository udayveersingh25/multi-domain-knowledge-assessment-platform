/*
  Author: Udayveer Singh
  Project: Multi-Domain Knowledge Assessment Platform
  Course: Web Dev II Final Project
  Version: 1.0
  Notes:
  - Built without frameworks to demonstrate core DOM and JavaScript skills.
  - Focused on clarity and modular structure over micro-optimizations.
*/
/* ====================================================
   MULTI-DOMAIN KNOWLEDGE ASSESSMENT PLATFORM
   Pure Vanilla JavaScript Implementation
   
   Architecture Layers:
   1. Data Layer - Question bank
   2. State Management - Client-side state
   3. DOM Manipulation - Dynamic UI rendering
   4. Event Handling - User interactions
   5. Persistence Layer - LocalStorage operations
   ==================================================== */

/* 
  Changelog:
  v1.0 - Initial quiz platform with multi-topic support and leaderboard
  v1.1 - Added timer, keyboard shortcuts, and dark mode
  v1.2 - Leaderboard preview on home screen and ranking by score
*/

// ====================================================
// DATA LAYER: QUIZ QUESTION BANK
// ====================================================

const quizzes = {
    science: [
        {
            question: "What is the chemical symbol for gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            answer: 2
        },
        {
            question: "What is the speed of light in vacuum?",
            options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "200,000 km/s"],
            answer: 0
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Jupiter", "Mars", "Saturn"],
            answer: 2
        },
        {
            question: "What is the most abundant gas in Earth's atmosphere?",
            options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
            answer: 2
        },
        {
            question: "What is the powerhouse of the cell?",
            options: ["Nucleus", "Ribosome", "Mitochondria", "Endoplasmic Reticulum"],
            answer: 2
        },
        {
            question: "What is the hardest natural substance on Earth?",
            options: ["Gold", "Iron", "Diamond", "Platinum"],
            answer: 2
        },
        {
            question: "How many bones are in the adult human body?",
            options: ["186", "206", "226", "246"],
            answer: 1
        }
    ],
    technology: [
        {
            question: "What does CPU stand for?",
            options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Computer Processing Unit"],
            answer: 0
        },
        {
            question: "Who is known as the father of computers?",
            options: ["Alan Turing", "Charles Babbage", "Steve Jobs", "Bill Gates"],
            answer: 1
        },
        {
            question: "What does HTML stand for?",
            options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
            answer: 0
        },
        {
            question: "In what year was the first iPhone released?",
            options: ["2005", "2007", "2008", "2010"],
            answer: 1
        },
        {
            question: "What does HTTP stand for?",
            options: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "HyperText Transmission Protocol", "Home Text Transfer Protocol"],
            answer: 0
        },
        {
            question: "Which company developed the Java programming language?",
            options: ["Microsoft", "Apple", "Sun Microsystems", "IBM"],
            answer: 2
        },
        {
            question: "What is the binary equivalent of decimal number 10?",
            options: ["1010", "1100", "1001", "1110"],
            answer: 0
        }
    ],
    movies: [
        {
            question: "Who directed the movie 'Inception'?",
            options: ["Steven Spielberg", "Christopher Nolan", "James Cameron", "Quentin Tarantino"],
            answer: 1
        },
        {
            question: "Which movie won the Academy Award for Best Picture in 1994?",
            options: ["Pulp Fiction", "The Shawshank Redemption", "Forrest Gump", "The Lion King"],
            answer: 2
        },
        {
            question: "What is the highest-grossing film of all time (unadjusted for inflation)?",
            options: ["Titanic", "Avatar", "Avengers: Endgame", "Star Wars: The Force Awakens"],
            answer: 1
        },
        {
            question: "Who played Iron Man in the Marvel Cinematic Universe?",
            options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"],
            answer: 1
        },
        {
            question: "In which year was the first 'Jurassic Park' movie released?",
            options: ["1991", "1993", "1995", "1997"],
            answer: 1
        },
        {
            question: "Which actress played Hermione Granger in the Harry Potter series?",
            options: ["Emma Stone", "Emma Watson", "Emily Blunt", "Emma Thompson"],
            answer: 1
        },
        {
            question: "What is the name of the fictional African country in Black Panther?",
            options: ["Zamunda", "Wakanda", "Genovia", "Latveria"],
            answer: 1
        }
    ]
};

// ====================================================
// STATE MANAGEMENT LAYER
// Client-side application state
// ====================================================

const appState = {
    currentScreen: 'topicSelection',
    selectedTopic: null,
    currentQuestionIndex: 0,
    score: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    timeRemaining: 15,
    timerInterval: null,
    questionsData: [],
    userAnswers: [],
    quizStartTime: null,
    darkMode: false
};

// ====================================================
// DOM MANIPULATION LAYER
// Functions for dynamic UI rendering
// ====================================================

/**
 * Main content rendering controller
 * Dynamically switches between screens based on application state
 */
function renderScreen() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = ''; // Clear existing content

    switch (appState.currentScreen) {
        case 'topicSelection':
            renderTopicSelection(mainContent);
            break;
        case 'quiz':
            renderQuizInterface(mainContent);
            break;
        case 'results':
            renderResults(mainContent);
            break;
        default:
            renderTopicSelection(mainContent);
    }
}

/**
 * Renders the topic selection screen
 * DOM Manipulation: Creates topic cards dynamically
 */
function renderTopicSelection(container) {
    const section = document.createElement('div');
    section.className = 'topic-selection';

    const title = document.createElement('h2');
    title.textContent = 'Select Your Quiz Topic';
    
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Choose a domain to test your knowledge';

    const topicGrid = document.createElement('div');
    topicGrid.className = 'topic-grid';

    // Topic descriptions
    const topicInfo = {
        science: 'Test your knowledge of scientific concepts, natural phenomena, and discoveries',
        technology: 'Explore your understanding of computing, programming, and modern technology',
        movies: 'Challenge yourself on film history, famous actors, and cinematic masterpieces'
    };

    // Dynamically create topic cards
    Object.keys(quizzes).forEach(topic => {
        const card = document.createElement('div');
        card.className = 'topic-card';
        card.dataset.topic = topic;

        const cardTitle = document.createElement('h3');
        cardTitle.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);

        const cardDesc = document.createElement('p');
        cardDesc.textContent = topicInfo[topic];

        const questionCount = document.createElement('p');
        questionCount.textContent = `${quizzes[topic].length} Questions`;
        questionCount.style.marginTop = '10px';
        questionCount.style.fontWeight = 'bold';

        card.appendChild(cardTitle);
        card.appendChild(cardDesc);
        card.appendChild(questionCount);

        // Event listener for topic selection
        card.addEventListener('click', () => selectTopic(topic));

        topicGrid.appendChild(card);
    });

    const startSection = document.createElement('div');
    startSection.className = 'start-quiz-section';

    const startButton = document.createElement('button');
    startButton.className = 'btn btn-success';
    startButton.textContent = 'Start Quiz';
    startButton.addEventListener('click', startQuiz);

    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.id = 'errorMessage';
    errorMsg.textContent = 'Please select a topic before starting the quiz!';

    startSection.appendChild(startButton);
    startSection.appendChild(errorMsg);

    section.appendChild(title);
    section.appendChild(subtitle);
    section.appendChild(topicGrid);
    section.appendChild(startSection);

    // Leaderboard Preview Section on Home Screen
    const leaderboardPreview = document.createElement('div');
    leaderboardPreview.className = 'leaderboard-section';

    const leaderboardTitle = document.createElement('h3');
    leaderboardTitle.textContent = 'Recent Leaderboard Scores';

    leaderboardPreview.appendChild(leaderboardTitle);
    leaderboardPreview.appendChild(renderLeaderboardPreview());

    section.appendChild(leaderboardPreview);

    container.appendChild(section);

    // Restore selected topic if exists
    if (appState.selectedTopic) {
        const selectedCard = container.querySelector(`[data-topic="${appState.selectedTopic}"]`);
        if (selectedCard) selectedCard.classList.add('selected');
    }
}

/**
 * Renders the quiz interface with current question
 * DOM Manipulation: Dynamically creates question and options
 */
function renderQuizInterface(container) {
    const quizDiv = document.createElement('div');
    quizDiv.className = 'quiz-interface';

    // Quiz Header
    const header = document.createElement('div');
    header.className = 'quiz-header';

    const quizInfo = document.createElement('div');
    quizInfo.className = 'quiz-info';

    const topicBadge = document.createElement('span');
    topicBadge.className = 'topic-badge';
    topicBadge.textContent = appState.selectedTopic;

    const progressInfo = document.createElement('span');
    progressInfo.className = 'progress-info';
    progressInfo.textContent = `Question ${appState.currentQuestionIndex + 1} of ${appState.questionsData.length}`;

    quizInfo.appendChild(topicBadge);
    quizInfo.appendChild(progressInfo);

    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'timer-display';
    timerDisplay.id = 'timerDisplay';
    timerDisplay.innerHTML = `⏱️ <span id="timeValue">${appState.timeRemaining}</span>s`;

    header.appendChild(quizInfo);
    header.appendChild(timerDisplay);

    // Progress Bar
    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'progress-bar-container';

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.id = 'progressBar';
    const progressPercent = ((appState.currentQuestionIndex + 1) / appState.questionsData.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    progressBarContainer.appendChild(progressBar);

    // Question Container
    const questionContainer = document.createElement('div');
    questionContainer.className = 'question-container';

    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.textContent = appState.questionsData[appState.currentQuestionIndex].question;

    questionContainer.appendChild(questionText);

    // Options Container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';

    appState.questionsData[appState.currentQuestionIndex].options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';
        optionBtn.textContent = `${index + 1}. ${option}`;
        optionBtn.dataset.index = index;
        optionsContainer.appendChild(optionBtn);
    });

    // Event Delegation for answer buttons
    // Using event delegation to handle dynamic option buttons efficiently
    optionsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('option-btn')) {
            const index = Number(e.target.dataset.index);
            handleAnswer(index);
        }
    });

    // Quiz Actions
    const actions = document.createElement('div');
    actions.className = 'quiz-actions';

    const quitBtn = document.createElement('button');
    quitBtn.className = 'btn btn-secondary';
    quitBtn.textContent = 'Quit Quiz';
    quitBtn.addEventListener('click', quitQuiz);

    actions.appendChild(quitBtn);

    quizDiv.appendChild(header);
    quizDiv.appendChild(progressBarContainer);
    quizDiv.appendChild(questionContainer);
    quizDiv.appendChild(optionsContainer);
    quizDiv.appendChild(actions);

    container.appendChild(quizDiv);
}

/**
 * Renders the results screen with score and leaderboard
 * DOM Manipulation: Creates results display and leaderboard table
 */
function renderResults(container) {
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'results-screen';

    // Results Header
    const header = document.createElement('div');
    header.className = 'results-header';

    const title = document.createElement('h2');
    title.textContent = 'Quiz Completed!';

    const topicInfo = document.createElement('p');
    topicInfo.textContent = `Topic: ${appState.selectedTopic.charAt(0).toUpperCase() + appState.selectedTopic.slice(1)}`;
    topicInfo.style.fontSize = '1.2rem';
    topicInfo.style.color = 'var(--text-secondary)';

    header.appendChild(title);
    header.appendChild(topicInfo);

    // Score Display
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    const percentage = Math.round((appState.correctAnswers / appState.questionsData.length) * 100);
    scoreDisplay.textContent = `${percentage}%`;

    // Add class based on score
    if (percentage >= 70) {
        scoreDisplay.classList.add('high');
    } else if (percentage >= 40) {
        scoreDisplay.classList.add('medium');
    } else {
        scoreDisplay.classList.add('low');
    }

    // Stats Grid
    const statsGrid = document.createElement('div');
    statsGrid.className = 'results-stats';

    const stats = [
        { label: 'Total Questions', value: appState.questionsData.length },
        { label: 'Correct Answers', value: appState.correctAnswers },
        { label: 'Incorrect Answers', value: appState.incorrectAnswers },
        { label: 'Final Score', value: `${appState.score}/${appState.questionsData.length}` }
    ];

    stats.forEach(stat => {
        const statCard = document.createElement('div');
        statCard.className = 'stat-card';

        const statLabel = document.createElement('h3');
        statLabel.textContent = stat.label;

        const statValue = document.createElement('p');
        statValue.textContent = stat.value;

        statCard.appendChild(statLabel);
        statCard.appendChild(statValue);
        statsGrid.appendChild(statCard);
    });

    // Action Buttons
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'results-actions';

    const restartBtn = document.createElement('button');
    restartBtn.className = 'btn btn-success';
    restartBtn.textContent = 'Take Another Quiz';
    restartBtn.addEventListener('click', () => {
        resetState();
        appState.currentScreen = 'topicSelection';
        renderScreen();
    });

    const viewLeaderboardBtn = document.createElement('button');
    viewLeaderboardBtn.className = 'btn';
    viewLeaderboardBtn.textContent = 'View Full Leaderboard';
    viewLeaderboardBtn.addEventListener('click', () => {
        document.getElementById('leaderboardSection').scrollIntoView({ behavior: 'smooth' });
    });

    actionsDiv.appendChild(restartBtn);
    actionsDiv.appendChild(viewLeaderboardBtn);

    // Leaderboard Section
    const leaderboardSection = document.createElement('div');
    leaderboardSection.className = 'leaderboard-section';
    leaderboardSection.id = 'leaderboardSection';

    const leaderboardHeader = document.createElement('div');
    leaderboardHeader.className = 'leaderboard-header';

    const leaderboardTitle = document.createElement('h3');
    leaderboardTitle.textContent = 'Leaderboard';

    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn btn-danger';
    clearBtn.textContent = 'Clear Leaderboard';
    clearBtn.addEventListener('click', clearLeaderboard);

    leaderboardHeader.appendChild(leaderboardTitle);
    leaderboardHeader.appendChild(clearBtn);

    leaderboardSection.appendChild(leaderboardHeader);
    leaderboardSection.appendChild(renderLeaderboard());

    resultsDiv.appendChild(header);
    resultsDiv.appendChild(scoreDisplay);
    resultsDiv.appendChild(statsGrid);
    resultsDiv.appendChild(actionsDiv);
    resultsDiv.appendChild(leaderboardSection);

    container.appendChild(resultsDiv);
}

/**
 * Renders the leaderboard table
 * DOM Manipulation: Dynamically creates table rows from localStorage data
 */
function renderLeaderboard() {
    const scores = getLeaderboard();

    if (scores.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-leaderboard';
        emptyDiv.textContent = 'No scores recorded yet. Complete a quiz to see your score here!';
        return emptyDiv;
    }

    const table = document.createElement('table');
    table.className = 'leaderboard-table';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Rank</th>
            <th>Date</th>
            <th>Topic</th>
            <th>Score</th>
            <th>Percentage</th>
        </tr>
    `;

    const tbody = document.createElement('tbody');

    scores.forEach((score, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${score.date}</td>
            <td style="text-transform: capitalize;">${score.topic}</td>
            <td>${score.score}/${score.total}</td>
            <td>${score.percentage}%</td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}

function renderLeaderboardPreview() {
    const scores = getLeaderboard()
        .sort((a, b) => {
            // Sort by highest percentage, then highest raw score, then most recent
            if (b.percentage !== a.percentage) return b.percentage - a.percentage;
            if (b.score !== a.score) return b.score - a.score;
            return b.timestamp - a.timestamp;
        })
        .slice(0, 5);

    if (scores.length === 0) {
        const div = document.createElement('div');
        div.className = 'empty-leaderboard';
        div.textContent = 'No scores yet. Be the first!';
        return div;
    }

    const table = document.createElement('table');
    table.className = 'leaderboard-table';

    table.innerHTML = `
        <thead>
            <tr>
                <th>Rank</th>
                <th>Date</th>
                <th>Topic</th>
                <th>Score</th>
            </tr>
        </thead>
        <tbody>
            ${scores.map((s, i) => `
                <tr>
                    <td>${i + 1}</td>
                    <td>${s.date}</td>
                    <td>${s.topic}</td>
                    <td>${s.score}/${s.total}</td>
                </tr>
            `).join("")}
        </tbody>
    `;
    return table;
}

// ====================================================
// EVENT HANDLING LAYER
// User interaction handlers
// ====================================================

/**
 * Handles topic selection
 * Event Handler: Updates state and UI when topic is selected
 */
function selectTopic(topic) {
    appState.selectedTopic = topic;

    // Update UI to show selection
    document.querySelectorAll('.topic-card').forEach(card => {
        card.classList.remove('selected');
    });

    const selectedCard = document.querySelector(`[data-topic="${topic}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    // Hide error message if shown
    const errorMsg = document.getElementById('errorMessage');
    if (errorMsg) {
        errorMsg.classList.remove('show');
    }
}

/**
 * Starts the quiz
 * State Management: Initializes quiz state and switches to quiz screen
 */
function startQuiz() {
    // TODO: Add difficulty levels (easy/medium/hard) in future version
    if (!appState.selectedTopic) {
        const errorMsg = document.getElementById('errorMessage');
        if (errorMsg) {
            errorMsg.classList.add('show');
        }
        return;
    }

    // Initialize quiz state
    appState.questionsData = [...quizzes[appState.selectedTopic]];
    appState.currentQuestionIndex = 0;
    appState.score = 0;
    appState.correctAnswers = 0;
    appState.incorrectAnswers = 0;
    appState.userAnswers = [];
    appState.quizStartTime = Date.now();
    appState.currentScreen = 'quiz';

    renderScreen();
    startTimer();
}

/**
 * Handles answer selection
 * Event Handler: Processes user's answer and updates state
 */
function handleAnswer(selectedIndex) {
    // Prevent multiple answers
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => btn.disabled = true);

    clearInterval(appState.timerInterval);

    const correctIndex = appState.questionsData[appState.currentQuestionIndex].answer;
    const isCorrect = selectedIndex === correctIndex;

    // Visual feedback - DOM class manipulation
    optionBtns[selectedIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
    if (!isCorrect) {
        optionBtns[correctIndex].classList.add('correct');
    }

    // Update state
    if (isCorrect) {
        appState.score++;
        appState.correctAnswers++;
        showToast('Correct! Well done!', 'success');
    } else {
        appState.incorrectAnswers++;
        showToast('Incorrect. Better luck next time!', 'error');
    }

    appState.userAnswers.push({
        questionIndex: appState.currentQuestionIndex,
        selectedIndex,
        correctIndex,
        isCorrect
    });

    // Move to next question after delay
    setTimeout(() => {
        appState.currentQuestionIndex++;
        if (appState.currentQuestionIndex < appState.questionsData.length) {
            appState.timeRemaining = 15;
            renderScreen();
            startTimer();
        } else {
            finishQuiz();
        }
    }, 1500);
}

/**
 * Starts the countdown timer
 * Timer Management: Uses setInterval for countdown
 */
function startTimer() {
    clearInterval(appState.timerInterval);
    
    appState.timerInterval = setInterval(() => {
        appState.timeRemaining--;

        const timeValue = document.getElementById('timeValue');
        const timerDisplay = document.getElementById('timerDisplay');

        if (timeValue) {
            timeValue.textContent = appState.timeRemaining;
        }

        // Warning state when time is low
        if (appState.timeRemaining <= 5 && timerDisplay) {
            timerDisplay.classList.add('warning');
        }

        if (appState.timeRemaining <= 0) {
            clearInterval(appState.timerInterval);
            handleTimeExpired();
        }
    }, 1000);
}

/**
 * Handles time expiration
 * Auto-advances to next question when timer runs out
 */
function handleTimeExpired() {
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => btn.disabled = true);

    const correctIndex = appState.questionsData[appState.currentQuestionIndex].answer;
    optionBtns[correctIndex].classList.add('correct');

    appState.incorrectAnswers++;
    appState.userAnswers.push({
        questionIndex: appState.currentQuestionIndex,
        selectedIndex: null,
        correctIndex,
        isCorrect: false
    });

    showToast('Time expired! Moving to next question...', 'warning');

    setTimeout(() => {
        appState.currentQuestionIndex++;
        if (appState.currentQuestionIndex < appState.questionsData.length) {
            appState.timeRemaining = 15;
            renderScreen();
            startTimer();
        } else {
            finishQuiz();
        }
    }, 1500);
}

/**
 * Finishes the quiz and shows results
 * State Management: Switches to results screen and saves score
 */
function finishQuiz() {
    clearInterval(appState.timerInterval);
    saveScore();
    appState.currentScreen = 'results';
    renderScreen();
}

/**
 * Quits the quiz and returns to topic selection
 */
function quitQuiz() {
    if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
        clearInterval(appState.timerInterval);
        resetState();
        appState.currentScreen = 'topicSelection';
        renderScreen();
    }
}

/**
 * Resets application state
 */
function resetState() {
    appState.selectedTopic = null;
    appState.currentQuestionIndex = 0;
    appState.score = 0;
    appState.correctAnswers = 0;
    appState.incorrectAnswers = 0;
    appState.timeRemaining = 15;
    appState.questionsData = [];
    appState.userAnswers = [];
    clearInterval(appState.timerInterval);
}

// ====================================================
// LOCALSTORAGE PERSISTENCE LAYER
// Data persistence operations
// ====================================================

/**
 * Saves current quiz score to localStorage
 * Persistence: Stores score with metadata
 */
function saveScore() {
    const scores = getLeaderboard();
    
    // Storing metadata for academic demonstration of persistence layer
    
    const newScore = {
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        topic: appState.selectedTopic,
        score: appState.score,
        total: appState.questionsData.length,
        percentage: Math.round((appState.correctAnswers / appState.questionsData.length) * 100),
        timestamp: Date.now()
    };

    scores.unshift(newScore);
    
    // Keep only top 50 scores
    if (scores.length > 50) {
        scores.length = 50;
    }

    localStorage.setItem('quizLeaderboard', JSON.stringify(scores));
}

/**
 * Retrieves leaderboard from localStorage
 * Persistence: Reads and parses stored data
 */
function getLeaderboard() {
    try {
        const data = localStorage.getItem('quizLeaderboard');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading leaderboard:', error);
        return [];
    }
}

/**
 * Clears the leaderboard
 * Persistence: Removes data from localStorage
 */
function clearLeaderboard() {
    if (confirm('Are you sure you want to clear all leaderboard data? This cannot be undone.')) {
        localStorage.removeItem('quizLeaderboard');
        showToast('Leaderboard cleared successfully!', 'success');
        renderScreen();
    }
}

// ====================================================
// UTILITY FUNCTIONS
// ====================================================

/**
 * Shows toast notification
 * DOM Manipulation: Creates and removes toast elements
 */
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/**
 * Toggles dark mode
 * DOM Manipulation: Adds/removes dark-mode class on body
 */
function toggleDarkMode() {
    appState.darkMode = !appState.darkMode;
    document.body.classList.toggle('dark-mode');
    
    const icon = document.querySelector('#darkModeToggle .icon');
    icon.textContent = appState.darkMode ? '☀️' : '🌙';

    // Save preference
    localStorage.setItem('darkMode', appState.darkMode);
}

/**
 * Loads dark mode preference
 * Persistence: Retrieves saved dark mode setting
 */
function loadDarkModePreference() {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        appState.darkMode = true;
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('#darkModeToggle .icon');
        if (icon) icon.textContent = '☀️';
    }
}

// ====================================================
// KEYBOARD SHORTCUTS
// Event Handling: Keyboard input for accessibility
// ====================================================

document.addEventListener('keydown', (e) => {
    if (appState.currentScreen === 'quiz') {
        const key = e.key;
        
        // Number keys 1-4 for selecting options
        if (['1', '2', '3', '4'].includes(key)) {
            const index = parseInt(key) - 1;
            const optionBtns = document.querySelectorAll('.option-btn');
            
            if (optionBtns[index] && !optionBtns[index].disabled) {
                handleAnswer(index);
            }
        }
    }
});

// ====================================================
// APPLICATION INITIALIZATION
// Entry point - sets up event listeners and renders initial screen
// ====================================================

document.addEventListener('DOMContentLoaded', () => {
    // Load dark mode preference
    loadDarkModePreference();

    // Setup dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Render initial screen
    renderScreen();

    console.log('🎓 Multi-Domain Knowledge Assessment Platform Initialized');
    console.log('📚 Available Topics:', Object.keys(quizzes));
    console.log('⌨️  Keyboard Shortcuts: Press 1-4 to select answers during quiz');
});

/*
  Developer Notes:
  - This project intentionally avoids external libraries to align with course constraints.
  - State is centralized in appState for predictable UI rendering.
  - LocalStorage is used instead of backend for simplicity and offline support.
  - Code structured to be readable for evaluation and viva explanation.
*/
