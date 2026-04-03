const BASE_URL = "https://integrate.api.nvidia.com/v1";
const API_KEY = import.meta.env.VITE_NVIDIA_API_KEY;

export async function generatePalettes(prompt, count = 6) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "meta/llama-3.1-8b-instruct",
      messages: [
        {
          role: "system",
          content: `You are a colour palette expert. When given a theme or mood, respond ONLY with a valid JSON array of exactly ${count} palette objects. Each object must have this exact shape:
{"name": "Evocative palette name", "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"]}
Rules:
- All ${count} palettes must feel related to the theme but each must be distinct
- Vary the mood: some light, some dark, some saturated, some muted
- Names should be poetic and evocative, not generic
- Only valid 6-digit hex codes
- Respond with ONLY the raw JSON array, no markdown, no explanation, nothing else.`,
        },
        {
          role: "user",
          content: `Generate ${count} distinct colour palettes for the theme: "${prompt}"`,
        },
      ],
      temperature: 0.9,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const data = await response.json();
  let text = data.choices[0].message.content
    .replace(/```json|```/g, "")
    .trim();

  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start !== -1 && end !== -1) text = text.slice(start, end + 1);

  text = text
    .replace(/,\s*]/g, "]")
    .replace(/,\s*}/g, "}")
    .replace(/(['"])?([a-z0-9_]+)(['"])?:/gi, '"$2":')
    .replace(/:\s*'([^']*)'/g, ': "$1"');

  return JSON.parse(text);
}