import './env.js';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import chatRouter from './routes/chat.js';

const app = express();
const PORT = 3000;

// 中间件
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json());

// 路由
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Wander 后端服务已启动: http://localhost:${PORT}`);
  console.log(`📡 API 地址: http://localhost:${PORT}/api`);
});
