import os

file_path = os.path.join("aws-quiz-app", "js", "ai-worker.js")

worker_code = """async function fetchQuestionChunk(API_KEY, tutorialData, previousQuestions = [], maxRetries = 3) {
    let previousContext = "";
    if (previousQuestions.length > 0) {
        previousContext = `\\nExisting Static Questions (DO NOT duplicate these concepts):\\n${JSON.stringify(previousQuestions)}`;
    }

    const promptText = `You are an expert AWS Machine Learning Specialty exam architect.
Based ONLY on the following tutorial data, generate exactly 20 highly advanced, scenario-based practice questions.
Focus heavily on different parts of the tutorial to ensure variety.${previousContext}

COMPLEXITY RULES:
1. Do not ask simple definitional questions.
2. Each question MUST present a real-world architectural scenario (e.g., a company is trying to optimize X using Y, but encounters Z).
3. The options must represent plausible architectural decisions, requiring multi-step reasoning to find the correct one.
4. Keep explanations concise (1-2 sentences max) but deeply technical.

CRITICAL FORMAT RULE: You MUST provide exactly 4 options and exactly 4 explanations for EACH of the 20 questions. The explanations array must map exactly to the options array. Do not leave any explanations blank.

Tutorial Data:
${JSON.stringify(tutorialData)}`;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: {
                        temperature: 0.7,
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
                jsonString = jsonString.replace(/^```json\\n?/, '').replace(/```$/, '').trim();
            }
            
            return JSON.parse(jsonString);
        } catch (error) {
            if (attempt === maxRetries) throw new Error(`Generation failed: ${error.message}`);
            await new Promise(r => setTimeout(r, 2000));
        }
    }
}

self.onmessage = async function(e) {
    const { apiKey, tutorialData, quizData } = e.data;
    
    try {
        self.postMessage({ type: 'progress', message: `Architecting 20 advanced scenario-based questions...` });
        
        const newQuestions = await fetchQuestionChunk(apiKey, tutorialData, quizData || []);
        
        self.postMessage({ type: 'success', data: newQuestions });
    } catch (error) {
        self.postMessage({ type: 'error', message: error.message });
    }
};
"""

def write_worker():
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(worker_code)
    print(f"Success: Rewrote {file_path} for 20 complex scenario-based questions.")

if __name__ == "__main__":
    write_worker()
