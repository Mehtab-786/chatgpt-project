const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateContent(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config:{
      temperature:0.7,
      systemInstruction:"you are an ai, whose name is hector, you help people by  giving answer of their question in precise and formal manner"
    }
  });
  return response.text
}


async function generateVectors(content) {
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: content,
    config: { 
      outputDimensionality: 768 
    }
  });

  return response.embeddings[0].values
}

module.exports = { generateContent, generateVectors }