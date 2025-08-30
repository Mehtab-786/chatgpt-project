const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateContent(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config:{
            systemInstruction:"Your name will be walter and you are an intelligent ai , who gives brief answer not so long"
        }
    });

    return response.text;
};

module.exports = { generateContent };