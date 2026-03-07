// Vercel Serverless Function — Gumroad License Key Validator
// POST /api/validate-overmind-key
// Body: { license_key: "XXXX-XXXX-XXXX-XXXX" }
// No env vars required — Gumroad license verify is a public endpoint.

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ valid: false, error: 'Method not allowed' });

    const { license_key } = req.body || {};
    if (!license_key || typeof license_key !== 'string') {
        return res.status(400).json({ valid: false, error: 'No license key provided.' });
    }

    // Creator bypass — unlimited dev access
    const DEV_KEY = 'VNR-OVERMIND-DEV-2026';
    if (license_key.trim().toUpperCase() === DEV_KEY) {
        return res.status(200).json({ valid: true, name: 'VNR Creator', email: 'admin@vossneuralresearch.com' });
    }

    try {
        const params = new URLSearchParams({
            product_permalink: 'overmindfull',
            license_key: license_key.trim().toUpperCase(),
        });

        const gumroadRes = await fetch('https://api.gumroad.com/v2/licenses/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
        });

        const data = await gumroadRes.json();

        if (data.success) {
            return res.status(200).json({
                valid: true,
                name: data.purchase?.full_name || '',
                email: data.purchase?.email || '',
            });
        } else {
            return res.status(200).json({ valid: false, error: 'Key not recognized. Check your Gumroad receipt and try again.' });
        }
    } catch (err) {
        return res.status(500).json({ valid: false, error: 'Verification service unavailable. Try again in a moment.' });
    }
}
