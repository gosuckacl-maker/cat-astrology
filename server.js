require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const chatHandler = require('./api/chat');
const quotaHandler = require('./api/quota');
const rewardHandler = require('./api/reward');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Vercel Serverless Function 라우트 매핑 (로컬 개발 환경 완벽 호환)
app.all('/api/quota', (req, res) => quotaHandler(req, res));
app.all('/api/user-quota', (req, res) => quotaHandler(req, res));
app.all('/api/reward', (req, res) => rewardHandler(req, res));
app.all('/api/chat', (req, res) => chatHandler(req, res));

// SPA 기본 정적 서빙
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 서버 기동
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🐾 [별빛 냥성술 상담소] Vercel 호환 로컬 개발 서버 가동!`);
  console.log(`🌐 웹 사이트 접속: http://localhost:${PORT}`);
  console.log(`🔮 Gemini API 상태: ${process.env.GEMINI_API_KEY ? '연결됨 (gemini-2.5-flash)' : '미설정 (오프라인 냥성술 엔진 작동)'}`);
  console.log(`📁 Serverless Endpoints: /api/chat, /api/quota, /api/reward`);
  console.log(`===============================================`);
});
