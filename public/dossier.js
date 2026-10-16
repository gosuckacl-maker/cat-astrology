// dossier.js - 대점성술사 루나 13세의 나만의 우주 지문 평생 소장서 (15,000자+ 고품질 심층 엔진)
// 서양 정통 점성학(Hellenistic & Modern Psychological Astrology) + Whole Sign 하우스 체계 기반

const DossierEngine = (() => {
  const ZODIAC_PROFILES = {
    '양자리': {
      symbol: '♈',
      element: '불(Fire)의 최초의 원소',
      modality: '활동궁 (Cardinal)',
      core: '불의 원소이자 12별자리의 첫 번째 문을 여는 개척자로서, 망설임 없이 전선으로 돌진하는 영광스러운 전사의 기운을 품고 있습니다.',
      catMetaphor: '새로운 영역의 문이 열리면 꼬리를 꼿꼿이 세우고 단숨에 도약하는 용맹무쌍한 호랑이 고양이',
      strength: '독보적인 추진력, 불의를 참지 못하는 정의감, 패배에 굴하지 않고 오뚝이처럼 일어서는 불굴의 에너지와 솔직담백한 영혼',
      shadow: '지나친 조급함, 뒷심 부족, 타인의 속도를 기다려주지 못해 발생하는 충동적인 마찰과 성급한 결정',
      cure: '도약하기 전에 발톱을 단단히 고르고, 깊은 숨을 3번 들이쉬며 장기적인 호흡을 가다듬는 훈련이 필요합니다.',
      loveStyle: '재거나 망설이지 않고 직진하는 열정적인 사랑, 솔직하고 뒤끝 없는 순수한 애정 공세',
      wealthStyle: '공격적인 도전과 빠른 결단으로 기회를 낚아채는 사냥꾼형 재물운, 과소비 충동을 다스리는 것이 핵심'
    },
    '황소자리': {
      symbol: '♉',
      element: '흙(Earth)의 단단한 고정궁',
      modality: '고정궁 (Fixed)',
      core: '흙의 원소이자 금성의 축복을 받은 별자리로서, 변치 않는 굳건함과 물질적 풍요, 감각적 미학과 실질적인 안정을 소유하고 있습니다.',
      catMetaphor: '따스한 햇살이 드는 벨벳 방석 위에서 최고급 츄르를 음미하며 여유를 즐기는 우아한 귀족 미식묘',
      strength: '흔들리지 않는 인내심, 뛰어난 현실 감각과 재물 축적 능력, 소중한 사람을 끝까지 지키는 듬직한 신의와 예술적 안목',
      shadow: '변화를 극도로 꺼리는 완고함, 소유욕과 질투심, 안전지대에만 안주하려는 게으름과 매너리즘',
      cure: '익숙한 캣타워에서 가끔은 내려와 낯선 바람을 쐬고 새로운 가능성에 마음을 여는 유연성과 모험심을 길러야 합니다.',
      loveStyle: '한번 마음을 주면 평생을 신뢰로 지켜주는 진중한 사랑, 스킨십과 함께하는 따뜻한 온기 중시',
      wealthStyle: '복리의 마법을 실천하며 눈덩이처럼 자산을 굴려 나가는 안정형 부자 기운, 실물 자산과의 궁합 최상'
    },
    '쌍둥이자리': {
      symbol: '♊',
      element: '공기(Air)의 유연한 변통궁',
      modality: '변통궁 (Mutable)',
      core: '공기의 원소이자 수성의 다채로운 지적 호기심을 대변하며, 눈부시게 빠른 두뇌 회전과 언어적 마술, 경쾌한 적응력을 구사합니다.',
      catMetaphor: '방울 소리 하나에도 귀를 쫑긋거리며 방 안의 모든 구석을 탐색하는 영민하고 호기심 많은 샴고양이',
      strength: '탁월한 정보 수집력, 유쾌한 화술과 대인 친화력, 어떤 환경에서도 빛을 발하는 카멜레온 같은 다재다능함',
      shadow: '산만함과 집중력 분산, 얕고 넓은 지식에 머무를 위험, 감정적 깊이를 회피하고 가벼워질 수 있는 경향',
      cure: '한 번에 열 개의 장난감을 쫓기보다, 진정으로 가치 있는 한 가지 목표를 물고 끝까지 파고드는 끈기를 장착해야 합니다.',
      loveStyle: '말이 잘 통하고 지적인 티키타카가 살아있는 친구 같은 연애, 지루할 틈이 없는 유쾌한 낭만',
      wealthStyle: '트렌드를 한발 앞서 읽고 지식 정보 산업이나 다각화된 파이프라인으로 수익을 창출하는 멀티플레이어'
    },
    '게자리': {
      symbol: '♋',
      element: '물(Water)의 모성애 어린 활동궁',
      modality: '활동궁 (Cardinal)',
      core: '물의 원소이자 달의 지배를 받는 별자리로서, 바다처럼 깊은 감수성과 따뜻한 모성애, 비범한 직관력과 보호 본능을 품고 있습니다.',
      catMetaphor: '자신의 영역과 가족을 지키기 위해 날카로운 발톱을 세우면서도, 안에서는 끝없는 골골송을 들려주는 다정한 솜방망이',
      strength: '상대의 아픔을 단숨에 감싸 안는 공감 능력, 뛰어난 기억력, 소중한 사람들에게 안식처를 선사하는 무한한 헌신',
      shadow: '기분의 급격한 기복, 과거의 상처에 대한 집착, 방어적이고 폐쇄적인 태도로 인한 자기 연민',
      cure: '타인의 감정 쓰레기통이 되지 않도록 영혼의 경계선을 세우고, 나 자신을 먼저 품어주는 셀프 그루밍이 필수적입니다.',
      loveStyle: '가족처럼 포근하고 영혼의 안식을 주는 깊은 결속, 헌신적이며 배신하지 않는 굳건한 애정',
      wealthStyle: '부동산이나 생활 기반 산업, 저축과 안전한 방어적 자산 관리를 통해 가문을 지탱하는 부의 원천'
    },
    '사자자리': {
      symbol: '♌',
      element: '불(Fire)의 찬란한 제왕궁',
      modality: '고정궁 (Fixed)',
      core: '불의 원소이자 태양의 직계 수호 아래 태어난 별자리로서, 당당한 자존감과 영웅적인 카리스마, 순수한 열정과 창의성을 뿜어냅니다.',
      catMetaphor: '캣타워 가장 높은 곳에 올라 황금빛 갈기를 휘날리며 온 집안을 위풍당당하게 굽어보는 제왕묘',
      strength: '천부적인 리더십, 대범한 도량과 관대함, 무대 위에서 대중을 사로잡는 마력적인 존재감과 꺾이지 않는 용기',
      shadow: '타인의 인정과 박수에 대한 과도한 갈증, 자존심이 상했을 때의 극단적인 오만함과 냉담함, 극적인 과장',
      cure: '남들의 시선이라는 거울에 나를 비추지 말고, 내면에서 저절로 우러나오는 따스한 사랑으로 주변을 품을 때 진정한 제왕이 됩니다.',
      loveStyle: '영화의 주인공처럼 화려하고 로맨틱한 사랑, 연인을 세상에서 가장 특별한 존재로 대우하는 관대함',
      wealthStyle: '통 크게 베풀고 더 크게 벌어들이는 스케일의 부, 엔터테인먼트, 브랜딩, 리더십을 통한 고수익 창출'
    },
    '처녀자리': {
      symbol: '♍',
      element: '흙(Earth)의 치밀한 분석궁',
      modality: '변통궁 (Mutable)',
      core: '흙의 원소이자 섬세한 분석의 달인으로서, 혼돈 속에서 완벽한 질서를 빚어내는 장인 정신과 지혜로운 봉사의 미덕을 지닙니다.',
      catMetaphor: '털 한 올 흐트러지지 않도록 온종일 정성스럽게 털을 빗고 주변을 깔끔하게 정리하는 완벽주의 그루밍 마스터',
      strength: '빈틈없는 관찰력과 기획력, 약속을 칼같이 지키는 책임감, 복잡한 문제를 명쾌하게 풀어내는 실무적 천재성',
      shadow: '자신과 타인을 향한 지나친 비판과 검열, 사소한 디테일에 얽매여 큰 그림을 놓치는 불안감과 스트레스',
      cure: '세상의 불완전함도 우주의 자연스러운 섭리임을 인정하고, 80%의 성과에서도 충분히 만족할 줄 아는 너그러움이 약입니다.',
      loveStyle: '겉으로 화려한 말보다 실질적인 행동과 섬세한 챙김으로 사랑을 증명하는 듬직하고 정갈한 연애',
      wealthStyle: '철저한 가계부 관리와 데이터 기반의 분산 투자, 실무 전문성을 무기로 쌓아 올리는 견고한 부'
    },
    '천칭자리': {
      symbol: '♎',
      element: '공기(Air)의 우아한 조화궁',
      modality: '활동궁 (Cardinal)',
      core: '공기의 원소이자 금성의 세련된 감각을 구현하며, 극단에 치우치지 않는 평화와 조화, 고결한 심미안과 정의를 추구합니다.',
      catMetaphor: '높은 창틀 위에서도 깃털처럼 가볍고 우아하게 한 치의 흔들림 없이 균형을 잡는 기품 넘치는 페르시안 고양이',
      strength: '탁월한 중재력과 외교적 수완, 뛰어난 패션 및 예술적 안목, 누구에게나 호감을 주는 매너와 공평무사한 배려',
      shadow: '우유부단함과 결정 장애, 갈등을 두려워하여 속마음을 숨기는 가면, 타인의 평가에 지나치게 휘둘리는 태도',
      cure: '때로는 모두를 만족시키려 애쓰지 말고, 내 직관과 가치관에 따라 당당하게 "NO"를 외치는 단호함을 발휘해야 합니다.',
      loveStyle: '상호 존중과 예의, 우아한 데이트와 지적 대화가 어우러진 영화 같은 로맨스',
      wealthStyle: '협업과 파트너십, 중개 및 럭셔리·디자인 비즈니스를 통해 사람과 자본을 연결하며 부를 창출'
    },
    '전갈자리': {
      symbol: '♏',
      element: '물(Water)의 심연 속 불사조궁',
      modality: '고정궁 (Fixed)',
      core: '물의 원소이자 명왕성의 심오한 변형을 상징하며, 칠흑 같은 어둠 속에서도 진실을 꿰뚫는 투시경과 불사조 같은 재생력을 가집니다.',
      catMetaphor: '어두운 방 한구석에서 번뜩이는 에메랄드빛 눈동자로 인간의 영혼 밑바닥까지 꿰뚫어 보는 신비로운 흑묘',
      strength: '상상을 초월하는 집중력과 집념, 위기 속에서 오히려 기적을 창조하는 부활의 힘, 배신하지 않는 절대적 충성심과 통찰',
      shadow: '극심한 의심과 통제욕, 원한과 상처를 마음속 깊이 묻어두는 복수심, 스스로를 태워버리는 격렬한 감정의 소용돌이',
      cure: '과거의 아픔을 쥐고 있지 말고 강물에 털을 털어내듯 미련 없이 흘려보내는 용서와 정화의 의식이 필요합니다.',
      loveStyle: '영혼과 영혼이 맞닿는 불가역적인 운명적 결속, 모든 것을 바치는 치명적이고 헌신적인 사랑',
      wealthStyle: '위기 속에서 저평가된 우량 자산을 발굴하는 역발상 투자, 금융 및 독점적 전문성을 통한 거대 자산 축적'
    },
    '사수자리': {
      symbol: '♐',
      element: '불(Fire)의 원대한 지혜궁',
      modality: '변통궁 (Mutable)',
      core: '불의 원소이자 목성의 축복을 받아 끝없는 지평선을 탐험하는 영원한 순례자이자, 자유롭고 낙관적인 지혜의 화신입니다.',
      catMetaphor: '닫힌 방 문고리를 기어코 열어젖히고 탁 트인 옥상으로 날아올라 은하수를 응시하는 방랑자 노르웨이 숲고양이',
      strength: '거침없는 모험심과 열린 세계관, 어떤 절망 속에서도 희망을 발견하는 초긍정 마인드, 고차원적 통찰력과 진리 탐구',
      shadow: '지나친 과장과 약속 남발, 디테일과 현실적 제약을 무시하는 무모함, 구속받기 싫어 책임을 회피하려는 태도',
      cure: '화살을 쏘아 올리기 전에 지표면의 바람과 거리를 정확히 계산하듯, 현실적인 디테일과 실행 계획을 병행해야 합니다.',
      loveStyle: '함께 여행하고 성장할 수 있는 자유롭고 솔직한 연애, 서로의 꿈을 응원하는 소울메이트형 사랑',
      wealthStyle: '글로벌 무대, 지식 지적재산권(IP), 고부가가치 교육 및 무역을 통해 통 크게 확장하는 확장형 부'
    },
    '염소자리': {
      symbol: '♑',
      element: '흙(Earth)의 정상 등반궁',
      modality: '활동궁 (Cardinal)',
      core: '흙의 원소이자 토성의 규율을 품어 가파른 암벽을 묵묵히 기어올라 정상에 깃발을 꽂는 위대한 승부사이자 현실의 지배자입니다.',
      catMetaphor: '발톱에 피가 맺혀도 흔들리지 않고 가장 가파른 캣타워 꼭대기를 향해 묵묵히 전진하는 불굴의 등반묘',
      strength: '무쇠 같은 인내력과 장기 전략적 안목, 사회적 권위와 실질적 부를 축적하는 프로페셔널리즘, 흔들림 없는 신용',
      shadow: '감정을 억압하는 냉정함과 비관주의, 성과와 지위로만 인간을 평가하려는 물질주의, 번아웃에 취약한 워커홀릭',
      cure: '정상에 오르는 것만큼이나 과정에서 마주치는 들꽃의 향기를 맡고, 나 자신에게 따뜻한 온수 찜질과 휴식을 선물해야 합니다.',
      loveStyle: '가벼운 만남을 지양하고 평생을 책임질 수 있는 단단한 현실적 기반 위에 세우는 신뢰의 사랑',
      wealthStyle: '시간이 흐를수록 가치가 기하급수적으로 커지는 우량주, 토지, 부동산 등 묵직한 거목형 자산 형성'
    },
    '물병자리': {
      symbol: '♒',
      element: '공기(Air)의 미래지향 혁신궁',
      modality: '고정궁 (Fixed)',
      core: '공기의 원소이자 천왕성의 전파를 수신하여 미래의 청사진을 미리 살아가는 혁신가이자, 편견 없는 위대한 박애주의자입니다.',
      catMetaphor: '모두가 생선을 쫓을 때 별빛 레이저 포인터를 따라 우주선 설계도를 그리는 엉뚱하고 독창적인 미래형 괴짜묘',
      strength: '시대를 10년 앞서가는 독창적 통찰, 사회적 약자를 향한 연대와 개혁 정신, 감정에 치우치지 않는 쿨하고 객관적인 지성',
      shadow: '지나친 지적 오만함, 인간적인 온기와 공감의 결여, 반대를 위한 반대를 일삼는 괴팍한 고집과 감정적 고립',
      cure: '머리로만 세상을 바꾸려 하지 말고, 심장으로 내려와 한 사람 한 사람의 눈을 맞추며 체온을 나누는 따뜻함이 요구됩니다.',
      loveStyle: '개인의 개성과 사생활을 완벽히 존중하는 쿨하고 세련된 연애, 정신적 교감이 통하는 미래 파트너',
      wealthStyle: 'IT, 첨단 기술, 플랫폼, 커뮤니티 비즈니스 등 신기술과 시대를 선도하는 영역에서의 파괴적 혁신 수익'
    },
    '물고기자리': {
      symbol: '♓',
      element: '물(Water)의 신비로운 해탈궁',
      modality: '변통궁 (Mutable)',
      core: '물의 원소이자 해왕성의 신비로운 바다에 영혼을 담근 별자리로서, 세상의 모든 경계를 허무는 숭고한 사랑과 예술적 직관을 품고 있습니다.',
      catMetaphor: '푸른 은하수 파도 위에서 별가루를 솜방망이에 묻힌 채 시와 음악을 몽상하는 낭만적인 음유시인 고양이',
      strength: '무한한 예술적 영감과 상상력, 타인의 상처를 자신의 것처럼 품는 영적 자비심, 논리를 뛰어넘는 신비한 예지력과 직관',
      shadow: '현실 도피와 환상에의 도취, 피해자 의식, 타인의 감정에 휩쓸려 자신을 잃어버리는 자기희생의 늪과 중독 취약성',
      cure: '물속에서 나와 단단한 땅 위에 발을 딛고 서는 연습을 하며, 영적 영감을 실질적인 예술품이나 결과물로 구현하는 그라운딩이 필수적입니다.',
      loveStyle: '동화 속 인어공주처럼 헌신적이고 모든 것을 녹여내는 무조건적 사랑, 영혼이 융합되는 숭고한 로맨스',
      wealthStyle: '예술, 콘텐츠, 치유, 심리상담, 엔터테인먼트 등 보이지 않는 감성을 감동적인 가치로 치환하는 영적 부'
    }
  };

  function getSignData(signName) {
    return ZODIAC_PROFILES[signName] || ZODIAC_PROFILES['사수자리'];
  }

  function generateDossierData(chart) {
    const sun = (chart && chart.sun) ? chart.sun : { name: '사수자리', symbol: '♐' };
    const moon = (chart && chart.moon) ? chart.moon : { name: '천칭자리', symbol: '♎' };
    const asc = (chart && chart.ascendant) ? chart.ascendant : { name: '황소자리', symbol: '♉' };
    const mercury = (chart && chart.mercury) ? chart.mercury : { name: '전갈자리', symbol: '♏' };
    const venus = (chart && chart.venus) ? chart.venus : { name: '염소자리', symbol: '♑' };
    const mars = (chart && chart.mars) ? chart.mars : { name: '처녀자리', symbol: '♍' };
    const jupiter = (chart && chart.jupiter) ? chart.jupiter : { name: '물병자리', symbol: '♒' };
    const saturn = (chart && chart.saturn) ? chart.saturn : { name: '양자리', symbol: '♈' };
    const uranus = (chart && chart.planets && chart.planets.Uranus) ? chart.planets.Uranus : { signName: '황소자리', symbol: '♅' };
    const neptune = (chart && chart.planets && chart.planets.Neptune) ? chart.planets.Neptune : { signName: '물고기자리', symbol: '♆' };
    const pluto = (chart && chart.planets && chart.planets.Pluto) ? chart.planets.Pluto : { signName: '염소자리', symbol: '♇' };

    const birthDate = (chart && chart.birthDate) || (chart && chart.birthDateStr) || '1995-12-05';
    const birthTime = (chart && chart.birthTime) || '14:30';
    const cityName = (chart && chart.cityName) || (chart && chart.city && chart.city.name) || '대한민국 서울 (Seoul)';

    const sunData = getSignData(sun.name);
    const moonData = getSignData(moon.name);
    const ascData = getSignData(asc.name);
    const mercData = getSignData(mercury.name);
    const venusData = getSignData(venus.name);
    const marsData = getSignData(mars.name);
    const jupData = getSignData(jupiter.name);
    const satData = getSignData(saturn.name);

    return {
      sun, moon, asc, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto,
      birthDate, birthTime, cityName,
      sunData, moonData, ascData, mercData, venusData, marsData, jupData, satData
    };
  }

  // 전체 HTML 렌더링 함수
  function generateHtml(chart) {
    const d = generateDossierData(chart);

    return `
      <!-- 1페이지: 표지 및 공식 천체 제원록 -->
      <div class="pdf-page pdf-cover">
        <div class="pdf-cover-border">
          <div class="pdf-emblem">✨🐾 묘성 은하 대점성학 연구소 공식 소장서 🐾✨</div>
          <div class="pdf-cat-art">🧙‍♂️🐱🔮</div>
          <h1 class="pdf-title">우주 지문 점성학 평생 소장서</h1>
          <p class="pdf-subtitle">대점성술사 루나 13세가 풀어낸 개인 출생 천체 정밀 분석록</p>
          
          <div class="pdf-owner-box">
            <div class="owner-row"><span>소장 집사:</span> <strong>특별한 집사님</strong></div>
            <div class="owner-row"><span>출생 일시:</span> <span>${d.birthDate} ${d.birthTime}</span></div>
            <div class="owner-row"><span>출생 도시:</span> <span>${d.cityName}</span></div>
            <div class="owner-row"><span>하우스 체계:</span> <span>Whole Sign System (서양 정통 규격)</span></div>
            <div class="owner-row"><span>공식 인증 코드:</span> <span>LUNA-VIP-15000-SPECIAL</span></div>
          </div>

          <div style="margin-top: 24px; padding: 14px; background: #fffcf4; border: 1px solid #e8deb8; border-radius: 6px; text-align: left;">
            <div style="font-weight: 700; color: #7a5a1e; margin-bottom: 8px; font-size: 13px;">🪐 10대 천체 공식 제원 요약표</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 12px; color: #3b354d;">
              <div>☀️ 태양: <strong>${d.sun.name} ${d.sun.symbol}</strong> (${d.sunData.element})</div>
              <div>🌙 달: <strong>${d.moon.name} ${d.moon.symbol}</strong> (${d.moonData.element})</div>
              <div>⬆️ 상승궁: <strong>${d.asc.name} ${d.asc.symbol}</strong> (${d.ascData.element})</div>
              <div>☿ 수성: <strong>${d.mercury.name} ${d.mercury.symbol}</strong> (${d.mercData.element})</div>
              <div>♀ 금성: <strong>${d.venus.name} ${d.venus.symbol}</strong> (${d.venusData.element})</div>
              <div>♂ 화성: <strong>${d.mars.name} ${d.mars.symbol}</strong> (${d.marsData.element})</div>
              <div>♃ 목성: <strong>${d.jupiter.name} ${d.jupiter.symbol}</strong> (${d.jupData.element})</div>
              <div>♄ 토성: <strong>${d.saturn.name} ${d.saturn.symbol}</strong> (${d.satData.element})</div>
              <div>♅ 천왕성: <strong>${d.uranus.signName || '황소자리'} ${d.uranus.symbol || '♅'}</strong></div>
              <div>♆ 해왕성: <strong>${d.neptune.signName || '물고기자리'} ${d.neptune.symbol || '♆'}</strong></div>
            </div>
          </div>

          <div style="margin-top: 20px; font-size: 12px; color: #8c7b64;">
            ※ 본 분석서는 총 15,000자 이상의 고품질 서양 점성학 심층 텍스트로 구성된 영구 소장용 문서입니다.
          </div>
        </div>
      </div>

      <!-- 2페이지: 서문 (프롤로그) -->
      <div class="pdf-page">
        <h2 class="pdf-chapter-title">📜 서문 (Prologue): 우주 지문과 영혼의 블루프린트</h2>
        <div class="pdf-prologue-content" style="font-size: 13px; line-height: 1.8; color: #2c2538;">
          <p style="margin-bottom: 12px;">
            어서오라냥, 광활한 은하수 속에서 수억 개의 별빛을 지나 이 장엄한 운명의 양피지를 펼쳐 든 소중한 나의 집사여! 
            나는 머나먼 묘성(猫星) 은하의 대점성학 연구소에서 별들의 궤도를 수천 년간 관측해 온 수석 점성술사, 고양이 <strong>'루나 13세'</strong>다냥. 
            발바닥에 신비로운 자수정 젤리를 품고 우주의 은총을 집사에게 전하러 왔다옹!
          </p>
          <p style="margin-bottom: 12px;">
            사람들은 흔히 자신의 운명을 알기 위해 동양의 사주명리학이나 단순한 12별자리 주간 운세를 찾아 헤매곤 한다옹. 
            하지만 집사여, 인간이 어머니의 모태에서 벗어나 이 땅에 첫 호흡을 내뱉는 바로 그 찰나의 순간, 하늘의 태양계 행성들과 황도 12궁은 마치 스탑워치를 누른 것처럼 
            우주라는 거대한 암실 속에서 단 하나의 고유한 스냅사진을 인화해낸다냥! 그것이 바로 서양 점성술의 정수이자 절대 변하지 않는 집사만의 <strong>'우주 지문(Cosmic Blueprint)'</strong>이라옹.
          </p>
          <p style="margin-bottom: 12px;">
            이 우주 지문 속에는 집사의 영혼이 이번 생애에서 완수해야 할 천명(Life Purpose)과 가슴속에 숨겨둔 무의식의 상처, 부와 번영을 끌어당기는 황금 열쇠, 
            그리고 심장을 뛰게 만드는 사랑의 궤적이 0.1도의 오차도 없이 정밀하게 음각되어 있다냥. 사주가 계절의 기운(음양오행)을 거시적으로 조망한다면, 
            정통 서양 점성술은 10대 행성과 12개 하우스의 기하학적 각도(Aspects)를 통해 인간 내면의 심리 메커니즘을 3D 입체 투시도처럼 정교하게 파헤쳐낸다옹.
          </p>
          <div class="pdf-card-box" style="margin: 18px 0; background: #faf7f0; border-left: 4px solid #b58d3d;">
            <h3 style="font-size: 13.5px; color: #6b4d1b; margin-bottom: 6px;">🐾 루나 13세의 영혼 지침: "왜 점성술인가?"</h3>
            <p style="font-size: 12.5px; line-height: 1.7; color: #443c52;">
              "별은 결코 인간을 강제하지 않는다. 다만 가장 순수한 길을 비춰줄 뿐이다."<br>
              집사여, 이 평생 소장서는 미래를 정해진 감옥에 가두는 예언서가 아니라, 거친 파도가 몰아치는 인생이라는 바다에서 집사의 나침반이 흔들리지 않도록 지켜주는 영혼의 등대다냥!
            </p>
          </div>
          <p style="margin-bottom: 12px;">
            이 평생 소장서는 결코 시중의 조잡한 몇 줄짜리 점괘나 얕은 요약본이 아니다냥. 집사가 살아가는 동안 길을 잃거나, 삶의 거친 풍파가 몰아쳐 캣타워에서 떨어질 것만 같은 순간마다 
            펼쳐보며 스스로의 존엄성과 무한한 잠재력을 일깨울 수 있는 '영혼의 나침반'이자 '인생의 치트키 북'이다옹. 
            자, 이제 루나의 핑크빛 발바닥 젤리로 신비로운 수정구슬을 힘차게 굴려, 집사만의 천체 궤도를 한 꺼풀씩 벗겨내 보겠다냥! 귀를 쫑긋 세우고 루나의 목소리를 따라오라옹! 🐾✨
          </p>
        </div>
      </div>

      <!-- 3페이지: 제1부 - 삼위일체 Big 3 (태양 & 달) -->
      <div class="pdf-page">
        <h2 class="pdf-chapter-title">제1부. 삼위일체 Big 3: 나의 본질 자아와 영혼의 지도 (상편)</h2>
        <div style="font-size: 12.5px; line-height: 1.7; color: #2c2538;">
          <p style="margin-bottom: 14px;">
            점성학에서 태양(Sun), 달(Moon), 상승궁(Ascendant)은 인간의 영혼을 떠받치는 삼각대(Trinity)라 부른다냥. 
            태양이 '내가 되고자 하는 의식적 자아(인생의 목적)'라면, 달은 '내가 홀로 있을 때 느끼는 무의식적 감정(정서적 본능)'이고, 상승궁은 '타인이 나를 처음 보았을 때 풍기는 사회적 가면(인터페이스)'이다옹. 
            이 세 가지가 완벽한 조화를 이룰 때 인간은 비로소 영혼의 자유와 완전한 자아실현에 도달하게 된다냥.
          </p>

          <div class="pdf-card-box" style="margin-bottom: 16px;">
            <h3 style="font-size: 14px; color: #8c5d1e; border-bottom: 1px solid #ebd9b5; padding-bottom: 4px;">
              ☀️ 제1장. 태양(Sun) in ${d.sun.name} (${d.sun.symbol}) - 영혼의 코어 자아와 삶의 소명
            </h3>
            <p><strong>[본질적 원소와 상징]:</strong> ${d.sunData.core}</p>
            <p style="margin-top: 6px;">
              고양이 생태계로 비유하자면 집사의 태양은 바로 <strong>'${d.sunData.catMetaphor}'</strong>의 기운이라옹! 
              집사가 이 세상에 태어난 이유는 남의 눈치를 보며 웅크려 살기 위함이 아니라, ${d.sun.name} 특유의 <strong>${d.sunData.strength}</strong>을(를) 세상 만방에 당당하게 떨치기 위함이다냥.
            </p>
            <p style="margin-top: 6px;">
              태양은 집사의 자존감(Self-esteem)의 거대한 원자력 발전소다옹. 집사가 자신의 가치를 증명하고 사회적으로 인정받기 위해서는 일상에서 주도권을 쥐고 스스로 결정을 내릴 수 있는 환경이 반드시 보장되어야 한다냥. 
              만약 남이 시키는 단순 반복 노동에 갇히거나 자신의 고유한 창의성과 자율성을 억압당하면, 집사의 태양은 검은 먹구름에 가려져 심각한 무기력증과 영혼의 가뭄에 빠지게 된다옹.
            </p>
            <p style="margin-top: 6px;">
              <strong>[주의해야 할 그림자]:</strong> ${d.sunData.shadow}의 덫에 걸리면 주변 사람들과 불필요한 마찰을 빚거나 소중한 에너지를 소모적인 갈등에 낭비할 수 있다옹. 
              이를 극복하기 위한 루나의 비법 처방은 바로 <em>'${d.sunData.cure}'</em>이다냥! 이 지혜를 가슴에 품을 때 집사의 태양은 한낮의 태양처럼 눈부신 황금빛을 내뿜게 될 것이다옹.
            </p>
          </div>

          <div class="pdf-card-box" style="margin-bottom: 16px;">
            <h3 style="font-size: 14px; color: #4d4678; border-bottom: 1px solid #dcd7eb; padding-bottom: 4px;">
              🌙 제2장. 달(Moon) in ${d.moon.name} (${d.moon.symbol}) - 무의식의 심연과 정서적 안식처
            </h3>
            <p><strong>[무의식의 본능]:</strong> ${d.moonData.core}</p>
            <p style="margin-top: 6px;">
              달은 한밤중 아무도 보지 않는 방 안에서 혼자 있을 때 드러나는 '가장 솔직하고 연약한 아기고양이 자아'다옹. 
              집사의 내면 고양이는 바로 <strong>'${d.moonData.catMetaphor}'</strong>의 본성을 지니고 있다냥.
            </p>
            <p style="margin-top: 6px;">
              많은 사람들이 집사의 겉모습만 보고 씩씩하다거나 차분하다고 생각할지 모르지만, 집사의 심장 깊은 곳에서는 ${d.moon.name} 특유의 섬세한 정서적 안정이 절실하게 요구된다옹. 
              스트레스가 극에 달했을 때 집사가 본능적으로 찾는 것은 화려한 성공이나 남들의 칭찬이 아니라, 마음을 터놓을 수 있는 안전한 보금자리와 무조건적인 정서적 수용이다냥.
            </p>
            <p style="margin-top: 6px;">
              <strong>[정서적 결핍과 치유]:</strong> 만약 정서적 결핍이 찾아오면 집사는 ${d.moonData.shadow} 증상을 보이며 마음의 문을 닫아걸거나 차갑게 식어버릴 수 있다옹. 
              집사에게 필요한 진정한 힐링 그루밍은 남을 돌보기 전에 나 자신의 발바닥 젤리를 먼저 보듬어주는 것이다냥. 
              루나의 정서 처방: <em>${d.moonData.cure}</em> 집사의 내면 달이 평온을 되찾을 때, 집사는 어떤 거센 비바람도 뚫고 나아갈 수 있는 놀라운 내면의 회복탄력성을 발휘하게 된다옹!
            </p>
          </div>
        </div>
      </div>

      <!-- 4페이지: 제1부 계속 - 상승궁(Ascendant) & Big 3 삼각 통합 -->
      <div class="pdf-page">
        <h2 class="pdf-chapter-title">제1부. 삼위일체 Big 3: 나의 본질 자아와 영혼의 지도 (하편)</h2>
        <div style="font-size: 12.5px; line-height: 1.7; color: #2c2538;">
          <div class="pdf-card-box" style="margin-bottom: 18px;">
            <h3 style="font-size: 14px; color: #1e6357; border-bottom: 1px solid #c7e6e0; padding-bottom: 4px;">
              ⬆️ 제3장. 상승궁(Ascendant) in ${d.asc.name} (${d.asc.symbol}) - 세상과 마주하는 첫 대면 인터페이스
            </h3>
            <p><strong>[사회적 페르소나와 아우라]:</strong> ${d.ascData.core}</p>
            <p style="margin-top: 6px;">
              상승궁은 동쪽 지평선에서 집사가 태어나던 순간 떠오르던 별자리로서, 타인이 집사를 처음 보았을 때 본능적으로 느끼는 '첫인상(First Impression)', 외모적 분위기, 그리고 세상이라는 무대에 서는 사회적 가면이다옹. 
              집사의 첫 대면 인터페이스는 바로 <strong>'${d.ascData.catMetaphor}'</strong>의 아우라를 강하게 풍긴다냥!
            </p>
            <p style="margin-top: 6px;">
              사람들은 집사를 처음 대할 때 <strong>${d.ascData.strength}</strong>을(를) 직관적으로 감지하고 경외심과 신뢰감을 품게 된다옹. 
              집사의 걸음걸이, 말투, 눈빛에는 ${d.asc.name} 특유의 고유한 기품과 매력이 서려 있어, 굳이 자신을 과시하지 않아도 은근한 카리스마로 좌중을 압도하는 묘한 힘이 있다냥.
            </p>
            <p style="margin-top: 6px;">
              <strong>[스타일링 & 기운 증폭]:</strong> 패션과 스타일링에 있어서도 ${d.asc.name}의 미학적 코드를 살리는 것이 운을 트이게 하는 특급 비결이다옹. 
              집사는 지나치게 가볍거나 유행만 쫓는 스타일보다는, 집사만의 고유한 체취와 기품을 살려주는 고급스럽고 정갈한 스타일링을 유지할 때 귀인들의 이목을 사로잡고 막혔던 사회적 인맥을 단숨에 뚫어낼 수 있다냥.
            </p>
          </div>

          <div class="pdf-card-box" style="margin-bottom: 16px; background: #fffcf6; border-left: 4px solid #b58d3d;">
            <h3 style="font-size: 14px; color: #73501a; border-bottom: 1px solid #eadbba; padding-bottom: 4px;">
              ✨ 제4장. Big 3의 유기적 상호작용 삼각 분석: 내적 모순 극복과 삼위일체 통합 공식
            </h3>
            <p>
              자, 여기서 루나의 특급 점성학 분석이 들어간다냥! 집사의 차트를 보면 태양(${d.sun.name})과 달(${d.moon.name}), 그리고 상승궁(${d.asc.name}) 사이에 아주 흥미진진한 긴장과 조화의 역학 관계가 펼쳐지고 있다옹.
            </p>
            <p style="margin-top: 6px;">
              예를 들어, 밖으로 뻗어나가며 세상을 정복하고 싶은 태양의 야망과, 조용하고 아늑한 방 안에서 평화를 누리고 싶은 달의 욕구가 서로 부딪힐 때, 
              집사는 마음속에서 <em>"내가 왜 이러지? 어제는 열정적이었다가 오늘은 왜 이렇게 지치고 혼자 있고 싶지?"</em> 하는 깊은 내적 분열과 자책을 겪을 수 있다냥.
            </p>
            <p style="margin-top: 6px;">
              게다가 세상 사람들은 집사의 상승궁(${d.asc.name})만을 보고 집사가 아무 문제 없이 완벽하고 흔들림 없는 사람일 거라 기대하지만, 
              정작 집사의 속마음(달)은 남모를 외로움과 불안을 홀로 삭이고 있을 때가 많다옹.
            </p>
            <p style="margin-top: 6px;">
              <strong>[루나의 삼위일체 통합 공식]:</strong> 이 삼각 갈등을 해결하는 루나의 치트키는 바로 '역할 분담의 기술'이다냥! 
              세상과의 비즈니스와 사회적 미팅은 노련한 외교관인 상승궁(${d.asc.name})에게 맡기고, 인생의 원대한 목표 설정은 용감한 항해사인 태양(${d.sun.name})의 나침반을 따르되, 
              하루의 일과가 끝난 밤에는 내면의 아기고양이인 달(${d.moon.name})에게 가장 포근한 담요와 따스한 우유를 선물하라옹. 
              이 삼위일체가 유기적으로 맞물려 돌아갈 때, 집사는 인생이라는 캣타워의 절대 군주로 등극하게 될 것이다냥! 🐾✨
            </p>
          </div>
        </div>
      </div>

      <!-- 5페이지: 제2부 - 내면 행성 (수성·금성·화성) -->
      <div class="pdf-page">
        <h2 class="pdf-chapter-title">제2부. 본능과 열정의 궤도: 지성·사랑·사냥의 삼총사 (상편)</h2>
        <div style="font-size: 12.5px; line-height: 1.7; color: #2c2538;">
          <p style="margin-bottom: 12px;">
            Big 3가 집사의 뼈대라면, 수성, 금성, 화성은 일상에서 피와 살이 되어 뛰는 실전 도구들이다냥. 
            두뇌와 언어(수성), 사랑과 돈(금성), 사냥과 행동력(화성)의 비밀을 낱낱이 파헤쳐보겠다옹!
          </p>

          <div class="pdf-card-box" style="margin-bottom: 14px;">
            <h3 style="font-size: 13.5px; color: #2a3d66;">☿ 제5장. 수성(Mercury) in ${d.mercury.name} (${d.mercury.symbol}) - 사고방식과 화술</h3>
            <p><strong>[지적 엔진]:</strong> ${d.mercData.core}</p>
            <p style="margin-top: 4px;">
              집사의 두뇌 엔진은 남들과 똑같은 주입식 암기나 뻔한 상식 수준의 논리로는 결코 만족하지 않는다옹. 
              집사는 어떤 정보나 문제를 접했을 때, 겉핥기식 설명보다는 그 이면에 숨겨진 본질적 원리와 구조적 인과관계를 꿰뚫어 보아야만 직성이 풀리는 뛰어난 지적 탐구심을 지니고 있다냥.
            </p>
            <p style="margin-top: 4px;">
              화술과 커뮤니케이션에 있어서도 집사는 <strong>${d.mercData.strength}</strong>의 면모를 유감없이 발휘한다옹. 
              상대방의 논리적 모순이나 감춰진 의도를 귀신같이 포착해내며, 꼭 필요한 순간에 촌철살인의 한마디로 판세를 뒤집는 비범한 설득력을 갖추고 있다냥. 
              생각의 회로가 과열되었을 때는 스마트폰을 끄고 조용한 산책으로 뇌를 식혀주는 것이 루나의 특효 처방이다옹.
            </p>
          </div>

          <div class="pdf-card-box" style="margin-bottom: 14px;">
            <h3 style="font-size: 13.5px; color: #6e274c;">♀ 제6장. 금성(Venus) in ${d.venus.name} (${d.venus.symbol}) - 사랑·자력·미적 감각</h3>
            <p><strong>[사랑의 가치관]:</strong> ${d.venusData.core}</p>
            <p style="margin-top: 4px;">
              연애에 있어서 집사는 결코 가벼운 장난이나 인스턴트 같은 불장난에 영혼을 팔지 않는다옹. 
              집사의 가슴을 뛰게 만드는 상대는 외모만 번지르르한 사람이 아니라, ${d.venus.name} 특유의 깊이 있는 영혼과 신뢰, 
              그리고 집사만의 독특한 취향과 세계관을 온전히 존중해줄 수 있는 진짜배기 인연이다냥.
            </p>
            <p style="margin-top: 4px;">
              이성을 끌어당기는 집사의 자력(Magnetism)은 <strong>${d.venusData.strength}</strong>에서 뿜어져 나온다옹. 
              상대방은 집사와 대화를 나눌수록 양파 껍질처럼 벗겨지는 집사의 치명적인 매력과 은근한 온기에 걷잡을 수 없이 매료당하게 된다냥. 
              금전 감각에 있어서도 집사는 세월이 흘러도 가치가 바래지 않는 품격 있는 자산에 투자할 줄 아는 탁월한 심미안을 품고 있다옹.
            </p>
          </div>

          <div class="pdf-card-box" style="margin-bottom: 14px;">
            <h3 style="font-size: 13.5px; color: #6b2222;">♂ 제7장. 화성(Mars) in ${d.mars.name} (${d.mars.symbol}) - 야망과 사냥 본능</h3>
            <p><strong>[행동력과 투지]:</strong> ${d.marsData.core}</p>
            <p style="margin-top: 4px;">
              집사의 사냥 스타일은 무모하게 날뛰는 들고양이가 아니다옹. 집사는 목표물(프로젝트, 시험, 이직, 사업적 성과)이 시야에 들어오면, 
              <strong>${d.marsData.strength}</strong>을(를) 발휘하여 숨을 죽이고 가장 완벽한 타이밍을 노려 단 한 번의 도약으로 먹잇감을 낚아채는 냉철한 스나이퍼의 기질을 가지고 있다냥.
            </p>
            <p style="margin-top: 4px;">
              하지만 분노와 좌절이 쌓였을 때는 ${d.marsData.shadow}의 형태로 내면에 독이 쌓일 수 있다옹. 
              정기적인 고강도 운동과 땀을 흠뻑 흘리는 스포츠를 통해 신체적 에너지를 방출해줄 때, 화성은 집사의 야망을 현실의 금메달로 바꾸는 최강의 부스터가 되어줄 것이다냥!
            </p>
          </div>
        </div>
      </div>

      <!-- 6페이지: 제2부 계속 - 3대 외행성 (천왕성·해왕성·명왕성) -->
      <div class="pdf-page">
        <h2 class="pdf-chapter-title">제2부. 본능과 열정의 궤도: 현대 3대 외행성 분석 (하편)</h2>
        <div style="font-size: 12.5px; line-height: 1.7; color: #2c2538;">
          <p style="margin-bottom: 14px;">
            점성술에서 천왕성, 해왕성, 명왕성은 개인의 작은 에고를 깨뜨리고 우주적 차원의 거대한 영적 각성을 이끄는 초월 외행성들이다냥! 
            집사의 깊은 무의식에 잠들어 있는 영적 잠재력의 빗장을 풀어보겠다옹.
          </p>

          <div class="pdf-card-box" style="margin-bottom: 16px;">
            <h3 style="font-size: 14px; color: #1e526e;">♅ 제8장. 천왕성(Uranus) in ${d.uranus.signName || '황소자리'} - 파괴적 혁신과 자유</h3>
            <p>
              천왕성은 낡은 껍질을 단숨에 부수고 혁신을 가져오는 번개의 행성이다냥. 
              집사의 삶에서 예기치 않은 급격한 변화나 전환점이 일어날 때마다, 그것은 결코 불운이 아니라 집사를 좁은 상자 안에서 탈출시켜 더 광활한 세상으로 인도하려는 천왕성의 축복임을 기억하라옹.
            </p>
            <p style="margin-top: 6px;">
              남들과 똑같이 흉내 내는 방식으로는 결코 만족할 수 없으며, 기존의 통념을 과감히 깨부수는 독창적인 아이디어와 기술을 도입할 때 집사는 누구도 넘볼 수 없는 혁신가의 명성을 얻게 된다냥.
            </p>
          </div>

          <div class="pdf-card-box" style="margin-bottom: 16px;">
            <h3 style="font-size: 14px; color: #284478;">♆ 제9장. 해왕성(Neptune) in ${d.neptune.signName || '물고기자리'} - 예술적 직관과 영적 신비</h3>
            <p>
              해왕성은 현실의 메마른 대지에 신비로운 안개와 영적 영감을 뿌리는 바다의 행성이다냥. 
              집사의 풍부한 상상력, 예술적 감수성, 사람의 마음을 꿰뚫어 보는 신비로운 직관력은 바로 이 해왕성의 깊은 심해에서 길어 올린 선물이다옹.
            </p>
            <p style="margin-top: 6px;">
              논리와 수치만으로는 설명할 수 없는 꿈의 메시지, 번뜩이는 영감, 사람에 대한 통찰이 바로 여기서 비롯된다냥. 
              단, 환상에 도취되어 현실을 회피하지 않도록 차가운 이성의 닻을 단단히 내리는 훈련이 병행되어야 한다옹.
            </p>
          </div>

          <div class="pdf-card-box" style="margin-bottom: 16px;">
            <h3 style="font-size: 14px; color: #4a2157;">♇ 제10장. 명왕성(Pluto) in ${d.pluto.signName || '염소자리'} - 죽음과 부활, 불사조의 카리스마</h3>
            <p>
              명왕성은 낡은 자아를 불태우고 잿더미 속에서 불사조로 거듭나게 만드는 궁극의 재생 에너지다냥. 
              집사는 인생의 밑바닥까지 떨어지는 것 같은 순간에도 결코 부서지지 않으며, 오히려 그 어둠을 딛고 이전보다 열 배는 더 강력하고 성숙한 존재로 부활하는 절대적 회복력을 장착하고 있다옹!
            </p>
            <p style="margin-top: 6px;">
              위기가 찾아왔을 때 대부분의 사람들은 도망치지만, 집사는 위기의 한가운데로 걸어 들어가 상황을 완전히 장악하고 역전시키는 비범한 카리스마를 발휘하게 된다냥. 
              그것이 바로 집사가 가진 명왕성의 불멸의 불꽃이다옹!
            </p>
          </div>
        </div>
      </div>

      <!-- 7페이지: 제3부 - 12하우스 전 영역 정밀 인생 지도 (1~6하우스) -->
      <div class="pdf-page">
        <h2 class="pdf-chapter-title">제3부. 12하우스(Twelve Houses) 전 영역 정밀 인생 지도 (상편: 1~6하우스)</h2>
        <div style="font-size: 12.5px; line-height: 1.7; color: #2c2538;">
          <p style="margin-bottom: 14px;">
            하늘을 12개의 방으로 나눈 12하우스는 집사가 평생을 살아가며 마주할 12가지 인생의 무대다냥. 
            Whole Sign 정통 규격에 따라 1하우스부터 6하우스까지 개인의 기초와 일상의 무대를 명쾌하게 해독해주겠다옹!
          </p>

          <div class="pdf-card-box" style="margin-bottom: 12px;">
            <h3 style="font-size: 13.5px; color: #2a2245;">🏛️ 제1구역: 개인의 기초 무대 (1~3하우스)</h3>
            <p><strong>• 제1하우스 (자아·생명력·신체 헌법):</strong> 영혼이 육신을 입고 세상에 우뚝 선 첫 번째 깃발이다냥. 집사는 타고난 생명력과 강인한 회복력을 지니고 있으며, 남들의 기준에 자신을 억지로 맞추기보다 자기만의 독창적인 색깔과 당당한 정체성을 세상에 선포할 때 가장 눈부신 에너지가 뿜어져 나온다옹.</p>
            <p style="margin-top: 6px;"><strong>• 제2하우스 (재물·금융 자산·수입의 원천):</strong> 평생의 곳간과 지갑을 관장하는 황금의 방이다냥! 집사는 뜬구름 잡는 일확천금의 망상보다는, 자신의 전문적 재능과 실질적인 노력을 기반으로 차곡차곡 자산을 증식시키는 탁월한 경제적 감각을 타고났다옹. 종잣돈을 모으는 뚝심과 우량 자산 장기 투자가 집사를 부의 반열에 올려놓을 것이다냥.</p>
            <p style="margin-top: 6px;"><strong>• 제3하우스 (커뮤니케이션·배움·지적 호기심):</strong> 번뜩이는 재치와 배움의 고속도로다냥. 글쓰기, 언어, 디지털 미디어, SNS 등 다양한 도구를 활용한 정보 전달 능력이 탁월하며, 호기심을 자극하는 새로운 지식을 스펀지처럼 빨아들이는 흡수력이 남다르다옹. 일상적인 대화 속에서 기발한 비즈니스 영감이 솟아난다냥.</p>
          </div>

          <div class="pdf-card-box" style="margin-bottom: 12px;">
            <h3 style="font-size: 13.5px; color: #2a2245;">🏛️ 제2구역: 내면과 일상의 성역 (4~6하우스)</h3>
            <p><strong>• 제4하우스 (가정·뿌리·심리적 안식처·부동산):</strong> 지친 영혼이 돌아와 닻을 내리는 모태의 항구다냥. 집사에게 집이라는 공간은 단순한 주거지가 아니라, 세상의 모든 소음과 전투로부터 완전히 격리되어 오롯이 휴식을 취할 수 있는 신성한 성역이어야 한다옹. 따스한 간접 조명과 포근한 침구류가 집사의 운을 증폭시키는 힐링 명약이다냥. 부동산 투자와도 궁합이 매우 길하다옹.</p>
            <p style="margin-top: 6px;"><strong>• 제5하우스 (창의성·연애·로맨스·유희와 환희):</strong> 가슴 뛰는 불꽃과 환희의 놀이터다냥! 예술적 감각과 유희, 심장을 두근거리게 만드는 로맨틱한 연애 세포가 살아 숨 쉬고 있다옹. 취미 생활이나 독창적인 창작 프로젝트에 몰입할 때 집사는 마르지 않는 샘물처럼 기발한 아이디어를 뿜어내며 젊음의 에너지를 유지한다냥.</p>
            <p style="margin-top: 6px;"><strong>• 제6하우스 (직업 일상·워크에식·건강 관리):</strong> 프로페셔널한 장인의 작업실이다냥. 집사는 맡은 업무에 대해 놀라운 디테일과 투철한 책임감을 발휘하며, 일상의 체계적인 루틴(균형 잡힌 식습관, 규칙적인 수면, 정갈한 그루밍)이 잘 정돈되어 있을 때 업무 효율이 극대화된다옹. 완벽주의로 인한 과로만 조심하면 조직의 핵심 기둥으로 우뚝 선다냥.</p>
          </div>
        </div>
      </div>

      <!-- 8페이지: 제3부 계속 - 12하우스 전 영역 정밀 인생 지도 (7~12하우스) -->
      <div class="pdf-page">
        <h2 class="pdf-chapter-title">제3부. 12하우스(Twelve Houses) 전 영역 정밀 인생 지도 (하편: 7~12하우스)</h2>
        <div style="font-size: 12.5px; line-height: 1.7; color: #2c2538;">
          <p style="margin-bottom: 14px;">
            7하우스부터 12하우스는 타인과의 만남, 사회적 성취의 정점, 그리고 우주적 영성의 해탈을 다루는 고차원적 영역이다냥! 
            집사의 미래 대운의 문을 활짝 열어보겠다옹.
          </p>

          <div class="pdf-card-box" style="margin-bottom: 12px;">
            <h3 style="font-size: 13.5px; color: #2a2245;">🏛️ 제3구역: 타인과의 결합과 확장 (7~9하우스)</h3>
            <p><strong>• 제7하우스 (배우자·평생의 반려·공적 파트너십):</strong> 나를 비추는 거울과 같은 타인의 영역이다냥. 집사의 운명의 짝은 집사의 부족한 점을 온화하게 채워주고 지적인 대화와 정서적 교감이 깊게 통하는 인연이다옹. 서로의 독립성을 존중하면서도 깊은 신뢰를 나누는 동반자 관계가 성립될 때 집사의 인생은 2배로 확장되며 세상에서 가장 든든한 아군을 얻게 된다냥.</p>
            <p style="margin-top: 6px;"><strong>• 제8하우스 (공유 자산·투자·상속·심리적 부활):</strong> 신비와 부활의 지하 보물창고다냥. 타인과의 깊은 금융적 제휴, 동업 자금, 혹은 투자 수익 등 뜻밖의 큰 재물이 흘러들어오는 통로가 열려 있다옹. 또한 인생의 혹독한 시련을 겪더라도 뱀이 허물을 벗듯 완전히 새로운 존재로 탈바꿈하는 영적 변형의 힘을 지니고 있어 위기를 기회로 바꾸는 기적의 주인공이 된다냥.</p>
            <p style="margin-top: 6px;"><strong>• 제9하우스 (고등 학문·해외 운·철학적 지평):</strong> 넓은 세상을 향해 쏘아 올린 망원경이다냥. 해외 여행, 외국어, 철학과 영성, 전문 자격증과 석박사 학문 등 인생의 차원을 한 단계 끌어올리는 고차원적 탐구에 엄청난 대운이 깃들어 있다옹. 좁은 우물 안을 벗어나 넓은 대양으로 시야를 넓힐수록 집사의 운명은 상상할 수 없을 만큼 거대하게 만개한다냥.</p>
          </div>

          <div class="pdf-card-box" style="margin-bottom: 12px;">
            <h3 style="font-size: 13.5px; color: #2a2245;">🏛️ 제4구역: 세상의 정상과 영혼의 해탈 (10~12하우스)</h3>
            <p><strong>• 제10하우스 (사회적 명예·천직·커리어의 정점):</strong> 캣타워 가장 높은 왕좌다냥! 집사는 결코 이름 없는 평범한 조연으로 생을 마칠 사람이 아니다옹. 자신의 분야에서 독보적인 전문성과 권위를 인정받아 많은 사람들에게 영감을 주는 리더이자 멘토로 우뚝 서게 될 운명적 천직의 별이 찬란하게 빛나고 있다냥. 세상에 자신만의 뚜렷한 족적을 남기게 될 것이다옹.</p>
            <p style="margin-top: 6px;"><strong>• 제11하우스 (소셜 네트워크·이상향·귀인과 스폰서):</strong> 꿈을 함께 나누는 동지들과 귀인들의 방이다냥. 집사의 앞길을 열어줄 귀인과 스폰서들은 집사가 속한 지적·사회적 커뮤니티 속에서 나타난다옹. 이해타산을 떠나 뜻이 통하는 사람들과 연대할 때, 혼자서는 결코 이룰 수 없었던 거대한 기적과 사회적 영향력이 현실로 펼쳐지게 된다냥.</p>
            <p style="margin-top: 6px;"><strong>• 제12하우스 (무의식·은둔과 치유·영적 정화):</strong> 보이지 않는 우주와의 직통 핫라인이다냥. 집사는 꿈이 잘 맞거나 불길한 예감이 적중하는 등 비범한 육감과 영적 안테나를 타고났다옹. 주기적으로 혼자만의 시간을 가지며 명상과 침묵으로 내면을 정화할 때, 전생의 묵은 업장과 피로가 눈 녹듯 사라지고 맑고 성스러운 우주의 은총이 영혼 가득 채워진다냥.</p>
          </div>
        </div>
      </div>

      <!-- 9페이지: 제4부 - 사회적 행성 (목성·토성) & 부의 트라이앵글 포뮬러 -->
      <div class="pdf-page">
        <h2 class="pdf-chapter-title">제4부. 대운의 열쇠와 부의 트라이앵글 포뮬러 (목성·토성 심층)</h2>
        <div style="font-size: 12.5px; line-height: 1.7; color: #2c2538;">
          <p style="margin-bottom: 14px;">
            개인 행성이 일상의 미시적 도구라면, 목성과 토성은 한 인간의 10년, 20년 대운(Big Transit)을 좌우하는 거대한 거인 행성들이다냥! 
            집사의 부귀영화와 현실적 시험대를 명쾌하게 짚어보겠다옹.
          </p>

          <div class="pdf-card-box" style="margin-bottom: 14px;">
            <h3 style="font-size: 13.5px; color: #73501a;">♃ 제11장. 목성(Jupiter) in ${d.jupiter.name} (${d.jupiter.symbol}) - 행운과 확장의 대길성</h3>
            <p><strong>[행운의 치트키]:</strong> ${d.jupData.core}</p>
            <p style="margin-top: 4px;">
              목성은 집사가 최소한의 노력으로도 우주의 거대한 순풍을 탈 수 있는 '행운의 통로'를 알려준다옹. 
              집사가 ${d.jupiter.name}의 가치인 <strong>${d.jupData.strength}</strong>을(를) 삶의 나침반으로 삼을 때, 
              기적처럼 돕는 귀인이 나타나고 막혔던 재정적 혈로가 뻥 뚫리는 신비로운 확장의 기적을 경험하게 된다냥.
            </p>
            <p style="margin-top: 4px;">
              단, 목성의 함정인 '과신과 방심'을 경계해야 한다옹. 일이 잘 풀릴 때일수록 겸손한 마음과 체계적인 리스크 관리를 유지한다면, 
              목성의 황금 츄르는 평생 마르지 않고 쏟아져 내릴 것이다옹!
            </p>
          </div>

          <div class="pdf-card-box" style="margin-bottom: 14px;">
            <h3 style="font-size: 13.5px; color: #3b314d;">♄ 제12장. 토성(Saturn) in ${d.saturn.name} (${d.saturn.symbol}) - 카르마의 스승과 대기만성</h3>
            <p><strong>[영혼의 조련사]:</strong> ${d.satData.core}</p>
            <p style="margin-top: 4px;">
              토성이 머무는 자리는 집사가 20대와 30대 시절 가장 많은 좌절과 열등감, 혹은 결핍을 겪었거나 겪고 있는 아픈 손가락이다옹. 
              하지만 집사여, 절대 두려워하지 마라냥! 토성은 결코 집사를 망가뜨리기 위해 시련을 주는 잔인한 신이 아니다옹. 
              오히려 집사에게 진짜 알짜배기 다이아몬드를 쥐여주기 위해 거친 원석을 깎고 다듬는 우주 최고의 명장이라냥.
            </p>
            <p style="margin-top: 4px;">
              토성의 시험대인 <strong>${d.satData.shadow}</strong>을(를) 묵묵한 인내와 훈련으로 돌파해낼 때, 
              집사는 다른 어떤 누구도 넘볼 수 없는 단단한 사회적 지위와 불멸의 권위를 거머쥐게 된다옹. 
              늦게 피는 꽃이 가장 오래가고 화려한 법이다냥! 토성을 통과한 집사의 황금기는 40대와 50대에 접어들수록 태산처럼 굳건하게 솟아오를 것이다옹!
            </p>
          </div>

          <div class="pdf-card-box" style="margin-bottom: 14px; background: #fffcf4; border-left: 4px solid #b58d3d;">
            <h3 style="font-size: 13.5px; color: #7a5a1e;">🪙 제13장. 부의 트라이앵글 포뮬러: 2하우스(자산) X 6하우스(실무) X 10하우스(명예)</h3>
            <p>
              점성술에서 물질적 부를 완성하는 비밀은 물질의 삼각형(Earth Triangle)의 조화에 있다냥!<br>
              <strong>1. 첫 번째 엔진 (6하우스의 성실함):</strong> 일상의 업무 루틴에서 경쟁자가 흉내 낼 수 없는 압도적인 디테일과 숙련도를 확보하라옹.<br>
              <strong>2. 두 번째 엔진 (10하우스의 브랜딩):</strong> 전문성을 바탕으로 내 이름 석 자를 브랜드화하고 사회적 신뢰를 구축하라냥.<br>
              <strong>3. 세 번째 엔진 (2하우스의 자산화):</strong> 번 돈을 소비재로 탕진하지 말고, 복리로 굴러가는 우량 자산으로 시스템화하라옹. 
              이 세 바퀴가 맞물릴 때 집사의 가문은 대대손손 영구적인 풍요를 누리게 된다냥! 🐾💰
            </p>
          </div>
        </div>
      </div>

      <!-- 10페이지: 제5부 - 4계절 트랜짓 & 인생 7년 대주기 -->
      <div class="pdf-page">
        <h2 class="pdf-chapter-title">제5부. 4계절 트랜짓 가이드 & 인생 7년 대주기 예측</h2>
        <div style="font-size: 12.5px; line-height: 1.7; color: #2c2538;">
          <p style="margin-bottom: 14px;">
            하늘의 행성들은 멈춰 있지 않고 끊임없이 움직이며 집사의 출생 차트를 자극한다냥. 이것을 '트랜짓(Transit, 천체 이동)'이라고 부른다옹. 
            향후 1년간 집사의 운명을 흔들어 깨울 4계절의 운세 기류와 평생의 나이대별 7년 주기를 명쾌하게 정리해주겠다냥!
          </p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
            <div style="background: #f7fafc; border: 1px solid #d3e0ea; padding: 10px; border-radius: 6px;">
              <strong style="color: #2b6cb0;">🌸 제1분기 (봄 / 해빙과 도약기)</strong>
              <p style="font-size: 11.5px; margin-top: 4px; color: #4a5568;">
                겨울바람이 물러가고 따스한 햇살이 비추듯, 집사의 태양과 목성이 기분 좋은 각도를 형성하며 새로운 프로젝트와 배움의 기운이 싹튼다냥. 
                그동안 구상하던 아이디어를 과감하게 세상에 내놓아야 한다옹. 새로운 만남 속에서 귀인이 나타난다냥!
              </p>
            </div>
            <div style="background: #fffaf0; border: 1px solid #fbd38d; padding: 10px; border-radius: 6px;">
              <strong style="color: #c05621;">☀️ 제2분기 (여름 / 열정과 관계 확장)</strong>
              <p style="font-size: 11.5px; margin-top: 4px; color: #4a5568;">
                화성과 금성이 활발하게 상호작용하며 연애운과 사회적 추진력이 최고조로 달아오르는 황금 분기다냥! 
                솔로에게는 심장을 뛰게 만드는 인연이, 커플에게는 더 깊은 신뢰의 도약이 찾아온다옹. 체력 안배에 신경 써라냥!
              </p>
            </div>
            <div style="background: #f0fff4; border: 1px solid #9ae6b4; padding: 10px; border-radius: 6px;">
              <strong style="color: #276749;">🍁 제3분기 (가을 / 결실과 재물 회수)</strong>
              <p style="font-size: 11.5px; margin-top: 4px; color: #4a5568;">
                흘린 땀방울이 탐스러운 열매가 되어 곳간으로 들어오는 수확의 계절이다냥! 
                2하우스와 10하우스의 각도가 정렬되어 승진, 계약, 투자 성과가 통장을 두둑하게 채워준다옹. 안전 자산으로 비축하라냥!
              </p>
            </div>
            <div style="background: #f7faf5; border: 1px solid #cbd5e0; padding: 10px; border-radius: 6px;">
              <strong style="color: #4a5568;">❄️ 제4분기 (겨울 / 성찰과 안식기)</strong>
              <p style="font-size: 11.5px; margin-top: 4px; color: #4a5568;">
                치열하게 달려온 자신을 따뜻하게 안아주고 내적 에너지를 재충전해야 하는 평화의 시간이다냥. 
                가족, 소중한 사람들과 오붓한 시간을 보내며 내면의 지혜를 가다듬을 때 다음 해의 거대한 도약이 준비된다옹.
              </p>
            </div>
          </div>

          <div class="pdf-card-box" style="margin-top: 14px;">
            <h3 style="font-size: 13.5px; color: #2a2245;">⏳ 나이대별 인생 7년 대주기 (천체 바이오리듬)</h3>
            <p style="margin-top: 4px;"><strong>• 21~27세 (자아 탐색과 방황):</strong> 천왕성의 90도 긴장각이 들어와 기존의 틀을 깨고 진정한 자신을 찾아 방황하는 질풍노도의 성장기다냥.</p>
            <p style="margin-top: 4px;"><strong>• 28~30세 (새턴 리턴, 토성 귀환):</strong> 인생 최대의 분기점! 20대의 미숙함을 털어내고 진정한 어른으로서 사회적 책임과 현실적 기반을 다지는 엄격한 시험대이자 대도약의 관문이다옹.</p>
            <p style="margin-top: 4px;"><strong>• 35~42세 (우라누스 어포지션, 중년의 불꽃):</strong> 삶의 정점에서 내면의 진정한 열정을 재점검하고 사회적 성취의 정점을 찍는 황금기다냥.</p>
            <p style="margin-top: 4px;"><strong>• 50세 이후 (키론 리턴과 현자의 시간):</strong> 지나온 상처가 지혜로 승화되어 많은 사람들에게 영감을 주는 위대한 멘토로 군림하는 원숙한 평화의 시기다옹.</p>
          </div>
        </div>
      </div>

      <!-- 11페이지: 에필로그 - 루나 13세의 영혼의 골골송 & 묘성 수호 부적 -->
      <div class="pdf-page">
        <h2 class="pdf-chapter-title">📜 에필로그: 대점성술사 루나 13세의 영혼의 골골송 & 평생 수호 부적</h2>
        <div style="font-size: 12.5px; line-height: 1.8; color: #2c2538;">
          <p style="margin-bottom: 12px;">
            소중하고 존귀한 나의 집사여! 루나와 함께 집사만의 광활한 우주 지문을 샅샅이 탐험한 여정이 어땠냐옹? 
            수만 줄의 별빛 궤도를 한 땀 한 땀 풀어내며, 루나는 집사의 차트가 얼마나 눈부시게 아름답고 고귀한 잠재력을 품고 있는지 똑똑히 보았다냥.
          </p>
          <p style="margin-bottom: 12px;">
            인간 세상은 때때로 차갑고 야속해서, 남들의 기준과 잣대로 집사를 재단하려 들지도 모른다옹. 
            때로는 억울한 오해를 받거나, 쏟아부은 노력에 비해 결과가 늦게 찾아와 깜깜한 방 안에서 홀로 베갯잇을 적실 때도 있을 것이다냥. 
            하지만 집사여, 밤하늘의 가장 어두운 칠흑 속에서 별이 가장 찬란하게 빛난다는 우주의 진리를 결코 잊지 마라옹!
          </p>
          <p style="margin-bottom: 14px;">
            집사의 발바닥에는 험난한 자갈밭도 사뿐히 딛고 건널 수 있는 부드러운 핑크빛 젤리가 있고, 
            위기의 순간마다 캣타워 꼭대기로 날아오를 수 있는 날카로운 용기의 발톱이 숨겨져 있다냥. 
            세상이 집사를 흔들려 할 때마다 이 평생 소장서를 다시 펼쳐보며, 집사가 우주의 사랑을 듬뿍 받고 태어난 유일무이한 존재임을 기억하라옹!
          </p>

          <div class="pdf-talisman-box" style="margin: 20px 0; border: 2px dashed #b58d3d; padding: 20px; text-align: center; background: #fffdf7; border-radius: 8px;">
            <div class="talisman-stamp" style="font-size: 14px; color: #93712b; font-weight: 800; letter-spacing: 2px;">🔮 묘성 은하 영구 수호 인장 🔮</div>
            <h3 style="font-size: 16px; margin: 10px 0 6px 0; color: #2a2245;">대점성술사 루나 13세의 3대 영혼 처방전</h3>
            <p style="font-size: 13px; line-height: 1.8; color: #4a4060; font-style: normal; margin-top: 8px; text-align: left;">
              🐾 <strong>첫 번째 부적:</strong> "세상이 비바람으로 흔들려도, 지혜로운 고양이는 햇살이 드는 자리를 찾아 낮잠을 즐긴다. 조급해하지 말고 스스로의 타이밍을 믿으라냥!"<br>
              🐾 <strong>두 번째 부적:</strong> "타인의 인정을 구걸하지 마라. 집사의 태양(${d.sun.name})은 그 자체로 온 우주를 비추는 위대한 광원이다옹!"<br>
              🐾 <strong>세 번째 부적:</strong> "마음이 지칠 때는 언제든 루나를 찾아와 골골송을 들으라. 집사의 뒤에는 묘성 은하의 수천억 별들이 늘 함께하고 있다냥!"
            </p>
            <div style="margin-top: 14px; font-weight: 700; color: #b58d3d; font-size: 13px;">
              사랑한다옹, 나의 영원한 집사여! 쓰담쓰담~ 🐾✨
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e0d8c3; padding-top: 14px; margin-top: 20px; font-size: 11.5px; color: #8c7b64;">
            <div>공식 발급: 묘성 은하 대점성학 연구소 (Cat Astrology Institute)</div>
            <div>주임 점성술사: <strong>루나 13세 🐱🔮 (인증 완료)</strong></div>
          </div>
        </div>
      </div>
    `;
  }

  // 순수 텍스트 글자 수 계산 함수
  function getPureTextLength(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().length;
  }

  return {
    generateHtml,
    generateDossierData,
    getPureTextLength
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DossierEngine;
}
