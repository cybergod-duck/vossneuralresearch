// Vercel Serverless Function — Overmind AI Proxy via OpenRouter
// POST /api/overmind
// Body: { contents: [...], system_instruction: {...}, generationConfig: {...} }

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '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';

    const { contents, system_instruction, generationConfig } = req.body || {};
    if (!contents) {
        return res.status(400).json({ error: 'No contents provided' });
    }

    // Convert Gemini-format messages to OpenAI/OpenRouter format
    const messages = [];

    // Add system prompt if provided
    if (system_instruction?.parts?.[0]?.text) {
        messages.push({ role: 'system', content: system_instruction.parts[0].text });
    }

    // Convert Gemini contents array (role: user/model, parts: [{text}])
    for (const turn of contents) {
        const role = turn.role === 'model' ? 'assistant' : 'user';
        const content = turn.parts?.map(p => p.text).join('') || '';
        messages.push({ role, content });
    }

    try {
        const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_KEY}`,
                'HTTP-Referer': 'https://vossneuralresearch.com',
                'X-Title': 'The Overmind',
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-001',
                messages,
                max_tokens: generationConfig?.maxOutputTokens || 1200,
                temperature: generationConfig?.temperature || 0.9,
            }),
        });

        const data = await orRes.json();

        if (!orRes.ok) {
            console.error('[Overmind proxy] OpenRouter error:', data);
            return res.status(orRes.status).json(data);
        }

        // Re-wrap in Gemini-compatible shape so the frontend works unchanged
        const text = data?.choices?.[0]?.message?.content || '';
        return res.status(200).json({
            candidates: [{ content: { parts: [{ text }] } }]
        });

    } catch (err) {
        console.error('[Overmind proxy error]', err);
        return res.status(500).json({ error: 'Upstream error', detail: err.message });
    }
}
