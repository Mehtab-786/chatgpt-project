const { Pinecone }  = require('@pinecone-database/pinecone');

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const chatgptIndex = pc.index('chat-gpt');

async function createMemory({vectors, messageId, metadata}) {
    await chatgptIndex.upsert([{
        id : messageId,
        metadata,
        values:vectors
    }])
}

async function queryMemory({queryVectors, metadata, limit=5}) {
    const data = await chatgptIndex.query({
        vector:queryVectors,
        includeMetadata:true,
        topK:limit,
        filter:metadata || undefined
    })
    return data.matches
}

module.exports = {createMemory, queryMemory}