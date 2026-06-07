import OpenAI from 'openai';

const groq = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.OPENAI_API_KEY,
});

export async function streamChat(messages, onChunk) {
  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages,
    stream: true,
    temperature: 0.7,
    max_tokens: 4096,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices?.[0]?.delta?.content;
    if (delta) {
      onChunk(delta);
    }
  }
}
