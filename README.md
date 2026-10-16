# 🐾 별빛 냥성술 상담소 (Cat Astrologer Luna)
### 순수 반응형 웹 서비스 & Node.js(Express) 백엔드 / 질문 제한 및 광고 보상 시스템 🌌✨

---

## 🌟 프로젝트 개요
'별빛 냥성술 상담소'는 앱(App) 설치 없이 모든 기기(모바일, 태블릿, PC)에서 부드럽게 접속되는 **순수 반응형 웹 페이지(Web Page)**입니다.
사용자 브라우저에 노출되던 Gemini API 키 입력을 완전히 제거하고, **Node.js(Express) 백엔드 서버가 API 키와 LLM 호출 비용을 중앙에서 안전하게 방어**하는 서비스 아키텍처로 구축되었습니다.

---

## 🚀 웹 아키텍처 & 주요 기능

### 1. 🛡️ 서버 사이드 Gemini 2.5 Flash 연동 및 비용 방어
- 클라이언트 API 키 입력창을 완전히 제거하여 API 키 탈취 위험을 원천 차단했습니다.
- 백엔드 `.env`의 `GEMINI_API_KEY`를 통해 가성비와 추론 속도가 뛰어난 `gemini-2.5-flash` 모델을 호출합니다.
- 대점성술사 루나의 특유 고양이 페르소나("~다냥", "~옹")와 정통 서양 점성술 해석 규칙을 백엔드 시스템 프롬프트(System Instruction)로 고정 적용했습니다.
- API 키 미설정 또는 네트워크 오류 시에도 내장된 룰베이스 냥성술 엔진이 안전하게 즉각 폴백(Fallback)되어 서비스가 중단되지 않습니다.

### 2. 🎟️ 비로그인 웹 방문자 질문 횟수(Quota) 관리
- 사용자가 웹 페이지에 처음 접속하면 `localStorage.getItem('luna_web_uid')`를 확인하고, 없으면 `crypto.randomUUID()`로 웹 고유 ID를 생성합니다.
- 모든 API 요청(`POST /api/chat`, `GET /api/user-quota`, `POST /api/reward`)의 `X-Web-User-Id` 헤더로 전달되어 세션을 식별합니다.
- **기본 무료 제공**: 3회
- 3회 소진 시 실시간으로 질문 전송이 차단되고 츄르 광고 유도 팝업이 작동합니다.

### 3. 🎬 웹용 10초 보상형 광고 레이어 (`playRewardAdWeb()`)
- 잔여 질문 횟수가 0일 때 질문을 시도하면 웹 모달 팝업이 작동합니다:
  > *"루나의 마력이 소진되었다냥! 츄르 광고(10초)를 보고 마력을 충전하라옹 🐟"*
- '광고 보고 충전하기' 클릭 시 10초 카운트다운 타이머와 애니메이션 프로그레스 바가 동작합니다.
- 시청 완료 시 백엔드 `/api/reward` 엔드포인트를 호출하여 질문 마력이 **즉시 +2회 충전**됩니다.
- 모듈화된 함수(`playRewardAdWeb()`)로 분리되어 있어, 추후 Google AdSense H5 Games / 보상형 웹 광고 스크립트 연동 시 즉각 교체가 가능합니다.

### 4. 📢 채팅창 최상단 가로형 및 사이드바/모달 디스플레이 배너
- **채팅창 최상단 가로 배너 (`.chat-top-ad-banner`)**: 채팅 대화 흐름을 방해하지 않는 상단 고정 가로 디스플레이 배너
- **좌측 사이드바 하단 배너 (`.sidebar-display-ad-card`)**: Google AdSense `<ins class="adsbygoogle">` 표준 호환 및 네이티브 백업 렌더링
- **모달 하단 배너 (`.modal-display-ad-slot`)**: 차트 등록, 시나스트리 궁합, 부적 팝업 하단에 자연스러운 스폰서 슬롯 배치

---

## 📁 파일 구조

```
cat-astrologer/
├── .env                  # 환경 변수 (PORT, GEMINI_API_KEY)
├── .env.example          # 환경 변수 템플릿
├── package.json          # Express, dotenv, cors 등 의존성 정의
├── server.js             # Express 웹 서버, 정적 파일 서빙, API 라우트
├── public/               # 웹 정적 파일 루트 (express.static)
│   ├── index.html        # 메인 웹 페이지 (API설정 모달 제거, 쿼터 뱃지 & 광고 모달 탑재)
│   ├── style.css         # 우주 테마 반응형 스타일 및 광고/리포트 CSS
│   ├── script.js         # 웹 클라이언트 컨트롤러 (/api/chat, 쿼터 동기화, 보상형 광고)
│   └── astronomy.js      # NASA JPL 케플러 궤도 요소 기반 정밀 천체 계산 엔진
└── README.md             # 프로젝트 설명서
```

---

## 💻 실행 방법

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정 (`.env`)
`.env` 파일에 발급받은 Google Gemini API 키를 입력합니다:
```env
PORT=3000
GEMINI_API_KEY=AIzaSy...
```
*(키를 입력하지 않아도 내장 오프라인 냥성술 엔진으로 모든 기능이 정상 동작합니다.)*

### 3. 서버 실행
```bash
npm start
```
콘솔에 서버 시작 메시지가 출력되면 브라우저에서 아래 주소로 접속합니다:
👉 **http://localhost:3000**
