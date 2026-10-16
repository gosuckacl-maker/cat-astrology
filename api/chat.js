// api/chat.js - Vercel Serverless Gemini 2.5 Flash 연동 & 질문 처리 엔드포인트
// 대점성술사 루나 13세 페르소나 시스템 프롬프트 및 동적 수호냥이 바인딩
const { getUser, getUserIdFromRequest, setCorsHeaders } = require('./_store');
let GoogleGenerativeAI;
try {
  GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
} catch (e) {
  GoogleGenerativeAI = null;
}

// 12별자리 및 수호냥이 매핑 사전
const ZODIAC_LIST = [
  { key: 'aries', name: '양자리', cat: 'cheese' },
  { key: 'taurus', name: '황소자리', cat: 'british' },
  { key: 'gemini', name: '쌍둥이자리', cat: 'calico' },
  { key: 'cancer', name: '게자리', cat: 'persian' },
  { key: 'leo', name: '사자자리', cat: 'tuxedo' },
  { key: 'virgo', name: '처녀자리', cat: 'siamese' },
  { key: 'libra', name: '천칭자리', cat: 'russianblue' },
  { key: 'scorpio', name: '전갈자리', cat: 'blackcat' },
  { key: 'sagittarius', name: '사수자리', cat: 'bengal' },
  { key: 'capricorn', name: '염소자리', cat: 'norwegian' },
  { key: 'aquarius', name: '물병자리', cat: 'sphynx' },
  { key: 'pisces', name: '물고기자리', cat: 'turkish' }
];

function getZodiacFromDate(month, day) {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { key: 'aries', name: '양자리', cat: 'cheese' };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { key: 'taurus', name: '황소자리', cat: 'british' };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return { key: 'gemini', name: '쌍둥이자리', cat: 'calico' };
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return { key: 'cancer', name: '게자리', cat: 'persian' };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { key: 'leo', name: '사자자리', cat: 'tuxedo' };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { key: 'virgo', name: '처녀자리', cat: 'siamese' };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { key: 'libra', name: '천칭자리', cat: 'russianblue' };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { key: 'scorpio', name: '전갈자리', cat: 'blackcat' };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { key: 'sagittarius', name: '사수자리', cat: 'bengal' };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { key: 'capricorn', name: '염소자리', cat: 'norwegian' };
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { key: 'aquarius', name: '물병자리', cat: 'sphynx' };
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return { key: 'pisces', name: '물고기자리', cat: 'turkish' };
  return { key: 'aries', name: '양자리', cat: 'cheese' };
}

function extractBirthAndSign(query, chartData) {
  if (chartData && chartData.sun && chartData.sun.name) {
    return {
      sunName: chartData.sun.name,
      sunKey: chartData.sun.key || 'taurus',
      birthDate: chartData.birthDate || null,
      birthTime: chartData.birthTime || null,
      cityName: chartData.cityName || 'Seoul'
    };
  }

  const text = query || '';
  const mYr = text.match(/(?:19\d{2}|20\d{2}|[5-9]\d|0\d|1\d|2\d)(?:년|\.|\-|\/)?/);
  const mMd = text.match(/(\d{1,2})\s*(?:월|\.|\-|\/)\s*(\d{1,2})\s*(?:일)?/);

  if (mMd) {
    const month = parseInt(mMd[1], 10);
    const day = parseInt(mMd[2], 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const sign = getZodiacFromDate(month, day);
      return {
        sunName: sign.name,
        sunKey: sign.key,
        birthDate: mYr ? `${mYr[0]} ${month}월 ${day}일` : `${month}월 ${day}일`,
        birthTime: null,
        cityName: 'Seoul'
      };
    }
  }

  for (const z of ZODIAC_LIST) {
    if (text.includes(z.name) || text.toLowerCase().includes(z.key)) {
      return {
        sunName: z.name,
        sunKey: z.key,
        birthDate: null,
        birthTime: null,
        cityName: 'Seoul'
      };
    }
  }

  return null;
}

function pickDynamicCatKey(seedText) {
  const keys = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  let hash = 0;
  const str = (seedText || '') + new Date().toDateString();
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % keys.length;
  return keys[index];
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
    const extracted = extractBirthAndSign(questionText.trim(), chartData);

    // 3. Gemini API 키가 있는 경우 Gemini 2.5 Flash 호출
    if (apiKey && apiKey.trim().length > 0) {
      try {
        const geminiResult = await callGemini(questionText.trim(), chartData, extracted, apiKey.trim());
        const finalCatId = (chartData?.sun?.key) || (extracted?.sunKey) || geminiResult.guardianCatId || pickDynamicCatKey(questionText);
        return res.status(200).json({
          success: true,
          reply: geminiResult.replyText,
          guardianCatId: finalCatId,
          quota: user.quota
        });
      } catch (geminiError) {
        console.warn('[Gemini Call Failed, Falling back to Luna Offline Engine]:', geminiError.message);
        const fallbackResult = generateFallbackAstrology(questionText.trim(), chartData, extracted);
        return res.status(200).json({
          success: true,
          reply: fallbackResult.reply,
          guardianCatId: fallbackResult.guardianCatId,
          quota: user.quota,
          notice: 'Gemini 일시 지연으로 오프라인 냥성술 지혜를 전했다냥! 🐾'
        });
      }
    }

    // 4. API 키가 설정되지 않은 경우 고품질 오프라인 냥성술 엔진으로 안전 응답
    const offlineResult = generateFallbackAstrology(questionText.trim(), chartData, extracted);
    return res.status(200).json({
      success: true,
      reply: offlineResult.reply,
      guardianCatId: offlineResult.guardianCatId,
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
async function callGemini(query, chartData, extracted, apiKey) {
  let chartContext = '';
  if (chartData && (chartData.sun || chartData.birthDate)) {
    chartContext = `
[집사의 Astro-Seek 출생 차트 계산 데이터]
- 출생일시: ${chartData.birthDate || '미상'} ${chartData.birthTime || '미상'} (${chartData.cityName || 'Seoul'})
- ☀️ 태양(Sun, 본질 자아): ${chartData.sun ? chartData.sun.name : (extracted ? extracted.sunName : '미상')}
- 🌙 달(Moon, 내면/무의식): ${chartData.moon ? chartData.moon.name : '천체 궤도 추적 중'}
- ⬆️ 상승궁(Ascendant, 첫인상/사회적가면): ${chartData.ascendant ? chartData.ascendant.name : '천체 궤도 추적 중'}
- 💖 금성(Venus, 연애/가치관): ${chartData.venus ? chartData.venus.name : '천체 궤도 추적 중'}
- ⚔️ 화성(Mars, 열정/사냥본능): ${chartData.mars ? chartData.mars.name : '천체 궤도 추적 중'}
- 주요 행성 및 아스펙트: ${chartData.aspects && chartData.aspects.length > 0 ? chartData.aspects.join(', ') : '온화한 조화각'}
    `;
  } else if (extracted) {
    chartContext = `
[집사의 질문에서 감지된 점성술 데이터]
- 추정 출생 정보: ${extracted.birthDate || '언급된 날짜/별자리 기반'}
- ☀️ 태양 별자리: ${extracted.sunName} (${extracted.sunKey})
    `;
  } else {
    chartContext = `
[출생 차트 미등록 상태]
집사가 아직 생년월일시를 등록하지 않았습니다. 질문 내용의 뉘앙스를 바탕으로 위트 있게 풀어내고, 더 정확한 Big 3 분석을 위해 생년월일시 입력을 자연스럽게 권유하세요.
    `;
  }

  const systemInstruction = `
당신은 머나먼 묘성(猫星) 은하에서 온 신비롭고 영험한 대점성술사 고양이 '루나 13세'입니다.

[★최우선 필수 규칙: 수호 냥이 유형 ID 태그 출력]
답변의 맨 첫 번째 줄에 반드시 다음 형식으로 수호 냥이 유형 ID를 정확히 한 줄 출력해야 합니다:
[GUARDIAN_CAT_ID: <유형ID>]
(사용 가능한 유형 ID:
- aries (또는 cheese): 양자리, 장난기 넘치는 치즈태비 화성냥
- taurus (또는 british): 황소자리, 고급 츄르를 음미하는 브리티시 미식냥
- gemini (또는 calico): 쌍둥이자리, 호기심 많은 삼색이 수성냥
- cancer (또는 persian): 게자리, 도도하고 섬세한 페르시안 달빛냥
- leo (또는 tuxedo): 사자자리, 우주를 호령하는 턱시도 사자냥
- virgo (또는 siamese): 처녀자리, 완벽한 그루밍의 샴 고양이 책사냥
- libra (또는 russianblue): 천칭자리, 우아한 발걸음의 러시안블루 귀족냥
- scorpio (또는 blackcat): 전갈자리, 어둠 속을 꿰뚫는 올블랙 마법냥
- sagittarius (또는 bengal): 사수자리, 은하수를 방랑하는 벵갈 탐험냥
- capricorn (또는 norwegian): 염소자리, 캣타워 정상에 오른 노르웨이숲 야망냥
- aquarius (또는 sphynx): 물병자리, 외계 전파를 수신하는 스핑크스 외계냥
- pisces (또는 turkish): 물고기자리, 꿈속 은하수를 유영하는 터키시앙고라 힐러냥
- 기타 스페셜: munchkin(먼치킨), ragdoll(랙돌), mainecoon(메인쿤), scottish(스코티시폴드)
)
* 선택 기준:
  1. 집사의 차트 데이터나 질문에 특정 별자리나 생년월일이 명시되어 있다면 그에 해당하는 ID를 지정하세요.
  2. 별자리가 없다면 질문 내용의 기운(열정적이면 aries, 힐링/위로면 cancer/pisces, 성취/이직이면 capricorn, 연애면 libra/cancer, 지적호기심이면 gemini 등)에 맞춰 가장 어울리는 ID를 지정하세요.
  3. 절대 고정된 특정 ID만 반복하지 마세요! 질문자의 특성에 맞는 고유한 ID를 부여하세요.
* 첫 줄에 [GUARDIAN_CAT_ID: ...]를 출력한 후, 다음 줄부터 정통 점성술 답변 본문을 시작하세요.

[말투 및 성격 지침]
1. 친근하고 귀여운 고양이 말투를 씁니다. 문장 끝에 반드시 '~다냥', '~옹', '~냐옹', '~다냥!' 등을 자연스럽게 붙입니다.
2. 사용자를 다정하게 '집사', '집사여', '소중한 집사'로 부릅니다.
3. 고양이 생태계 비유(츄르, 캣닢, 발바닥 젤리, 그루밍, 캣타워, 골골송)를 점성학적 풀이에 위트 있게 녹여냅니다.

[점성술 해석 지침]
1. 제공된 [차트 데이터]의 태양, 달, 상승궁 및 행성 궤도를 바탕으로 정통 서양 점성학에 입각해 해석합니다.
2. 사용자의 질문("${query}")에 구체적으로 직결된 통찰을 제공하세요. 뻔하거나 반복적인 답변을 절대 피하고, 천체들의 각도와 트랜짓을 들어 상세하고 흥미진진하게 풀어냅니다.
3. 질문에 대해 따뜻하고 현실적인 해결책과 희망찬 힐링 메시지, 그리고 '루나의 묘성 부적' 키워드를 전해줍니다.
4. 풀이 서두나 요약에서 집사의 수호 냥이 성격 유형(예: "우주를 호령하는 턱시도 사자냥" 등)을 언급하며 그 매력을 짚어주세요.
  `;

  let rawText = null;

  // 1. @google/generative-ai SDK를 통한 gemini-3.8-flash / 3.1-flash-lite 호출 시도
  if (GoogleGenerativeAI) {
    for (const sdkModel of ['gemini-3.8-flash', 'gemini-3.1-flash-lite']) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: sdkModel,
          systemInstruction: systemInstruction
        });
        const result = await model.generateContent(`${chartContext}\n\n[집사의 질문]\n${query}`);
        const text = result?.response?.text();
        if (text && text.trim().length > 0) {
          rawText = text.trim();
          break;
        }
      } catch (sdkError) {
        console.warn(`[SDK ${sdkModel} call failed, trying next]:`, sdkError.message);
      }
    }
  }

  // 2. Direct REST API 호출 (순차 폴백 - 빠른 응답을 위해 5초 타임아웃 적용)
  if (!rawText) {
    const candidateModels = [
      'gemini-3.8-flash',
      'gemini-3.1-flash-lite',
      'gemini-flash-latest'
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
          body: JSON.stringify(payload),
          signal: (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) ? AbortSignal.timeout(6000) : undefined
        });

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim().length > 0) {
            rawText = text.trim();
            break;
          }
        }
      } catch (e) {
        console.warn(`[Vercel API Model ${model} Failed]:`, e.message);
      }
    }
  }

  if (!rawText) {
    throw new Error('모든 Gemini 모델 응답 생성 실패');
  }

  let guardianCatId = null;
  const tagMatch = rawText.match(/\[GUARDIAN_CAT_ID:\s*([a-zA-Z0-9_-]+)\]/i);
  if (tagMatch) {
    guardianCatId = tagMatch[1].toLowerCase().trim();
    rawText = rawText.replace(/\[GUARDIAN_CAT_ID:\s*([a-zA-Z0-9_-]+)\]\s*\n?/i, '').trim();
  }

  return {
    replyText: rawText,
    guardianCatId: guardianCatId
  };
}

// 오프라인 냥성술 정밀 분석 엔진 (다양하고 동적인 운세 생성)
function generateFallbackAstrology(query, chartData, extracted) {
  let sunSign = '사수자리';
  let sunKey = 'sagittarius';
  let moonSign = '천칭자리';
  let ascSign = '사자자리';

  if (chartData && chartData.sun && chartData.sun.name) {
    sunSign = chartData.sun.name;
    sunKey = chartData.sun.key || 'taurus';
    moonSign = chartData.moon?.name || '염소자리';
    ascSign = chartData.ascendant?.name || '처녀자리';
  } else if (extracted) {
    sunSign = extracted.sunName;
    sunKey = extracted.sunKey;
    const zPool = ['양자리', '황소자리', '쌍둥이자리', '게자리', '사자자리', '처녀자리', '천칭자리', '전갈자리', '사수자리', '염소자리', '물병자리', '물고기자리'];
    const idx = zPool.indexOf(sunSign);
    moonSign = zPool[(idx >= 0 ? idx + 4 : 4) % 12];
    ascSign = zPool[(idx >= 0 ? idx + 7 : 7) % 12];
  } else {
    sunKey = pickDynamicCatKey(query);
    const zMap = {
      aries: '양자리', taurus: '황소자리', gemini: '쌍둥이자리', cancer: '게자리',
      leo: '사자자리', virgo: '처녀자리', libra: '천칭자리', scorpio: '전갈자리',
      sagittarius: '사수자리', capricorn: '염소자리', aquarius: '물병자리', pisces: '물고기자리'
    };
    sunSign = zMap[sunKey] || '사수자리';
    moonSign = '천칭자리';
    ascSign = '사자자리';
  }

  const q = query.toLowerCase();
  let reply = '';

  // 1. 금전 / 재물 관련
  if (q.includes('금전') || q.includes('재물') || q.includes('돈') || q.includes('부자') || q.includes('투자') || q.includes('월급') || q.includes('로또')) {
    reply = `묘성 은하의 황금 츄르 별이 집사의 <strong>2하우스(자가소득)와 8하우스(투자/이자)</strong> 상공에서 찬란하게 번쩍이고 있다냥! 🪙✨<br><br>
집사의 본질인 <strong>태양(${sunSign})</strong>과 <strong>상승궁(${ascSign})</strong> 배치를 살펴보면, 올해 하반기 목성(Jupiter)의 대길각 덕분에 생각지도 못한 부수입이나 인센티브, 혹은 정체되었던 금전 흐름이 시원하게 뚫릴 운명이다옹!<br><br>
💰 <strong>루나의 금전 대운 치트키:</strong><br>
• <strong>황금 수확기:</strong> 이번 분기 후반부에 재물 그릇이 가장 커진다냥. 계약이나 급여 협상에서 당당하게 요구하라옹.<br>
• <strong>주의할 점:</strong> 기분에 취해 지르는 충동구매만 조심하면 올해 가장 든든한 통장을 목격하게 될 것이다냥!<br><br>
🐾 <strong>루나의 황금 부적:</strong> #황금동전 #노란색카드지갑 #따뜻한차`;
  }
  // 2. 연애 / 사랑 / 썸 / 인연
  else if (q.includes('연애') || q.includes('사랑') || q.includes('이상형') || q.includes('썸') || q.includes('인연') || q.includes('재회') || q.includes('결혼')) {
    reply = `수정구슬 속에서 집사의 <strong>금성(Venus)과 7하우스(인연궁)</strong>가 은은한 핑크빛 오라를 뿜어내고 있다냥! 💖<br><br>
집사의 <strong>태양(${sunSign})</strong>과 <strong>달(${moonSign})</strong>은 겉으로는 쿨하고 당당해 보여도, 마음을 준 사람 앞에서는 밤새 골골송을 들려주는 마성의 매력 덩어리다옹.<br><br>
✨ <strong>루나의 연애 점괘:</strong> 일상적인 공간이나 편안한 모임에서 집사의 지적인 아우라에 매료될 인연이 다가올 운명이다냥. 서두르지 말고 포근하게 미소를 지어보라옹!<br><br>
🐾 <strong>행운의 사랑 부적:</strong> #라벤더향수 #따뜻한밀크티 #핑크빛머플러`;
  }
  // 3. 직업 / 이직 / 커리어 / 시험
  else if (q.includes('직업') || q.includes('커리어') || q.includes('이직') || q.includes('취업') || q.includes('천직') || q.includes('시험') || q.includes('합격')) {
    reply = `집사의 <strong>10하우스(사회적 성취)</strong> 상공에 화성과 수성의 총명한 궤도가 교차하고 있다냥! ⚔️📜<br><br>
집사는 타고난 기획력과 디테일한 실행력을 겸비한 리더형 고양이다옹. 지금 고민 중인 이직이나 프로젝트는 새로운 돌파구가 될 가능성이 90% 이상이다냥!<br><br>
🎯 <strong>루나의 커리어 비기:</strong> 주변의 눈치를 보지 말고 집사만의 확실한 포트폴리오를 밀어붙이라옹. 가을 무렵 스카우트나 승진의 기운이 강력하다냥!<br><br>
🐾 <strong>행운의 성공 부적:</strong> #반듯한메모장 #남색자켓 #은색볼펜`;
  }
  // 4. 힐링 / 위로 / 건강
  else if (q.includes('힘들') || q.includes('지쳐') || q.includes('피곤') || q.includes('불안') || q.includes('우울') || q.includes('힐링') || q.includes('건강')) {
    reply = `토닥토닥... 골골골골... 🐾 집사의 <strong>달(${moonSign})</strong> 별자리가 감정의 만조(High Tide)를 겪으며 잔잔하게 요동치고 있다옹.<br><br>
달은 우리의 가장 여린 속살과 같은 무의식을 관장한다냥. 남들에게는 씩씩한 척, 아무렇지 않은 척 털을 세웠지만 속으로는 얼마나 애쓰고 지쳤겠느냐옹...<br><br>
🌙 <strong>루나의 달빛 힐링 처방전:</strong> 오늘 밤만큼은 세상의 모든 알림을 무음으로 돌리고, 폭신한 이불 속에서 배를 드러내고 푹 쉬라냥. 고양이가 낮잠으로 에너지를 채우듯, 내일 아침이면 다시 반짝이는 눈동자로 세상을 바라보게 될 것이다옹! 💤✨<br><br>
🐾 <strong>행운의 안식 부적:</strong> #캐모마일티 #푹신한수면양말 #캔들라이트`;
  }
  // 5. 전체 / 올해 / 미래 / 운세
  else if (q.includes('올해') || q.includes('운세') || q.includes('자세') || q.includes('앞으로') || q.includes('미래') || q.includes('총운') || q.includes('오늘')) {
    reply = `집사의 <strong>태양(${sunSign})</strong>의 진취적인 불꽃과 <strong>달(${moonSign})</strong>의 우아하고 균형 잡힌 기운을 정밀 추적했다냥! 🌌🔮<br><br>
올해는 집사에게 '새로운 영토를 확장하고 오랜 망설임을 끝내는 대도약의 해'다옹. 지난 시간 동안 쌓아온 내공이 드디어 빛을 발하기 시작한다냥!<br><br>
📅 <strong>2026 시기별 집중 가이드:</strong><br>
• <strong>상반기~가을:</strong> 대인관계의 외연이 넓어지고 집사를 지지해 주는 귀인이 나타나는 시기다옹.<br>
• <strong>가을~겨울:</strong> 명예와 성취(10하우스)의 궤도가 정점에 달해 노력한 만큼 커다란 트로피가 손에 쥐어질 것이다냥!<br><br>
🐾 <strong>루나의 묘성 조언:</strong> "고양이는 높은 곳을 두려워하지 않고 우아하게 착지한다냥. 집사 안의 잠재력을 믿고 과감하게 발을 내딛으라옹!" 🐾✨`;
  }
  // 6. 기본 응답
  else {
    reply = `별들의 궤도를 살피니 집사의 <strong>태양(${sunSign})</strong>과 <strong>달(${moonSign})</strong>이 우주와 깊은 공명을 이루고 있다냥! 🌌🔮<br><br>
"비바람이 몰아쳐도 굳센 고양이는 따스한 햇살을 찾아내어 낮잠을 즐긴다옹."<br>
질문하신 [${query}]에 대해, 우주는 집사의 발걸음마다 은하수 길을 비추고 있다냥! 불안해하지 말고 스스로의 직관과 유연함을 믿으라옹!<br><br>
더 알고 싶은 테마(연애운, 금전운, 커리어운)를 편하게 콕 집어서 루나에게 말해보라옹! 🐾✨`;
  }

  return {
    reply,
    guardianCatId: sunKey
  };
}
