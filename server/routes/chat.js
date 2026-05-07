import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

router.post('/', async (req, res) => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const jwtSecret = process.env.JWT_SECRET;
  if (!apiKey) {
    return res.status(500).json({
      code: 500,
      message: 'DEEPSEEK_API_KEY is not configured',
    });
  }
  if (!jwtSecret) {
    return res.status(500).json({
      code: 500,
      message: 'JWT_SECRET is not configured',
    });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  try {
    jwt.verify(token, jwtSecret);
  } catch {
    return res.status(401).json({
      code: 401,
      message: 'Unauthorized',
    });
  }

  const { messages } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({
      code: 400,
      message: 'messages must be an array',
    });
  }

  try {
    const upstream = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        stream: true,
        messages,
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text();
      return res.status(upstream.status).json({
        code: upstream.status,
        message: text || 'DeepSeek request failed',
      });
    }

    res.status(upstream.status);
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    const reader = upstream.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
    } finally {
      res.end();
      reader.releaseLock();
    }
  } catch (error) {
    console.error('Chat proxy failed:', error);
    if (!res.headersSent) {
      res.status(500).json({
        code: 500,
        message: 'Chat proxy failed',
      });
    } else {
      res.end();
    }
  }
});

export default router;
