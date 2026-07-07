require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = process.env.PORT || 3001;
const EMDASH_BASE_URL = process.env.EMDASH_BASE_URL || 'http://localhost:4321';
const EMDASH_TOKEN = process.env.EMDASH_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Live aur Local dono origins ko flexible handle karne ke liye array
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');

// SUPER FLEXIBLE CORS CONFIGURATION FOR VERCEL
app.use(
  cors({
    origin: (origin, callback) => {
      // Agar local ho, allowed list mein ho, ya direct hit ho (bina origin ke) toh pass kardein
      if (!origin || ALLOWED_ORIGINS.includes(origin) || origin.includes('vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
  })
);

// Rate limiting configurations
const reversePromptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { error: 'Too many requests. Please wait a few minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const emdashLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please wait a few minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─────────────────────────────────────────────────────────────
// EmDash Proxy (Both Handling: With /proxy and Direct /_emdash)
// ─────────────────────────────────────────────────────────────
const emdashProxyConfig = createProxyMiddleware({
  target: EMDASH_BASE_URL,
  changeOrigin: true,
  onProxyReq: (proxyReq) => {
    if (EMDASH_TOKEN) {
      proxyReq.setHeader('Authorization', `Bearer ${EMDASH_TOKEN}`);
    }
  },
});

// A: Agar frontend /proxy/_emdash lagaye
app.use(
  '/proxy',
  emdashLimiter,
  (req, res, next) => {
    // Isko clean kar ke target tak bhejein
    req.url = req.url.replace(/^\/proxy/, '');
    next();
  },
  emdashProxyConfig
);

// B: Fallback - Agar frontend direct /_emdash/... hit kare (Vercel par console error ke mutabik)
app.use('/_emdash', emdashLimiter, emdashProxyConfig);


// Body parser for the routes below
app.use(express.json({ limit: '15mb' }));

// ─────────────────────────────────────────────────────────────
// Gemini "Reverse Prompt" proxy
// ─────────────────────────────────────────────────────────────
app.post('/api/reverse-prompt', reversePromptLimiter, async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body || {};

    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: 'imageBase64 and mimeType are required.' });
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: 'Analyze this image and generate a detailed AI art prompt (Midjourney style). Only return the prompt text.',
                },
                { inline_data: { mime_type: mimeType, data: imageBase64 } },
              ],
            },
          ],
        }),
      }
    );

    const result = await geminiResponse.json();
    res.status(geminiResponse.status).json(result);
  } catch (err) {
    console.error('Gemini proxy error:', err);
    res.status(500).json({ error: 'Failed to reach the Gemini API.' });
  }
});

// Root health checks for fallback routing
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`✅ PromptVessel proxy server running on http://localhost:${PORT}`);
});

module.exports = app;