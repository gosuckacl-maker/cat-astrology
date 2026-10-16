// api/quota.js - Vercel Serverless 유저 잔여 질문 횟수 조회 엔드포인트
const { getUser, getUserIdFromRequest, setCorsHeaders } = require('./_store');

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const userId = getUserIdFromRequest(req);
    const user = getUser(userId);

    return res.status(200).json({
      success: true,
      quota: user.quota,
      totalQuestions: user.totalQuestions,
      totalAdsWatched: user.totalAdsWatched
    });
  } catch (error) {
    console.error('[api/quota Error]:', error);
    return res.status(500).json({
      success: false,
      message: '쿼터 조회 중 오류가 발생했다냥.',
      error: error.message
    });
  }
};
