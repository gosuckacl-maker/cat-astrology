const fs = require('fs');
const path = require('path');

const cats = {
  'aries': {
    name: '장난기 넘치는 치즈태비 화성냥',
    bg1: '#ff4d6d', bg2: '#590d22',
    fur: '#f4a261', furShadow: '#e76f51', white: '#fff3b0',
    eye: '#e76f51',
    horns: '#ffd166',
    extra: `
      <!-- 양자리 황금 뿔 -->
      <path d="M 52 75 C 30 50, 20 20, 48 24 C 60 26, 62 48, 68 62" fill="none" stroke="#ffd166" stroke-width="9" stroke-linecap="round"/>
      <path d="M 148 75 C 170 50, 180 20, 152 24 C 140 26, 138 48, 132 62" fill="none" stroke="#ffd166" stroke-width="9" stroke-linecap="round"/>
      <!-- 치즈태비 이마 줄무늬 -->
      <path d="M 92 82 L 100 68 L 108 82 M 84 88 L 100 74 L 116 88" fill="none" stroke="#e76f51" stroke-width="3.5" stroke-linecap="round"/>
      <!-- 불꽃 별빛 -->
      <circle cx="100" cy="38" r="4" fill="#ffd166" filter="url(#glow)"/>
      <path d="M 100 28 L 102 36 L 110 38 L 102 40 L 100 48 L 98 40 L 90 38 L 98 36 Z" fill="#fff" />
    `
  },
  'taurus': {
    name: '고급 츄르를 음미하는 브리티시 미식냥',
    bg1: '#2a9d8f', bg2: '#134e48',
    fur: '#9aa0a6', furShadow: '#70757a', white: '#e8eaed',
    eye: '#e9c46a',
    horns: '#52b788',
    extra: `
      <!-- 황소자리 에메랄드 뿔 & 화관 -->
      <path d="M 58 70 C 35 60, 32 36, 52 35 C 64 34, 68 52, 72 64" fill="none" stroke="#e9c46a" stroke-width="7" stroke-linecap="round"/>
      <path d="M 142 70 C 165 60, 168 36, 148 35 C 136 34, 132 52, 128 64" fill="none" stroke="#e9c46a" stroke-width="7" stroke-linecap="round"/>
      <!-- 머리 위 플라워 리프 -->
      <circle cx="100" cy="52" r="7" fill="#52b788" />
      <circle cx="92" cy="54" r="5" fill="#74c69d" />
      <circle cx="108" cy="54" r="5" fill="#74c69d" />
      <circle cx="100" cy="52" r="3" fill="#ffd166" />
    `
  },
  'gemini': {
    name: '호기심 많은 삼색이 수성냥',
    bg1: '#4cc9f0', bg2: '#03045e',
    fur: '#f8f9fa', furShadow: '#dee2e6', white: '#ffffff',
    eye: '#48cae4',
    extra: `
      <!-- 삼색이 무늬 (오른쪽 검정, 왼쪽 주황 패치) -->
      <path d="M 55 60 C 55 45, 75 40, 85 65 C 80 85, 60 85, 55 60 Z" fill="#e76f51" />
      <path d="M 145 60 C 145 45, 125 40, 115 65 C 120 85, 140 85, 145 60 Z" fill="#2b2d42" />
      <!-- 쌍둥이자리 트윈 스타 헤일로 -->
      <path d="M 75 32 L 77 38 L 83 40 L 77 42 L 75 48 L 73 42 L 67 40 L 73 38 Z" fill="#ffd166" filter="url(#glow)"/>
      <path d="M 125 32 L 127 38 L 133 40 L 127 42 L 125 48 L 123 42 L 117 40 L 123 38 Z" fill="#4cc9f0" filter="url(#glow)"/>
      <path d="M 78 40 Q 100 24 122 40" fill="none" stroke="#ffd166" stroke-width="2" stroke-dasharray="3,3"/>
    `
  },
  'cancer': {
    name: '도도하고 섬세한 페르시안 달빛냥',
    bg1: '#7209b7', bg2: '#1b0a2a',
    fur: '#ffffff', furShadow: '#e0d6f5', white: '#ffffff',
    eye: '#48bfe3',
    extra: `
      <!-- 페르시안 털 풍성한 볼 -->
      <path d="M 40 120 C 30 115, 30 135, 45 135 M 160 120 C 170 115, 170 135, 155 135" stroke="#e0d6f5" stroke-width="3" fill="none"/>
      <!-- 이마의 달빛 초승달 티아라 -->
      <path d="M 100 46 C 108 46, 114 54, 110 64 C 106 56, 96 56, 92 64 C 88 54, 94 46, 100 46 Z" fill="#ffd166" filter="url(#glow)"/>
      <circle cx="100" cy="70" r="3.5" fill="#48bfe3" />
      <!-- 진주 장식 -->
      <circle cx="88" cy="56" r="2.5" fill="#fff" />
      <circle cx="112" cy="56" r="2.5" fill="#fff" />
    `
  },
  'leo': {
    name: '우주를 호령하는 턱시도 사자냥',
    bg1: '#f77f00', bg2: '#3d0814',
    fur: '#1a1829', furShadow: '#0d0714', white: '#ffffff',
    eye: '#ffd166',
    extra: `
      <!-- 턱시도 흰색 마스크 & 가슴 털 -->
      <path d="M 88 120 L 100 102 L 112 120 L 115 155 L 85 155 Z" fill="#ffffff" />
      <!-- 황금 사자 왕관 -->
      <path d="M 74 58 L 80 32 L 90 48 L 100 22 L 110 48 L 120 32 L 126 58 Z" fill="#ffd166" stroke="#f39c12" stroke-width="2"/>
      <circle cx="100" cy="22" r="3" fill="#e63946" />
      <circle cx="80" cy="32" r="2.5" fill="#4cc9f0" />
      <circle cx="120" cy="32" r="2.5" fill="#4cc9f0" />
      <!-- 태양 갈기 헤일로 -->
      <circle cx="100" cy="100" r="70" fill="none" stroke="#ffd166" stroke-width="2" stroke-dasharray="6,8" opacity="0.6"/>
    `
  },
  'virgo': {
    name: '완벽한 그루밍의 샴 고양이 책사냥',
    bg1: '#3a0ca3', bg2: '#0f0826',
    fur: '#ede0d4', furShadow: '#ddb892', white: '#fdf0d5',
    eye: '#3a86ff',
    extra: `
      <!-- 샴 고양이 포인트 마스크 & 귀 팁 -->
      <ellipse cx="100" cy="115" rx="28" ry="22" fill="#58311e" opacity="0.9"/>
      <!-- 지적인 크리스털 모노클 (외눈 안경) -->
      <circle cx="78" cy="112" r="16" fill="none" stroke="#ffd166" stroke-width="2.5"/>
      <path d="M 94 112 L 106 112" stroke="#ffd166" stroke-width="2"/>
      <path d="M 78 128 L 72 150 L 68 152" fill="none" stroke="#ffd166" stroke-width="1.5" stroke-dasharray="2,2"/>
      <!-- 사파이어 서약 깃털 펜 -->
      <path d="M 125 45 C 135 25, 150 20, 155 35 C 145 45, 135 50, 125 45 Z" fill="#4cc9f0" />
    `
  },
  'libra': {
    name: '우아한 발걸음의 러시안블루 귀족냥',
    bg1: '#4361ee', bg2: '#10163a',
    fur: '#8d99ae', furShadow: '#6c757d', white: '#edf2f4',
    eye: '#52b788',
    extra: `
      <!-- 러시안블루 은빛 실크 털 질감 & 핑크 장미 화관 -->
      <circle cx="88" cy="52" r="5" fill="#ff70a6" />
      <circle cx="100" cy="48" r="6" fill="#ff70a6" />
      <circle cx="112" cy="52" r="5" fill="#ff70a6" />
      <!-- 천칭 저울 오브 -->
      <path d="M 75 28 L 125 28 M 100 20 L 100 36" stroke="#ffd166" stroke-width="2" stroke-linecap="round"/>
      <path d="M 75 28 L 70 38 L 80 38 Z" fill="#ffd166" opacity="0.8"/>
      <path d="M 125 28 L 120 38 L 130 38 Z" fill="#ffd166" opacity="0.8"/>
    `
  },
  'scorpio': {
    name: '어둠 속을 꿰뚫는 올블랙 마법냥',
    bg1: '#7209b7', bg2: '#0b0014',
    fur: '#14111f', furShadow: '#05020a', white: '#2a2438',
    eye: '#f72585',
    extra: `
      <!-- 올블랙 흑묘 신비로운 보랏빛 오라 -->
      <circle cx="100" cy="100" r="66" fill="none" stroke="#b5179e" stroke-width="3" filter="url(#glow)"/>
      <!-- 이마의 전갈 루비 스타 보석 -->
      <path d="M 100 58 L 105 66 L 100 74 L 95 66 Z" fill="#f72585" filter="url(#glow)"/>
      <!-- 신비로운 보라 꼬리 별빛 곡선 -->
      <path d="M 145 130 Q 170 110 165 85 Q 160 70 172 65" fill="none" stroke="#b5179e" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="172" cy="65" r="3" fill="#ffd166" />
    `
  },
  'sagittarius': {
    name: '은하수를 방랑하는 벵갈 탐험냥',
    bg1: '#b5179e', bg2: '#240046',
    fur: '#e07a5f', furShadow: '#c45a3c', white: '#f4f1de',
    eye: '#06d6a0',
    extra: `
      <!-- 벵갈 레오파드 로제트 점박이 무늬 -->
      <circle cx="68" cy="98" r="4" fill="#3d1308" />
      <circle cx="132" cy="98" r="4" fill="#3d1308" />
      <circle cx="100" cy="80" r="4.5" fill="#3d1308" />
      <!-- 모험가 깃털 모자 -->
      <path d="M 68 62 C 75 42, 125 42, 132 62 Z" fill="#3d348b"/>
      <path d="M 60 62 L 140 62" stroke="#ffd166" stroke-width="3" stroke-linecap="round"/>
      <path d="M 125 58 Q 145 35 155 20" fill="none" stroke="#f72585" stroke-width="3"/>
      <!-- 황금 궁수의 화살 -->
      <path d="M 85 28 L 115 28 M 110 24 L 115 28 L 110 32" stroke="#ffd166" stroke-width="2.5" stroke-linecap="round"/>
    `
  },
  'capricorn': {
    name: '캣타워 정상에 오른 노르웨이숲 야망냥',
    bg1: '#386641', bg2: '#132a13',
    fur: '#cfdbd5', furShadow: '#9a8c98', white: '#f8f9fa',
    eye: '#e9c46a',
    extra: `
      <!-- 노르웨이숲 풍성한 갈기 & 크리스털 산양 뿔 -->
      <path d="M 62 68 C 45 42, 38 25, 54 18 C 66 14, 70 38, 74 54" fill="none" stroke="#a7c957" stroke-width="8" stroke-linecap="round"/>
      <path d="M 138 68 C 155 42, 162 25, 146 18 C 134 14, 130 38, 126 54" fill="none" stroke="#a7c957" stroke-width="8" stroke-linecap="round"/>
      <!-- 풍성한 겨울 털 턱받이 -->
      <path d="M 70 142 Q 100 160 130 142 Q 100 170 70 142" fill="#ffffff" opacity="0.9"/>
      <!-- 만년설 별빛 브로치 -->
      <polygon points="100,50 103,58 111,61 103,64 100,72 97,64 89,61 97,58" fill="#f8f9fa" filter="url(#glow)"/>
    `
  },
  'aquarius': {
    name: '외계 전파를 수신하는 스핑크스 외계냥',
    bg1: '#00b4d8', bg2: '#03045e',
    fur: '#fcd5ce', furShadow: '#f8ad9d', white: '#fceade',
    eye: '#48cae4',
    extra: `
      <!-- 스핑크스 큰 귀 & 네온 우주 전파 안테나 -->
      <path d="M 40 85 L 32 30 L 78 58 Z" fill="#fcd5ce" stroke="#f8ad9d" stroke-width="2"/>
      <path d="M 160 85 L 168 30 L 122 58 Z" fill="#fcd5ce" stroke="#f8ad9d" stroke-width="2"/>
      <!-- 이마의 4차원 외계 포털 문양 -->
      <circle cx="100" cy="62" r="8" fill="none" stroke="#48cae4" stroke-width="2" filter="url(#glow)"/>
      <circle cx="100" cy="62" r="3" fill="#ffd166" />
      <!-- 별빛 쏟아지는 물병자리 네온 광선 -->
      <path d="M 75 22 Q 100 12 125 22" fill="none" stroke="#00b4d8" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M 82 28 Q 100 18 118 28" fill="none" stroke="#ffd166" stroke-width="2" stroke-linecap="round"/>
    `
  },
  'pisces': {
    name: '꿈속 은하수를 유영하는 터키시앙고라 힐러냥',
    bg1: '#5a189a', bg2: '#10002b',
    fur: '#ffffff', furShadow: '#e2eafc', white: '#ffffff',
    eye: '#3a86ff',
    extra: `
      <!-- 오드아이 (왼쪽 파랑, 오른쪽 호박색 눈) -->
      <circle cx="78" cy="112" r="9" fill="#3a86ff" />
      <circle cx="122" cy="112" r="9" fill="#f4a261" />
      <!-- 은하수 지느러미 날개 -->
      <path d="M 38 105 C 20 85, 20 125, 42 125 C 28 135, 25 150, 48 140" fill="none" stroke="#c77dff" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M 162 105 C 180 85, 180 125, 158 125 C 172 135, 175 150, 152 140" fill="none" stroke="#c77dff" stroke-width="2.5" stroke-linecap="round"/>
      <!-- 트윈 스타 코이 (물고기자리 상징) -->
      <circle cx="92" cy="40" r="3" fill="#c77dff" filter="url(#glow)"/>
      <circle cx="108" cy="40" r="3" fill="#48cae4" filter="url(#glow)"/>
      <path d="M 92 40 Q 100 32 108 40 Q 100 48 92 40" fill="none" stroke="#ffd166" stroke-width="1.5"/>
    `
  }
};

function generateSvg(signKey, cfg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <radialGradient id="bg-${signKey}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${cfg.bg1}"/>
      <stop offset="100%" stop-color="${cfg.bg2}"/>
    </radialGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- 우주 배경 원반 -->
  <circle cx="100" cy="100" r="96" fill="url(#bg-${signKey})" stroke="#ffd166" stroke-width="3"/>
  <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,0.2)" stroke-dasharray="4,6"/>

  <!-- 배경 미세 별빛 -->
  <circle cx="45" cy="45" r="1.5" fill="#fff" opacity="0.8"/>
  <circle cx="155" cy="45" r="1.5" fill="#fff" opacity="0.8"/>
  <circle cx="35" cy="150" r="1.2" fill="#fff" opacity="0.7"/>
  <circle cx="165" cy="150" r="1.2" fill="#fff" opacity="0.7"/>

  <!-- 고양이 귀 -->
  <polygon points="50,90 62,38 92,72" fill="${cfg.fur}" stroke="${cfg.furShadow}" stroke-width="2"/>
  <polygon points="56,84 66,48 86,72" fill="#ffb4a2" opacity="0.8"/>

  <polygon points="150,90 138,38 108,72" fill="${cfg.fur}" stroke="${cfg.furShadow}" stroke-width="2"/>
  <polygon points="144,84 134,48 114,72" fill="#ffb4a2" opacity="0.8"/>

  <!-- 별자리별 시그니처 엑스트라 (뿔, 왕관, 헤일로 등) -->
  ${cfg.extra}

  <!-- 고양이 얼굴 본체 -->
  <ellipse cx="100" cy="116" rx="52" ry="46" fill="${cfg.fur}" stroke="${cfg.furShadow}" stroke-width="2"/>

  <!-- 턱 & 볼털 포인트 -->
  <ellipse cx="100" cy="138" rx="28" ry="18" fill="${cfg.white}" opacity="0.9"/>

  <!-- 눈 (양쪽 기본 또는 커스텀) -->
  ${signKey !== 'pisces' ? `
    <ellipse cx="78" cy="112" rx="9.5" ry="11.5" fill="${cfg.eye}"/>
    <circle cx="81" cy="109" r="3.5" fill="#ffffff"/>
    <circle cx="76" cy="115" r="1.5" fill="#ffffff"/>

    <ellipse cx="122" cy="112" rx="9.5" ry="11.5" fill="${cfg.eye}"/>
    <circle cx="125" cy="109" r="3.5" fill="#ffffff"/>
    <circle cx="120" cy="115" r="1.5" fill="#ffffff"/>
  ` : `
    <circle cx="81" cy="109" r="3.5" fill="#ffffff"/>
    <circle cx="76" cy="115" r="1.5" fill="#ffffff"/>
    <circle cx="125" cy="109" r="3.5" fill="#ffffff"/>
    <circle cx="120" cy="115" r="1.5" fill="#ffffff"/>
  `}

  <!-- 귀여운 핑크 코 -->
  <polygon points="97,124 103,124 100,128" fill="#ff758f"/>

  <!-- 입 (고양이 W 모양 미소) -->
  <path d="M 94 130 Q 97 134 100 130 Q 103 134 106 130" fill="none" stroke="#5c4d7d" stroke-width="2" stroke-linecap="round"/>

  <!-- 수염 -->
  <line x1="52" y1="124" x2="32" y2="120" stroke="#ffd166" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>
  <line x1="50" y1="130" x2="30" y2="132" stroke="#ffd166" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>
  <line x1="148" y1="124" x2="168" y2="120" stroke="#ffd166" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>
  <line x1="150" y1="130" x2="170" y2="132" stroke="#ffd166" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>

  <!-- 볼터치 (홍조) -->
  <circle cx="64" cy="125" r="6" fill="#ff758f" opacity="0.45"/>
  <circle cx="136" cy="125" r="6" fill="#ff758f" opacity="0.45"/>
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
  const svgContent = generateSvg(signKey, cfg);
  outDirs.forEach(dir => {
    fs.writeFileSync(path.join(dir, `cat-${signKey}.svg`), svgContent, 'utf8');
  });
  console.log(`Generated cat-${signKey}.svg for ${cfg.name}`);
}

console.log('All 12 Zodiac Cat SVGs generated successfully!');
