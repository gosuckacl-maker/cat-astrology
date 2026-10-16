// api/_store.js - Vercel Serverless 유저 쿼터 관리 인메모리 스토어
// 기본 무료 질문 3회 + 10초 광고 시청 시 +2회 충전

const userStore = new Map();

function getUser(userId) {
  if (!userId || typeof userId !== 'string') {
    userId = 'guest_' + Math.random().toString(36).substring(2, 9);
  }
  if (!userStore.has(userId)) {
    userStore.set(userId, {
      quota: 3, // 기본 무료 제공 3회
      totalQuestions: 0,
      totalAdsWatched: 0,
      createdAt: Date.now()
    });
  }
  return userStore.get(userId);
}

function getUserIdFromRequest(req) {
  return (
    req.headers['x-user-id'] ||
    req.headers['x-web-user-id'] ||
    (req.query && (req.query.userId || req.query.user_id)) ||
    'guest'
  );
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-User-Id, X-Web-User-Id'
  );
}

module.exports = {
  getUser,
  getUserIdFromRequest,
  setCorsHeaders,
  userStore
};
