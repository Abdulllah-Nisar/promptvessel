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

// Sirf apni frontend se requests allow karein -- koi aur website ya
// script ye proxy seedha nahi hit kar sakti. Live jaate waqt is list
// mein apna production domain (e.g. https://promptvessel.com) add karein.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

// Rate limiting -- ek IP se ek waqt mein sirf itni requests allow karta hai,
// taake koi bhi banda quota khatam karne ke liye website ko spam na kar sake.
const reversePromptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 15, // har IP se 15 minute mein max 15 image-analysis requests
  message: { error: 'Too many requests. Please wait a few minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const emdashLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // browsing/posts ke liye zyada generous limit
  message: { error: 'Too many requests. Please wait a few minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─────────────────────────────────────────────────────────────
// EmDash proxy
// Frontend calls: http://localhost:3001/proxy/_emdash/api/content/posts
// This forwards it to: http://localhost:4321/_emdash/api/content/posts
// and injects the Bearer token server-side -- the frontend never sees it.
//
// IMPORTANT: mounted BEFORE express.json(), otherwise the body-parser
// consumes the request stream and the proxy can't forward it (this would
// break POST requests like creating a post or uploading media).
// ─────────────────────────────────────────────────────────────
app.use(
  '/proxy',
  emdashLimiter,
  createProxyMiddleware({
    target: EMDASH_BASE_URL,
    changeOrigin: true,
    pathRewrite: { '^/proxy': '' },
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('Authorization', `Bearer ${EMDASH_TOKEN}`);
    },
  })
);

// Body parser for the routes below (safe here since /proxy is already handled above)
app.use(express.json({ limit: '15mb' })); // 15mb to comfortably fit base64 images

// ─────────────────────────────────────────────────────────────
// Gemini "Reverse Prompt" proxy
// Frontend sends: { imageBase64, mimeType }
// Backend attaches the real Gemini key and forwards the request.
// Response shape is identical to Gemini's raw response, so the frontend's
// existing parsing logic (result.candidates[0]...) works unchanged.
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
          'x-goog-api-key': GEMINI_API_KEY, // key header mein, query param mein nahi
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

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`✅ PromptVessel proxy server running on http://localhost:${PORT}`);
  console.log(`   EmDash requests -> http://localhost:${PORT}/proxy/... -> ${EMDASH_BASE_URL}`);
  console.log(`   Gemini requests -> http://localhost:${PORT}/api/reverse-prompt`);
});