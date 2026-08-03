const fs = require('fs');

// 1. Read API Key
let API_KEY = '';
try {
    const configContent = fs.readFileSync('./js/config.js', 'utf8');
    const match = configContent.match(/GEMINI_API_KEY:\s*['"]([^'"]+)['"]/);
    if (match) API_KEY = match[1];
} catch (e) {
    console.error("Failed to read config.js");
    process.exit(1);
}

// 2. Read Local Data Files
const tutorialData = fs.readFileSync('./data/tutorialData.js', 'utf8');
const quizData = fs.readFileSync('./data/quizData.js', 'utf8');

const promptText = `You are an expert AWS Machine Learning Specialty instructor. 
Based ONLY on the following tutorial data, generate 5 advanced practice questions.
Ensure the new questions DO NOT duplicate the existing static questions provided below.
Keep explanations concise (1-2 sentences max).

Tutorial Data:
${tutorialData}

Existing Static Questions:
${quizData}`;

async function testAPI() {
    console.log("Sending isolated test request to Gemini API...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: {
                    temperature: 0.2,
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

        const data = await response.json();
        
        if (data.error) {
            console.error("\n--- API ERROR RESPONSE ---");
            console.error(JSON.stringify(data.error, null, 2));
            return;
        }

        const candidate = data.candidates[0];
        console.log("\n--- DIAGNOSTICS ---");
        console.log("Finish Reason:", candidate.finishReason);
        if (candidate.safetyRatings) {
            console.log("Safety Ratings Triggered:", JSON.stringify(candidate.safetyRatings.filter(r => r.probability !== "NEGLIGIBLE"), null, 2));
        }

        console.log("\n--- PARSE TEST ---");
        const rawText = candidate.content.parts[0].text;
        console.log("Total Character Length:", rawText.length);
        
        try {
            const parsed = JSON.parse(rawText);
            console.log("Parse SUCCESS! Output is valid JSON. Question count:", parsed.length);
        } catch (e) {
            console.log("Parse FAILED at end of string:", rawText.substring(rawText.length - 100));
            console.error("\nError:", e.message);
        }

    } catch (error) {
        console.error("Network/Fetch Error:", error.message);
    }
}

testAPI();
