// Vercel Serverless Function — Gumroad License Key Validator
// POST /api/validate-overmind-key
// Body: { license_key: "XXXX-XXXX-XXXX-XXXX" }
//
// Required Vercel env var: GUMROAD_ACCESS_TOKEN
// Product permalink: overmind-sovereign

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.vossneuralresearch.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ valid: false, error: 'Method not allowed' });

    const { license_key } = req.body || {};
    if (!license_key || typeof license_key !== 'string') {
        return res.status(400).json({ valid: false, error: 'No license key provided.' });
    }

    const accessToken = process.env.GUMROAD_ACCESS_TOKEN;
    if (!accessToken) {
        return res.status(500).json({ valid: false, error: 'Server configuration error.' });
    }

    try {
        const params = new URLSearchParams({
            product_permalink: 'overmindfull',
            license_key: license_key.trim().toUpperCase(),
            access_token: accessToken,
        });

        const gumroadRes = await fetch(`https://api.gumroad.com/v2/licenses/verify`, {
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
            return res.status(200).json({ valid: false, error: 'Invalid or already-used key.' });
        }
    } catch (err) {
        return res.status(500).json({ valid: false, error: 'Verification service unavailable.' });
    }
}
