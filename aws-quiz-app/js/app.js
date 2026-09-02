let currentQuestionIndex = 0;
let score = 0;
let isAnswered = false;
let activeQuizData = [];
let quizData = [];
let tutorialData = {};
let cachedAiData = null;

const dom = {
    appContainer: document.getElementById('app-container'),
    landingDashboard: document.getElementById('landing-dashboard'),
    contentSection: document.getElementById('content-section'),
    servicesSection: document.getElementById('services-section'),
    
    emptyState: document.getElementById('empty-state'),
    welcomeScreen: document.getElementById('welcome-screen'),
    loadingScreen: document.getElementById('loading-screen'),
    
    tutorialScreen: document.getElementById('tutorial-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    resultScreen: document.getElementById('result-screen'),
    
    appSubTitle: document.getElementById('app-sub-title'),
    welcomeTitle: document.getElementById('welcome-title'),
    
    startBtn: document.getElementById('start-btn'),
    readTutorialBtn: document.getElementById('read-tutorial-btn'),
    tutorialToQuizBtn: document.getElementById('tutorial-to-quiz-btn'),
    navTutorial: document.getElementById('nav-tutorial'),
    navQuiz: document.getElementById('nav-quiz'),
    navAiQuiz: document.getElementById('nav-ai-quiz'),
    startAiBtn: document.getElementById('start-ai-btn'),
    customDataUpload: document.getElementById('custom-data-upload'),
    
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
    progressBar: document.getElementById('progress-bar')
};

const templates = {
    tutorialSection: document.getElementById('tmpl-tutorial-section'),
    tutorialListItem: document.getElementById('tmpl-tutorial-list-item'),
    quizOption: document.getElementById('tmpl-quiz-option')
};

function setAppState(isReady, moduleName = null) {
    if (dom.appSubTitle && dom.welcomeTitle) {
        if (moduleName) {
            dom.appSubTitle.textContent = "Active Module: " + moduleName;
            dom.welcomeTitle.textContent = moduleName;
        } else {
            dom.appSubTitle.textContent = "Education is the movement from darkness to light";
        }
    }
    
    if (!isReady) {
        dom.emptyState.classList.remove('hidden-view');
        dom.welcomeScreen.classList.add('hidden-view');
    } else {
        dom.emptyState.classList.add('hidden-view');
        dom.welcomeScreen.classList.remove('hidden-view');
    }
    
    const controls = [dom.readTutorialBtn, dom.startBtn, dom.startAiBtn];
    controls.forEach(btn => {
        if (!btn) return;
        btn.disabled = !isReady;
    });
}

function updateNavUI(activeTab) {
    [dom.navTutorial, dom.navQuiz, dom.navAiQuiz].forEach(el => {
        el.className = 'pb-1 border-b-2 border-transparent text-gray-400 transition-colors hover:text-white';
    });

    const activeEl = activeTab === 'tutorial' ? dom.navTutorial : 
                     activeTab === 'ai-quiz' ? dom.navAiQuiz : dom.navQuiz;
    
    activeEl.classList.remove('border-transparent', 'text-gray-400');
    activeEl.classList.add('border-brand-500', 'text-white');
}

function showLandingDashboard() {
    dom.contentSection.classList.add('hidden-view');
    dom.landingDashboard.classList.remove('hidden-view');
    dom.servicesSection.classList.remove('hidden-view');
    dom.loadingScreen.classList.add('hidden-view');
    
    if(tutorialData.title) {
        dom.emptyState.classList.add('hidden-view');
        dom.welcomeScreen.classList.remove('hidden-view');
    } else {
        dom.emptyState.classList.remove('hidden-view');
        dom.welcomeScreen.classList.add('hidden-view');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateNavUI('tutorial');
}

function showTutorial() {
    if (!tutorialData.title) return;
    dom.landingDashboard.classList.add('hidden-view');
    dom.contentSection.classList.remove('hidden-view');
    
    dom.tutorialScreen.classList.remove('hidden-view');
    dom.quizScreen.classList.add('hidden-view');
    dom.resultScreen.classList.add('hidden-view');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateNavUI('tutorial');
}

function startQuiz() {
    if (!tutorialData.title) return;
    dom.landingDashboard.classList.add('hidden-view');
    dom.contentSection.classList.remove('hidden-view');
    
    dom.tutorialScreen.classList.add('hidden-view');
    dom.resultScreen.classList.add('hidden-view');
    dom.quizScreen.classList.remove('hidden-view');
    
    dom.progressContainer.classList.remove('hidden-view');
    dom.scoreTracker.textContent = score;
    updateNavUI(activeQuizData === quizData ? 'quiz' : 'ai-quiz');
    
    if (!isAnswered && activeQuizData.length > 0) {
        loadQuestion();
    } else if (activeQuizData.length === 0) {
        showResults();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showResults() {
    dom.landingDashboard.classList.add('hidden-view');
    dom.contentSection.classList.remove('hidden-view');
    
    dom.tutorialScreen.classList.add('hidden-view');
    dom.quizScreen.classList.add('hidden-view');
    dom.resultScreen.classList.remove('hidden-view');
    dom.progressContainer.classList.add('hidden-view');

    const totalQuestions = activeQuizData.length;
    const percent = totalQuestions === 0 ? 0 : Math.round((score / totalQuestions) * 100);
    
    dom.finalFraction.textContent = `${score} / ${totalQuestions}`;
    
    dom.resultMessage.innerHTML = '';
    if (activeQuizData !== quizData) {
        dom.generateNewAiBtn.classList.remove('hidden-view');
    } else {
        dom.generateNewAiBtn.classList.add('hidden-view');
    }
    
    const spanMsg = document.createElement('span');
    spanMsg.className = 'font-light block mb-4 text-3xl text-white';
    
    if (totalQuestions === 0) {
        spanMsg.textContent = 'No Assessment Available.';
        spanMsg.classList.add('text-gray-400');
        dom.resultMessage.appendChild(spanMsg);
    } else if (percent >= 80) {
        spanMsg.textContent = 'Outstanding Performance!';
        spanMsg.classList.add('text-emerald-400');
        dom.resultMessage.appendChild(spanMsg);
        dom.resultMessage.appendChild(document.createTextNode(' You have demonstrated expert-level mastery of the material.'));
    } else if (percent >= 60) {
        spanMsg.textContent = 'Solid Effort.';
        spanMsg.classList.add('text-brand-400');
        dom.resultMessage.appendChild(spanMsg);
        dom.resultMessage.appendChild(document.createTextNode(' You understand the fundamentals well, but reviewing key concepts will push you further.'));
    } else {
        spanMsg.textContent = 'Keep Reviewing.';
        spanMsg.classList.add('text-brand-500');
        dom.resultMessage.appendChild(spanMsg);
        dom.resultMessage.appendChild(document.createTextNode(' Review the tutorial material deeply before retaking the assessment.'));
    }

    if (percent === 0) {
        dom.finalScore.textContent = `0%`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showResultsViewOnly() {
    showResults();
    updateNavUI(activeQuizData === quizData ? 'quiz' : 'ai-quiz');
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    isAnswered = false;
    startQuiz();
}

dom.navTutorial.addEventListener('click', showLandingDashboard); 

dom.startBtn.addEventListener('click', () => { activeQuizData = quizData; startQuiz(); });
dom.readTutorialBtn.addEventListener('click', showTutorial);
dom.tutorialToQuizBtn.addEventListener('click', () => { activeQuizData = quizData; startQuiz(); });

dom.nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < activeQuizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

dom.retakeBtnHeader.addEventListener('click', restartQuiz);
dom.restartBtn.addEventListener('click', restartQuiz);

dom.startAiBtn.addEventListener('click', startAIQuizGenerator);
dom.generateNewAiBtn.addEventListener('click', startAIQuizGenerator);

dom.navAiQuiz.addEventListener('click', () => {
    if (!tutorialData.title) return;
    if (activeQuizData === cachedAiData && cachedAiData !== null) {
        if (currentQuestionIndex >= activeQuizData.length) showResultsViewOnly();
        else startQuiz();
    } else if (cachedAiData !== null) {
        activeQuizData = cachedAiData;
        restartQuiz();
    } else {
        startAIQuizGenerator();
    }
});

dom.navQuiz.addEventListener('click', () => {
    if (!tutorialData.title) return;
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

dom.customDataUpload.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith('.json')) {
            const text = await file.text();
            const parsedData = JSON.parse(text);
            if (!parsedData.tutorialData || !parsedData.quizData || !Array.isArray(parsedData.quizData)) {
                throw new Error("Invalid JSON schema. Must contain 'tutorialData' object and 'quizData' array.");
            }

            tutorialData = parsedData.tutorialData;
            quizData = parsedData.quizData;
            activeQuizData = quizData;
            cachedAiData = null;
        } else {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', file.name.replace(/\.[^.]+$/, '') || 'Uploaded Module');
            formData.append('questions', '10');

            const response = await fetch('/api/upload-module', {
                method: 'POST',
                body: formData
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok || !result.tutorialData || !result.quizData || !Array.isArray(result.quizData)) {
                throw new Error(result.error || 'The server could not convert this file into a learning module.');
            }

            tutorialData = result.tutorialData;
            quizData = result.quizData;
            activeQuizData = quizData;
            cachedAiData = null;
        }

        currentQuestionIndex = 0;
        score = 0;
        isAnswered = false;

        renderTutorial();
        setAppState(true, tutorialData.title || "Custom Course Module");
        showLandingDashboard();
    } catch (error) {
        console.error("Module load error:", error);
        alert("Failed to load data: " + error.message);
    }

    dom.customDataUpload.value = '';
});

// Helper Function that injects the WebComponent
function formatText(text) {
    if (!text) return '';
    const viewer = document.createElement('rich-text-viewer');
    viewer.setAttribute('content', encodeURIComponent(text));
    return viewer.outerHTML;
}

function renderTutorial() {
    if (!tutorialData || !tutorialData.sections) return;
    dom.tutorialTitle.textContent = tutorialData.title || 'Tutorial Module';
    dom.tutorialLead.textContent = tutorialData.lead || '';
    dom.tutorialContent.innerHTML = ''; 

    tutorialData.sections.forEach(section => {
        const sectionClone = templates.tutorialSection.content.cloneNode(true);
        const titleEl = sectionClone.querySelector('.section-title');
        const noteEl = sectionClone.querySelector('.section-note');
        const listContainer = sectionClone.querySelector('.section-list');

        const theme = section.themeColor || 'indigo-500';

        titleEl.textContent = section.title;
        titleEl.className = `section-title text-2xl font-bold mb-4 border-b-2 pb-2 text-${theme} border-${theme}`;

        if (section.note) {
            noteEl.textContent = section.note;
        } else {
            noteEl.remove();
        }

        section.items.forEach(itemData => {
            const liClone = templates.tutorialListItem.content.cloneNode(true);
            const spanEl = liClone.querySelector('span');
            
            if (typeof itemData === 'string') {
                const parts = itemData.split(':');
                if (parts.length > 1) {
                    const strong = document.createElement('strong');
                    strong.className = `font-semibold text-${theme}`;
                    strong.textContent = parts[0] + ':';
                    spanEl.appendChild(strong);
                    
                    const textWrapper = document.createElement('span');
                    textWrapper.innerHTML = formatText(parts.slice(1).join(':'));
                    spanEl.appendChild(textWrapper);
                } else {
                    spanEl.innerHTML = formatText(itemData);
                }
            } 
            else if (typeof itemData === 'object' && itemData !== null) {
                if (itemData.term) {
                    const strong = document.createElement('strong');
                    strong.className = `font-semibold text-${theme} block mb-4 mt-2 text-lg md:text-xl tracking-wide`;
                    strong.textContent = itemData.term;
                    spanEl.appendChild(strong);
                }

                if (itemData.blocks && Array.isArray(itemData.blocks)) {
                    itemData.blocks.forEach(block => {
                        if (block.type === 'text') {
                            const p = document.createElement('p');
                            p.className = 'mb-6 text-gray-200 leading-relaxed';
                            p.innerHTML = formatText(block.content);
                            spanEl.appendChild(p);
                        } else if (block.type === 'media' && block.mediaType === 'image') {
                            const img = document.createElement('img');
                            img.src = `data/${block.src}`;
                            img.alt = block.alt || '';
                            img.className = 'my-6 max-w-full rounded-xl shadow-lg';
                            spanEl.appendChild(img);
                        } else if (block.type === 'card') {
                            const cardDiv = document.createElement('div');
                            
                            if (block.variant === 'example') {
                                cardDiv.className = `my-6 p-7 rounded-2xl bg-slate-900 border-l-8 border-${theme} shadow-xl relative overflow-hidden`;
                            } else {
                                cardDiv.className = `my-6 p-6 rounded-xl bg-gray-800/40 border-l-4 border-${theme} shadow-md`;
                            }
                            
                            if (block.title) {
                                const cardTitle = document.createElement('h4');
                                const titleFont = block.variant === 'example' ? 'font-extrabold text-2xl tracking-tight' : 'font-bold text-lg';
                                cardTitle.className = `text-white mb-4 ${titleFont}`;
                                cardTitle.textContent = block.title;
                                cardDiv.appendChild(cardTitle);
                            }
                            if (block.intro || block.content) {
                                const p = document.createElement('p');
                                const textBrightness = block.variant === 'example' ? 'text-gray-100' : 'text-gray-300';
                                p.className = `${textBrightness} mb-4 leading-relaxed text-lg`;
                                p.innerHTML = formatText(block.intro || block.content);
                                cardDiv.appendChild(p);
                            }
                            if (block.bullets && Array.isArray(block.bullets)) {
                                const ul = document.createElement('ul');
                                ul.className = 'list-disc list-outside text-gray-300 ml-6 space-y-3 leading-relaxed text-lg';
                                block.bullets.forEach(bullet => {
                                    const li = document.createElement('li');
                                    li.innerHTML = formatText(bullet);
                                    ul.appendChild(li);
                                });
                                cardDiv.appendChild(ul);
                            }
                            spanEl.appendChild(cardDiv);
                        } else if (block.type === 'callout') {
                            const calloutDiv = document.createElement('div');
                            calloutDiv.className = 'my-6 p-6 rounded-xl bg-amber-900/20 border border-amber-500/30 shadow-md';
                            
                            if (block.title) {
                                const calloutTitle = document.createElement('h4');
                                calloutTitle.className = 'font-bold text-amber-500 mb-4 flex items-center gap-2 text-lg';
                                calloutTitle.innerHTML = `<span>⚠️</span> ${block.title}`;
                                calloutDiv.appendChild(calloutTitle);
                            }
                            if (block.items && Array.isArray(block.items)) {
                                const ul = document.createElement('ul');
                                ul.className = 'space-y-4 text-gray-200 leading-relaxed';
                                block.items.forEach(item => {
                                    const li = document.createElement('li');
                                    li.innerHTML = formatText(item);
                                    ul.appendChild(li);
                                });
                                calloutDiv.appendChild(ul);
                            }
                            spanEl.appendChild(calloutDiv);
                        }
                    });
                }
            }
            
            listContainer.appendChild(liClone);
        });

        dom.tutorialContent.appendChild(sectionClone);
    });
}

function loadQuestion() {
    isAnswered = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const currentQ = activeQuizData[currentQuestionIndex];
    
    dom.questionNumberBadge.textContent = currentQuestionIndex + 1;
    dom.questionText.innerHTML = formatText(currentQ.question);
    
    if (currentQuestionIndex === activeQuizData.length - 1) {
        dom.nextBtnText.textContent = "Finish Assessment";
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
        textSpan.innerHTML = formatText(optionText);
        
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
        titleSpan.className = 'block mb-1 font-bold tracking-wider text-xs uppercase';
        const explSpan = document.createElement('span');
        explSpan.className = 'text-gray-400 leading-relaxed';
        explSpan.innerHTML = formatText(currentQ.explanations[index]);
        
        if (isOptionCorrect) {
            titleSpan.textContent = 'Correct Answer';
            titleSpan.classList.add('text-emerald-400');
            explInner.appendChild(titleSpan);
            explInner.appendChild(explSpan);
            
            card.classList.remove('border-transparent');
            card.style.borderColor = '#10b981'; 
            card.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            letterBadge.classList.remove('bg-gray-800', 'text-gray-400');
            letterBadge.style.backgroundColor = '#10b981';
            letterBadge.style.color = '#ffffff';
            
        } else {
            titleSpan.textContent = 'Incorrect';
            titleSpan.classList.add('text-brand-400'); 
            explInner.appendChild(titleSpan);
            explInner.appendChild(explSpan);
            
            if (index === selectedIndex) {
                card.classList.remove('border-transparent');
                card.style.borderColor = '#ef4444'; 
                card.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; 
                letterBadge.classList.remove('bg-gray-800', 'text-gray-400');
                letterBadge.style.backgroundColor = '#ef4444';
                letterBadge.style.color = '#ffffff';
            } else {
                card.classList.add('opacity-50');
            }
        }
        
        setTimeout(() => {
            explContainer.classList.add('expanded');
        }, 50 * index); 
    });

    dom.actionContainer.classList.remove('hidden-view');
    setTimeout(() => {
        dom.actionContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 400);
}

async function startAIQuizGenerator() {
    if (!tutorialData.title) return;
    
    dom.contentSection.classList.add('hidden-view');
    dom.landingDashboard.classList.remove('hidden-view');
    dom.emptyState.classList.add('hidden-view');
    dom.welcomeScreen.classList.add('hidden-view');
    dom.servicesSection.classList.add('hidden-view'); 
    dom.loadingScreen.classList.remove('hidden-view');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateNavUI('ai-quiz');

    const API_KEY = config.GEMINI_API_KEY;
    if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
        alert("Please insert your Gemini API key in config.js");
        showLandingDashboard();
        return;
    }

    try {
        const aiWorker = new Worker('js/ai-worker.js');
        aiWorker.postMessage({ apiKey: API_KEY, tutorialData: tutorialData, quizData: quizData });

        aiWorker.onmessage = function(e) {
            if (e.data.type === 'progress') {
                // update text if needed
            } else if (e.data.type === 'success') {
                activeQuizData = e.data.data;
                cachedAiData = e.data.data;
                restartQuiz();
            } else if (e.data.type === 'error') {
                alert("Error: " + e.data.message);
                showLandingDashboard();
            }
        };
    } catch (error) {
        alert("Failed to initialize AI worker.");
        showLandingDashboard();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setAppState(false); 
});
