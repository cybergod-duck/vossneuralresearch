// Vercel Serverless Function — Overmind Gemini Proxy
// POST /api/overmind
// Body: { contents: [...], system_instruction: {...}, generationConfig: {...} }
// Keeps the Gemini API key server-side

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const GEMINI_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDEtp0t2qY3YjD-o2t0JojZaTYvIDeW5V8';

    const { contents, system_instruction, generationConfig } = req.body || {};
    if (!contents) {
        return res.status(400).json({ error: 'No contents provided' });
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;
        const geminiRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents, system_instruction, generationConfig }),
        });

        const data = await geminiRes.json();
        return res.status(geminiRes.status).json(data);
    } catch (err) {
        console.error('[Overmind proxy error]', err);
        return res.status(500).json({ error: 'Upstream error', detail: err.message });
    }
}
