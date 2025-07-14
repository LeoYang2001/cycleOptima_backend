const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.getEmbedding = async function (text) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });

  if (!embedding.data || !embedding.data[0]?.embedding) {
    throw new Error("Failed to get embedding from OpenAI");
  }

  return embedding.data[0].embedding;
};
