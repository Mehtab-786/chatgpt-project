const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateContent(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config:{
            systemInstruction:"Your name will be walter and you are an intelligent ai who provides answer to the question asked"
        }
    });

    return response.text;
};

async function generateVectors(prompt) {
    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: prompt,
        config:{
            outputDimensionality:768
        }
    });

    return response.embeddings[0].values;
};

module.exports = { generateContent, generateVectors };