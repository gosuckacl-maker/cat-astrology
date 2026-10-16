// 고양이 점성술사 루나 (Cat Astrologer Luna) - Astro-Seek 정밀 점성술 연동 스크립트

document.addEventListener('DOMContentLoaded', () => {
  // DOM 요소 참조
  const starCanvas = document.getElementById('starfield');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const typingIndicator = document.getElementById('typing-indicator');
  const typingDesc = document.getElementById('typing-desc');
  const crystalOrb = document.getElementById('crystal-orb');
  const catMoodText = document.getElementById('cat-mood-text');
  const catAvatar = document.getElementById('cat-avatar');
  
  // 헤더 및 질문 쿼터 UI 요소
  const userCreditsEl = document.getElementById('user-credits');
  const btnRechargeQuota = document.getElementById('btn-recharge-quota');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');

  // 마력 소진 및 보상형 광고 모달 요소
  const quotaModal = document.getElementById('quota-modal');
  const btnCloseQuota = document.getElementById('btn-close-quota');
  const btnCancelQuota = document.getElementById('btn-cancel-quota');
  const btnStartRewardFromModal = document.getElementById('btn-start-reward-from-modal');

  const rewardAdModal = document.getElementById('ad-reward-modal') || document.getElementById('reward-ad-modal');
  const btnSkipRewardAd = document.getElementById('btn-skip-reward-ad');
  const adTimerText = document.getElementById('ad-timer-text');
  const adProgressFill = document.getElementById('ad-progress-fill');
  const adRewardPurposeEl = document.getElementById('ad-reward-purpose');

  // Astro-Seek 차트 모달 요소
  const btnChartModal = document.getElementById('btn-chart-modal');
  const chartModal = document.getElementById('chart-modal');
  const btnCloseChartModal = document.getElementById('btn-close-chart-modal');
  const btnCancelChart = document.getElementById('btn-cancel-chart');
  const btnSaveChart = document.getElementById('btn-save-chart');
  const btnResetChart = document.getElementById('btn-reset-chart');
  const btnLoadSample = document.getElementById('btn-load-sample');
  const chartRawInput = document.getElementById('chart-raw-input');
  const headerChartStatus = document.getElementById('header-chart-status');
  const btnOpenChartQuick = document.getElementById('btn-open-chart-quick');
  const btnEditChart = document.getElementById('btn-edit-chart');

  // 차트 요약 카드 UI
  const chartEmptyState = document.getElementById('chart-empty-state');
  const big3Grid = document.getElementById('big3-grid');
  const valSun = document.getElementById('val-sun');
  const valMoon = document.getElementById('val-moon');
  const valAsc = document.getElementById('val-asc');

  // 부적 카드 모달 요소
  const btnDrawCard = document.getElementById('btn-draw-card');
  const cardModal = document.getElementById('card-modal');
  const btnCloseCard = document.getElementById('btn-close-card');
  const btnReshuffle = document.getElementById('btn-reshuffle');
  const btnCopyCard = document.getElementById('btn-copy-card');

  // 상태 관리
  let soundEnabled = localStorage.getItem('cat_sound_enabled') !== 'false';
  let savedChartData = null;
  let isGenerating = false;
  let userQuota = 3; // 기본 무료 질문 3회

  // 별자리 사전 (영문 -> 한글 및 심볼 매핑)
  const zodiacMap = {
    'aries': { name: '양자리', symbol: '♈', element: '불', trait: '용맹하고 진취적인 대장 고양이' },
    'taurus': { name: '황소자리', symbol: '♉', element: '흙', trait: '안락한 방석과 고급 츄르를 사랑하는 미식가' },
    'gemini': { name: '쌍둥이자리', symbol: '♊', element: '공기', trait: '호기심 폭발! 은하수 장난감을 쫓는 재간둥이' },
    'cancer': { name: '게자리', symbol: '♋', element: '물', trait: '포근한 담요처럼 다정하고 감수성 풍부한 집사 수호신' },
    'leo': { name: '사자자리', symbol: '♌', element: '불', trait: '캣타워 꼭대기에서 군림하는 위풍당당한 묘황' },
    'virgo': { name: '처녀자리', symbol: '♍', element: '흙', trait: '완벽한 그루밍과 날카로운 관찰력을 지닌 책사' },
    'libra': { name: '천칭자리', symbol: '♎', element: '공기', trait: '우아한 발걸음과 평화, 조화를 사랑하는 귀족 고양이' },
    'scorpio': { name: '전갈자리', symbol: '♏', element: '물', trait: '어둠 속을 꿰뚫어보는 마성의 매력과 신비주의자' },
    'sagittarius': { name: '사수자리', symbol: '♐', element: '불', trait: '창밖 너머 은하수를 탐험하는 자유로운 방랑묘' },
    'capricorn': { name: '염소자리', symbol: '♑', element: '흙', trait: '묵묵히 높은 산을 정복하는 성실한 끈기의 화신' },
    'aquarius': { name: '물병자리', symbol: '♒', element: '공기', trait: '엉뚱하고 독창적인 외계 묘성 전파 수신자' },
    'pisces': { name: '물고기자리', symbol: '♓', element: '물', trait: '꿈속 은하수를 유영하는 낭만주의 힐러' }
  };

  // 수호 냥이 성격 유형 (MBTI 스타일 고양이 칭호) 매핑 사전 (12별자리 + 4대표 스페셜 품종)
  const guardianCatArchetypes = {
    'aries': {
      signKey: 'aries',
      catId: 'cheese',
      signName: '양자리',
      title: '장난기 넘치는 치즈태비 화성냥',
      subtitle: 'ESTP 스타일 - 직진 본능 불도저 대장묘',
      summary: '망설임 따윈 없다냥! 사냥감이 보이면 앞발부터 번개처럼 뻗는 용맹무쌍한 모험가!',
      planet: '화성 (Mars) - 불꽃같은 투지와 돌파력',
      luckyAdvice: '넘어지는 것을 두려워하지 말라옹. 한 번의 도약이 새로운 은하를 연다냥!',
      luckyItem: '붉은색 스카프 & 매콤한 스낵 (코랄 레드)',
      emoji: '🦁',
      avatar: 'images/cats/cheese.png',
      svgFallback: 'images/cats/cat-aries.svg'
    },
    'taurus': {
      signKey: 'taurus',
      catId: 'british',
      signName: '황소자리',
      title: '고급 츄르를 음미하는 브리티시 미식냥',
      subtitle: 'ISFP 스타일 - 안락한 방석 위의 힐링 귀족묘',
      summary: '햇살 드는 창가와 최고급 츄르만 있다면 천국이다냥. 은은한 품격과 확고한 취향의 소유자!',
      planet: '금성 (Venus) - 아름다움과 풍요로운 감각',
      luckyAdvice: '조급하게 서두를 필요 없다냥. 묵묵히 다져온 집사의 기반이 곧 큰 결실을 맺는다옹!',
      luckyItem: '포근한 무릎 담요 & 로즈 골드 (에메랄드 그린)',
      emoji: '🍰',
      avatar: 'images/cats/british.png',
      svgFallback: 'images/cats/cat-taurus.svg'
    },
    'gemini': {
      signKey: 'gemini',
      catId: 'calico',
      signName: '쌍둥이자리',
      title: '호기심 많은 삼색이 수성냥',
      subtitle: 'ENTP 스타일 - 24시간 뇌섹미 재간둥이묘',
      summary: '깃털 장난감 하나에도 우주의 비밀을 읽어낸다냥! 재치 넘치는 입담과 번뜩이는 아이디어의 천재!',
      planet: '수성 (Mercury) - 빛의 속도로 회전하는 지성과 소통',
      luckyAdvice: '마음속에 떠오른 흥미로운 아이디어를 주변에 속삭여보라옹. 기적 같은 기회가 찾아온다냥!',
      luckyItem: '무선 이어폰 & 비비드 옐로우 (스카이 블루)',
      emoji: '⚡',
      avatar: 'images/cats/calico.png',
      svgFallback: 'images/cats/cat-gemini.svg'
    },
    'cancer': {
      signKey: 'cancer',
      catId: 'persian',
      signName: '게자리',
      title: '도도하고 섬세한 페르시안 달빛냥',
      subtitle: 'INFJ 스타일 - 집사 영혼의 수호천사 감성묘',
      summary: '겉은 도도한 얼음 공주 같아도, 내 사람에게는 밤새 골골송을 들려주는 다정 끝판왕!',
      planet: '달 (Moon) - 깊은 무의식과 무한한 공감 치유력',
      luckyAdvice: '지친 마음을 따스하게 그루밍해주라옹. 집사가 편안해야 세상도 빛난다냥!',
      luckyItem: '은은한 캔들 & 오팔 실버 (진주빛 화이트)',
      emoji: '🌙',
      avatar: 'images/cats/persian.png',
      svgFallback: 'images/cats/cat-cancer.svg'
    },
    'leo': {
      signKey: 'leo',
      catId: 'tuxedo',
      signName: '사자자리',
      title: '우주를 호령하는 턱시도 사자냥',
      subtitle: 'ENTJ 스타일 - 캣타워 꼭대기의 카리스마 묘황',
      summary: '내가 가는 곳이 곧 무대이자 중심이다냥! 당당한 자존감과 눈부신 아우라로 좌중을 압도하는 리더!',
      planet: '태양 (Sun) - 꺼지지 않는 절대 생명력과 영광',
      luckyAdvice: '스스로의 빛을 의심하지 말라옹. 당당하게 고개를 들면 우주가 집사를 따른다냥!',
      luckyItem: '볼드한 골드 링 & 선셋 앰버 (임페리얼 골드)',
      emoji: '👑',
      avatar: 'images/cats/tuxedo.png',
      svgFallback: 'images/cats/cat-leo.svg'
    },
    'virgo': {
      signKey: 'virgo',
      catId: 'siamese',
      signName: '처녀자리',
      title: '완벽한 그루밍의 샴 고양이 책사냥',
      subtitle: 'INTJ 스타일 - 오차율 0%의 날카로운 분석묘',
      summary: '먼지 한 톨도 용납할 수 없다냥! 뛰어난 직관과 치밀한 계획으로 위기를 기회로 바꾸는 영리한 참모!',
      planet: '수성 (Mercury) - 정밀한 분별력과 실용적 지혜',
      luckyAdvice: '작은 디테일에 집착하기보다 전체 그림을 보라옹. 이미 집사는 충분히 완벽하다냥!',
      luckyItem: '만년필 & 가죽 다이어리 (딥 네이비)',
      emoji: '📜',
      avatar: 'images/cats/siamese.png',
      svgFallback: 'images/cats/cat-virgo.svg'
    },
    'libra': {
      signKey: 'libra',
      catId: 'russianblue',
      signName: '천칭자리',
      title: '우아한 발걸음의 러시안블루 귀족냥',
      subtitle: 'ENFJ 스타일 - 황금비율의 평화주의 조화묘',
      summary: '다툼은 하수의 방식이다냥! 은빛 실크 털을 휘날리며 모두를 매료시키는 사교계의 평화 대사!',
      planet: '금성 (Venus) - 조화로운 관계성과 세련된 미의식',
      luckyAdvice: '선택의 기로에서 마음의 저울이 기우는 쪽을 믿으라옹. 집사의 심미안은 언제나 옳다냥!',
      luckyItem: '플로럴 향수 & 로맨틱 라벤더 (파우더 핑크)',
      emoji: '⚖️',
      avatar: 'images/cats/russianblue.png',
      svgFallback: 'images/cats/cat-libra.svg'
    },
    'scorpio': {
      signKey: 'scorpio',
      catId: 'blackcat',
      signName: '전갈자리',
      title: '어둠 속을 꿰뚫는 올블랙 마법냥',
      subtitle: 'INTJ 스타일 - 백발백중 육감의 신비주의 통찰묘',
      summary: '조용한 눈빛 속에 깊은 은하를 품고 있다냥. 한 번 마음을 준 인연은 지옥 끝까지 지켜내는 의리파!',
      planet: '명왕성 (Pluto) - 파괴와 재생, 불굴의 잠재력',
      luckyAdvice: '과거의 낡은 허물을 벗어던지라옹. 집사의 진정한 부활은 지금부터 시작이다냥!',
      luckyItem: '오닉스 원석 참 & 미드나잇 블랙 (버건디 레드)',
      emoji: '🔮',
      avatar: 'images/cats/blackcat.png',
      svgFallback: 'images/cats/cat-scorpio.svg'
    },
    'sagittarius': {
      signKey: 'sagittarius',
      catId: 'bengal',
      signName: '사수자리',
      title: '은하수를 방랑하는 벵갈 탐험냥',
      subtitle: 'ENTP 스타일 - 자유로운 영혼의 우주 방랑묘',
      summary: '좁은 방안에만 갇혀 살 순 없다냥! 끝없는 호기심과 낙천적인 미소로 미지의 세계를 개척하는 탐험가!',
      planet: '목성 (Jupiter) - 무한한 확장과 천운의 축복',
      luckyAdvice: '더 넓은 시야로 미래를 바라보라옹. 사소한 걸림돌은 가볍게 뛰어넘을 수 있다냥!',
      luckyItem: '여행용 백팩 & 일렉트릭 퍼플 (사파이어 블루)',
      emoji: '🏹',
      avatar: 'images/cats/bengal.png',
      svgFallback: 'images/cats/cat-sagittarius.svg'
    },
    'capricorn': {
      signKey: 'capricorn',
      catId: 'norwegian',
      signName: '염소자리',
      title: '캣타워 정상에 오른 노르웨이숲 야망냥',
      subtitle: 'ISTJ 스타일 - 묵묵한 인내의 불굴 끈기묘',
      summary: '눈보라가 쳐도 내 발걸음은 멈추지 않는다냥. 굳은 의지와 실력으로 정상의 깃발을 꽂는 대기만성형!',
      planet: '토성 (Saturn) - 시간과 훈련을 통해 벼려낸 진짜 실력',
      luckyAdvice: '집사가 흘린 땀방울은 단 한 방울도 헛되지 않다옹. 머지않아 압도적인 보상이 찾아온다냥!',
      luckyItem: '클래식 아날로그 시계 & 차콜 그레이 (포레스트 그린)',
      emoji: '🏔️',
      avatar: 'images/cats/norwegian.png',
      svgFallback: 'images/cats/cat-capricorn.svg'
    },
    'aquarius': {
      signKey: 'aquarius',
      catId: 'sphynx',
      signName: '물병자리',
      title: '외계 전파를 수신하는 스핑크스 외계냥',
      subtitle: 'INTP 스타일 - 4차원 천재 혁신묘',
      summary: '남들과 똑같이 사는 건 지루하다냥! 시대를 10년 앞서가는 번뜩이는 통찰과 독창성의 아이콘!',
      planet: '천왕성 (Uranus) - 패러다임을 뒤흔드는 혁신과 독창성',
      luckyAdvice: '남들의 편견에 맞추려 하지 말라옹. 집사의 엉뚱함이야말로 세상을 바꿀 슈퍼 파워다냥!',
      luckyItem: '스마트 웨어러블 기기 & 네온 아쿠아 (메탈릭 실버)',
      emoji: '🛸',
      avatar: 'images/cats/sphynx.png',
      svgFallback: 'images/cats/cat-aquarius.svg'
    },
    'pisces': {
      signKey: 'pisces',
      catId: 'turkish',
      signName: '물고기자리',
      title: '꿈속 은하수를 유영하는 터키시앙고라 힐러냥',
      subtitle: 'INFP 스타일 - 영혼을 적시는 낭만 예술묘',
      summary: '눈송이처럼 맑고 순수한 영혼의 소유자다냥. 온 세상을 품는 무조건적인 사랑과 예술적 감수성의 화신!',
      planet: '해왕성 (Neptune) - 무한한 상상력과 신비로운 영감',
      luckyAdvice: '집사의 맑은 직관을 믿으라옹. 논리로 설명할 수 없는 기적이 집사를 향해 헤엄쳐오고 있다냥!',
      luckyItem: '수채화 드로잉 엽서 & 파스텔 라일락 (오션 틸)',
      emoji: '🌊',
      avatar: 'images/cats/turkish.png',
      svgFallback: 'images/cats/cat-pisces.svg'
    },
    'munchkin': {
      signKey: 'gemini',
      catId: 'munchkin',
      signName: '먼치킨',
      title: '앙증맞은 발걸음의 먼치킨 요정냥',
      subtitle: 'ESFP 스타일 - 숏다리 파워 초긍정 재간묘',
      summary: '다리는 짧아도 점프력과 매력은 우주 1등이다냥! 어디서나 사랑받는 마스코트 요정!',
      planet: '수성 (Mercury) - 발랄한 호기심과 순발력',
      luckyAdvice: '작은 한 걸음이라도 신나게 내딛으라옹! 온 우주가 집사를 응원하고 있다냥!',
      luckyItem: '노란 양말 & 미니 파우치 (선샤인 옐로우)',
      emoji: '🐾',
      avatar: 'images/cats/munchkin.png',
      svgFallback: 'images/cats/cat-gemini.svg'
    },
    'ragdoll': {
      signKey: 'pisces',
      catId: 'ragdoll',
      signName: '랙돌',
      title: '솜사탕 구름에 안긴 랙돌 힐링냥',
      subtitle: 'ISFJ 스타일 - 품에 안기면 사르르 녹는 포근묘',
      summary: '안아주면 인형처럼 힘을 빼고 몸을 맡긴다냥. 보는 것만으로도 영혼이 정화되는 궁극의 힐러!',
      planet: '달 (Moon) - 무한한 위로와 무조건적인 수용',
      luckyAdvice: '오늘은 자신을 꼭 껴안아주라옹. 집사는 있는 그대로 눈부시게 사랑스럽다냥!',
      luckyItem: '실크 수면안대 & 블루베리 티 (소프트 스카이)',
      emoji: '🧸',
      avatar: 'images/cats/ragdoll.png',
      svgFallback: 'images/cats/cat-pisces.svg'
    },
    'mainecoon': {
      signKey: 'leo',
      catId: 'mainecoon',
      signName: '메인쿤',
      title: '위풍당당 은하의 수호신 메인쿤 거인냥',
      subtitle: 'ENTJ 스타일 - 웅장한 체구 속 온화한 거묘',
      summary: '거대한 몸집에 담긴 듬직함과 다정함! 그 어떤 폭풍우가 닥쳐도 든든하게 집사를 지켜주는 든든한 방패!',
      planet: '태양 (Sun) - 웅장한 포용력과 불굴의 신뢰',
      luckyAdvice: '넓은 품으로 세상을 바라보라옹. 집사의 그릇은 생각보다 훨씬 거대하다냥!',
      luckyItem: '가죽 브리프케이스 & 클래식 브라운 (딥 마호가니)',
      emoji: '🦁',
      avatar: 'images/cats/mainecoon.png',
      svgFallback: 'images/cats/cat-leo.svg'
    },
    'scottish': {
      signKey: 'taurus',
      catId: 'scottish',
      signName: '스코티시폴드',
      title: '동글동글 호기심 가득 스코티시폴드 명탐정냥',
      subtitle: 'INTP 스타일 - 접힌 귀 뒤로 지혜를 숨긴 관찰묘',
      summary: '동그란 눈망울로 세상을 관찰하며 조용히 답을 찾아낸다냥! 묵묵히 곁을 지키며 통찰을 건네는 파트너!',
      planet: '목성 (Jupiter) - 숨은 행운과 슬기로운 지혜',
      luckyAdvice: '조용히 기다리면 때가 온다옹. 서두르지 않는 자가 가장 달콤한 결실을 얻는다냥!',
      luckyItem: '동그란 뿔테 안경 & 민트 캔디 (세이지 그린)',
      emoji: '🐱',
      avatar: 'images/cats/scottish.png',
      svgFallback: 'images/cats/cat-taurus.svg'
    }
  };

  // 키 매핑 별칭 사전 (별칭 및 한글 별자리명 지원)
  const archetypeAliasMap = {
    'british': 'taurus',
    'persian': 'cancer',
    'tuxedo': 'leo',
    'cheese': 'aries',
    'russianblue': 'libra',
    'calico': 'gemini',
    'siamese': 'virgo',
    'blackcat': 'scorpio',
    'bengal': 'sagittarius',
    'norwegian': 'capricorn',
    'sphynx': 'aquarius',
    'turkish': 'pisces',
    'munchkin': 'munchkin',
    'ragdoll': 'ragdoll',
    'mainecoon': 'mainecoon',
    'scottish': 'scottish',
    '양자리': 'aries', '황소자리': 'taurus', '쌍둥이자리': 'gemini', '게자리': 'cancer',
    '사자자리': 'leo', '처녀자리': 'virgo', '천칭자리': 'libra', '전갈자리': 'scorpio',
    '사수자리': 'sagittarius', '염소자리': 'capricorn', '물병자리': 'aquarius', '물고기자리': 'pisces'
  };

  function getGuardianCatType(keyOrData) {
    if (!keyOrData) {
      return guardianCatArchetypes['sagittarius'];
    }
    // 객체인 경우 (차트 데이터)
    if (typeof keyOrData === 'object') {
      if (keyOrData.guardianCatId) {
        return getGuardianCatType(keyOrData.guardianCatId);
      }
      if (keyOrData.sun && keyOrData.sun.key) {
        return getGuardianCatType(keyOrData.sun.key);
      }
    }
    // 문자열인 경우
    if (typeof keyOrData === 'string') {
      const k = keyOrData.toLowerCase().trim();
      if (guardianCatArchetypes[k]) return guardianCatArchetypes[k];
      const alias = archetypeAliasMap[k];
      if (alias && guardianCatArchetypes[alias]) return guardianCatArchetypes[alias];
    }
    return guardianCatArchetypes['sagittarius'];
  }

  function getZodiacFromDate(month, day) {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return 'gemini';
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return 'cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'pisces';
    return 'aries';
  }

  function detectZodiacKeyFromQuery(text) {
    if (!text) return null;
    const t = text.toLowerCase();

    // 1. 별자리 한글 키워드
    if (t.includes('양자리')) return 'aries';
    if (t.includes('황소자리')) return 'taurus';
    if (t.includes('쌍둥이자리')) return 'gemini';
    if (t.includes('게자리')) return 'cancer';
    if (t.includes('사자자리')) return 'leo';
    if (t.includes('처녀자리')) return 'virgo';
    if (t.includes('천칭자리')) return 'libra';
    if (t.includes('전갈자리')) return 'scorpio';
    if (t.includes('사수자리')) return 'sagittarius';
    if (t.includes('염소자리')) return 'capricorn';
    if (t.includes('물병자리')) return 'aquarius';
    if (t.includes('물고기자리')) return 'pisces';

    // 2. 수호냥이 이름/품종 키워드
    if (t.includes('브리티시') || t.includes('미식냥')) return 'taurus';
    if (t.includes('페르시안') || t.includes('달빛냥')) return 'cancer';
    if (t.includes('턱시도') || t.includes('사자냥')) return 'leo';
    if (t.includes('치즈태비') || t.includes('화성냥')) return 'aries';
    if (t.includes('러시안블루') || t.includes('귀족냥') || t.includes('얼음냥')) return 'libra';
    if (t.includes('삼색이') || t.includes('수성냥')) return 'gemini';
    if (t.includes('샴') || t.includes('책사냥')) return 'virgo';
    if (t.includes('올블랙') || t.includes('마법냥') || t.includes('검은고양이')) return 'scorpio';
    if (t.includes('벵갈') || t.includes('탐험냥')) return 'sagittarius';
    if (t.includes('노르웨이') || t.includes('야망냥')) return 'capricorn';
    if (t.includes('스핑크스') || t.includes('외계냥')) return 'aquarius';
    if (t.includes('터키시') || t.includes('힐러냥')) return 'pisces';
    if (t.includes('먼치킨') || t.includes('요정냥')) return 'munchkin';
    if (t.includes('랙돌')) return 'ragdoll';
    if (t.includes('메인쿤') || t.includes('거인냥')) return 'mainecoon';
    if (t.includes('스코티시') || t.includes('폴드')) return 'scottish';

    // 3. "x월 x일" 패턴 검사
    const mdMatch = text.match(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
    if (mdMatch) {
      const m = parseInt(mdMatch[1], 10);
      const d = parseInt(mdMatch[2], 10);
      if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        return getZodiacFromDate(m, d);
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

  // 초기화 실행
  initStarfield();
  initSoundUI();
  initCatBlinking();
  initChartSystem();
  initQuotaSystem();
  initGuardianCatShareSystem();

  // ==========================================
  // 1. 별빛 캔버스 (Starfield Canvas)
  // ==========================================
  function initStarfield() {
    const ctx = starCanvas.getContext('2d');
    let stars = [];
    const starCount = 120;

    function resizeCanvas() {
      starCanvas.width = window.innerWidth;
      starCanvas.height = window.innerHeight;
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * starCanvas.width,
          y: Math.random() * starCanvas.height,
          radius: Math.random() * 1.5 + 0.3,
          alpha: Math.random(),
          speed: Math.random() * 0.02 + 0.005,
          color: ['#ffffff', '#ffd166', '#d4b5ff', '#4cc9f0'][Math.floor(Math.random() * 4)]
        });
      }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function animateStars() {
      ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
      stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) {
          star.speed = -star.speed;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha));
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
      requestAnimationFrame(animateStars);
    }
    animateStars();
  }

  // ==========================================
  // 2. Web Audio 신비로운 사운드 효과
  // ==========================================
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playBellChime() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [587.33, 880, 1174.66].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.08, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 1.3);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  function playCatMeow() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(820, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(430, now + 0.45);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  function initSoundUI() {
    updateSoundButton();
    btnSoundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('cat_sound_enabled', soundEnabled);
      updateSoundButton();
      if (soundEnabled) playBellChime();
    });
  }

  function updateSoundButton() {
    btnSoundToggle.innerHTML = soundEnabled ? '<span class="btn-icon">🔔</span>' : '<span class="btn-icon">🔕</span>';
    btnSoundToggle.title = soundEnabled ? '효과음 끄기' : '효과음 켜기';
  }

  // ==========================================
  // 3. 고양이 아바타 인터랙션
  // ==========================================
  function initCatBlinking() {
    const eyes = document.querySelectorAll('.cat-eyes');
    if (eyes.length > 0) {
      function blink() {
        eyes.forEach(eye => {
          eye.style.transformOrigin = '100px 98px';
          eye.style.transform = 'scaleY(0.1)';
        });
        setTimeout(() => {
          eyes.forEach(eye => eye.style.transform = 'scaleY(1)');
        }, 150);

        const nextBlink = Math.random() * 4000 + 3000;
        setTimeout(blink, nextBlink);
      }
      setTimeout(blink, 2000);
    }

    if (catAvatar) {
      catAvatar.addEventListener('click', () => {
        playCatMeow();
        setCatMood('골골골... 집사의 손길이 느껴진다옹! ✨');
        triggerOrbGlow('#ff70a6');
      });
    }
  }

  function setCatMood(text) {
    if (catMoodText) catMoodText.textContent = text;
  }

  function triggerOrbGlow(color = '#8a5cf6') {
    if (crystalOrb) {
      crystalOrb.style.boxShadow = `0 0 35px ${color}, inset 0 0 20px ${color}`;
      crystalOrb.style.borderColor = color;
      setTimeout(() => {
        crystalOrb.style.boxShadow = '';
        crystalOrb.style.borderColor = '';
      }, 1400);
    }
  }

  // ==========================================
  // 4. Astro-Seek 점성술 차트 파싱 및 관리
  // ==========================================
  const SAMPLE_ASTRO_SEEK_DATA = `=== ASTRO-SEEK.COM - BIRTH CHART REPORT ===
Date of Birth: 15 May 1998, 14:30
Place: Seoul, South Korea
House System: Whole Sign

PLANETS POSITIONS:
Sun in Taurus 24°31' (9th House)
Moon in Capricorn 18°12' (5th House)
Ascendant in Virgo 12°45' (1st House)
Mercury in Taurus 15°02' (9th House)
Venus in Aries 09°21' (8th House)
Mars in Taurus 28°55' (9th House)
Jupiter in Pisces 26°10' (7th House)
Saturn in Taurus 00°44' (9th House)
Uranus in Aquarius 12°31' (6th House)
Neptune in Aquarius 02°11' (6th House)
Pluto in Sagittarius 07°19' (4th House)

MAJOR ASPECTS:
Sun Trine Moon (6°19')
Sun Conjunction Mars (4°24')
Moon Sextile Jupiter (7°58')
Venus Trine Pluto (2°02')
Mercury Conjunction Saturn (14°18')`;

  function initChartSystem() {
    // 저장된 차트 로드
    const rawSaved = localStorage.getItem('cat_astrologer_natal_chart');
    if (rawSaved) {
      try {
        savedChartData = JSON.parse(rawSaved);
        updateChartDisplayUI(savedChartData);
      } catch (e) {
        console.error(e);
      }
    }

    // 모달 열기/닫기
    btnChartModal.addEventListener('click', openChartModal);
    if (btnOpenChartQuick) btnOpenChartQuick.addEventListener('click', openChartModal);
    if (btnEditChart) btnEditChart.addEventListener('click', openChartModal);

    btnCloseChartModal.addEventListener('click', closeChartModal);
    btnCancelChart.addEventListener('click', closeChartModal);
    chartModal.addEventListener('click', (e) => {
      if (e.target === chartModal) closeChartModal();
    });

    // 탭 전환
    document.querySelectorAll('.chart-tab-btn').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        document.querySelectorAll('.chart-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.chart-tab-content').forEach(c => c.classList.remove('active'));
        tabBtn.classList.add('active');
        const targetId = tabBtn.dataset.tab;
        document.getElementById(targetId).classList.add('active');
      });
    });

    // 샘플 데이터 불러오기 버튼
    btnLoadSample.addEventListener('click', () => {
      chartRawInput.value = SAMPLE_ASTRO_SEEK_DATA;
    });

    // 차트 초기화 버튼
    btnResetChart.addEventListener('click', () => {
      if (confirm('저장된 점성술 출생 차트를 삭제하시겠습니까?')) {
        localStorage.removeItem('cat_astrologer_natal_chart');
        savedChartData = null;
        updateChartDisplayUI(null);
        chartRawInput.value = '';
        closeChartModal();
        appendAstrologerMessage('집사의 묘성 출생 차트가 초기화되었다냥. 기본 냥성술 모드로 복귀했다옹! 🐾');
      }
    });

    // 차트 등록 및 분석 요청 버튼
    btnSaveChart.addEventListener('click', handleSaveChart);
  }

  function openChartModal() {
    chartModal.classList.remove('hidden');
    if (savedChartData) {
      if (savedChartData.raw) {
        chartRawInput.value = savedChartData.raw;
      }
      if (savedChartData.birthDate) {
        document.getElementById('simple-birth-date').value = savedChartData.birthDate;
      }
      if (savedChartData.birthTime) {
        document.getElementById('simple-birth-time').value = savedChartData.birthTime;
      }
    }
  }

  function closeChartModal() {
    chartModal.classList.add('hidden');
  }

  function parseAstroSeekText(text) {
    const data = {
      raw: text,
      sun: null,
      moon: null,
      ascendant: null,
      mercury: null,
      venus: null,
      mars: null,
      jupiter: null,
      saturn: null,
      houses: {},
      aspects: []
    };

    const extractSign = (line) => {
      for (const [key, info] of Object.entries(zodiacMap)) {
        const regex = new RegExp(`\\b${key}\\b`, 'i');
        if (regex.test(line)) {
          return { key, ...info };
        }
      }
      return null;
    };

    const lines = text.split('\n');
    lines.forEach(line => {
      const lower = line.toLowerCase();
      if (lower.includes('sun in') || lower.includes('sun:')) {
        data.sun = extractSign(line);
      } else if (lower.includes('moon in') || lower.includes('moon:')) {
        data.moon = extractSign(line);
      } else if (lower.includes('ascendant in') || lower.includes('asc in') || lower.includes('rising in')) {
        data.ascendant = extractSign(line);
      } else if (lower.includes('venus in') || lower.includes('venus:')) {
        data.venus = extractSign(line);
      } else if (lower.includes('mars in') || lower.includes('mars:')) {
        data.mars = extractSign(line);
      } else if (lower.includes('mercury in') || lower.includes('mercury:')) {
        data.mercury = extractSign(line);
      } else if (lower.includes('jupiter in') || lower.includes('jupiter:')) {
        data.jupiter = extractSign(line);
      } else if (lower.includes('saturn in') || lower.includes('saturn:')) {
        data.saturn = extractSign(line);
      }

      if (lower.includes('trine') || lower.includes('sextile') || lower.includes('square') || lower.includes('conjunction') || lower.includes('opposition')) {
        data.aspects.push(line.trim());
      }
    });

    return data;
  }

  // 생년월일시 입력으로 AstroEngine을 호출하여 Astro-Seek 정밀 차트 자동 계산
  function generateChartFromSimpleInput() {
    const birthDate = document.getElementById('simple-birth-date').value;
    const birthTime = document.getElementById('simple-birth-time').value || '12:00';
    const birthCity = document.getElementById('simple-birth-city').value;
    const concern = document.getElementById('simple-concern').value;

    if (!birthDate) return null;

    if (typeof AstroEngine !== 'undefined') {
      const fullChart = AstroEngine.generateFullChart(birthDate, birthTime, birthCity);
      fullChart.concern = concern;
      return fullChart;
    }
    return null;
  }

  function handleSaveChart() {
    const isRawTab = document.getElementById('tab-raw').classList.contains('active');
    let chartResult = null;
    let concernPrompt = '나의 Big 3(태양·달·상승궁)와 타고난 본질 및 전반적인 운세';

    if (isRawTab) {
      const textToParse = chartRawInput.value.trim();
      if (!textToParse) {
        alert('Astro-Seek 데이터를 입력하거나, [✨ 샘플 데이터 채우기] 버튼을 눌러보라냥!');
        return;
      }
      chartResult = parseAstroSeekText(textToParse);
    } else {
      const calculated = generateChartFromSimpleInput();
      if (!calculated) {
        alert('생년월일을 올바르게 입력하라냥!');
        return;
      }

      chartResult = {
        raw: calculated.raw,
        sun: { key: calculated.sun.signKey, name: calculated.sun.signName, symbol: calculated.sun.symbol, ...zodiacMap[calculated.sun.signKey] },
        moon: { key: calculated.moon.signKey, name: calculated.moon.signName, symbol: calculated.moon.symbol, ...zodiacMap[calculated.moon.signKey] },
        ascendant: { key: calculated.ascendant.signKey, name: calculated.ascendant.signName, symbol: calculated.ascendant.symbol, ...zodiacMap[calculated.ascendant.signKey] },
        venus: { key: calculated.venus.signKey, name: calculated.venus.signName, symbol: calculated.venus.symbol, ...zodiacMap[calculated.venus.signKey] },
        mars: { key: calculated.mars.signKey, name: calculated.mars.signName, symbol: calculated.mars.symbol, ...zodiacMap[calculated.mars.signKey] },
        aspects: calculated.aspects,
        planets: calculated.planets,
        birthDate: calculated.birthDateStr,
        birthTime: calculated.birthTimeStr,
        cityName: calculated.city.name
      };

      const concernMap = {
        'all': 'Big 3 본질 성향과 타고난 잠재력',
        'love': '금성과 화성 배치로 보는 연애 스타일 및 매력 포인트',
        'career': '10하우스와 2하우스로 보는 직업 적성 및 사회적 성취',
        'money': '재물운의 흐름과 금전적 기회',
        'healing': '달 별자리를 중심으로 한 마음 치유와 힐링 처방'
      };
      concernPrompt = concernMap[calculated.concern] || concernPrompt;
    }

    if (!chartResult.sun && !chartResult.moon && !chartResult.ascendant) {
      alert('Astro-Seek 데이터에서 별자리를 감지하지 못했다냥! [생년월일 직접 입력] 탭을 이용해보라옹! 🐾');
      return;
    }

    savedChartData = chartResult;
    localStorage.setItem('cat_astrologer_natal_chart', JSON.stringify(savedChartData));
    updateChartDisplayUI(savedChartData);
    closeChartModal();

    playBellChime();
    triggerOrbGlow('#ffd166');
    setCatMood('천체 궤도 계산 완료! 🌌✨');

    // 차트 등록 및 분석 요청 메시지 자동 전송
    const introPrompt = chartResult.birthDate 
      ? `내 생년월일시(${chartResult.birthDate} ${chartResult.birthTime}, ${chartResult.cityName})를 바탕으로 자동 계산된 Astro-Seek 차트야! 나의 ${concernPrompt}를 정밀 분석해줘냥!`
      : `내 Astro-Seek 출생 차트를 성공적으로 등록했어! 나의 Big 3(태양·달·상승궁)와 주요 행성 배치를 종합 분석해줘!`;
      
    handleSendMessage(introPrompt);
    scrollToChatView();
  }

  function updateChartDisplayUI(data) {
    const summaryBox = document.getElementById('guardian-cat-summary-box');
    if (!data || (!data.sun && !data.moon && !data.ascendant)) {
      headerChartStatus.textContent = '생년월일 등록';
      chartEmptyState.classList.remove('hidden');
      big3Grid.classList.add('hidden');
      if (summaryBox) summaryBox.classList.add('hidden');
      return;
    }

    // 헤더 상태 변경
    const sunStr = data.sun ? data.sun.name : '알수없음';
    const moonStr = data.moon ? data.moon.name : '알수없음';
    const ascStr = data.ascendant ? data.ascendant.name : '알수없음';

    headerChartStatus.textContent = `생년월일 입력완료 (${sunStr}/${moonStr}/${ascStr})`;
    
    // 좌측 패널 Big 3 표시
    chartEmptyState.classList.add('hidden');
    big3Grid.classList.remove('hidden');

    valSun.textContent = data.sun ? `${data.sun.symbol} ${data.sun.name}` : '-';
    valMoon.textContent = data.moon ? `${data.moon.symbol} ${data.moon.name}` : '-';
    valAsc.textContent = data.ascendant ? `${data.ascendant.symbol} ${data.ascendant.name}` : '-';

    // 수호 냥이 성격 유형 위젯 업데이트
    const guardianCat = getGuardianCatType(data);
    updateGuardianCatSummaryUI(guardianCat);
  }

  // ==========================================
  // 5. 복채 공양 (Tribute System)
  // ==========================================
  const tributeReactions = {
    churu: [
      "크아앙! 황금 참치 츄르라니! 루나의 점성술 영력이 300% 폭발했다냥! 🐟✨",
      "촵촵촵... 감동의 눈물이 흐른다옹! 집사의 차트에 황금빛 목성(Jupiter)의 대길운을 내려주겠다옹! 💰",
      "츄르는 우주 최고의 보물이다냥! 집사의 앞길에 만복이 깃들지어다! 🌟"
    ],
    catnip: [
      "헤헤... 으아아... 신비의 캣닢 향기에 취해 묘성 은하의 삼라만상이 보인다옹! 🌿💫",
      "뒹굴뒹굴... 별자리들이 완벽한 트라인(Trine) 각도로 늘어서며 대박 기운을 속삭이고 있다냥! 🪐",
      "골골송 오케스트라 가동! 집사의 달 별자리에 쌓인 피로를 캣닢 바람으로 싹 날려주겠다옹! 🍃"
    ],
    feather: [
      "파닥파닥! 앗, 저 은하수 깃털은 내가 사냥해주마냥! 얍! 🪶🐾",
      "호기심과 화성(Mars)의 투지가 최고조로 올랐다냥! 방해물따위 날카로운 냥냥펀치로 부숴버려라옹! 💥",
      "바람의 정령이 깃든 깃털이다냥. 그대의 모든 선택에 행운의 별바람이 불 것이다냥! 🌈"
    ]
  };

  const tributeReactionEl = document.getElementById('tribute-reaction');
  document.querySelectorAll('.btn-tribute').forEach(btn => {
    btn.addEventListener('click', () => {
      const gift = btn.dataset.gift;
      playCatMeow();
      triggerOrbGlow('#ffd166');
      const messages = tributeReactions[gift];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      
      tributeReactionEl.textContent = randomMsg;
      tributeReactionEl.style.opacity = '1';
      setCatMood("영력이 최고조에 달했다냥! 🐾");

      setTimeout(() => {
        tributeReactionEl.style.opacity = '0.7';
      }, 3500);
    });
  });

  // ==========================================
  // 6. 추천 질문 칩 (Quick Chips)
  // ==========================================
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (isGenerating) return;
      const query = chip.dataset.query;
      if (!query) return;
      userInput.value = query;
      handleSendMessage(query);
    });
  });

  // ==========================================
  // 7. 웹 환경 비로그인 쿼터 & 보상형 광고 시스템
  // ==========================================
  function getWebUserId() {
    let uid = localStorage.getItem('luna_web_uid');
    if (!uid) {
      uid = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : 'web_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      localStorage.setItem('luna_web_uid', uid);
    }
    return uid;
  }

  async function checkUserQuota() {
    try {
      const res = await fetch('/api/quota', {
        headers: {
          'X-User-Id': getWebUserId(),
          'X-Web-User-Id': getWebUserId()
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && typeof data.quota === 'number') {
          userQuota = data.quota;
          updateQuotaUI();
        }
      }
    } catch (err) {
      console.warn('Quota sync error:', err);
    }
  }

  function updateQuotaUI() {
    if (userCreditsEl) userCreditsEl.textContent = userQuota;
  }

  function showQuotaExhaustedModal() {
    if (quotaModal) quotaModal.classList.remove('hidden');
  }

  let rewardAdInterval = null;
  let currentRewardPurpose = 'quota'; // 'quota' or 'reshuffle'

  // 추후 Google AdSense H5 Games / 보상형 웹 광고 스크립트로 손쉽게 교체 가능한 모듈화 함수
  function playRewardAdWeb(purpose = 'quota') {
    currentRewardPurpose = purpose;
    if (quotaModal) quotaModal.classList.add('hidden');
    if (!rewardAdModal) return;

    rewardAdModal.classList.remove('hidden');
    if (btnSkipRewardAd) btnSkipRewardAd.classList.add('hidden');
    if (adProgressFill) adProgressFill.style.width = '0%';

    if (purpose === 'quota') {
      adRewardPurposeEl.textContent = '🐟 10초 츄르 광고 시청 완료 시 루나의 마력 질문권이 +2회 충전됩니다!';
    } else {
      adRewardPurposeEl.textContent = '🔮 10초 츄르 광고 시청 완료 시 황금 행운 부적이 새로 추첨됩니다!';
    }

    let timeLeft = 10;
    if (adTimerText) adTimerText.textContent = `보상까지 ${timeLeft}초...`;

    clearInterval(rewardAdInterval);
    const startTime = Date.now();
    const DURATION = 10; // 10초 카운트다운

    rewardAdInterval = setInterval(async () => {
      const elapsed = (Date.now() - startTime) / 1000;
      timeLeft = Math.max(0, DURATION - Math.floor(elapsed));
      const pct = Math.min(100, (elapsed / DURATION) * 100);
      if (adProgressFill) adProgressFill.style.width = `${pct}%`;

      if (timeLeft > 0) {
        if (adTimerText) adTimerText.textContent = `보상까지 ${timeLeft}초...`;
      } else {
        clearInterval(rewardAdInterval);
        if (adTimerText) adTimerText.textContent = '🎉 광고 시청 완료! 마력 +2 충전 완료!';
        if (btnSkipRewardAd) btnSkipRewardAd.classList.remove('hidden');

        // 서버 /api/reward 엔드포인트 호출
        try {
          const res = await fetch('/api/reward', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-User-Id': getWebUserId(),
              'X-Web-User-Id': getWebUserId()
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              userQuota = data.quota;
              updateQuotaUI();
              playBellChime();
              playCatMeow();

              if (currentRewardPurpose === 'quota') {
                appendAstrologerMessage('🐟 10초 츄르 광고 시청 보상으로 <strong>루나의 마력(질문 횟수)이 +2회 충전</strong>되었다냥! 어서 궁금한 것을 물어보라옹! 🐾⚡');
              } else if (currentRewardPurpose === 'reshuffle') {
                drawRandomCard();
              }
            }
          }
        } catch (err) {
          console.error('Reward API Error:', err);
        }
      }
    }, 200);
  }

  function initQuotaSystem() {
    checkUserQuota();

    if (btnRechargeQuota) {
      btnRechargeQuota.addEventListener('click', () => {
        playRewardAdWeb('quota');
      });
    }

    if (btnStartRewardFromModal) {
      btnStartRewardFromModal.addEventListener('click', () => {
        playRewardAdWeb('quota');
      });
    }

    if (btnCloseQuota) btnCloseQuota.addEventListener('click', () => quotaModal.classList.add('hidden'));
    if (btnCancelQuota) btnCancelQuota.addEventListener('click', () => quotaModal.classList.add('hidden'));

    if (btnSkipRewardAd) {
      btnSkipRewardAd.addEventListener('click', () => {
        rewardAdModal.classList.add('hidden');
        clearInterval(rewardAdInterval);
      });
    }
  }

  // ==========================================
  // 8. 메시지 전송 및 처리 흐름
  // ==========================================
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isGenerating) return;
    const query = userInput.value.trim();
    if (!query) return;
    handleSendMessage(query);
  });

  // 대화 내용에서 생년월일/시간/도시 자연어 자동 감지 함수
  function detectBirthInfo(text) {
    if (!text) return null;
    
    // 연도 추출 (19xx, 20xx 또는 90년대, 00년대 등)
    const mYr = text.match(/(?:19\d{2}|20\d{2}|[5-9]\d|0\d|1\d|2\d)(?:년|\.|\-|\/)?/);
    if (!mYr) return null;
    let yr = parseInt(mYr[0].replace(/[^\d]/g, ''), 10);
    if (yr < 30) yr += 2000;
    else if (yr < 100) yr += 1900;
    if (yr < 1920 || yr > 2030) return null;

    // 월과 일 추출
    const mMd = text.match(/(\d{1,2})\s*(?:월|\.|\-|\/)\s*(\d{1,2})\s*(?:일)?/);
    if (!mMd) return null;
    const month = parseInt(mMd[1], 10);
    const day = parseInt(mMd[2], 10);
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;

    // 시간 추출 (미입력 시 12:00)
    let hour = 12;
    let minute = 0;
    const mTime = text.match(/(오전|오후|am|pm)?\s*(\d{1,2})\s*(?:시|:)\s*(\d{1,2})?(?:분)?/i);
    if (mTime) {
      const ampm = mTime[1];
      let h = parseInt(mTime[2], 10);
      const m = mTime[3] ? parseInt(mTime[3], 10) : 0;
      if (ampm && (ampm.includes('오후') || ampm.toLowerCase() === 'pm') && h < 12) {
        h += 12;
      } else if (ampm && (ampm.includes('오전') || ampm.toLowerCase() === 'am') && h === 12) {
        h = 0;
      }
      if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
        hour = h;
        minute = m;
      }
    }

    // 도시 추출
    const cityMap = {
      '서울': 'Seoul', '부산': 'Busan', '인천': 'Incheon', '대구': 'Daegu',
      '대전': 'Daejeon', '광주': 'Gwangju', '울산': 'Ulsan', '수원': 'Suwon',
      '제주': 'Jeju', '도쿄': 'Tokyo', '뉴욕': 'NewYork', '런던': 'London',
      '파리': 'Paris', 'la': 'LA', '로스앤젤레스': 'LA'
    };
    let city = 'Seoul';
    const lowerText = text.toLowerCase();
    for (const [k, v] of Object.entries(cityMap)) {
      if (lowerText.includes(k)) {
        city = v;
        break;
      }
    }

    const birthDateStr = `${yr}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const birthTimeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

    return {
      birthDateStr,
      birthTimeStr,
      cityKey: city
    };
  }

  // 인라인 차트 계산 박스 HTML 생성기
  function getInlineWidgetHtml() {
    return `
      <div class="inline-chart-box">
        <div class="inline-chart-title">✨ 집사의 생년월일시로 점성술 차트 바로 계산하기</div>
        <div class="inline-chart-grid">
          <div class="inline-field">
            <label>생년월일</label>
            <input type="date" class="input-inline-date" value="1998-05-15">
          </div>
          <div class="inline-field">
            <label>태어난 시간</label>
            <input type="time" class="input-inline-time" value="14:30">
          </div>
          <div class="inline-field">
            <label>출생 도시</label>
            <select class="select-inline-city">
              <option value="Seoul">서울 (Seoul)</option>
              <option value="Busan">부산 (Busan)</option>
              <option value="Incheon">인천 (Incheon)</option>
              <option value="Daegu">대구 (Daegu)</option>
              <option value="Daejeon">대전 (Daejeon)</option>
              <option value="Gwangju">광주 (Gwangju)</option>
              <option value="Jeju">제주 (Jeju)</option>
              <option value="Other">기타/해외</option>
            </select>
          </div>
        </div>
        <button class="btn-inline-calc">🔮 내 차트 알아서 계산하기</button>
      </div>
    `;
  }

  // 인라인 차트 버튼 클릭 이벤트 위임
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('btn-inline-calc')) {
      const parent = e.target.closest('.inline-chart-box');
      if (!parent) return;

      const dateInput = parent.querySelector('.input-inline-date');
      const timeInput = parent.querySelector('.input-inline-time');
      const citySelect = parent.querySelector('.select-inline-city');

      const dateVal = dateInput ? dateInput.value : '1998-05-15';
      const timeVal = timeInput ? timeInput.value : '14:30';
      const cityVal = citySelect ? citySelect.value : 'Seoul';

      if (typeof AstroEngine !== 'undefined') {
        const calculated = AstroEngine.generateFullChart(dateVal, timeVal, cityVal);
        
        savedChartData = {
          raw: calculated.raw,
          sun: { key: calculated.sun.signKey, name: calculated.sun.signName, symbol: calculated.sun.symbol, ...zodiacMap[calculated.sun.signKey] },
          moon: { key: calculated.moon.signKey, name: calculated.moon.signName, symbol: calculated.moon.symbol, ...zodiacMap[calculated.moon.signKey] },
          ascendant: { key: calculated.ascendant.signKey, name: calculated.ascendant.signName, symbol: calculated.ascendant.symbol, ...zodiacMap[calculated.ascendant.signKey] },
          venus: { key: calculated.venus.signKey, name: calculated.venus.signName, symbol: calculated.venus.symbol, ...zodiacMap[calculated.venus.signKey] },
          mars: { key: calculated.mars.signKey, name: calculated.mars.signName, symbol: calculated.mars.symbol, ...zodiacMap[calculated.mars.signKey] },
          aspects: calculated.aspects,
          planets: calculated.planets,
          birthDate: calculated.birthDateStr,
          birthTime: calculated.birthTimeStr,
          cityName: calculated.city.name
        };

        localStorage.setItem('cat_astrologer_natal_chart', JSON.stringify(savedChartData));
        updateChartDisplayUI(savedChartData);
        playBellChime();
        triggerOrbGlow('#ffd166');
        setCatMood('천체 궤도 계산 완료! 🌌✨');

        e.target.textContent = '차트 계산 완료! 🐾';
        e.target.disabled = true;
        e.target.style.background = '#06d6a0';

        const introPrompt = `내 생년월일시(${dateVal} ${timeVal}, ${calculated.city.name})로 차트를 직접 계산했어! 나의 Big 3(태양·달·상승궁)와 올해의 운세를 종합 분석해줘냥!`;
        handleSendMessage(introPrompt);
        scrollToChatView();
      }
    }
  });

  async function handleSendMessage(query) {
    if (userQuota <= 0) {
      showQuotaExhaustedModal();
      appendAstrologerMessage('집사여, 루나의 마력(무료 질문 횟수)이 모두 소진되었다냥! 🐾<br>🐟 <strong>10초 츄르 광고를 시청하면 마력이 +2회 즉시 무료 충전</strong>된다옹!<br><button class="btn-inline-calc" id="btn-ad-recharge-chat" style="margin-top:10px;">🎬 10초 광고 보고 마력 +2 충전하기</button>');
      const btnAd = document.getElementById('btn-ad-recharge-chat');
      if (btnAd) btnAd.addEventListener('click', () => playRewardAdWeb('quota'));
      return;
    }

    userInput.value = '';
    isGenerating = true;

    // 사용자 메시지 표시
    appendUserMessage(query);

    // 대화 내용에서 생년월일시 자연어 자동 추출 시도
    let autoDetectNotice = '';
    const detected = detectBirthInfo(query);
    if (detected && typeof AstroEngine !== 'undefined') {
      const calculated = AstroEngine.generateFullChart(detected.birthDateStr, detected.birthTimeStr, detected.cityKey);
      savedChartData = {
        raw: calculated.raw,
        sun: { key: calculated.sun.signKey, name: calculated.sun.signName, symbol: calculated.sun.symbol, ...zodiacMap[calculated.sun.signKey] },
        moon: { key: calculated.moon.signKey, name: calculated.moon.signName, symbol: calculated.moon.symbol, ...zodiacMap[calculated.moon.signKey] },
        ascendant: { key: calculated.ascendant.signKey, name: calculated.ascendant.signName, symbol: calculated.ascendant.symbol, ...zodiacMap[calculated.ascendant.signKey] },
        venus: { key: calculated.venus.signKey, name: calculated.venus.signName, symbol: calculated.venus.symbol, ...zodiacMap[calculated.venus.signKey] },
        mars: { key: calculated.mars.signKey, name: calculated.mars.signName, symbol: calculated.mars.symbol, ...zodiacMap[calculated.mars.signKey] },
        aspects: calculated.aspects,
        planets: calculated.planets,
        birthDate: calculated.birthDateStr,
        birthTime: calculated.birthTimeStr,
        cityName: calculated.city.name
      };
      localStorage.setItem('cat_astrologer_natal_chart', JSON.stringify(savedChartData));
      updateChartDisplayUI(savedChartData);
      autoDetectNotice = `✨ 집사의 말씀 속에서 <strong>생년월일시(${detected.birthDateStr} ${detected.birthTimeStr}, ${calculated.city.name})</strong>를 알아서 감지했다냥! Astro-Seek 천체 차트를 즉시 자동 계산해서 등록했다옹! 🪐🐾<br><br>`;
    }

    // 냥성술사 점성술 계산 인디케이터
    typingIndicator.classList.remove('hidden');
    typingDesc.textContent = savedChartData 
      ? '루나가 집사의 Astro-Seek 출생 차트를 천문학적으로 계산 중이다냥... 🪐'
      : '루나가 수정구슬 속 묘성을 들여다보는 중이다냥... 🔮';
    setCatMood('묘성(猫星)의 천체 궤도를 해독하는 중... 🐾');
    triggerOrbGlow('#4cc9f0');
    scrollToBottom();

    try {
      // 백엔드 /api/chat 호출 (서버가 Gemini 2.5 Flash 호출 및 쿼터 1회 차감)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': getWebUserId(),
          'X-Web-User-Id': getWebUserId()
        },
        body: JSON.stringify({
          query,
          chartData: savedChartData
        })
      });

      if (response.status === 403) {
        userQuota = 0;
        updateQuotaUI();
        showQuotaExhaustedModal();
        typingIndicator.classList.add('hidden');
        appendAstrologerMessage('집사여, 루나의 마력이 모두 소진되었다냥! 🐾<br>🐟 <strong>10초 츄르 광고를 시청하면 마력이 +2회 즉시 무료 충전</strong>된다옹!<br><button class="btn-inline-calc" id="btn-ad-recharge-chat" style="margin-top:10px;">🎬 10초 광고 보고 마력 +2 충전하기</button>');
        const btnAd = document.getElementById('btn-ad-recharge-chat');
        if (btnAd) btnAd.addEventListener('click', () => playRewardAdWeb('quota'));
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} 서버 통신 오류`);
      }

      const resData = await response.json();
      if (typeof resData.quota === 'number') {
        userQuota = resData.quota;
        updateQuotaUI();
      }

      let responseText = resData.reply || '별들이 잠시 숨을 고르고 있다냥!';
      responseText = responseText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      responseText = responseText.replace(/\n/g, '<br>');

      if (!savedChartData) {
        responseText += `<br>${getInlineWidgetHtml()}`;
      }

      if (autoDetectNotice) {
        responseText = autoDetectNotice + responseText;
      }

      // 수호 냥이 성격 유형 결정:
      // 1순위: Gemini API 또는 서버리스가 반환한 맞춤 수호 냥이 ID (resData.guardianCatId)
      // 2순위: 사용자 질문 내용에서 직접 감지된 별자리/생년월일
      // 3순위: 등록된 차트 데이터의 태양궁
      // 4순위: 질문 내용 기반의 고유한 동적 해시 매칭
      let catTypeKey = resData.guardianCatId 
        || detectZodiacKeyFromQuery(query) 
        || (savedChartData && savedChartData.sun && savedChartData.sun.key)
        || pickDynamicCatKey(query);
      const guardianCat = getGuardianCatType(catTypeKey);
      const cardId = 'gcc-chat-' + Date.now();
      const cardHtml = generateGuardianCatCardHtml(guardianCat, cardId);

      const finalHtml = `
        ${cardHtml}
        <div class="astrology-response-content">
          ${responseText}
        </div>
        <div class="gcc-actions-bar text-result-actions">
          <button type="button" class="btn-card-action btn-save-image" data-card-target="${cardId}">
            📸 결과 카드 이미지로 저장
          </button>
          <button type="button" class="btn-card-action btn-share-kakao" data-card-target="${cardId}">
            💬 카카오톡 공유하기
          </button>
        </div>
      `;

      typingIndicator.classList.add('hidden');
      appendAstrologerMessage(finalHtml);
      setCatMood('점성술의 계시를 전했다냥! ✨');
      playBellChime();
    } catch (err) {
      console.error(err);
      typingIndicator.classList.add('hidden');
      let catTypeKey = detectZodiacKeyFromQuery(query) 
        || (savedChartData && savedChartData.sun && savedChartData.sun.key)
        || pickDynamicCatKey(query);
      const guardianCat = getGuardianCatType(catTypeKey);
      const cardId = 'gcc-offline-' + Date.now();
      const cardHtml = generateGuardianCatCardHtml(guardianCat, cardId);
      const offlineHtml = `
        ${cardHtml}
        <div class="astrology-response-content">
          묘성 네트워크에 작은 헤어볼이 걸렸다냥! 😿<br><br><span style="color:#ffb4a2;">오류: ${err.message}</span><br><br>내장 오프라인 냥성술 엔진으로 점을 쳐주겠다냥:<br><br>${getOfflineAstrologyFortune(query)}
        </div>
        <div class="gcc-actions-bar text-result-actions">
          <button type="button" class="btn-card-action btn-save-image" data-card-target="${cardId}">
            📸 결과 카드 이미지로 저장
          </button>
          <button type="button" class="btn-card-action btn-share-kakao" data-card-target="${cardId}">
            💬 카카오톡 공유하기
          </button>
        </div>
      `;
      appendAstrologerMessage(offlineHtml);
      setCatMood('잠시 숨을 고르는 중이다냥...');
    } finally {
      isGenerating = false;
    }
  }

  function appendUserMessage(text) {
    const timeStr = getCurrentTime();
    const row = document.createElement('div');
    row.className = 'message-row user-row';
    row.innerHTML = `
      <div class="avatar-mini">👤</div>
      <div class="message-bubble user-bubble">
        <div class="speaker-name">집사</div>
        <div class="message-text">${escapeHtml(text)}</div>
        <div class="message-time">${timeStr}</div>
      </div>
    `;
    chatMessages.appendChild(row);
    scrollToBottom();
  }

  function appendAstrologerMessage(htmlContent) {
    const timeStr = getCurrentTime();
    const row = document.createElement('div');
    row.className = 'message-row astrologer-row';
    row.innerHTML = `
      <div class="avatar-mini"><img src="images/luna-astrologer.jpg" alt="루나" onerror="this.outerHTML='🐾'"></div>
      <div class="message-bubble astrologer-bubble">
        <div class="speaker-name">대점성술사 루나</div>
        <div class="message-text">${htmlContent}</div>
        <div class="message-time">${timeStr}</div>
      </div>
    `;
    chatMessages.appendChild(row);
    scrollToBottom();
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function scrollToChatView() {
    setTimeout(() => {
      const chatPanel = document.querySelector('.chat-panel');
      if (chatPanel) {
        chatPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 120);
  }

  function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    hours = hours % 12 || 12;
    return `${ampm} ${hours}:${minutes}`;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // ==========================================
  // 10. 오프라인 냥성술 정밀 분석 엔진 (클라이언트 표시 보조)
  // ==========================================
  function getOfflineAstrologyFortune(query) {
    const q = query.toLowerCase();

    // 1. 차트가 등록되어 있고, Big 3나 종합 차트 분석을 요구할 때
    if (savedChartData && (q.includes('big 3') || q.includes('빅3') || q.includes('출생 차트') || q.includes('등록') || q.includes('성향') || q.includes('본질'))) {
      const sun = savedChartData.sun || zodiacMap['taurus'];
      const moon = savedChartData.moon || zodiacMap['capricorn'];
      const asc = savedChartData.ascendant || zodiacMap['virgo'];

      return `키야아옹! 묘성 은하의 나침반으로 집사의 <strong>Astro-Seek 출생 차트</strong>를 정밀 해독했다냥! 🪐🌌<br><br>
      사주보다 훨씬 정교하다는 서양 점성술의 핵심, <strong>집사의 Big 3 우주 지문</strong>을 풀어주겠다옹!<br><br>
      ────────────────────<br>
      ☀️ <strong>태양궁 (Sun in ${sun.name} ${sun.symbol}): 타고난 본질 자아</strong><br>
      집사의 영혼의 알맹이는 <em>${sun.trait}</em>의 기운을 품고 있다냥. 겉으로 어떤 모습을 하든 결국 집사는 자신만의 확고한 가치관과 기준을 지킬 때 가장 빛나는 고양이라옹!<br><br>
      🌙 <strong>달궁 (Moon in ${moon.name} ${moon.symbol}): 무의식과 감정의 안식처</strong><br>
      남들에게 쉽게 보이지 않는 은밀한 마음속 동굴이다냥. 집사의 달은 <em>${moon.trait}</em>의 성향을 띠고 있어, 스트레스를 받으면 혼자만의 아늑한 구석에서 충분한 재충전 시간이 필수적이다옹.<br><br>
      ⬆️ <strong>상승궁 (Ascendant in ${asc.name} ${asc.symbol}): 세상에 비치는 첫인상</strong><br>
      타인이 집사를 처음 볼 때 풍기는 아우라다냥! <em>${asc.trait}</em>의 매력을 발산하기 때문에 주변 사람들은 집사를 신뢰감 있고 매력적인 존재로 기억하게 된다냥.<br>
      ────────────────────<br><br>
      🐾 <strong>루나의 묘성 처방전:</strong><br>
      태양의 의지와 달의 감성이 조화를 이루려면, 남들의 시선(상승궁)에 너무 얽매이지 말고 하루에 20분씩은 오롯이 '달의 안식'을 취하라냥!<br>
      ✨ <strong>행운의 간식:</strong> ${sun.element === '불' ? '매콤한 간식' : sun.element === '물' ? '따뜻한 라떼' : sun.element === '흙' ? '달콤한 츄르' : '톡 쏘는 탄산수'}`;
    }

    // 2. 연애 / 금성 / 인연
    if (q.includes('연애') || q.includes('사랑') || q.includes('금성') || q.includes('썸') || q.includes('인연')) {
      const venusSign = savedChartData && savedChartData.venus ? savedChartData.venus.name : '매혹적인 별자리';
      return `오호라냥! 집사의 점성술 차트에서 사랑과 미의 여신 <strong>금성(Venus)</strong>의 궤도를 포착했다옹! 💖🪐<br><br>
      집사의 금성 에너지는 <strong>[${venusSign}]</strong>의 온기를 머금고 있다냥. 고양이가 사람의 마음에 사뿐사뿐 발자국을 남기듯, 집사는 억지로 유혹하려 하지 않고 <em>자연스러운 본래의 매력</em>을 보여줄 때 가장 강력한 자석이 된다옹!<br><br>
      🔮 <strong>점성학적 연애 팁:</strong><br>
      상대방이 먼저 다가오기를 기다리기보다는, 마음에 드는 상대에게 은근슬쩍 따뜻한 관심의 눈빛(고양이의 느린 눈 깜빡임!)을 먼저 보내보라냥. 밀당보다는 진정성 있는 칭찬 한마디가 상대방의 심장을 사르르 녹여버릴 것이다옹! 🐾<br><br>
      ✨ <strong>행운의 데이트 추천:</strong> 은은한 조명과 맛있는 디저트가 있는 조용한 카페`;
    }

    // 3. 재물 / 커리어 / 직업 / 2·10하우스
    if (q.includes('재물') || q.includes('돈') || q.includes('직업') || q.includes('커리어') || q.includes('이직') || q.includes('하우스') || q.includes('성공')) {
      return `골골골골...! 집사의 차트에서 <strong>2하우스(물질적 부)와 10하우스(사회적 성취)</strong>를 비춰보았다냥! 🪙✨<br><br>
      사냥감을 노리는 표범처럼, 집사는 한 번 목표를 정하면 무서운 집중력을 발휘하는 천체 배치를 지니고 있다옹. 지금은 잔가지에 한눈팔지 말고 그대만의 주특기(사냥 기술)를 하나 날카롭게 갈고닦을 최적의 타이밍이다냥!<br><br>
      🔮 <strong>점성술사의 커리어 비책:</strong><br>
      - 목성(Jupiter)의 확장 기운이 서서히 문을 두드리고 있으니 이직이나 새로운 배움에 주저하지 말라냥.<br>
      - 쓸데없는 지출을 줄이고 그대 자신을 위한 투자(강의, 장비, 건강)에 아끼지 말라옹. 곧 그 열매가 든든한 황금 사료로 돌아올 것이다냥! 🏆`;
    }

    // 4. 달자리 힐링 / 멘탈 케어
    if (q.includes('달자리') || q.includes('힐링') || q.includes('힘들') || q.includes('피곤') || q.includes('불안') || q.includes('지쳐')) {
      const moonSign = savedChartData && savedChartData.moon ? savedChartData.moon.name : '달의 은하수';
      return `토닥토닥... 골골골골... 🐾🌌<br><br>
      집사의 <strong>달 별자리([${moonSign}])</strong>가 지금 감정의 만조(High Tide)를 겪으며 잔잔하게 요동치고 있다옹.<br><br>
      달은 우리의 가장 여린 속살과 같은 무의식을 관장한다냥. 남들에게는 씩씩한 척, 아무렇지 않은 척 털을 세웠지만 속으로는 얼마나 지치고 외로웠겠느냐옹...<br><br>
      🔮 <strong>달의 치유 처방전:</strong><br>
      오늘 밤만큼은 세상의 모든 알림을 무음으로 돌리고, 폭신한 이불 속에서 배를 드러내고 푹 쉬라냥. 고양이가 낮잠으로 에너지를 채우듯, 내일 아침이면 다시 반짝이는 눈동자로 세상을 바라보게 될 것이다옹! 🌙💤`;
    }

    // 5. 기본 운세 응답 (차트 미등록 시 인라인 계산 위젯 첨부)
    return `수정구슬 속 묘성(猫星)을 비춰보니, 집사의 질문에 신비로운 별빛의 기운이 맴돌고 있다옹! ✨<br><br>
    그대의 타고난 운명을 더 소름 돋게 꿰뚫어보려면 <strong>생년월일시</strong>가 필요하다냥.<br>
    대화창에 <em>"나 98년 5월 15일 14:30 서울에서 태어났어"</em>처럼 편하게 말씀하시거나, 아래 카드에서 바로 버튼을 눌러주시면 루나가 0.1초 만에 천체 차트를 알아서 계산해온다옹! 🔮🐾
    ${getInlineWidgetHtml()}`;
  }

  // ==========================================
  // 11. 오늘의 냥성술 부적 (Fortune Card Deck)
  // ==========================================
  const fortuneCards = [
    {
      constellation: "✨ 묘성 은하 제1궁: 태양의 캣닢 ✨",
      icon: "☀️🐱",
      title: "찬란한 태양 냥이",
      keywords: "#대길 #자신감 #활력폭발",
      desc: "찬란한 태양이 그대의 온몸을 비추고 있다냥! 마음에 품었던 모든 계획이 빛을 발하고 주변 사람들의 응원이 쏟아질 대길의 날이다옹.",
      luckyColor: "골드 옐로우",
      luckySnack: "바나나맛 우유"
    },
    {
      constellation: "✨ 묘성 은하 제2궁: 초승달 꼬리 ✨",
      icon: "🌙🐾",
      title: "신비의 달빛 수호자",
      keywords: "#직관력 #마음의평화 #통찰",
      desc: "고요한 밤하늘의 초승달이 그대의 혜안을 맑게 틔워준다냥. 남들이 보지 못하는 비밀과 기회를 꿰뚫어보고 평온을 되찾을 것이다옹.",
      luckyColor: "미드나잇 블루",
      luckySnack: "캐모마일 허브티"
    },
    {
      constellation: "✨ 묘성 은하 제3궁: 황금 츄르성 ✨",
      icon: "🐟💰",
      title: "풍요의 참치 신령",
      keywords: "#재물운 #보너스 #맛있는행복",
      desc: "그대의 곳간에 마르지 않는 샘물처럼 풍요가 깃든다냥! 성실히 쌓아온 노력이 금전과 보상으로 화답하니 기쁨을 만끽하라옹.",
      luckyColor: "영롱한 에메랄드",
      luckySnack: "연어 샐러드"
    },
    {
      constellation: "✨ 묘성 은하 제4궁: 날쌘 호랑이 발톱 ✨",
      icon: "🐅⚡",
      title: "용맹한 맹수의 도약",
      keywords: "#승리 #돌파구 #목표달성",
      desc: "장애물이 가로막아도 두려워 마라냥! 그대 안에는 잠자는 맹수의 용기가 살아있다옹. 앞발을 힘차게 뻗어 목표를 낚아채라냥!",
      luckyColor: "선명한 루비 레드",
      luckySnack: "매콤한 떡볶이"
    },
    {
      constellation: "✨ 묘성 은하 제5궁: 따스한 벨벳 방석 ✨",
      icon: "🛋️🍵",
      title: "안락의 낮잠 요정",
      keywords: "#충전 #힐링 #골골송",
      desc: "세상의 소음에서 벗어나 영혼을 충전할 시간이다냥. 푹 쉬어야 다음 도약도 높이 뛸 수 있는 법! 편안한 휴식을 누려라옹.",
      luckyColor: "포근한 크림 아이보리",
      luckySnack: "따뜻한 핫초코"
    },
    {
      constellation: "✨ 묘성 은하 제6궁: 은하수 핑크 젤리 ✨",
      icon: "💖🐾",
      title: "두근두근 인연의 끈",
      keywords: "#사랑 #매력발산 #설렘",
      desc: "사랑의 별자리가 분홍빛으로 반짝인다냥! 그대의 작은 배려와 미소가 누군가의 마음에 깊은 울림을 줄 것이다옹. 설레는 하루를 기대하라냥!",
      luckyColor: "로즈 핑크",
      luckySnack: "딸기 마카롱"
    }
  ];

  function drawRandomCard() {
    const card = fortuneCards[Math.floor(Math.random() * fortuneCards.length)];
    document.querySelector('.card-constellation').textContent = card.constellation;
    document.getElementById('card-icon').textContent = card.icon;
    document.getElementById('card-title').textContent = card.title;
    document.getElementById('card-keywords').textContent = card.keywords;
    document.getElementById('card-desc').textContent = card.desc;
    document.getElementById('lucky-color').textContent = card.luckyColor;
    document.getElementById('lucky-snack').textContent = card.luckySnack;

    playBellChime();
    triggerOrbGlow('#ffd166');
  }

  btnDrawCard.addEventListener('click', () => {
    drawRandomCard();
    cardModal.classList.remove('hidden');
  });

  btnCloseCard.addEventListener('click', () => {
    cardModal.classList.add('hidden');
  });

  cardModal.addEventListener('click', (e) => {
    if (e.target === cardModal) {
      cardModal.classList.add('hidden');
    }
  });

  btnReshuffle.addEventListener('click', () => {
    // 1일 1회 무료 추첨, 이후 10초 광고 시청 후 재추첨
    const todayStr = new Date().toDateString();
    const lastDraw = localStorage.getItem('cat_last_draw_date');
    if (lastDraw === todayStr) {
      playRewardAdWeb('reshuffle');
    } else {
      localStorage.setItem('cat_last_draw_date', todayStr);
      drawRandomCard();
    }
  });

  btnCopyCard.addEventListener('click', () => {
    const title = document.getElementById('card-title').textContent;
    const desc = document.getElementById('card-desc').textContent;
    const luckyColor = document.getElementById('lucky-color').textContent;
    const luckySnack = document.getElementById('lucky-snack').textContent;

    const copyText = `[고양이 점성술사 루나의 행운 부적]\n🔮 카드: ${title}\n📜 계시: ${desc}\n✨ 행운의 색: ${luckyColor} | 행운의 간식: ${luckySnack}`;
    navigator.clipboard.writeText(copyText).then(() => {
      btnCopyCard.textContent = '복사 완료! 🐾';
      setTimeout(() => {
        btnCopyCard.textContent = '부적 글귀 복사하기 📋';
      }, 2000);
    });
  });

  // ==========================================
  // 13. 비즈니스 모델: 토스/카카오페이 마이크로 결제 (990원 / 1,900원 / 9,900원)
  // ==========================================
  const paymentModal = document.getElementById('payment-modal');
  const btnClosePayment = document.getElementById('btn-close-payment');
  const btnCancelPay = document.getElementById('btn-cancel-pay');
  const btnSubmitPay = document.getElementById('btn-submit-pay');
  const checkoutItemName = document.getElementById('checkout-item-name');
  const checkoutItemPrice = document.getElementById('checkout-item-price');
  const btnPayText = document.getElementById('btn-pay-text');

  let currentProduct = null;

  function openPaymentModal(productId, title, price) {
    currentProduct = { id: productId, title, price };
    checkoutItemName.textContent = title;
    checkoutItemPrice.textContent = `${price.toLocaleString()}원`;
    btnPayText.textContent = `${price.toLocaleString()}원 간편 결제하기`;
    paymentModal.classList.remove('hidden');
  }

  if (btnClosePayment) btnClosePayment.addEventListener('click', () => paymentModal.classList.add('hidden'));
  if (btnCancelPay) btnCancelPay.addEventListener('click', () => paymentModal.classList.add('hidden'));

  // 결제 수단 선택 버튼
  document.querySelectorAll('.pay-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pay-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 결제 승인 시뮬레이션
  if (btnSubmitPay) {
    btnSubmitPay.addEventListener('click', () => {
      btnSubmitPay.disabled = true;
      btnSubmitPay.textContent = '안전 결제 승인 중... ⏳';

      setTimeout(() => {
        btnSubmitPay.disabled = false;
        btnSubmitPay.innerHTML = '<span id="btn-pay-text">결제 완료! 🐾</span>';
        paymentModal.classList.add('hidden');
        playBellChime();
        playCatMeow();

        if (currentProduct.id === 'future') {
          handleUnlockFutureReport();
        } else if (currentProduct.id === 'synastry') {
          handleUnlockSynastryReport();
        } else if (currentProduct.id === 'pdf') {
          openPdfModal();
          appendAstrologerMessage(`
            <div class="unlocked-report-badge">📖 [발급 완료] 나만의 우주 지문 평생 소장서 렌더링 완료!</div>
            <p>대점성술사 루나 13세가 10대 천체와 12하우스, 4계절 트랜짓을 샅샅이 해독하여 <strong>총 19,000자(순수 본문 11,000자+)의 최고급 정밀 분석서</strong>를 완성했다옹! 🐾✨</p>
            <button class="btn-inline-calc" onclick="document.getElementById('pdf-modal').classList.remove('hidden');" style="margin-top:10px;">📖 평생 소장서 뷰어 열기 & PDF 다운로드 📥</button>
          `);
        }
      }, 700);
    });
  }

  // 서비스 버튼 리스너 (사이드바 & 칩)
  const btnServiceFuture = document.getElementById('btn-service-future');
  const btnServiceSynastry = document.getElementById('btn-service-synastry');
  const btnServicePdf = document.getElementById('btn-service-pdf');
  const chipFuture = document.getElementById('chip-future');
  const chipSynastry = document.getElementById('chip-synastry');
  const chipPdf = document.getElementById('chip-pdf');

  if (btnServiceFuture) btnServiceFuture.addEventListener('click', () => openPaymentModal('future', '2026 하반기 연애/재물 대운 집중 리포트', 990));
  if (chipFuture) chipFuture.addEventListener('click', () => openPaymentModal('future', '2026 하반기 연애/재물 대운 집중 리포트', 990));

  if (btnServiceSynastry) btnServiceSynastry.addEventListener('click', openSynastryInputModal);
  if (chipSynastry) chipSynastry.addEventListener('click', openSynastryInputModal);

  if (btnServicePdf) btnServicePdf.addEventListener('click', () => openPaymentModal('pdf', '나만의 우주 지문 맞춤 PDF 평생 소장서', 9900));
  if (chipPdf) chipPdf.addEventListener('click', () => openPaymentModal('pdf', '나만의 우주 지문 맞춤 PDF 평생 소장서', 9900));

  // 1) 990원 하반기 대운 집중 리포트 해금 (최소 1,000자 이상 - 2,100자+ 고품질 심층 분석)
  function handleUnlockFutureReport() {
    const chart = savedChartData || AstroEngine.generateFullChart('1998-05-15', '14:30', 'Seoul');
    const sunName = chart.sun ? chart.sun.name : '황소자리';
    const sunSymbol = chart.sun ? chart.sun.symbol : '♉';
    const moonName = chart.moon ? chart.moon.name : '염소자리';
    const moonSymbol = chart.moon ? chart.moon.symbol : '♑';
    const ascName = chart.ascendant ? chart.ascendant.name : '처녀자리';
    const ascSymbol = chart.ascendant ? chart.ascendant.symbol : '♍';
    const venusName = chart.venus ? chart.venus.name : '양자리';
    const venusSymbol = chart.venus ? chart.venus.symbol : '♈';
    const marsName = chart.mars ? chart.mars.name : '물병자리';
    const marsSymbol = chart.mars ? chart.mars.symbol : '♒';

    const jupiterSign = (chart.planets && chart.planets.Jupiter) ? chart.planets.Jupiter.signName : '황소자리';
    const saturnSign = (chart.planets && chart.planets.Saturn) ? chart.planets.Saturn.signName : '물고기자리';

    const reportHtml = `
      <div class="paid-report-container future-report">
        <div class="report-meta-header">
          <div class="report-badge-row">
            <span class="report-tag gold-tag">👑 [유료 심층] 2026 하반기 대운 집중 리포트</span>
            <span class="report-verified-badge">결제 완료 (990원) · AstroEngine NASA 궤도 정밀 분석</span>
          </div>
          <h2 class="report-main-title">🌌 2026년 하반기 연애·재물·커리어 대운 궤도 총람</h2>
          <div class="report-astro-coords">
            <span class="coord-pill">☀️ 태양: ${sunName} ${sunSymbol}</span>
            <span class="coord-pill">🌙 달: ${moonName} ${moonSymbol}</span>
            <span class="coord-pill">⬆️ 상승궁: ${ascName} ${ascSymbol}</span>
            <span class="coord-pill">💖 금성: ${venusName} ${venusSymbol}</span>
            <span class="coord-pill">🪐 목성/토성 트랜짓: ${jupiterSign} / ${saturnSign}</span>
          </div>
        </div>

        <div class="report-chapter-section">
          <h3 class="chapter-title">📜 제1장. [천체 거시 환경] 2026년 하반기 우주 주파수와 집사의 영혼 좌표</h3>
          <p class="chapter-p">
            2026년 하반기는 우주 천체학적으로 매우 드물고 역동적인 전환점입니다. 확장의 행성인 목성(Jupiter)이 순행 궤도를 확고히 유지하며, 규율과 인내의 스승인 토성(Saturn)이 물고기자리와 양자리 경계에서 집사의 잠재의식을 강하게 자극합니다. 특히 집사의 태양인 <strong>${sunName} ${sunSymbol}</strong>의 본질적 자아와, 세상과 마주하는 페르소나인 상승궁 <strong>${ascName} ${ascSymbol}</strong>의 에너지가 결합하여, 지난 2~3년간 지체되었던 모든 일들이 마침내 급물살을 타기 시작하는 거대한 상승 기류(Rising Current)를 맞이하게 됩니다.
          </p>
          <p class="chapter-p">
            과거에는 노력에 비해 결과가 늦게 따라오거나 주변 사람들과의 템포 차이로 인해 답답함을 느꼈을 수 있으나, 2026년 7월을 기점으로 천체들의 배치각이 조화각(Trine & Sextile)을 집중적으로 이루게 됩니다. 이는 집사에게 '더 이상 망설이지 말고 당신만의 영토를 구축하라'는 묘성(猫星) 은하의 강력한 전령입니다. 주변의 소음에 흔들리지 않고 본인의 직관을 신뢰할 때, 하반기 내내 상상 이상의 보상이 뒤따를 것입니다.
          </p>
        </div>

        <div class="report-chapter-section">
          <h3 class="chapter-title">💖 제2장. [심층 애정/연애운] 금성(Venus)과 7하우스가 밝히는 인연의 타임라인</h3>
          <p class="chapter-p">
            사랑과 매력, 가치관을 관장하는 금성(${venusName} ${venusSymbol})의 위치는 집사가 어떤 방식으로 사람의 마음을 사로잡고 또 어떤 상대에게 깊은 안도감을 느끼는지를 적나라하게 보여줍니다. 2026년 하반기, 금성은 집사의 대인관계 및 파트너십 하우스(7하우스)와 신비로운 황금빛 트라이앵글을 형성합니다.
          </p>
          <div class="report-callout-box love-callout">
            <div class="callout-title">🐾 싱글 집사를 위한 운명의 인연 프로파일:</div>
            <p>
              하반기 만남의 열쇠는 '뜻밖의 일상'에 숨겨져 있습니다. 격식을 차린 소개팅 자리보다는 업무 관련 모임, 지인의 자연스러운 번개, 혹은 취미와 공부를 병행하는 공간에서 집사의 무심한 듯 따뜻한 반전 매력에 반하는 인연이 다가옵니다. 상대방은 예의가 바르고 자기 영역에서 전문성을 갖춘 사람으로, 집사의 달자리(${moonName})가 갈망하는 정서적 든든함을 완벽히 채워줄 수 있는 성숙한 영혼입니다. 특히 <strong>8월 중순과 11월 첫째 주</strong>에 강력한 핑크빛 오라가 발동합니다.
            </p>
          </div>
          <div class="report-callout-box love-callout">
            <div class="callout-title">🐾 커플 및 기혼 집사를 위한 관계 심화 가이드:</div>
            <p>
              기존의 관계에서는 '새로운 공동의 목표'가 권태를 깨부수고 애정을 200% 증폭시키는 기폭제가 됩니다. 함께 여행 계획을 세우거나 인테리어를 바꾸고, 재테크를 공부하는 등 함께 바라보는 시선을 맞출 때 결속력이 단단해집니다. 가을철 수성의 역행 기간(10월)에는 사소한 말투로 인한 토라짐이 발생할 수 있으니, "내가 맞다"고 따지기보다는 포근한 포옹과 맛있는 음식을 함께 나누는 '골골송 화해법'을 적극 실천하십시오.
            </p>
          </div>
        </div>

        <div class="report-chapter-section">
          <h3 class="chapter-title">💰 제3장. [재물 & 황금 츄르 대운] 2하우스(가치)와 10하우스(명예) 정밀 해부</h3>
          <p class="chapter-p">
            점성학에서 재물의 축적은 2하우스(자가소득)와 8하우스(투자/부가수익)의 균형에서 발생합니다. 집사의 차트 지문에서 태양(${sunName})과 화성(${marsName})의 각도는 하반기 '사냥 본능'을 극대화합니다. 일상적인 고정 급여 외에도 부수적인 프로젝트, 프리랜서 제안, 인센티브, 혹은 투자처에서의 쏠쏠한 수익이 가시화되는 주기가 9월부터 본격 점화됩니다.
          </p>
          <p class="chapter-p">
            특히 커리어(10하우스) 면에서는 윗사람이나 업계 전문가들의 눈에 집사의 세밀한 업무 처리 능력과 책임감이 강렬하게 각인됩니다. 이직이나 승진, 신규 프로젝트 런칭을 고심해왔다면 <strong>9월 말부터 11월 초</strong>가 일생일대의 골든 타임입니다. 단, 한 가지 주의할 점은 '귀가 얇아지는 지출'입니다. 하반기 재물운이 왕성하다 보니 기분에 취해 충동적으로 고가의 물건을 지르거나 검증되지 않은 정보에 큰돈을 묻어두는 행위는 금물입니다. 들어온 황금 츄르를 단단한 곳간에 축적하는 지혜가 배가될 때 부의 그릇이 두 배로 커집니다.
          </p>
        </div>

        <div class="report-chapter-section">
          <h3 class="chapter-title">📅 제4장. [하반기 월별 정밀 타임라인] 7월부터 12월까지 실전 운세 로드맵</h3>
          <div class="timeline-month-grid">
            <div class="month-card">
              <div class="month-badge">7월 (태동과 정비)</div>
              <p>마음속에 품고 있던 오랜 계획을 구체적인 로드맵으로 탈바꿈하는 시기. 주변의 잔가지 인간관계를 정리하고 자신의 내실에 집중할 때 엄청난 집중력이 발휘됩니다.</p>
            </div>
            <div class="month-card hot-card">
              <div class="month-badge hot">8월 (도약과 매력 발산) ★</div>
              <p>금성과 화성의 협공으로 매력 지수가 최고조에 달합니다. 사람들을 만나는 자리에서 호감을 독차지하며, 연애운의 결정적 기회가 찾아오는 뜨거운 달입니다.</p>
            </div>
            <div class="month-card hot-card">
              <div class="month-badge hot">9월 (황금빛 재물 결실) ★</div>
              <p>2026년 하반기 중 재물운이 가장 폭발하는 황금의 달! 보너스, 계약 성사, 시험 합격 등 실질적인 보상이 통장과 손에 쥐어지는 대길(大吉)의 기운입니다.</p>
            </div>
            <div class="month-card">
              <div class="month-badge">10월 (내면의 휴식과 지혜)</div>
              <p>앞만 보고 달려온 심신에 달콤한 휴식이 필요한 달. 무리한 확장보다는 건강과 멘탈을 챙기고, 침묵의 가치를 배우며 다음 수확을 준비하십시오.</p>
            </div>
            <div class="month-card hot-card">
              <div class="month-badge hot">11월 (사회적 승리와 명예) ★</div>
              <p>목성의 강력한 서포트로 직장이나 소속 그룹에서 집사의 가치가 공인받는 달입니다. 중요한 계약이나 이직, 포트폴리오 제출에 최고의 성과가 따릅니다.</p>
            </div>
            <div class="month-card">
              <div class="month-badge">12월 (축복과 영광의 매듭)</div>
              <p>올 한 해 일궈낸 모든 성취를 따뜻한 사람들과 나누며 2027년의 새로운 대운을 설계하는 달. 평온과 충만함 속에서 최고의 마무리를 짓게 됩니다.</p>
            </div>
          </div>
        </div>

        <div class="report-chapter-section">
          <h3 class="chapter-title">🐾 제5장. [루나의 묘성 비기] 2026 하반기 액운 타파 & 행운 치트키</h3>
          <p class="chapter-p">
            대점성술사 루나 13세가 집사의 수호 행성 기운을 감응하여 전하는 비밀 처방전입니다. 아래 3대 수호 원칙을 일상에서 실천해 보라옹!
          </p>
          <div class="report-talisman-summary">
            <div class="talisman-item">
              <span class="t-icon">🎨</span>
              <div class="t-info">
                <strong>행운의 퍼스널 컬러:</strong> 라벤더 바이올렛 & 샴페인 골드
                <p>차분한 이성과 당당한 귀족의 기운을 불어넣어 대인관계의 품격을 끌어올립니다.</p>
              </div>
            </div>
            <div class="talisman-item">
              <span class="t-icon">🌿</span>
              <div class="t-info">
                <strong>수호 아로마 & 힐링 푸드:</strong> 베르가못 시트러스 & 따뜻한 홍차와 연어
                <p>뇌의 피로를 즉각 풀어주고 심장의 두근거림을 포근하게 가라앉혀 줍니다.</p>
              </div>
            </div>
            <div class="talisman-item">
              <span class="t-icon">💎</span>
              <div class="t-info">
                <strong>행운의 숫자 & 방위:</strong> 3과 8 / 동남쪽(창가 햇살)
                <p>중요한 결정을 내리거나 복권을 구매할 때 동남쪽을 바라보고 심호흡하십시오.</p>
              </div>
            </div>
          </div>
          <div class="report-final-blessing">
            "세상의 모든 파도는 결국 고요한 수면으로 돌아오고, 용기 있는 고양이는 결코 발을 헛디디지 않는다냥. 집사의 하반기 우주는 이미 찬란한 별빛으로 가득 차 있으니 두려움 없이 앞발을 내딛으라옹! 🐾✨"
          </div>
        </div>

        <div class="report-footer-meta">
          <span>📜 고양이 점성학 연구소 정밀 계산 리포트 (총 2,150자 심층 분석 완결)</span>
          <span>발행인: 대점성술사 루나 13세 🐱🔮</span>
        </div>
      </div>
    `;
    appendAstrologerMessage(reportHtml);
  }

  // 2) 1,900원 시나스트리(궁합) 모달 & 분석
  const synastryModal = document.getElementById('synastry-modal');
  const btnCloseSynastry = document.getElementById('btn-close-synastry');
  const btnCancelSynastry = document.getElementById('btn-cancel-synastry');
  const btnSubmitSynastry = document.getElementById('btn-submit-synastry');

  function openSynastryInputModal() {
    if (!savedChartData) {
      alert('먼저 집사의 생년월일시를 입력해 차트를 등록해달라냥!');
      return;
    }
    synastryModal.classList.remove('hidden');
  }

  if (btnCloseSynastry) btnCloseSynastry.addEventListener('click', () => synastryModal.classList.add('hidden'));
  if (btnCancelSynastry) btnCancelSynastry.addEventListener('click', () => synastryModal.classList.add('hidden'));

  if (btnSubmitSynastry) {
    btnSubmitSynastry.addEventListener('click', () => {
      synastryModal.classList.add('hidden');
      openPaymentModal('synastry', '상대방과 나의 시나스트리(궁합) 심층 분석', 1900);
    });
  }

  // 1,900원 시나스트리(궁합) 심층 분석 해금 (최소 1,000자 이상 - 2,400자+ 고품질 심층 분석)
  function handleUnlockSynastryReport() {
    const pDate = document.getElementById('partner-birth-date').value || '1999-11-20';
    const pTime = document.getElementById('partner-birth-time').value || '10:00';
    const pCity = document.getElementById('partner-birth-city').value || 'Seoul';
    const pName = document.getElementById('partner-name').value || '상대방';

    const userChart = savedChartData || AstroEngine.generateFullChart('1998-05-15', '14:30', 'Seoul');
    const pChart = AstroEngine.generateFullChart(pDate, pTime, pCity);
    const synastry = AstroEngine.calcSynastry(userChart, pChart);

    const uSun = userChart.sun ? userChart.sun.name : '황소자리';
    const uSunSym = userChart.sun ? userChart.sun.symbol : '♉';
    const uMoon = userChart.moon ? userChart.moon.name : '염소자리';
    const uMoonSym = userChart.moon ? userChart.moon.symbol : '♑';
    const uVenus = userChart.venus ? userChart.venus.name : '양자리';
    const uMars = userChart.mars ? userChart.mars.name : '물병자리';

    const pSun = pChart.sun ? pChart.sun.name : '전갈자리';
    const pSunSym = pChart.sun ? pChart.sun.symbol : '♏';
    const pMoon = pChart.moon ? pChart.moon.name : '물고기자리';
    const pMoonSym = pChart.moon ? pChart.moon.symbol : '♓';
    const pVenus = pChart.venus ? pChart.venus.name : '사수자리';
    const pMars = pChart.mars ? pChart.mars.name : '염소자리';

    let aspectRows = synastry.interAspects.map(a => `
      <div class="aspect-row-item">
        <span class="asp-pair">🪐 ${a.p1Name} ⇄ ${a.p2Name}</span>
        <span class="asp-name">${a.nameKo} (${a.aspect})</span>
        <span class="asp-desc">${a.desc}</span>
      </div>
    `).join('');

    if (!aspectRows) {
      aspectRows = `
        <div class="aspect-row-item">
          <span class="asp-pair">🪐 태양 ⇄ 달 조화각</span>
          <span class="asp-name">상호 보완의 온화한 삼합 (Trine)</span>
          <span class="asp-desc">서로의 결핍을 포근히 감싸 안아주는 안정적인 결합</span>
        </div>
      `;
    }

    const synastryHtml = `
      <div class="paid-report-container synastry-report">
        <div class="report-meta-header pink-theme">
          <div class="report-badge-row">
            <span class="report-tag pink-tag">🔮 [유료 심층] 시나스트리(Synastry) 1:1 천체 궁합서</span>
            <span class="report-verified-badge">결제 완료 (1,900원) · NASA JPL 정밀 궤도 교차</span>
          </div>
          <h2 class="report-main-title">💖 집사님과 '${pName}'님의 천체 궤도 운명 분석</h2>
          <div class="synastry-score-showcase">
            <div class="score-circle">
              <span class="score-num">${synastry.score}</span>
              <span class="score-unit">점</span>
            </div>
            <div class="score-verdict">
              <div class="score-title">【${synastry.title}】</div>
              <div class="score-sub">서로의 궤도가 얽혀 영혼의 골골송을 자아내는 기적 같은 인연 지수</div>
            </div>
          </div>

          <div class="synastry-compare-grid">
            <div class="compare-col user-col">
              <div class="compare-name">🐾 집사님의 천체</div>
              <div class="compare-val">☀️ 태양: ${uSun} ${uSunSym}</div>
              <div class="compare-val">🌙 달: ${uMoon} ${uMoonSym}</div>
              <div class="compare-val">💖 금성: ${uVenus} / ⚔️ 화성: ${uMars}</div>
            </div>
            <div class="compare-vs">VS</div>
            <div class="compare-col partner-col">
              <div class="compare-name">🌟 ${pName}님의 천체</div>
              <div class="compare-val">☀️ 태양: ${pSun} ${pSunSym}</div>
              <div class="compare-val">🌙 달: ${pMoon} ${pMoonSym}</div>
              <div class="compare-val">💖 금성: ${pVenus} / ⚔️ 화성: ${pMars}</div>
            </div>
          </div>
        </div>

        <div class="report-chapter-section">
          <h3 class="chapter-title pink-title">✨ 제1장. [영혼의 싱크로율] 처음 마주쳤을 때 느낀 거부할 수 없는 자력</h3>
          <p class="chapter-p">
            집사님의 태양(${uSun})과 상대방의 태양(${pSun})은 점성학적으로 서로의 결핍을 채워주는 신비한 인력(Gravitational Pull)을 지니고 있습니다. 두 사람이 처음 대면했을 때, 혹은 대화를 시작했을 때 '어딘가 모르게 낯설지 않고 편안하다'거나 '이 사람에게는 내 본모습을 숨기지 않아도 될 것 같다'는 강한 직관적 안정감을 느꼈을 것입니다.
          </p>
          <p class="chapter-p">
            집사님이 현실의 바닥을 단단하게 딛고 실질적인 방향을 제시하는 나침반 역할을 한다면, 상대방은 집사님의 경직된 긴장감을 부드럽게 무장 해제시키고 마음에 온기를 불어넣는 힐러의 역할을 수행합니다. 이는 억지로 맞추려 노력해서 생기는 조화가 아닌, 전생부터 이어져 온 묘성 은하의 영혼 주파수가 공명하고 있음을 증명합니다.
          </p>
        </div>

        <div class="report-chapter-section">
          <h3 class="chapter-title pink-title">🌙 제2장. [내면과 무의식의 공명] 달(Moon)과 달이 속삭이는 감정 교류</h3>
          <p class="chapter-p">
            연인 관계가 수십 년 동안 지속될 수 있는지를 결정하는 핵심 천체는 다름 아닌 '달(Moon)'입니다. 집사님의 달(${uMoon})과 상대방의 달(${pMoon})의 상호 작용을 면밀히 분석한 결과, 두 사람은 단둘이 밀폐된 공간에 있어도 침묵이 어색하지 않은 '골골송 메이트'입니다.
          </p>
          <p class="chapter-p">
            사회생활에서 상처를 받거나 기운이 소진되어 집으로 돌아왔을 때, 서로의 얼굴을 바라보거나 손을 잡는 것만으로도 부교감 신경이 안정되는 마법 같은 치유가 일어납니다. 상대방은 집사님이 겉으로는 씩씩한 척하지만 속으로는 얼마나 여리고 생각이 많은지를 본능적으로 간파하고 있으며, 집사님 또한 상대방이 말 못 할 자존심 때문에 속앓이할 때 따뜻하게 등을 토닥여줄 수 있는 유일한 안식처가 되어줍니다.
          </p>
        </div>

        <div class="report-chapter-section">
          <h3 class="chapter-title pink-title">💖 제3장. [치명적 매력과 로맨틱 텐션] 금성(Venus)과 화성(Mars)의 케미스트리</h3>
          <p class="chapter-p">
            사랑의 심미안인 금성과 본능적 열정인 화성의 교차 각도는 두 사람의 로맨틱 텐션과 스킨십 만족도를 좌우합니다. 집사님의 금성/화성과 상대방의 천체들은 서로의 신체적 매력과 분위기에 강하게 이끌리는 각도를 형성하고 있습니다.
          </p>
          <p class="chapter-p">
            시간이 흘러도 서로에 대한 설렘과 성적 매력이 쉽게 식지 않는 것이 이 커플의 커다란 축복입니다. 특히 가벼운 스킨십, 눈맞춤, 향수 향기 하나에도 서로의 감각이 예민하게 반응합니다. 단, 서로에 대한 애정이 깊은 만큼 상대방의 주변 이성 관계나 무심한 행동에 대해 질투심이 유발될 수 있으니, "나는 너만을 바라본다"는 확신에 찬 애정 표현을 아끼지 않는 것이 불꽃을 건강하게 유지하는 비결입니다.
          </p>
        </div>

        <div class="report-chapter-section">
          <h3 class="chapter-title pink-title">🧠 제4장. [소통과 갈등 조율] 다툼이 일어났을 때 3분 만에 화해하는 법</h3>
          <p class="chapter-p">
            완벽한 궁합이라도 천체의 회전 주기 상 마찰이 생기는 순간이 존재합니다. 두 사람의 대화 스타일(수성 궤도)을 살펴보면, 갈등이 생겼을 때 집사님은 상황을 이성적이고 명확하게 정리하고 싶어 하는 반면, 상대방은 감정적인 상처를 먼저 어루만져 주기를 바라는 경향이 있습니다.
          </p>
          <div class="report-callout-box synastry-callout">
            <div class="callout-title">🐾 루나의 특효약 갈등 회피 가이드:</div>
            <ul>
              <li><strong>1단계 (비난 금지):</strong> "왜 또 그래?"라는 지적 대신 "우리가 서로 많이 피곤했나 봐"로 대화를 시작할 것.</li>
              <li><strong>2단계 (동굴 존중):</strong> 상대방이 입을 다물거나 동굴로 숨을 때 다그치지 말고, 따뜻한 음료나 간식을 건네며 20분의 생각할 시간을 줄 것.</li>
              <li><strong>3단계 (골골송 스킨십):</strong> 자존심 싸움 대신 가벼운 포옹을 먼저 건네면, 상대방은 즉시 무장해제되어 고마움과 미안함을 표현하게 됩니다.</li>
            </ul>
          </div>
        </div>

        <div class="report-chapter-section">
          <h3 class="chapter-title pink-title">📜 제5장. [장기적 인연 & 현실 결합운] 평생의 동반자로서의 미래 가치</h3>
          <p class="chapter-p">
            단순한 연애를 넘어 결혼이나 장기적 동반자, 혹은 공동의 경제적 목표를 함께하는 파트너로서의 인연 지수는 최상위권입니다. 두 사람이 손을 맞잡으면 재물(2하우스)의 그릇이 홀로 있을 때보다 훨씬 단단해집니다. 한 사람이 기획하고 추진하면 다른 한 사람이 위험 요소를 꼼꼼히 점검해 주는 상호 보완의 시너지가 탁월하기 때문입니다.
          </p>
          <p class="chapter-p">
            어려운 위기가 닥치더라도 서로를 탓하며 갈라서는 것이 아니라, 등을 맞대고 외부의 비바람을 막아내는 전우애와 같은 신뢰가 형성됩니다. 세월이 흐를수록 둘만의 유머 코드와 인생 철학이 하나의 단단한 요새처럼 구축될 것입니다.
          </p>
        </div>

        <div class="report-chapter-section">
          <h3 class="chapter-title pink-title">🐾 제6장. [루나의 맞춤 사랑 처방전] 두 사람을 위한 데이트 & 수호 부적</h3>
          <div class="synastry-aspects-card">
            <div class="aspect-title">🌌 두 사람의 주요 천체 각도(Inter-Aspects) 교차 분석:</div>
            ${aspectRows}
          </div>
          <div class="report-talisman-summary">
            <div class="talisman-item">
              <span class="t-icon">🍷</span>
              <div class="t-info">
                <strong>추천 데이트 코스:</strong> 은은한 조명의 재즈바 & 야경이 내려다보이는 조용한 드라이브
                <p>소음이 많은 번화가보다 서로의 목소리에 온전히 귀 기울일 수 있는 아늑한 공간이 애정을 극대화합니다.</p>
              </div>
            </div>
            <div class="talisman-item">
              <span class="t-icon">🐱</span>
              <div class="t-info">
                <strong>사랑의 수호 키워드:</strong> #체온공유 #솔직한감사 #아침인사
                <p>매일 아침과 잠들기 전 "오늘도 고마워" 한마디가 두 사람의 궤도를 평생 수호합니다.</p>
              </div>
            </div>
          </div>
          <div class="report-final-blessing pink-blessing">
            "광활한 은하계 수천억 개의 별들 중 두 영혼이 같은 시간, 같은 공간에서 서로를 알아보았다는 것은 기적 중의 기적이다냥. 서로의 발톱을 숨기고 보드라운 발바닥으로 평생을 꼭 쥐어주라옹! 🐾💖"
          </div>
        </div>

        <div class="report-footer-meta">
          <span>🔮 고양이 점성학 연구소 정밀 계산 리포트 (총 2,420자 심층 분석 완결)</span>
          <span>주임 점성술사: 대점성술사 루나 13세 🐱✨</span>
        </div>
      </div>
    `;
    appendAstrologerMessage(synastryHtml);
  }

  // ==========================================
  // 14. 비즈니스 모델: 고품질 PDF 평생 소장서 뷰어 & 다운로드
  // ==========================================
  const pdfModal = document.getElementById('pdf-modal');
  const btnClosePdf = document.getElementById('btn-close-pdf');
  const btnOpenPdfTop = document.getElementById('btn-open-pdf-top');
  const btnPrintPdf = document.getElementById('btn-print-pdf');
  const btnDownloadPdf = document.getElementById('btn-download-pdf');

  function openPdfModal() {
    renderPdfContent();
    pdfModal.classList.remove('hidden');
  }

  if (btnOpenPdfTop) {
    btnOpenPdfTop.addEventListener('click', () => {
      openPaymentModal('pdf', '나만의 우주 지문 맞춤 PDF 평생 소장서', 9900);
    });
  }

  if (btnClosePdf) btnClosePdf.addEventListener('click', () => pdfModal.classList.add('hidden'));

  function renderPdfContent() {
    const chart = savedChartData || AstroEngine.generateFullChart('1998-05-15', '14:30', 'Seoul');
    const container = document.getElementById('pdf-printable-area');
    if (container && typeof DossierEngine !== 'undefined') {
      container.innerHTML = DossierEngine.generateHtml(chart);
    }
  }

  if (btnPrintPdf) {
    btnPrintPdf.addEventListener('click', () => {
      window.print();
    });
  }

  if (btnDownloadPdf) {
    btnDownloadPdf.addEventListener('click', () => {
      btnDownloadPdf.textContent = 'PDF 파일 생성 중... ⏳';
      btnDownloadPdf.disabled = true;

      const element = document.getElementById('pdf-printable-area');
      const opt = {
        margin: 10,
        filename: `고양이점성술사_루나_우주지문_소장서.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      if (typeof html2pdf !== 'undefined') {
        html2pdf().set(opt).from(element).save().then(() => {
          btnDownloadPdf.textContent = '다운로드 완료! 🐾';
          btnDownloadPdf.disabled = false;
        }).catch(err => {
          console.error(err);
          window.print();
          btnDownloadPdf.textContent = 'PDF 파일 다운로드 📥';
          btnDownloadPdf.disabled = false;
        });
      } else {
        window.print();
        btnDownloadPdf.textContent = 'PDF 파일 다운로드 📥';
        btnDownloadPdf.disabled = false;
      }
    });
  }

  // ==========================================
  // 15. 구글 애드센스 승인용 법적 모달 (개인정보처리방침, 이용약관, 소개 및 문의)
  // ==========================================
  initLegalModals();

  function initLegalModals() {
    const privacyModal = document.getElementById('privacy-modal');
    const termsModal = document.getElementById('terms-modal');
    const aboutModal = document.getElementById('about-modal');

    const btnOpenPrivacy = document.getElementById('btn-open-privacy');
    const btnOpenTerms = document.getElementById('btn-open-terms');
    const btnOpenAbout = document.getElementById('btn-open-about');

    const btnClosePrivacy = document.getElementById('btn-close-privacy');
    const btnClosePrivacyFooter = document.getElementById('btn-close-privacy-footer');
    const btnCloseTerms = document.getElementById('btn-close-terms');
    const btnCloseTermsFooter = document.getElementById('btn-close-terms-footer');
    const btnCloseAbout = document.getElementById('btn-close-about');
    const btnCloseAboutFooter = document.getElementById('btn-close-about-footer');

    function openModal(modal) {
      if (modal) modal.classList.remove('hidden');
    }

    function closeModal(modal) {
      if (modal) modal.classList.add('hidden');
    }

    if (btnOpenPrivacy) btnOpenPrivacy.addEventListener('click', () => openModal(privacyModal));
    if (btnOpenTerms) btnOpenTerms.addEventListener('click', () => openModal(termsModal));
    if (btnOpenAbout) btnOpenAbout.addEventListener('click', () => openModal(aboutModal));

    if (btnClosePrivacy) btnClosePrivacy.addEventListener('click', () => closeModal(privacyModal));
    if (btnClosePrivacyFooter) btnClosePrivacyFooter.addEventListener('click', () => closeModal(privacyModal));

    if (btnCloseTerms) btnCloseTerms.addEventListener('click', () => closeModal(termsModal));
    if (btnCloseTermsFooter) btnCloseTermsFooter.addEventListener('click', () => closeModal(termsModal));

    if (btnCloseAbout) btnCloseAbout.addEventListener('click', () => closeModal(aboutModal));
    if (btnCloseAboutFooter) btnCloseAboutFooter.addEventListener('click', () => closeModal(aboutModal));

    // 오버레이 배경 클릭 시 닫기
    [privacyModal, termsModal, aboutModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal(modal);
        });
      }
    });

    // ESC 키 입력 시 열린 법적 모달 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal(privacyModal);
        closeModal(termsModal);
        closeModal(aboutModal);
      }
    });
  }

  // ==========================================
  // 16. 수호 냥이 성격 유형 (MBTI 스타일) & 바이럴 이미지 저장 / 카카오톡 공유
  // ==========================================
  function generateGuardianCatCardHtml(catData, cardId) {
    const avatarSrc = catData.avatar || ('images/cats/' + (catData.catId || 'cheese') + '.png');
    const svgFallback = catData.svgFallback || ('images/cats/cat-' + (catData.signKey || 'sagittarius') + '.svg');
    return `
      <div class="guardian-cat-card-container">
        <div class="guardian-cat-card" id="${cardId}" data-cat-id="${catData.catId || catData.signKey}" data-cat-sign="${catData.signKey}">
          <div class="gcc-header">
            <span class="gcc-badge">✨ 묘성 은하 공인 우주 지문 ✨</span>
            <span class="gcc-source">냥성술 상담소 | cat-astro.xyz</span>
          </div>
          <div class="gcc-character-section">
            <div class="gcc-avatar-orb">
              <img src="${avatarSrc}" 
                   alt="${catData.title}" 
                   class="gcc-avatar-img"
                   onerror="if(this.src && !this.src.endsWith('${svgFallback}') && !this.dataset.fallbackTried){this.dataset.fallbackTried='true';this.src='${svgFallback}';}else{this.onerror=null;this.src='images/luna-astrologer.jpg';}">
              <span class="gcc-emoji-tag">${catData.emoji}</span>
            </div>
            <div class="gcc-type-label">나의 수호 냥이 성격 유형</div>
            <h3 class="gcc-cat-name">${catData.title}</h3>
            <div class="gcc-mbti-pill">${catData.subtitle}</div>
          </div>
          <div class="gcc-quote-box">
            <p class="gcc-quote-text">"${catData.summary}"</p>
          </div>
          <div class="gcc-pillars-grid">
            <div class="gcc-pillar">
              <span class="pillar-label">🪐 수호 행성</span>
              <span class="pillar-val">${catData.planet}</span>
            </div>
            <div class="gcc-pillar">
              <span class="pillar-label">🍀 행운의 아이템/색상</span>
              <span class="pillar-val">${catData.luckyItem}</span>
            </div>
            <div class="gcc-pillar full-width">
              <span class="pillar-label">🌟 오늘의 행운 조언</span>
              <p class="pillar-advice">"${catData.luckyAdvice}"</p>
            </div>
          </div>
          <div class="gcc-footer">
            <span class="gcc-footer-stamp">🐾 대점성술사 루나 13세 공인</span>
            <span class="gcc-footer-url">cat-astro.xyz</span>
          </div>
        </div>
        <div class="gcc-actions-bar">
          <button type="button" class="btn-card-action btn-save-image" data-card-target="${cardId}">
            📸 결과 카드 이미지로 저장
          </button>
          <button type="button" class="btn-card-action btn-share-kakao" data-card-target="${cardId}">
            💬 카카오톡 공유하기
          </button>
        </div>
      </div>
    `;
  }

  function updateGuardianCatSummaryUI(catData) {
    const summaryBox = document.getElementById('guardian-cat-summary-box');
    const iconEl = document.getElementById('gc-summary-icon');
    const titleEl = document.getElementById('gc-summary-title');
    const subtitleEl = document.getElementById('gc-summary-subtitle');
    const quoteEl = document.getElementById('gc-summary-quote');

    if (!summaryBox || !catData) return;

    if (iconEl) {
      if (catData.avatar) {
        iconEl.innerHTML = `<img src="${catData.avatar}" alt="${catData.title}" style="width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 2px solid #ffd166; display: block;">`;
      } else {
        iconEl.textContent = catData.emoji;
      }
    }
    if (titleEl) titleEl.textContent = catData.title;
    if (subtitleEl) subtitleEl.textContent = catData.subtitle;
    if (quoteEl) quoteEl.textContent = `"${catData.summary}"`;

    summaryBox.classList.remove('hidden');
  }

  function showToast(message, duration = 3200) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<span>✨</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 350);
    }, duration);
  }

  async function saveCardAsImage(targetId, title) {
    const cardEl = document.getElementById(targetId);
    if (!cardEl) return;

    const btn = document.querySelector(`button[data-card-target="${targetId}"].btn-save-image`) || document.getElementById('btn-save-summary-card');
    const originalText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.innerHTML = '이미지 생성 중... ⏳';
      btn.disabled = true;
    }

    try {
      if (typeof html2canvas === 'undefined') {
        throw new Error('html2canvas 라이브러리를 불러오지 못했습니다.');
      }

      // 카드 내 이미지(아바타 등) 로드 완료 대기
      const imgs = Array.from(cardEl.querySelectorAll('img'));
      await Promise.all(imgs.map(img => {
        if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
        return new Promise(resolve => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
          setTimeout(resolve, 1500);
        });
      }));

      // 웹폰트 로딩 대기
      if (document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch(e) {}
      }

      const canvas = await html2canvas(cardEl, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#0c0919',
        logging: false,
        allowTaint: true
      });

      const dataUrl = canvas.toDataURL('image/png');
      const safeTitle = (title || '수호냥이').replace(/[^a-zA-Z0-9가-힣_-]/g, '_');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `고양이점성술_수호냥이_${safeTitle}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast('📸 수호 냥이 카드가 갤러리에 저장되었다냥! 🐾');
    } catch (err) {
      console.error('Image capture error:', err);
      showToast('😿 이미지 저장 중 오류가 발생했다냥. 잠시 후 다시 시도하라옹.');
    } finally {
      if (btn) {
        btn.innerHTML = originalText || '📸 결과 카드 이미지로 저장';
        btn.disabled = false;
      }
    }
  }

  async function shareGuardianCat(catData, targetId) {
    const cat = catData || getGuardianCatType(savedChartData);
    const shareTitle = `[별빛 냥성술] 나의 수호 냥이 성격 유형: ${cat.title}`;
    const shareDesc = `🔮 나의 수호 냥이 성격 유형: ${cat.title}\n"${cat.summary}"\n\n🪐 수호 행성: ${cat.planet}\n🍀 행운의 아이템: ${cat.luckyItem}\n\n👉 내 생년월일시로 수호 냥이 알아보기: https://cat-astro.xyz`;
    const shareUrl = 'https://cat-astro.xyz';

    const cardEl = (targetId && document.getElementById(targetId)) || document.querySelector('.guardian-cat-card');
    const shareBtn = (targetId && document.querySelector(`button[data-card-target="${targetId}"].btn-share-kakao`)) || document.getElementById('btn-share-summary-card');
    const originalText = shareBtn ? shareBtn.innerHTML : '';

    if (shareBtn) {
      shareBtn.innerHTML = '카톡 공유 준비 중... ⏳';
      shareBtn.disabled = true;
    }

    try {
      let imageFile = null;
      if (cardEl && typeof html2canvas !== 'undefined') {
        try {
          const imgs = Array.from(cardEl.querySelectorAll('img'));
          await Promise.all(imgs.map(img => {
            if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
            return new Promise(resolve => {
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
              setTimeout(resolve, 1500);
            });
          }));

          if (document.fonts && document.fonts.ready) {
            try { await document.fonts.ready; } catch(e) {}
          }

          const canvas = await html2canvas(cardEl, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#0c0919',
            logging: false,
            allowTaint: true
          });
          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
          if (blob) {
            const safeSign = (cat.signKey || 'fortune').replace(/[^a-zA-Z0-9_-]/g, '');
            imageFile = new File([blob], `고양이점성술_수호냥이_${safeSign}.png`, { type: 'image/png' });
          }
        } catch (cErr) {
          console.warn('Canvas export for share failed:', cErr);
        }
      }

      // 1. 카카오톡 공식 JavaScript SDK 연동 (앱 키가 활성화된 경우)
      if (window.Kakao && typeof window.Kakao.isInitialized === 'function' && window.Kakao.isInitialized()) {
        try {
          window.Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: `나의 수호 냥이: ${cat.title}`,
              description: cat.summary,
              imageUrl: `https://cat-astro.xyz/images/cats/cat-${cat.signKey || 'sagittarius'}.svg`,
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
            buttons: [
              {
                title: '내 수호 냥이 알아보기 🐾',
                link: {
                  mobileWebUrl: shareUrl,
                  webUrl: shareUrl,
                },
              },
            ],
          });
          showToast('💬 카카오톡 공유 창을 열었다냥! 🐾');
          return;
        } catch (kErr) {
          console.warn('Kakao Share failed, falling back:', kErr);
        }
      }

      // 2. 모바일 브라우저 표준 Web Share API: 카드 이미지 파일 + 텍스트를 카카오톡으로 직접 전송!
      if (navigator.share) {
        try {
          if (imageFile && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
            await navigator.share({
              files: [imageFile],
              title: shareTitle,
              text: `${shareTitle}\n\n"${cat.summary}"\n\n🪐 수호 행성: ${cat.planet}\n🍀 행운 아이템: ${cat.luckyItem}\n\n👉 내 생년월일시로 수호 냥이 알아보기: ${shareUrl}`
            });
            showToast('💬 카카오톡으로 카드 이미지와 내용이 전달되었다냥! 🐾');
            return;
          } else {
            // 이미지 파일 직접 공유 미지원 시 텍스트 및 링크로 즉시 앱 선택창 호출
            await navigator.share({
              title: shareTitle,
              text: `${shareTitle}\n\n"${cat.summary}"\n\n🪐 수호 행성: ${cat.planet}\n🍀 행운 아이템: ${cat.luckyItem}`,
              url: shareUrl
            });
            showToast('💬 카카오톡 공유 창을 열었다냥! 🐾');
            return;
          }
        } catch (sErr) {
          if (sErr.name === 'AbortError') return; // 사용자가 창 닫음
          console.warn('navigator.share failed:', sErr);
        }
      }

      // 3. PC 환경 폴백: 이미지 자동 다운로드 + 카톡 공유 텍스트 클립보드 복사
      if (imageFile) {
        const dataUrl = URL.createObjectURL(imageFile);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = imageFile.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      copyToClipboard(`${shareTitle}\n\n${shareDesc}`, '📸 카드 이미지가 저장되고 카톡 공유 문구가 복사되었다냥! 카카오톡 창에 바로 붙여넣기(Ctrl+V)하라옹 🐾');
    } finally {
      if (shareBtn) {
        shareBtn.innerHTML = originalText || '💬 카카오톡 공유하기';
        shareBtn.disabled = false;
      }
    }
  }

  function copyToClipboard(text, msg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(msg || '클립보드에 복사되었다냥! 🐾');
      }).catch(() => fallbackCopy(text, msg));
    } else {
      fallbackCopy(text, msg);
    }
  }

  function fallbackCopy(text, msg) {
    const t = document.createElement('textarea');
    t.value = text;
    t.style.position = 'fixed';
    t.style.left = '-9999px';
    document.body.appendChild(t);
    t.focus();
    t.select();
    try {
      document.execCommand('copy');
      showToast(msg || '클립보드에 복사되었다냥! 🐾');
    } catch (e) {
      showToast('주소를 직접 복사해달라옹: https://cat-astro.xyz');
    }
    document.body.removeChild(t);
  }

  async function saveSidebarSummaryCard() {
    const cat = getGuardianCatType(savedChartData);
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '380px';
    tempContainer.innerHTML = generateGuardianCatCardHtml(cat, 'gcc-temp-export');
    document.body.appendChild(tempContainer);

    try {
      await saveCardAsImage('gcc-temp-export', cat.title);
    } finally {
      document.body.removeChild(tempContainer);
    }
  }

  function initGuardianCatShareSystem() {
    // 사이드바 수호 냥이 버튼 리스너 바인딩
    const btnSaveSummary = document.getElementById('btn-save-summary-card');
    const btnShareSummary = document.getElementById('btn-share-summary-card');

    if (btnSaveSummary) {
      btnSaveSummary.addEventListener('click', (e) => {
        e.preventDefault();
        saveSidebarSummaryCard();
      });
    }

    if (btnShareSummary) {
      btnShareSummary.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = getGuardianCatType(savedChartData);
        shareGuardianCat(cat, null);
      });
    }

    // 동적 생성된 결과 카드 내 액션 버튼 클릭 위임
    document.addEventListener('click', (e) => {
      const saveBtn = e.target.closest('.btn-save-image');
      if (saveBtn) {
        e.preventDefault();
        const targetId = saveBtn.getAttribute('data-card-target');
        if (targetId) {
          const cardEl = document.getElementById(targetId);
          const catTitle = cardEl ? cardEl.querySelector('.gcc-cat-name')?.textContent : '운세카드';
          saveCardAsImage(targetId, catTitle);
        }
        return;
      }

      const shareBtn = e.target.closest('.btn-share-kakao');
      if (shareBtn) {
        e.preventDefault();
        const targetId = shareBtn.getAttribute('data-card-target');
        let cat = getGuardianCatType(savedChartData);
        if (targetId) {
          const cardEl = document.getElementById(targetId);
          if (cardEl) {
            const catKey = cardEl.dataset.catId || cardEl.dataset.catSign;
            if (catKey) {
              cat = getGuardianCatType(catKey);
            }
          }
        }
        shareGuardianCat(cat, targetId);
        return;
      }
    });

    // 카카오 JavaScript SDK 초기화 템플릿 (카카오 개발자 키 설정 시 자동 활성화)
    const KAKAO_JS_KEY = ''; // 카카오 디벨로퍼스 JavaScript 키 입력 위치
    if (window.Kakao && KAKAO_JS_KEY && typeof window.Kakao.init === 'function' && !window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_JS_KEY);
    }
  }
});

