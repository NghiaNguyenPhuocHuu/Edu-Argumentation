let currentQuestionIndex = 0;
let score = 0;
let isAnswered = false;
let activeQuizData = quizData; // Dynamically swapped later
let cachedAiData = null; // Caches generated AI questions

const dom = {
    appContainer: document.getElementById('app-container'),
    welcomeScreen: document.getElementById('welcome-screen'),
    tutorialScreen: document.getElementById('tutorial-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    resultScreen: document.getElementById('result-screen'),
    
    startBtn: document.getElementById('start-btn'),
    readTutorialBtn: document.getElementById('read-tutorial-btn'),
    tutorialToQuizBtn: document.getElementById('tutorial-to-quiz-btn'),
    navTutorial: document.getElementById('nav-tutorial'),
    navQuiz: document.getElementById('nav-quiz'),
    navAiQuiz: document.getElementById('nav-ai-quiz'),
    startAiBtn: document.getElementById('start-ai-btn'),
    loadingScreen: document.getElementById('loading-screen'),
    
    tutorialContent: document.getElementById('tutorial-content'),
    tutorialTitle: document.getElementById('tutorial-main-title'),
    tutorialLead: document.getElementById('tutorial-lead'),
    
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    questionNumberBadge: document.getElementById('question-number-badge'),
    scoreTracker: document.getElementById('score-tracker'),
    
    actionContainer: document.getElementById('action-container'),
    nextBtn: document.getElementById('next-btn'),
    nextBtnText: document.getElementById('next-btn-text'),
    retakeBtnHeader: document.getElementById('retake-btn-header'),
    
    finalScore: document.getElementById('final-score'),
    finalFraction: document.getElementById('final-fraction'),
    resultMessage: document.getElementById('result-message'),
    restartBtn: document.getElementById('restart-btn'),
    generateNewAiBtn: document.getElementById('generate-new-ai-btn'),
    
    progressContainer: document.getElementById('progress-container'),
    progressBar: document.getElementById('progress-bar'),
    scoreCircleSvg: document.getElementById('score-circle-svg')
};

const templates = {
    tutorialSection: document.getElementById('tmpl-tutorial-section'),
    tutorialListItem: document.getElementById('tmpl-tutorial-list-item'),
    quizOption: document.getElementById('tmpl-quiz-option')
};

dom.startBtn.addEventListener('click', () => { activeQuizData = quizData; startQuiz(); });
dom.startAiBtn.addEventListener('click', startAIQuizGenerator);
dom.tutorialToQuizBtn.addEventListener('click', startQuiz);
dom.readTutorialBtn.addEventListener('click', showTutorial);
dom.retakeBtnHeader.addEventListener('click', restartQuiz);
dom.restartBtn.addEventListener('click', restartQuiz);
dom.generateNewAiBtn.addEventListener('click', startAIQuizGenerator);

dom.navTutorial.addEventListener('click', showTutorial);
dom.navAiQuiz.addEventListener('click', () => {
    if (activeQuizData === cachedAiData && cachedAiData !== null) {
        if (currentQuestionIndex >= activeQuizData.length) showResultsViewOnly();
        else startQuiz();
    } else if (cachedAiData !== null) {
        activeQuizData = cachedAiData;
        currentQuestionIndex = 0;
        score = 0;
        isAnswered = false;
        startQuiz();
    } else {
        startAIQuizGenerator();
    }
});

dom.navQuiz.addEventListener('click', () => {
    const wasOnAI = (activeQuizData !== quizData);
    if (wasOnAI) {
        activeQuizData = quizData;
        currentQuestionIndex = 0;
        score = 0;
        isAnswered = false;
    }
    
    if (currentQuestionIndex >= activeQuizData.length) {
        showResultsViewOnly();
    } else {
        startQuiz();
    }
});

dom.nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < activeQuizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

function renderTutorial() {
    dom.tutorialTitle.textContent = tutorialData.title;
    dom.tutorialLead.textContent = tutorialData.lead;
    dom.tutorialContent.innerHTML = ''; 

    tutorialData.sections.forEach(section => {
        const sectionClone = templates.tutorialSection.content.cloneNode(true);
        const sectionContainer = sectionClone.querySelector('.tutorial-section-container');
        const titleEl = sectionClone.querySelector('.section-title');
        const noteEl = sectionClone.querySelector('.section-note');
        const listContainer = sectionClone.querySelector('.section-list');

        sectionContainer.classList.add(`border-l-${section.themeColor}`);
        titleEl.textContent = section.title;

        if (section.note) {
            noteEl.textContent = section.note;
        } else {
            noteEl.remove();
        }

        section.items.forEach(itemText => {
            const liClone = templates.tutorialListItem.content.cloneNode(true);
            const spanEl = liClone.querySelector('span');
            
            const parts = itemText.split(':');
            if (parts.length > 1) {
                const strong = document.createElement('strong');
                strong.textContent = parts[0] + ':';
                spanEl.appendChild(strong);
                spanEl.appendChild(document.createTextNode(parts.slice(1).join(':')));
            } else {
                spanEl.textContent = itemText;
            }
            listContainer.appendChild(liClone);
        });

        dom.tutorialContent.appendChild(sectionClone);
    });
}

function loadQuestion() {
    isAnswered = false;
    scrollToTop();
    const currentQ = activeQuizData[currentQuestionIndex];
    
    dom.questionNumberBadge.textContent = currentQuestionIndex + 1;
    dom.questionText.textContent = currentQ.question;
    
    if (currentQuestionIndex === activeQuizData.length - 1) {
        dom.nextBtnText.textContent = "Quit and Result";
    } else {
        dom.nextBtnText.textContent = "Next Question";
    }
    
    const progressPercent = ((currentQuestionIndex) / activeQuizData.length) * 100;
    dom.progressBar.style.width = `${progressPercent}%`;

    dom.actionContainer.classList.add('hidden-view');
    dom.optionsContainer.innerHTML = '';

    currentQ.options.forEach((optionText, index) => {
        const optionClone = templates.quizOption.content.cloneNode(true);
        const btn = optionClone.querySelector('.option-card');
        const letterSpan = optionClone.querySelector('.option-letter');
        const textSpan = optionClone.querySelector('.option-text');
        
        const letter = String.fromCharCode(65 + index);
        letterSpan.textContent = letter;
        textSpan.textContent = optionText;
        
        btn.addEventListener('click', () => handleAnswerSelect(index, btn));
        dom.optionsContainer.appendChild(optionClone);
    });
}

function handleAnswerSelect(selectedIndex, selectedBtn) {
    if (isAnswered) return;
    isAnswered = true;

    const currentQ = activeQuizData[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQ.correct;

    if (isCorrect) {
        score++;
        dom.scoreTracker.textContent = score;
        dom.scoreTracker.classList.add('scale-125', 'text-green-500');
        setTimeout(() => dom.scoreTracker.classList.remove('scale-125', 'text-green-500'), 300);
    }

    const allCards = dom.optionsContainer.querySelectorAll('.option-card');
    
    allCards.forEach((card, index) => {
        card.classList.add('answered', 'cursor-default');
        const letterBadge = card.querySelector('.option-letter');
        const explContainer = card.querySelector('.explanation-text');
        const explInner = card.querySelector('.explanation-inner');
        
        const isOptionCorrect = index === currentQ.correct;
        
        explInner.innerHTML = '';
        const titleSpan = document.createElement('span');
        titleSpan.className = 'block mb-1 font-bold';
        const explSpan = document.createElement('span');
        explSpan.className = 'text-slate-600';
        explSpan.textContent = currentQ.explanations[index];
        
        if (isOptionCorrect) {
            titleSpan.textContent = 'Correct Answer';
            titleSpan.classList.add('text-emerald-600');
            explInner.appendChild(titleSpan);
            explInner.appendChild(explSpan);
            
            card.classList.remove('border-slate-200');
            card.classList.add('border-emerald-400', 'bg-emerald-50/30');
            letterBadge.classList.remove('bg-slate-100', 'text-slate-500');
            letterBadge.classList.add('bg-emerald-500', 'text-white');
            explContainer.classList.add('border-emerald-100');
            
        } else {
            titleSpan.textContent = 'Incorrect';
            titleSpan.classList.add('text-rose-500');
            explInner.appendChild(titleSpan);
            explInner.appendChild(explSpan);
            
            if (index === selectedIndex) {
                card.classList.remove('border-slate-200');
                card.classList.add('border-rose-300', 'bg-rose-50/30');
                letterBadge.classList.remove('bg-slate-100', 'text-slate-500');
                letterBadge.classList.add('bg-rose-500', 'text-white');
                explContainer.classList.add('border-rose-100');
            } else {
                card.classList.add('opacity-70');
                explContainer.classList.add('border-slate-200');
            }
        }
        
        setTimeout(() => {
            explContainer.classList.add('expanded');
        }, 50 * index); 
    });

    dom.actionContainer.classList.remove('hidden-view');
    
    setTimeout(() => {
        dom.actionContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }, 400);
}

function updateNavUI(activeTab) {
    [dom.navTutorial, dom.navQuiz, dom.navAiQuiz].forEach(el => {
        el.classList.remove('bg-slate-700', 'text-white', 'shadow-sm');
        if (el === dom.navAiQuiz) {
            el.classList.add('text-purple-300');
        } else {
            el.classList.add('text-slate-300');
        }
    });

    const activeEl = activeTab === 'tutorial' ? dom.navTutorial : 
                     activeTab === 'ai-quiz' ? dom.navAiQuiz : dom.navQuiz;
    
    activeEl.classList.add('bg-slate-700', 'text-white', 'shadow-sm');
    activeEl.classList.remove('text-slate-300', 'text-purple-300');
}

function hideAllScreens() {
    dom.welcomeScreen.classList.add('hidden-view');
    dom.tutorialScreen.classList.add('hidden-view');
    dom.quizScreen.classList.add('hidden-view');
    dom.loadingScreen.classList.add('hidden-view');
    dom.resultScreen.classList.add('hidden-view');
    dom.progressContainer.classList.add('hidden-view');
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showTutorial() {
    hideAllScreens();
    scrollToTop();
    dom.tutorialScreen.classList.remove('hidden-view');
    updateNavUI('tutorial');
}

function showResultsViewOnly() {
    hideAllScreens();
    scrollToTop();
    dom.resultScreen.classList.remove('hidden-view');
    updateNavUI(activeQuizData === quizData ? 'quiz' : 'ai-quiz');
}

function startQuiz() {
    hideAllScreens();
    scrollToTop();
    dom.quizScreen.classList.remove('hidden-view');
    dom.progressContainer.classList.remove('hidden-view');
    dom.scoreTracker.textContent = score;
    updateNavUI(activeQuizData === quizData ? 'quiz' : 'ai-quiz');
    if (!isAnswered) {
         loadQuestion();
    }
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    isAnswered = false;
    startQuiz();
}

function showResults() {
    hideAllScreens();
    scrollToTop();
    dom.resultScreen.classList.remove('hidden-view');
    dom.progressBar.style.width = `100%`;

    const totalQuestions = activeQuizData.length;
    const percent = Math.round((score / totalQuestions) * 100);
    
    dom.finalFraction.textContent = `${score} / ${totalQuestions} Correct`;
    dom.scoreCircleSvg.style.strokeDashoffset = "251.2";
    
    dom.resultMessage.innerHTML = '';
    if (activeQuizData !== quizData) {
        dom.generateNewAiBtn.classList.remove('hidden-view');
    } else {
        dom.generateNewAiBtn.classList.add('hidden-view');
    }
    const spanMsg = document.createElement('span');
    spanMsg.className = 'font-bold block mb-2 text-xl';
    
    if (percent >= 80) {
        spanMsg.textContent = 'Outstanding Performance!';
        spanMsg.classList.add('text-emerald-600');
        dom.resultMessage.appendChild(spanMsg);
        dom.resultMessage.appendChild(document.createTextNode(' You have demonstrated expert-level mastery of SageMaker Endpoints, CI/CD, and Edge deployments.'));
        dom.scoreCircleSvg.classList.replace('text-aws-indigo', 'text-emerald-500');
    } else if (percent >= 60) {
        spanMsg.textContent = 'Solid Effort.';
        spanMsg.classList.add('text-aws-indigo');
        dom.resultMessage.appendChild(spanMsg);
        dom.resultMessage.appendChild(document.createTextNode(' You understand the fundamentals well, but reviewing deployment limits and VPC networking will push you to expert level.'));
    } else {
        spanMsg.textContent = 'Keep Reviewing.';
        spanMsg.classList.add('text-rose-500');
        dom.resultMessage.appendChild(spanMsg);
        dom.resultMessage.appendChild(document.createTextNode(' The concepts in Domain 4 are highly technical. Focus deeply on the constraints (like API Gateway timeouts) and endpoint routing strategies.'));
        dom.scoreCircleSvg.classList.replace('text-aws-indigo', 'text-rose-500');
    }

    if (percent === 0) {
        dom.finalScore.textContent = `0%`;
        return;
    }

    let currentPercent = 0;
    const animationDuration = 1000;
    const intervalTime = animationDuration / percent;
    
    const interval = setInterval(() => {
        currentPercent++;
        dom.finalScore.textContent = `${currentPercent}%`;
        if (currentPercent >= percent) {
            clearInterval(interval);
            dom.finalScore.textContent = `${percent}%`;
        }
    }, intervalTime);

    setTimeout(() => {
        const offset = 251.2 - (251.2 * percent) / 100;
        dom.scoreCircleSvg.style.strokeDashoffset = offset;
    }, 100);
}


async function fetchQuestionChunk(API_KEY, batchIndex, maxRetries = 3) {
    const promptText = `You are an expert AWS Machine Learning Specialty instructor. 
Based ONLY on the following tutorial data, generate 5 advanced practice questions.
This is Batch ${batchIndex} of 4. Focus heavily on different parts of the tutorial to ensure variety.
Ensure the new questions DO NOT duplicate the existing static questions provided below.
Keep explanations concise (1-2 sentences max). DO NOT use double quotes inside your text.

Tutorial Data:
${JSON.stringify(tutorialData)}

Existing Static Questions (DO NOT DUPLICATE THESE):
${JSON.stringify(quizData)}`;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: {
                        temperature: 0.7, 
                        maxOutputTokens: 8192,
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    question: { type: "STRING" },
                                    options: { type: "ARRAY", items: { type: "STRING" } },
                                    correct: { type: "INTEGER" },
                                    explanations: { type: "ARRAY", items: { type: "STRING" } }
                                },
                                required: ["question", "options", "correct", "explanations"]
                            }
                        }
                    }
                })
            });

            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

            const data = await response.json();
            
            if (!data.candidates || data.candidates.length === 0) {
                throw new Error("No candidates returned. Possible safety filter trigger.");
            }
            
            let jsonString = data.candidates[0].content.parts[0].text;
            if (jsonString.startsWith('```json')) {
                jsonString = jsonString.replace('```json', '').replace('```', '').trim();
            }
            
            return JSON.parse(jsonString);

        } catch (error) {
            console.warn(`Batch ${batchIndex} attempt ${attempt} failed: ${error.message}`);
            if (attempt === maxRetries) throw new Error(`Batch ${batchIndex} failed completely after ${maxRetries} attempts.`);
            // Wait 2 seconds before retrying to prevent rate limits
            await new Promise(r => setTimeout(r, 2000));
        }
    }
}

async function startAIQuizGenerator() {
    hideAllScreens();
    scrollToTop();
    dom.loadingScreen.classList.remove('hidden-view');
    updateNavUI('ai-quiz');

    const API_KEY = config.GEMINI_API_KEY;
    
    if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
        alert("Please insert your Gemini API key in js/config.js to use this feature.");
        showTutorial();
        return;
    }

    const loadingText = dom.loadingScreen.querySelector('p');
    loadingText.textContent = "Verifying API key status...";
    
    try {
        const checkResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        if (!checkResponse.ok) throw new Error("Invalid API Key.");
    } catch (error) {
        console.error("API Key Check Failed:", error);
        alert("API Key verification failed. Check js/config.js.");
        loadingText.textContent = "Gemini is analyzing the tutorial data and crafting new questions...";
        showTutorial();
        return;
    }

    try {
        const results = [];
        // Process sequentially to prevent free-tier burst limit truncation
        for (let i = 1; i <= 4; i++) {
            loadingText.textContent = `API Key verified! Generating batch ${i} of 4 (5 questions each)...`;
            const chunk = await fetchQuestionChunk(API_KEY, i);
            results.push(chunk);
            if (i < 4) await new Promise(r => setTimeout(r, 1000)); // Delay between batches
        }

        const aiQuestions = results.flat();

        activeQuizData = aiQuestions;
        cachedAiData = aiQuestions;
        
        currentQuestionIndex = 0;
        score = 0;
        
        loadingText.textContent = "Gemini is analyzing the tutorial data and crafting new questions..."; 
        startQuiz();

    } catch (error) {
        console.error("AI Generation Error:", error);
        alert("Failed to generate AI Quiz. Check console for details.");
        loadingText.textContent = "Gemini is analyzing the tutorial data and crafting new questions...";
        showTutorial();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderTutorial();
});
