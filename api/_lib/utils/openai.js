let groq;

async function getGroq() {
  if (!groq) {
    const { default: OpenAI } = await import('openai');
    groq = new OpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return groq;
}

export async function streamChat(messages, onChunk) {
  const client = await getGroq();
  const stream = await client.chat.completions.create({
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
