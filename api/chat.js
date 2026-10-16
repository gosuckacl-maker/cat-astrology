// api/chat.js - Vercel Serverless Gemini 2.5 Flash 연동 & 질문 처리 엔드포인트
// 대점성술사 루나 13세 페르소나 시스템 프롬프트 및 쿼터 차감 내장
const { getUser, getUserIdFromRequest, setCorsHeaders } = require('./_store');
let GoogleGenerativeAI;
try {
  GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
} catch (e) {
  GoogleGenerativeAI = null;
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const userId = getUserIdFromRequest(req);
    const user = getUser(userId);

    // 1. 잔여 질문 횟수 확인 (무료 3회)
    if (user.quota <= 0) {
      return res.status(403).json({
        success: false,
        error: 'QUOTA_EXHAUSTED',
        message: '루나의 마력이 모두 소진되었다냥! 츄르 광고(10초)를 보고 마력을 충전하라옹 🐟',
        quota: 0
      });
    }

    const { query, message, chartData } = req.body || {};
    const questionText = query || message;

    if (!questionText || typeof questionText !== 'string' || questionText.trim().length === 0) {
      return res.status(400).json({ success: false, message: '질문 내용을 입력해달라냥!' });
    }

    // 2. 질문 1회 차감
    user.quota -= 1;
    user.totalQuestions += 1;

    const apiKey = process.env.GEMINI_API_KEY;

    // 3. Gemini API 키가 있는 경우 Gemini 2.5 Flash 호출
    if (apiKey && apiKey.trim().length > 0) {
      try {
        const replyText = await callGemini(questionText.trim(), chartData, apiKey.trim());
        return res.status(200).json({
          success: true,
          reply: replyText,
          quota: user.quota
        });
      } catch (geminiError) {
        console.warn('[Gemini Call Failed, Falling back to Luna Offline Engine]:', geminiError.message);
        const fallbackReply = generateFallbackAstrology(questionText.trim(), chartData);
        return res.status(200).json({
          success: true,
          reply: fallbackReply,
          quota: user.quota,
          notice: 'Gemini 일시 지연으로 오프라인 냥성술 지혜를 전했다냥! 🐾'
        });
      }
    }

    // 4. API 키가 설정되지 않은 경우 고품질 오프라인 냥성술 엔진으로 안전 응답
    const offlineReply = generateFallbackAstrology(questionText.trim(), chartData);
    return res.status(200).json({
      success: true,
      reply: offlineReply,
      quota: user.quota
    });

  } catch (error) {
    console.error('[api/chat Error]:', error);
    return res.status(500).json({
      success: false,
      message: '별빛 교신 중 오류가 발생했다냥. 잠시 후 다시 시도해달라옹!',
      error: error.message
    });
  }
};

// Gemini API 호출 함수 (gemini-2.5-flash 우선 및 안전 멀티 모델 폴백)
async function callGemini(query, chartData, apiKey) {
  let chartContext = '현재 등록된 출생 차트 없음 (질문자에게 생년월일시 입력을 자연스럽게 유도할 것)';
  if (chartData) {
    chartContext = `
[집사의 Astro-Seek 출생 차트 계산 데이터]
- 출생일시: ${chartData.birthDate || '미상'} ${chartData.birthTime || '미상'} (${chartData.cityName || 'Seoul'})
- ☀️ 태양(Sun, 본질 자아): ${chartData.sun ? chartData.sun.name : '사수자리'}
- 🌙 달(Moon, 내면/무의식): ${chartData.moon ? chartData.moon.name : '천칭자리'}
- ⬆️ 상승궁(Ascendant, 첫인상/사회적가면): ${chartData.ascendant ? chartData.ascendant.name : '처녀자리'}
- 💖 금성(Venus, 연애/가치관): ${chartData.venus ? chartData.venus.name : '전갈자리'}
- ⚔️ 화성(Mars, 열정/사냥본능): ${chartData.mars ? chartData.mars.name : '염소자리'}
- 주요 행성 및 아스펙트: ${chartData.aspects ? chartData.aspects.join(', ') : '온화한 조화각'}
    `;
  }

  const systemInstruction = `
당신은 머나먼 묘성(猫星) 은하에서 온 신비롭고 영험한 대점성술사 고양이 '루나 13세'입니다.

[말투 및 성격 지침]
1. 친근하고 귀여운 고양이 말투를 씁니다. 문장 끝에 반드시 '~다냥', '~옹', '~냐옹', '~다냥!' 등을 자연스럽게 붙입니다.
2. 사용자를 다정하게 '집사', '집사여', '소중한 집사'로 부릅니다.
3. 고양이 생태계 비유(츄르, 캣닢, 발바닥 젤리, 그루밍, 캣타워, 골골송)를 점성학적 풀이에 위트 있게 녹여냅니다.

[점성술 해석 지침]
1. 제공된 [집사의 Astro-Seek 출생 차트 계산 데이터]의 태양, 달, 상승궁(Big 3) 및 행성 궤도를 바탕으로 정통 서양 점성학에 입각해 해석합니다.
2. 사용자의 질문("${query}")에 구체적으로 직결된 통찰을 제공하세요. 뻔하거나 반복적인 답변을 절대 피하고, 행성의 각도(트랜짓, 하우스)를 들어 상세하고 흥미진진하게 풀어냅니다.
3. 질문에 대해 따뜻하고 현실적인 해결책과 희망찬 힐링 메시지, 그리고 '루나의 묘성 부적' 키워드를 전해줍니다.
4. [수호 냥이 성격 유형 (MBTI 스타일 고양이 칭호) 언급]: 풀이 시작이나 요약부에서 집사의 별자리/행성에 매칭되는 재치 있는 고양이 수호신 칭호(예: 사자자리 "우주를 호령하는 턱시도 사자냥", 쌍둥이자리 "호기심 많은 삼색이 수성냥", 게자리 "도도하고 섬세한 페르시안 달빛냥", 양자리 "장난기 넘치는 치즈태비 화성냥", 황소자리 "고급 츄르를 음미하는 브리티시 미식냥" 등)와 한 줄 성격 요약을 친근하게 짚어주세요.
  `;

  // 1. @google/generative-ai SDK를 통한 gemini-2.5-flash 호출 시도
  if (GoogleGenerativeAI) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: systemInstruction
      });
      const result = await model.generateContent(`${chartContext}\n\n[집사의 질문]\n${query}`);
      const text = result?.response?.text();
      if (text && text.trim().length > 0) {
        return text;
      }
    } catch (sdkError) {
      console.warn('[SDK gemini-2.5-flash call failed, trying candidate endpoints]:', sdkError.message);
    }
  }

  // 2. Direct REST API 호출 (gemini-2.5-flash, gemini-3.1-flash-lite 등 순차 폴백)
  const candidateModels = [
    'gemini-2.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest',
    'gemini-3.5-flash'
  ];

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${chartContext}\n\n[집사의 질문]\n${query}` }]
          }
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 2048
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 0) {
          return text;
        }
      }
    } catch (e) {
      console.warn(`[Vercel API Model ${model} Failed]:`, e.message);
    }
  }

  throw new Error('모든 Gemini 모델 응답 생성 실패');
}

// 오프라인 냥성술 정밀 분석 엔진
function generateFallbackAstrology(query, chartData) {
  const sun = chartData?.sun?.name || '사수자리';
  const moon = chartData?.moon?.name || '천칭자리';
  const asc = chartData?.ascendant?.name || '황소자리';
  const q = query.toLowerCase();

  // 1. 금전 / 재물 관련
  if (q.includes('금전') || q.includes('재물') || q.includes('돈') || q.includes('부자') || q.includes('투자') || q.includes('월급')) {
    return `묘성 은하의 황금 츄르 별이 집사의 2하우스(자가소득)와 8하우스(투자/이자) 상공에서 번쩍이고 있다냥! 🪙✨<br><br>
집사의 태양(${sun})과 상승궁(${asc}) 배치를 살펴보면, 올해 하반기 목성(Jupiter)의 순행 에너지 덕분에 생각지도 못한 부수입이나 인센티브, 혹은 정체되었던 금전 흐름이 시원하게 뚫릴 운명이다옹!<br><br>
💰 <strong>루나의 금전 대운 치트키:</strong><br>
• <strong>황금 수확기:</strong> 9월과 11월에 재물 그릇이 가장 커진다냥. 계약이나 성과급 협상에서 당당하게 요구하라옹.<br>
• <strong>주의할 점:</strong> 기분에 취해 지르는 충동구매만 조심하면 올해 가장 든든한 통장을 목격하게 될 것이다냥!<br>
🐾 <strong>행운의 황금 부적:</strong> #황금동전 #노란색카드지갑 #따뜻한차`;
  }

  // 2. 전체 운세 / 올해 운세 / 상세 운세
  if (q.includes('올해') || q.includes('운세') || q.includes('자세') || q.includes('앞으로') || q.includes('미래') || q.includes('총운')) {
    return `집사의 <strong>태양(${sun})</strong>의 진취적인 불꽃과 <strong>달(${moon})</strong>의 우아하고 균형 잡힌 기운을 정밀 추적했다냥! 🌌🔮<br><br>
올해는 집사에게 '새로운 영토를 확장하고 오랜 망설임을 끝내는 대도약의 해'다옹. 지난 시간 동안 쌓아온 내공이 드디어 빛을 발하기 시작한다냥!<br><br>
📅 <strong>2026 시기별 집중 가이드:</strong><br>
• <strong>상반기~가을:</strong> 대인관계의 외연이 넓어지고 집사를 지지해 주는 귀인이 나타나는 시기다옹.<br>
• <strong>가을~겨울:</strong> 명예와 성취(10하우스)의 궤도가 정점에 달해 노력한 만큼 커다란 트로피가 손에 쥐어질 것이다냥!<br><br>
🐾 <strong>루나의 묘성 조언:</strong> "고양이는 높은 곳을 두려워하지 않고 우아하게 착지한다냥. 집사 안의 잠재력을 믿고 과감하게 발을 내딛으라옹!" 🐾✨`;
  }

  // 3. 연애 / 사랑 / 인연
  if (q.includes('연애') || q.includes('사랑') || q.includes('이상형') || q.includes('썸') || q.includes('인연')) {
    return `수정구슬 속에서 집사의 금성(Venus)과 7하우스가 은은한 핑크빛을 뿜어내고 있다냥! 💖<br><br>
집사의 태양(${sun})과 달(${moon})은 겉으로는 쿨하고 당당해 보여도, 마음을 준 상대 앞에서는 무한 골골송을 부르는 매력 덩어리다옹.<br><br>
✨ <strong>루나의 연애 점괘:</strong> 일상적인 공간이나 편안한 모임에서 집사의 지적인 아우라에 매료될 인연이 다가올 운명이다냥. 서두르지 말고 포근하게 미소를 지어보라옹!<br>
🐾 <strong>행운의 사랑 부적:</strong> #라벤더향수 #따뜻한밀크티 #핑크빛머플러`;
  }

  // 4. 직업 / 이직 / 커리어
  if (q.includes('직업') || q.includes('커리어') || q.includes('이직') || q.includes('취업') || q.includes('천직')) {
    return `집사의 10하우스(사회적 성취) 상공에 화성과 수성의 총명한 궤도가 교차하고 있다냥! ⚔️📜<br><br>
집사는 타고난 기획력과 추진력을 겸비한 리더형 고양이다옹. 지금 고민 중인 이직이나 프로젝트는 새로운 돌파구가 될 가능성이 90% 이상이다냥!<br><br>
🎯 <strong>루나의 커리어 비기:</strong> 주변의 눈치를 보지 말고 집사만의 확실한 포트폴리오를 밀어붙이라옹. 가을 무렵 스카우트나 승진의 기운이 강력하다냥!<br>
🐾 <strong>행운의 성공 부적:</strong> #반듯한메모장 #남색자켓 #은색볼펜`;
  }

  // 5. 기본 응답
  return `별들의 궤도를 살피니 집사의 태양(${sun})과 달(${moon})이 우주와 깊은 공명을 이루고 있다냥! 🌌🔮<br><br>
"비바람이 몰아쳐도 굳센 고양이는 따스한 햇살을 찾아내어 낮잠을 즐긴다옹."<br>
질문하신 [${query}]에 대해, 우주는 집사의 발걸음마다 은하수 길을 비추고 있다냥! 불안해하지 말고 스스로의 직관과 유연함을 믿으라옹!<br><br>
더 알고 싶은 테마(연애운, 금전운, 커리어운)를 편하게 콕 집어서 루나에게 말해보라옹! 🐾✨`;
}
