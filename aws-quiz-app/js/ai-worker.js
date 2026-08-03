async function fetchQuestionChunk(API_KEY, batchIndex, tutorialData, quizData, maxRetries = 3) {
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
                throw new Error("No candidates returned.");
            }
            
            let jsonString = data.candidates[0].content.parts[0].text;
            if (jsonString.startsWith('```json')) {
                jsonString = jsonString.replace('```json', '').replace('```', '').trim();
            }
            
            return JSON.parse(jsonString);

        } catch (error) {
            console.warn(`Worker Batch ${batchIndex} attempt ${attempt} failed: ${error.message}`);
            if (attempt === maxRetries) throw new Error(`Batch ${batchIndex} failed after ${maxRetries} attempts.`);
            await new Promise(r => setTimeout(r, 2000));
        }
    }
}

self.onmessage = async function(e) {
    const { apiKey, tutorialData, quizData } = e.data;
    
    try {
        const results = [];
        for (let i = 1; i <= 4; i++) {
            self.postMessage({ type: 'progress', message: `API Key verified! Generating batch ${i} of 4 (5 questions each)...` });
            const chunk = await fetchQuestionChunk(apiKey, i, tutorialData, quizData);
            results.push(chunk);
            if (i < 4) await new Promise(r => setTimeout(r, 1000));
        }
        
        const aiQuestions = results.flat();
        self.postMessage({ type: 'success', data: aiQuestions });
        
    } catch (error) {
        self.postMessage({ type: 'error', message: error.message });
    }
};