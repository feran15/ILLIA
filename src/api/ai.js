import api from '../lib/api';

export async function generateAI(prompt, json = false) {
  const data = await api('/api/ai/generate', {
    method: 'POST',
    body: JSON.stringify({
      prompt,
      json,
    }),
  });

  return json
    ? JSON.parse(data.output)
    : data.output;
}