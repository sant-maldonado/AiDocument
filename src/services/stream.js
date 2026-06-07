export function streamChat({ documentId, message, conversationId, onChunk, onDone, onError }) {
  const token = localStorage.getItem('token');
  const controller = new AbortController();

  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ documentId, message, conversationId }),
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        onError(err.error || 'Request failed');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr || jsonStr === '[DONE]') continue;

          try {
            const data = JSON.parse(jsonStr);
            if (data.error) {
              onError(data.error);
              return;
            }
            if (data.done) {
              onDone(data.conversationId);
              return;
            }
            if (data.content) {
              onChunk(data.content);
            }
          } catch {
            // skip malformed lines
          }
        }
      }
      onDone(null);
    })
    .catch((err) => {
      if (err.name !== 'AbortError') {
        onError(err.message);
      }
    });

  return () => controller.abort();
}
