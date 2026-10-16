const fs = require('fs');
const path = require('path');

const cats = {
  'aries': {
    name: '장난기 넘치는 치즈태비 화성냥',
    bg1: '#ff4d6d', bg2: '#4a0e17',
    fur: '#f4a261', furShadow: '#e76f51', white: '#fff3b0',
    eye: '#e76f51',
    extraHead: `
      <!-- 양자리 황금 뿔 -->
      <path d="M 68 82 C 40 55, 26 24, 60 28 C 76 30, 78 55, 86 72" fill="none" stroke="#ffd166" stroke-width="11" stroke-linecap="round"/>
      <path d="M 192 82 C 220 55, 234 24, 200 28 C 184 30, 182 55, 174 72" fill="none" stroke="#ffd166" stroke-width="11" stroke-linecap="round"/>
      <!-- 치즈태비 이마 줄무늬 -->
      <path d="M 120 85 L 130 68 L 140 85 M 110 92 L 130 75 L 150 92" fill="none" stroke="#e76f51" stroke-width="4" stroke-linecap="round"/>
    `,
    extraBody: `
      <!-- 몸통 줄무늬 -->
      <path d="M 85 165 Q 100 162 105 168 M 82 178 Q 98 175 102 182" fill="none" stroke="#e76f51" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 175 165 Q 160 162 155 168 M 178 178 Q 162 175 158 182" fill="none" stroke="#e76f51" stroke-width="3.5" stroke-linecap="round"/>
      <!-- 붉은 보석 목걸이 -->
      <path d="M 108 148 Q 130 156 152 148" fill="none" stroke="#d90429" stroke-width="4" stroke-linecap="round"/>
      <circle cx="130" cy="154" r="5" fill="#ffd166" stroke="#d90429" stroke-width="1.5"/>
      <!-- 꼬리 끝 불꽃 -->
      <circle cx="218" cy="142" r="7" fill="#ffba08" filter="url(#glow)"/>
      <circle cx="218" cy="142" r="4" fill="#ffffff"/>
    `
  },
  'taurus': {
    name: '고급 츄르를 음미하는 브리티시 미식냥',
    bg1: '#2a9d8f', bg2: '#0e3a35',
    fur: '#9aa0a6', furShadow: '#70757a', white: '#e8eaed',
    eye: '#e9c46a',
    extraHead: `
      <!-- 황소자리 에메랄드 뿔 -->
      <path d="M 72 82 C 45 68, 40 38, 64 36 C 78 35, 84 55, 88 70" fill="none" stroke="#e9c46a" stroke-width="9" stroke-linecap="round"/>
      <path d="M 188 82 C 215 68, 220 38, 196 36 C 182 35, 176 55, 172 70" fill="none" stroke="#e9c46a" stroke-width="9" stroke-linecap="round"/>
      <!-- 플라워 화관 & 별 -->
      <circle cx="100" cy="62" r="6" fill="#f4a261"/>
      <circle cx="130" cy="56" r="7" fill="#52b788"/>
      <circle cx="160" cy="62" r="6" fill="#f4a261"/>
      <circle cx="130" cy="56" r="3" fill="#ffffff"/>
    `,
    extraBody: `
      <!-- 황금 츄르 스틱 물고/들고 있기 -->
      <path d="M 116 182 L 144 196" fill="none" stroke="#ffd166" stroke-width="8" stroke-linecap="round"/>
      <path d="M 140 194 L 148 198" fill="none" stroke="#e76f51" stroke-width="8" stroke-linecap="round"/>
      <!-- 고급 로즈골드 메달 -->
      <path d="M 110 148 Q 130 156 150 148" fill="none" stroke="#52b788" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="130" cy="154" r="5" fill="#ffd166"/>
    `
  },
  'gemini': {
    name: '호기심 많은 삼색이 수성냥',
    bg1: '#4361ee', bg2: '#101740',
    fur: '#f8f9fa', furShadow: '#dee2e6', white: '#ffffff',
    eye: '#4cc9f0',
    extraHead: `
      <!-- 삼색이 얼룩: 오른쪽 귀 주황, 왼쪽 귀 블랙 -->
      <path d="M 78 95 L 88 45 L 118 70 Z" fill="#2b2d42"/>
      <path d="M 182 95 L 172 45 L 142 70 Z" fill="#e76f51"/>
      <ellipse cx="98" cy="95" rx="14" ry="12" fill="#2b2d42" opacity="0.85"/>
      <ellipse cx="162" cy="95" rx="14" ry="12" fill="#e76f51" opacity="0.85"/>
      <!-- 수성 쌍둥이 번개 안테나 -->
      <path d="M 124 50 L 134 32 L 126 32 L 136 16" fill="none" stroke="#ffd166" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
    `,
    extraBody: `
      <!-- 몸통 삼색 얼룩 -->
      <ellipse cx="90" cy="170" rx="14" ry="18" fill="#2b2d42"/>
      <ellipse cx="170" cy="175" rx="16" ry="15" fill="#e76f51"/>
      <!-- 수성 궤도 링 -->
      <ellipse cx="130" cy="175" rx="72" ry="18" fill="none" stroke="#4cc9f0" stroke-width="2" stroke-dasharray="5,6" opacity="0.75" transform="rotate(-12 130 175)"/>
      <circle cx="64" cy="188" r="4.5" fill="#ffd166" filter="url(#glow)"/>
    `
  },
  'cancer': {
    name: '도도하고 섬세한 페르시안 달빛냥',
    bg1: '#7209b7', bg2: '#240046',
    fur: '#f8f9fa', furShadow: '#e9ecef', white: '#ffffff',
    eye: '#3a0ca3',
    extraHead: `
      <!-- 풍성한 페르시안 볼털 -->
      <path d="M 66 115 Q 50 125 64 136 Q 52 144 72 148" fill="#ffffff" stroke="#dee2e6" stroke-width="2"/>
      <path d="M 194 115 Q 210 125 196 136 Q 208 144 188 148" fill="#ffffff" stroke="#dee2e6" stroke-width="2"/>
      <!-- 초승달 티아라 -->
      <path d="M 130 30 A 16 16 0 0 0 130 58 A 12 12 0 0 1 130 30" fill="#ffd166" stroke="#f39c12" stroke-width="1.5" filter="url(#glow)"/>
      <circle cx="130" cy="44" r="3" fill="#ffffff"/>
    `,
    extraBody: `
      <!-- 풍성한 가슴털 목도리 -->
      <path d="M 98 142 Q 130 162 162 142 Q 155 168 130 172 Q 105 168 98 142 Z" fill="#ffffff" stroke="#e9ecef" stroke-width="1.5"/>
      <!-- 진주 목걸이 & 달빛 오브 -->
      <circle cx="118" cy="155" r="3" fill="#ffd166"/>
      <circle cx="130" cy="158" r="4" fill="#4cc9f0" filter="url(#glow)"/>
      <circle cx="142" cy="155" r="3" fill="#ffd166"/>
      <!-- 달빛 은하수 아우라 -->
      <circle cx="130" cy="130" r="102" fill="none" stroke="#b5179e" stroke-width="1.5" stroke-dasharray="4,8" opacity="0.6"/>
    `
  },
  'leo': {
    name: '우주를 호령하는 턱시도 사자냥',
    bg1: '#f77f00', bg2: '#3d0814',
    fur: '#1a1829', furShadow: '#0d0714', white: '#ffffff',
    eye: '#fca311',
    extraHead: `
      <!-- 황금 사자 왕관 -->
      <path d="M 96 66 L 104 36 L 118 54 L 130 24 L 142 54 L 156 36 L 164 66 Z" fill="#ffd166" stroke="#f39c12" stroke-width="2.5"/>
      <circle cx="130" cy="24" r="4" fill="#e63946"/>
      <circle cx="104" cy="36" r="3" fill="#4cc9f0"/>
      <circle cx="156" cy="36" r="3" fill="#4cc9f0"/>
      <!-- 태양 갈기 헤일로 -->
      <circle cx="130" cy="115" r="68" fill="none" stroke="#ffd166" stroke-width="2.5" stroke-dasharray="7,9" opacity="0.65"/>
    `,
    extraBody: `
      <!-- 턱시도 하얀 역삼각형 셔츠 가슴 -->
      <path d="M 112 142 L 130 126 L 148 142 L 152 185 L 108 185 Z" fill="#ffffff"/>
      <!-- 빨간 나비 넥타이 -->
      <polygon points="122,142 122,152 130,147" fill="#d90429"/>
      <polygon points="138,142 138,152 130,147" fill="#d90429"/>
      <circle cx="130" cy="147" r="2.5" fill="#ffd166"/>
      <!-- 하얀 앞발 양말 -->
      <ellipse cx="114" cy="208" rx="12" ry="9" fill="#ffffff" stroke="#dee2e6" stroke-width="1.5"/>
      <ellipse cx="146" cy="208" rx="12" ry="9" fill="#ffffff" stroke="#dee2e6" stroke-width="1.5"/>
    `
  },
  'virgo': {
    name: '완벽한 그루밍의 샴 고양이 책사냥',
    bg1: '#06d6a0', bg2: '#073b4c',
    fur: '#f3e9dc', furShadow: '#d4c5b9', white: '#ffffff',
    eye: '#118ab2',
    extraHead: `
      <!-- 샴 마스크 포인트: 짙은 브라운 얼굴 중심 -->
      <ellipse cx="130" cy="120" rx="36" ry="28" fill="#3d2b1f" opacity="0.92"/>
      <!-- 귀 끝 짙은 브라운 -->
      <polygon points="78,95 88,45 118,70" fill="#3d2b1f"/>
      <polygon points="182,95 172,45 142,70" fill="#3d2b1f"/>
      <!-- 황금 밀 이삭 장식 -->
      <path d="M 166 60 Q 185 45 195 55" fill="none" stroke="#ffd166" stroke-width="3" stroke-linecap="round"/>
      <circle cx="178" cy="50" r="3" fill="#ffd166"/>
      <circle cx="188" cy="46" r="3" fill="#ffd166"/>
      <circle cx="196" cy="54" r="3" fill="#ffd166"/>
    `,
    extraBody: `
      <!-- 샴 앞발 & 꼬리 짙은 초콜릿 -->
      <ellipse cx="114" cy="208" rx="12" ry="9" fill="#3d2b1f"/>
      <ellipse cx="146" cy="208" rx="12" ry="9" fill="#3d2b1f"/>
      <!-- 지혜의 별빛 깃펜 -->
      <path d="M 148 165 L 180 135 Q 185 145 175 155 Z" fill="#ffd166" stroke="#e9c46a" stroke-width="1.5"/>
      <!-- 황금 안경 참 -->
      <circle cx="120" cy="115" r="11" fill="none" stroke="#ffd166" stroke-width="2"/>
      <circle cx="140" cy="115" r="11" fill="none" stroke="#ffd166" stroke-width="2"/>
      <line x1="131" y1="115" x2="129" y2="115" stroke="#ffd166" stroke-width="2"/>
    `
  },
  'libra': {
    name: '우아한 발걸음의 러시안블루 귀족냥',
    bg1: '#b5179e', bg2: '#3c096c',
    fur: '#8395a7', furShadow: '#576574', white: '#c8d6e5',
    eye: '#2ecc71',
    extraHead: `
      <!-- 우아한 은빛 실크 리본 -->
      <path d="M 112 52 Q 130 40 148 52 Q 130 64 112 52 Z" fill="#ff9ff3"/>
      <circle cx="130" cy="52" r="4.5" fill="#ffd166"/>
      <!-- 반짝이는 은빛 이마 룬 -->
      <path d="M 130 76 L 132 84 L 140 86 L 132 88 L 130 96 L 128 88 L 120 86 L 128 84 Z" fill="#ffffff" filter="url(#glow)"/>
    `,
    extraBody: `
      <!-- 천칭(저울) 펜던트 -->
      <path d="M 110 148 Q 130 156 150 148" fill="none" stroke="#ffd166" stroke-width="3" stroke-linecap="round"/>
      <line x1="130" y1="154" x2="130" y2="168" stroke="#ffd166" stroke-width="2.5"/>
      <line x1="118" y1="168" x2="142" y2="168" stroke="#ffd166" stroke-width="2.5"/>
      <circle cx="118" cy="174" r="4.5" fill="#ff7675"/>
      <circle cx="142" cy="174" r="4.5" fill="#74b9ff"/>
      <!-- 로맨틱 핑크 하트 이펙트 -->
      <path d="M 72 150 A 6 6 0 0 1 82 150 A 6 6 0 0 1 92 150 Q 82 164 72 150 Z" fill="#ff7675" opacity="0.75"/>
    `
  },
  'scorpio': {
    name: '어둠 속을 꿰뚫는 올블랙 마법냥',
    bg1: '#720026', bg2: '#100007',
    fur: '#14111f', furShadow: '#09080e', white: '#2d2842',
    eye: '#9d4edd',
    extraHead: `
      <!-- 제3의 눈 (이마의 신비로운 자수정 젬) -->
      <polygon points="130,76 136,86 130,96 124,86" fill="#c77dff" stroke="#ffd166" stroke-width="1.5" filter="url(#glow)"/>
      <circle cx="130" cy="86" r="2.5" fill="#ffffff"/>
      <!-- 마법진 오라 -->
      <circle cx="130" cy="115" r="68" fill="none" stroke="#c77dff" stroke-width="1.8" stroke-dasharray="3,6" opacity="0.8"/>
    `,
    extraBody: `
      <!-- 전갈 집게발 모양 룬 목걸이 -->
      <path d="M 112 148 Q 130 156 148 148" fill="none" stroke="#9d4edd" stroke-width="3" stroke-linecap="round"/>
      <circle cx="130" cy="154" r="5" fill="#c77dff"/>
      <!-- 전갈 독침 꼬리 끝 (강조) -->
      <path d="M 205 135 L 222 120 L 214 138 Z" fill="#ffd166" stroke="#e0aaff" stroke-width="2" filter="url(#glow)"/>
      <circle cx="218" cy="126" r="3" fill="#ffffff"/>
    `
  },
  'sagittarius': {
    name: '은하수를 방랑하는 벵갈 탐험냥',
    bg1: '#3a0ca3', bg2: '#0b0024',
    fur: '#e09f3e', furShadow: '#b06f1a', white: '#fff3b0',
    eye: '#52b788',
    extraHead: `
      <!-- 벵갈 표범 무늬 (이마/얼굴) -->
      <ellipse cx="114" cy="85" rx="5" ry="3.5" fill="#602808"/>
      <ellipse cx="146" cy="85" rx="5" ry="3.5" fill="#602808"/>
      <ellipse cx="90" cy="118" rx="4" ry="6" fill="#602808"/>
      <ellipse cx="170" cy="118" rx="4" ry="6" fill="#602808"/>
      <!-- 탐험가 깃털 인디언 밴드 -->
      <path d="M 78 78 Q 130 84 182 78" fill="none" stroke="#9e2a2b" stroke-width="4.5"/>
      <path d="M 166 74 Q 185 50 198 56 Z" fill="#4cc9f0"/>
      <path d="M 172 74 Q 192 60 200 70 Z" fill="#ffd166"/>
    `,
    extraBody: `
      <!-- 등에 멘 황금 화살통 & 별빛 화살 -->
      <rect x="74" y="135" width="12" height="34" rx="4" fill="#9e2a2b" transform="rotate(-25 80 152)"/>
      <line x1="72" y1="130" x2="62" y2="108" stroke="#ffd166" stroke-width="3" stroke-linecap="round"/>
      <polygon points="62,108 58,116 66,116" fill="#4cc9f0"/>
      <!-- 벵갈 로젯 몸통 무늬 -->
      <ellipse cx="98" cy="172" rx="7" ry="5" fill="#602808"/>
      <ellipse cx="162" cy="176" rx="7" ry="5" fill="#602808"/>
      <ellipse cx="130" cy="192" rx="6" ry="4" fill="#602808"/>
    `
  },
  'capricorn': {
    name: '캣타워 정상에 오른 노르웨이숲 야망냥',
    bg1: '#1d3557', bg2: '#0b132b',
    fur: '#4a5568', furShadow: '#2d3748', white: '#f7fafc',
    eye: '#f6ad55',
    extraHead: `
      <!-- 노르웨이숲 귀 털 쫑긋 팁 -->
      <path d="M 86 44 L 88 32 L 92 45" fill="#f7fafc"/>
      <path d="M 174 44 L 172 32 L 168 45" fill="#f7fafc"/>
      <!-- 산양 얼음 수정 뿔 -->
      <path d="M 72 82 C 48 55, 55 24, 76 20 C 90 20, 88 50, 90 70" fill="none" stroke="#a0aec0" stroke-width="9" stroke-linecap="round"/>
      <path d="M 188 82 C 212 55, 205 24, 184 20 C 170 20, 172 50, 170 70" fill="none" stroke="#a0aec0" stroke-width="9" stroke-linecap="round"/>
      <!-- 얼음 별빛 보석 -->
      <polygon points="130,48 135,56 130,64 125,56" fill="#e2e8f0" stroke="#ffd166" stroke-width="1.5"/>
    `,
    extraBody: `
      <!-- 노르웨이숲 초대형 풍성한 가슴털 -->
      <path d="M 94 140 Q 130 168 166 140 Q 160 178 130 182 Q 100 178 94 140 Z" fill="#f7fafc" stroke="#cbd5e0" stroke-width="1.5"/>
      <!-- 정상 정복자 골드 메달 -->
      <circle cx="130" cy="162" r="6" fill="#ffd166" stroke="#b7791f" stroke-width="1.5"/>
      <text x="130" y="165" font-size="8" text-anchor="middle" fill="#744210" font-weight="bold">1</text>
      <!-- 눈꽃 오라 -->
      <circle cx="68" cy="170" r="3" fill="#e2e8f0" opacity="0.8"/>
      <circle cx="192" cy="160" r="3" fill="#e2e8f0" opacity="0.8"/>
    `
  },
  'aquarius': {
    name: '외계 전파를 수신하는 스핑크스 외계냥',
    bg1: '#0077b6', bg2: '#03045e',
    fur: '#e2cfea', furShadow: '#c8b2d4', white: '#f3e8f7',
    eye: '#00f5d4',
    extraHead: `
      <!-- 스핑크스 대형 박쥐 귀 -->
      <polygon points="68,105 74,28 122,72" fill="#c8b2d4" stroke="#a58db3" stroke-width="2.5"/>
      <polygon points="76,96 82,38 114,72" fill="#f3c6d3" opacity="0.85"/>
      <polygon points="192,105 186,28 138,72" fill="#c8b2d4" stroke="#a58db3" stroke-width="2.5"/>
      <polygon points="184,96 178,38 146,72" fill="#f3c6d3" opacity="0.85"/>
      <!-- 외계 전파 홀로그램 링 헤일로 -->
      <ellipse cx="130" cy="40" rx="38" ry="12" fill="none" stroke="#00f5d4" stroke-width="3" stroke-dasharray="6,6" filter="url(#glow)"/>
      <circle cx="130" cy="28" r="3.5" fill="#ffffff"/>
    `,
    extraBody: `
      <!-- 물병자리 성수 항아리에서 흐르는 네온 별빛 폭포 -->
      <ellipse cx="78" cy="160" rx="14" ry="18" fill="#48cae4" stroke="#0077b6" stroke-width="2"/>
      <path d="M 84 152 Q 110 162 130 178 Q 150 195 160 215" fill="none" stroke="#00f5d4" stroke-width="4.5" stroke-linecap="round" filter="url(#glow)"/>
      <circle cx="106" cy="162" r="2.5" fill="#fff"/>
      <circle cx="134" cy="182" r="3" fill="#fff"/>
      <!-- 미래 사이버 네온 발찌 -->
      <rect x="138" y="200" width="16" height="5" rx="2" fill="#00f5d4"/>
    `
  },
  'pisces': {
    name: '꿈속 은하수를 유영하는 터키시앙고라 힐러냥',
    bg1: '#48cae4', bg2: '#023e8a',
    fur: '#ffffff', furShadow: '#e0f2fe', white: '#ffffff',
    eye: '#38bdf8', // 오드아이 적용
    extraHead: `
      <!-- 오드아이 (왼쪽 핑크/퍼플, 오른쪽 아쿠아마린) -->
      <ellipse cx="108" cy="112" rx="10" ry="12" fill="#f472b6"/>
      <ellipse cx="152" cy="112" rx="10" ry="12" fill="#38bdf8"/>
      <!-- 은하수 물결 티아라 -->
      <path d="M 112 55 Q 130 42 148 55 Q 130 68 112 55 Z" fill="#bae6fd" opacity="0.85"/>
      <circle cx="130" cy="55" r="4" fill="#ffd166" filter="url(#glow)"/>
    `,
    extraBody: `
      <!-- 고양이를 감싸고 헤엄치는 쌍둥이 천상 금붕어 -->
      <!-- 첫 번째 금붕어 (황금빛) -->
      <path d="M 62 140 Q 52 165 72 180 Q 78 165 62 140 Z" fill="#ffd166" filter="url(#glow)"/>
      <polygon points="56,135 50,126 62,130" fill="#f39c12"/>
      <!-- 두 번째 금붕어 (터키옥빛) -->
      <path d="M 198 175 Q 212 155 192 135 Q 184 155 198 175 Z" fill="#38bdf8" filter="url(#glow)"/>
      <polygon points="204,180 212,190 198,185" fill="#0284c7"/>
      <!-- 은하수 물결 링 -->
      <ellipse cx="130" cy="175" rx="78" ry="22" fill="none" stroke="#7dd3fc" stroke-width="2" stroke-dasharray="6,8" opacity="0.75" transform="rotate(8 130 175)"/>
    `
  }
};

function generateFullBodySvg(signKey, cfg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260" width="260" height="260">
  <defs>
    <radialGradient id="bg-${signKey}" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="${cfg.bg1}"/>
      <stop offset="65%" stop-color="${cfg.bg2}"/>
      <stop offset="100%" stop-color="#080414"/>
    </radialGradient>
    <radialGradient id="aura-${signKey}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="70%" stop-color="${cfg.bg1}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- 우주 배경 원반 & 마법진 테두리 -->
  <circle cx="130" cy="130" r="124" fill="url(#bg-${signKey})" stroke="#ffd166" stroke-width="2.5"/>
  <circle cx="130" cy="130" r="118" fill="none" stroke="rgba(255,255,255,0.22)" stroke-dasharray="4,6"/>
  <circle cx="130" cy="130" r="95" fill="url(#aura-${signKey})"/>

  <!-- 배경 미세 별빛들 -->
  <circle cx="48" cy="55" r="1.8" fill="#fff" opacity="0.9"/>
  <circle cx="212" cy="55" r="1.8" fill="#fff" opacity="0.9"/>
  <circle cx="36" cy="165" r="1.5" fill="#ffd166" opacity="0.8"/>
  <circle cx="225" cy="165" r="1.5" fill="#ffd166" opacity="0.8"/>
  <circle cx="85" cy="30" r="2.2" fill="#fff" filter="url(#glow)"/>
  <circle cx="175" cy="30" r="2.2" fill="#fff" filter="url(#glow)"/>
  <circle cx="130" cy="242" r="1.5" fill="#fff" opacity="0.7"/>

  <!-- ================= 고양이 몸체 (Full Body) ================= -->

  <!-- 풍성한 꼬리 (앉은 뒤쪽에서 스르륵 감겨 올라오는 곡선) -->
  <path d="M 165 195 C 215 198, 235 155, 205 135 C 195 128, 186 142, 196 148 C 214 162, 198 185, 155 185 Z" 
        fill="${cfg.fur}" stroke="${cfg.furShadow}" stroke-width="2"/>

  <!-- 통통하고 귀여운 앉은 몸통 -->
  <ellipse cx="130" cy="180" rx="46" ry="38" fill="${cfg.fur}" stroke="${cfg.furShadow}" stroke-width="2.5"/>

  <!-- 앙증맞은 하얀/배털 패치 -->
  <ellipse cx="130" cy="182" rx="28" ry="25" fill="${cfg.white}" opacity="0.92"/>

  <!-- 몸통별 시그니처 엑스트라 (목걸이, 줄무늬, 날개, 소품) -->
  ${cfg.extraBody}

  <!-- 뒤쪽 발 (양옆에 얌전히 놓인 둥근 발) -->
  <ellipse cx="88" cy="204" rx="14" ry="10" fill="${cfg.fur}" stroke="${cfg.furShadow}" stroke-width="2"/>
  <ellipse cx="172" cy="204" rx="14" ry="10" fill="${cfg.fur}" stroke="${cfg.furShadow}" stroke-width="2"/>

  <!-- 앞쪽 발 2개 (가운데 가지런히 모은 찹쌀떡 솜방망이) -->
  <ellipse cx="114" cy="208" rx="12" ry="9" fill="${cfg.fur}" stroke="${cfg.furShadow}" stroke-width="2"/>
  <ellipse cx="146" cy="208" rx="12" ry="9" fill="${cfg.fur}" stroke="${cfg.furShadow}" stroke-width="2"/>
  <path d="M 111 206 L 111 214 M 117 206 L 117 214" stroke="${cfg.furShadow}" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M 143 206 L 143 214 M 149 206 L 149 214" stroke="${cfg.furShadow}" stroke-width="1.5" stroke-linecap="round"/>

  <!-- ================= 고양이 머리 & 얼굴 ================= -->

  <!-- 쫑긋 솟은 귀 2개 -->
  <polygon points="76,95 86,45 116,72" fill="${cfg.fur}" stroke="${cfg.furShadow}" stroke-width="2.5"/>
  <polygon points="84,88 92,54 110,74" fill="#ffb4a2" opacity="0.85"/>

  <polygon points="184,95 174,45 144,72" fill="${cfg.fur}" stroke="${cfg.furShadow}" stroke-width="2.5"/>
  <polygon points="176,88 168,54 150,74" fill="#ffb4a2" opacity="0.85"/>

  <!-- 머리별 시그니처 엑스트라 (왕관, 뿔, 티아라 등) -->
  ${cfg.extraHead}

  <!-- 둥글넓적 찹쌀떡 같은 귀여운 머리통 -->
  <ellipse cx="130" cy="115" rx="55" ry="46" fill="${cfg.fur}" stroke="${cfg.furShadow}" stroke-width="2.5"/>

  <!-- 볼 & 턱 털 포인트 -->
  <ellipse cx="130" cy="136" rx="28" ry="18" fill="${cfg.white}" opacity="0.9"/>

  <!-- 초롱초롱한 왕눈이 눈망울 -->
  <ellipse cx="108" cy="112" rx="10" ry="12" fill="${cfg.eye}"/>
  <circle cx="111" cy="109" r="4" fill="#ffffff"/>
  <circle cx="105" cy="116" r="1.8" fill="#ffffff"/>

  <ellipse cx="152" cy="112" rx="10" ry="12" fill="${cfg.eye}"/>
  <circle cx="155" cy="109" r="4" fill="#ffffff"/>
  <circle cx="149" cy="116" r="1.8" fill="#ffffff"/>

  <!-- 핑크 삼각형 코 -->
  <polygon points="127,125 133,125 130,129" fill="#ff758f"/>

  <!-- 심쿵 'ω' 고양이 미소 입 -->
  <path d="M 124 131 Q 127 135 130 131 Q 133 135 136 131" fill="none" stroke="#5c4d7d" stroke-width="2.2" stroke-linecap="round"/>

  <!-- 발그레한 핑크빛 볼터치 -->
  <circle cx="92" cy="126" r="7.5" fill="#ff758f" opacity="0.45"/>
  <circle cx="168" cy="126" r="7.5" fill="#ff758f" opacity="0.45"/>

  <!-- 수염 2쌍 -->
  <line x1="82" y1="124" x2="60" y2="120" stroke="#ffd166" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>
  <line x1="80" y1="131" x2="58" y2="133" stroke="#ffd166" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>
  <line x1="178" y1="124" x2="200" y2="120" stroke="#ffd166" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>
  <line x1="180" y1="131" x2="202" y2="133" stroke="#ffd166" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>
</svg>`;
}

const outDirs = [
  path.join(__dirname, 'public', 'images', 'cats'),
  path.join(__dirname, 'images', 'cats')
];

outDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

for (const [signKey, cfg] of Object.entries(cats)) {
  const svgContent = generateFullBodySvg(signKey, cfg);
  outDirs.forEach(dir => {
    fs.writeFileSync(path.join(dir, `cat-${signKey}.svg`), svgContent, 'utf8');
  });
  console.log(`Generated FULL-BODY cat-${signKey}.svg for ${cfg.name}`);
}

console.log('All 12 Full-Body Zodiac Cat SVGs generated successfully!');
