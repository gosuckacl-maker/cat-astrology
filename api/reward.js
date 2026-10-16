// api/reward.js - Vercel Serverless 광고 시청 완료 후 마력(질문 횟수) 충전 (+2회)
const { getUser, getUserIdFromRequest, setCorsHeaders } = require('./_store');

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const userId = getUserIdFromRequest(req);
    const user = getUser(userId);

    user.quota += 2;
    user.totalAdsWatched += 1;

    return res.status(200).json({
      success: true,
      quota: user.quota,
      added: 2,
      message: '🎉 츄르 광고 시청 완료! 루나의 마력이 +2 충전되었다냥! 🐾'
    });
  } catch (error) {
    console.error('[api/reward Error]:', error);
    return res.status(500).json({
      success: false,
      message: '보상 충전 중 오류가 발생했다냥.',
      error: error.message
    });
  }
};
