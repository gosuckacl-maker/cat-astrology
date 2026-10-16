// astronomy.js - Astro-Seek 호환 천체력(Ephemeris) 및 점성술 차트 자동 계산 엔진
// NASA JPL 케플러 궤도 요소 및 Jean Meeus 천체 역학 알고리즘 기반

const AstroEngine = (() => {
  const DEG2RAD = Math.PI / 180;
  const RAD2DEG = 180 / Math.PI;

  const ZODIAC_SIGNS = [
    { key: 'aries', name: '양자리', symbol: '♈', element: '불' },
    { key: 'taurus', name: '황소자리', symbol: '♉', element: '흙' },
    { key: 'gemini', name: '쌍둥이자리', symbol: '♊', element: '공기' },
    { key: 'cancer', name: '게자리', symbol: '♋', element: '물' },
    { key: 'leo', name: '사자자리', symbol: '♌', element: '불' },
    { key: 'virgo', name: '처녀자리', symbol: '♍', element: '흙' },
    { key: 'libra', name: '천칭자리', symbol: '♎', element: '공기' },
    { key: 'scorpio', name: '전갈자리', symbol: '♏', element: '물' },
    { key: 'sagittarius', name: '사수자리', symbol: '♐', element: '불' },
    { key: 'capricorn', name: '염소자리', symbol: '♑', element: '흙' },
    { key: 'aquarius', name: '물병자리', symbol: '♒', element: '공기' },
    { key: 'pisces', name: '물고기자리', symbol: '♓', element: '물' }
  ];

  const CITIES = {
    'Seoul': { name: '서울 (Seoul)', lat: 37.5665, lon: 126.9780, tz: 9 },
    'Busan': { name: '부산 (Busan)', lat: 35.1796, lon: 129.0756, tz: 9 },
    'Incheon': { name: '인천 (Incheon)', lat: 37.4563, lon: 126.7052, tz: 9 },
    'Daegu': { name: '대구 (Daegu)', lat: 35.8714, lon: 128.6014, tz: 9 },
    'Daejeon': { name: '대전 (Daejeon)', lat: 36.3504, lon: 127.3845, tz: 9 },
    'Gwangju': { name: '광주 (Gwangju)', lat: 35.1595, lon: 126.8526, tz: 9 },
    'Ulsan': { name: '울산 (Ulsan)', lat: 35.5384, lon: 129.3114, tz: 9 },
    'Suwon': { name: '수원 (Suwon)', lat: 37.2636, lon: 127.0286, tz: 9 },
    'Jeju': { name: '제주 (Jeju)', lat: 33.4996, lon: 126.5312, tz: 9 },
    'Tokyo': { name: '도쿄 (Tokyo)', lat: 35.6762, lon: 139.6503, tz: 9 },
    'NewYork': { name: '뉴욕 (New York)', lat: 40.7128, lon: -74.0060, tz: -5 },
    'London': { name: '런던 (London)', lat: 51.5074, lon: -0.1278, tz: 0 },
    'Paris': { name: '파리 (Paris)', lat: 48.8566, lon: 2.3522, tz: 1 },
    'LA': { name: '로스앤젤레스 (Los Angeles)', lat: 34.0522, lon: -118.2437, tz: -8 }
  };

  // 0~360도 정규화
  function norm360(deg) {
    deg = deg % 360;
    return deg < 0 ? deg + 360 : deg;
  }

  // 율리우스 적일 (Julian Day) 계산
  function calcJulianDay(year, month, day, hour, min, tz) {
    let Y = year;
    let M = month;
    if (M <= 2) {
      Y -= 1;
      M += 12;
    }
    const UT = hour + min / 60.0 - tz;
    const D = day + UT / 24.0;
    const A = Math.floor(Y / 100);
    const B = 2 - A + Math.floor(A / 4);
    const JD = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
    return JD;
  }

  // J2000.0 기준 율리우스 세기 T
  function calcCenturies(JD) {
    return (JD - 2451545.0) / 36525.0;
  }

  // 황도 경사각 (Obliquity of the Ecliptic)
  function calcObliquity(T) {
    return 23.4392911 - 0.0130042 * T;
  }

  // 그리니치 평균 항성시 (GMST) 및 지방 항성시 (LST / RAMC)
  function calcLST(JD, T, lon) {
    const D = JD - 2451545.0;
    let gmst = 280.46061837 + 360.98564736629 * D + 0.000387933 * T * T - (T * T * T) / 38710000.0;
    gmst = norm360(gmst);
    const lst = norm360(gmst + lon);
    return lst; // RAMC in degrees
  }

  // 상승궁 (Ascendant) 계산
  function calcAscendant(RAMC, lat, eps) {
    const ramcRad = RAMC * DEG2RAD;
    const latRad = lat * DEG2RAD;
    const epsRad = eps * DEG2RAD;

    const y = Math.cos(ramcRad);
    const x = -Math.sin(ramcRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
    let asc = Math.atan2(y, x) * RAD2DEG;
    asc = norm360(asc);
    return asc;
  }

  // 태양 위치 (Sun Ecliptic Longitude)
  function calcSun(T) {
    const L0 = norm360(280.46646 + 36000.76983 * T);
    const M = norm360(357.52911 + 35999.05029 * T) * DEG2RAD;
    const C = (1.914602 - 0.004817 * T) * Math.sin(M) +
              (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
              0.000289 * Math.sin(3 * M);
    return norm360(L0 + C);
  }

  // 달 위치 (Moon Ecliptic Longitude) - Jean Meeus 간이 섭동론
  function calcMoon(T) {
    const Lp = norm360(218.3164477 + 481267.88123421 * T);
    const D  = norm360(297.8501921 + 445267.1114034 * T) * DEG2RAD;
    const M  = norm360(357.5291092 + 35999.0502909 * T) * DEG2RAD;
    const Mp = norm360(134.9633964 + 477198.8675055 * T) * DEG2RAD;
    const F  = norm360(93.2720950 + 483202.0175233 * T) * DEG2RAD;

    let l = Lp +
      6.288774 * Math.sin(Mp) +
      1.274027 * Math.sin(2 * D - Mp) +
      0.658314 * Math.sin(2 * D) +
      0.213618 * Math.sin(2 * Mp) -
      0.185116 * Math.sin(M) -
      0.114332 * Math.sin(2 * F) +
      0.058793 * Math.sin(2 * D - 2 * Mp) +
      0.057066 * Math.sin(2 * D - M - Mp) +
      0.053322 * Math.sin(2 * D + Mp) +
      0.045758 * Math.sin(2 * D - M);

    return norm360(l);
  }

  // NASA JPL 행성 케플러 궤도 매개변수
  const PLANET_ORBITS = {
    Mercury: { a: 0.38709893, e: 0.20563069, I: 7.00487, L: 252.250845, w: 77.45645, node: 48.33167, dL: 149472.67411175 },
    Venus:   { a: 0.72333199, e: 0.00677323, I: 3.39471, L: 181.979730, w: 131.57294, node: 76.68069, dL: 58517.81538729 },
    Mars:    { a: 1.52366231, e: 0.09341233, I: 1.85061, L: 355.453320, w: 336.04084, node: 49.57854, dL: 19140.30268499 },
    Jupiter: { a: 5.20336301, e: 0.04839266, I: 1.30530, L: 34.404380, w: 14.75385, node: 100.55615, dL: 3034.74612898 },
    Saturn:  { a: 9.53707032, e: 0.05415060, I: 2.48446, L: 49.944240, w: 92.43194, node: 113.71504, dL: 1222.49362201 },
    Uranus:  { a: 19.19126393, e: 0.04716771, I: 0.76986, L: 313.232180, w: 170.96424, node: 74.22988, dL: 428.48202785 },
    Neptune: { a: 30.06896348, e: 0.00858587, I: 1.76917, L: 304.880030, w: 44.97135, node: 131.72169, dL: 218.45945325 },
    Pluto:   { a: 39.48168677, e: 0.24880766, I: 17.14175, L: 238.928810, w: 224.06676, node: 110.30347, dL: 145.20780515 }
  };

  // 행성 지심 황도 경도 (Geocentric Ecliptic Longitude) 계산
  function calcPlanet(name, T, sunLon) {
    const orb = PLANET_ORBITS[name];
    if (!orb) return 0;

    const L = norm360(orb.L + orb.dL * T);
    const M = norm360(L - orb.w) * DEG2RAD;
    const e = orb.e;
    
    // 케플러 방정식 풀이 (뉴턴-랩슨법)
    let E = M;
    for (let i = 0; i < 5; i++) {
      E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    }

    const xv = orb.a * (Math.cos(E) - e);
    const yv = orb.a * (Math.sqrt(1 - e * e) * Math.sin(E));
    const v = Math.atan2(yv, xv);
    const r = Math.sqrt(xv * xv + yv * yv);

    // 일심 헬리오센트릭 경도
    const lHelioc = norm360((v * RAD2DEG) + orb.w);
    const lRad = lHelioc * DEG2RAD;

    // 지구-태양 거리 (약 1.0 AU)
    const sunRad = sunLon * DEG2RAD;
    const xEarth = -Math.cos(sunRad);
    const yEarth = -Math.sin(sunRad);

    const xPlanet = r * Math.cos(lRad);
    const yPlanet = r * Math.sin(lRad);

    // 지심 변환
    const xGeo = xPlanet - xEarth;
    const yGeo = yPlanet - yEarth;
    const lGeo = norm360(Math.atan2(yGeo, xGeo) * RAD2DEG);

    return lGeo;
  }

  // 각도에서 별자리 및 도/분 추출
  function degreeToZodiac(deg) {
    deg = norm360(deg);
    const signIdx = Math.floor(deg / 30);
    const sign = ZODIAC_SIGNS[signIdx];
    const degreeInSign = deg % 30;
    const d = Math.floor(degreeInSign);
    const m = Math.floor((degreeInSign - d) * 60);

    return {
      signKey: sign.key,
      signName: sign.name,
      symbol: sign.symbol,
      element: sign.element,
      degTotal: deg,
      degInSign: d,
      minInSign: m,
      formatted: `${sign.name} ${String(d).padStart(2, '0')}°${String(m).padStart(2, '0')}'`
    };
  }

  // Whole Sign 하우스 계산
  function calcHouseWholeSign(ascDeg, planetDeg) {
    const ascSignIdx = Math.floor(norm360(ascDeg) / 30);
    const planetSignIdx = Math.floor(norm360(planetDeg) / 30);
    let house = (planetSignIdx - ascSignIdx + 12) % 12 + 1;
    return house;
  }

  // 서수 포맷 (1st, 2nd, ...)
  function formatHouseNum(h) {
    const suffixes = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
    return `${h}${suffixes[h] || 'th'} House`;
  }

  // 주요 각도(Aspects) 계산
  function calcAspects(planets) {
    const aspectDefs = [
      { name: 'Conjunction', angle: 0, orb: 7.5, symbol: '☌' },
      { name: 'Sextile', angle: 60, orb: 5.5, symbol: '⚹' },
      { name: 'Square', angle: 90, orb: 7.0, symbol: '□' },
      { name: 'Trine', angle: 120, orb: 7.5, symbol: '△' },
      { name: 'Opposition', angle: 180, orb: 7.5, symbol: '☍' }
    ];

    const results = [];
    const keys = Object.keys(planets);

    for (let i = 0; i < keys.length; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        const p1 = keys[i];
        const p2 = keys[j];
        const deg1 = planets[p1].degTotal;
        const deg2 = planets[p2].degTotal;

        let diff = Math.abs(deg1 - deg2);
        if (diff > 180) diff = 360 - diff;

        for (const asp of aspectDefs) {
          const delta = Math.abs(diff - asp.angle);
          if (delta <= asp.orb) {
            const d = Math.floor(delta);
            const m = Math.floor((delta - d) * 60);
            results.push({
              planet1: p1,
              planet2: p2,
              aspect: asp.name,
              symbol: asp.symbol,
              orb: `${d}°${String(m).padStart(2, '0')}'`,
              line: `${p1} ${asp.name} ${p2} (${d}°${String(m).padStart(2, '0')}')`
            });
            break;
          }
        }
      }
    }
    return results;
  }

  // 메인: 생년월일시 및 도시 입력으로 완전한 Astro-Seek 형식 차트 생성
  function generateFullChart(birthDateStr, birthTimeStr, cityKey = 'Seoul') {
    const city = CITIES[cityKey] || CITIES['Seoul'];
    const [yearStr, monthStr, dayStr] = birthDateStr.split('-');
    const [hourStr, minStr] = (birthTimeStr || '12:00').split(':');

    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);
    const hour = parseInt(hourStr, 10);
    const min = parseInt(minStr, 10);

    const JD = calcJulianDay(year, month, day, hour, min, city.tz);
    const T = calcCenturies(JD);
    const eps = calcObliquity(T);
    const RAMC = calcLST(JD, T, city.lon);

    // 각 천체 계산
    const ascDeg = calcAscendant(RAMC, city.lat, eps);
    const sunDeg = calcSun(T);
    const moonDeg = calcMoon(T);

    const planets = {
      Sun: degreeToZodiac(sunDeg),
      Moon: degreeToZodiac(moonDeg),
      Ascendant: degreeToZodiac(ascDeg),
      Mercury: degreeToZodiac(calcPlanet('Mercury', T, sunDeg)),
      Venus: degreeToZodiac(calcPlanet('Venus', T, sunDeg)),
      Mars: degreeToZodiac(calcPlanet('Mars', T, sunDeg)),
      Jupiter: degreeToZodiac(calcPlanet('Jupiter', T, sunDeg)),
      Saturn: degreeToZodiac(calcPlanet('Saturn', T, sunDeg)),
      Uranus: degreeToZodiac(calcPlanet('Uranus', T, sunDeg)),
      Neptune: degreeToZodiac(calcPlanet('Neptune', T, sunDeg)),
      Pluto: degreeToZodiac(calcPlanet('Pluto', T, sunDeg))
    };

    // 하우스 배정
    for (const [pName, pData] of Object.entries(planets)) {
      pData.house = calcHouseWholeSign(ascDeg, pData.degTotal);
      pData.houseStr = formatHouseNum(pData.house);
    }

    // 애스펙트 계산
    const aspects = calcAspects(planets);

    // Astro-Seek AI Export 포맷 텍스트 자동 빌드
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${day} ${monthNames[month - 1]} ${year}, ${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;

    let exportText = `=== ASTRO-SEEK.COM - BIRTH CHART REPORT ===\n`;
    exportText += `Date of Birth: ${formattedDate} (Timezone: UTC+${city.tz})\n`;
    exportText += `Place: ${city.name} (Lat: ${city.lat.toFixed(2)}, Lon: ${city.lon.toFixed(2)})\n`;
    exportText += `House System: Whole Sign\n\n`;
    exportText += `PLANETS POSITIONS:\n`;

    const planetOrder = ['Sun', 'Moon', 'Ascendant', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    planetOrder.forEach(pName => {
      const p = planets[pName];
      const signCap = p.signKey.charAt(0).toUpperCase() + p.signKey.slice(1);
      exportText += `${pName} in ${signCap} ${String(p.degInSign).padStart(2, '0')}°${String(p.minInSign).padStart(2, '0')}' (${p.houseStr})\n`;
    });

    exportText += `\nMAJOR ASPECTS:\n`;
    aspects.slice(0, 8).forEach(asp => {
      exportText += `${asp.line}\n`;
    });

    return {
      raw: exportText,
      planets,
      sun: planets.Sun,
      moon: planets.Moon,
      ascendant: planets.Ascendant,
      venus: planets.Venus,
      mars: planets.Mars,
      mercury: planets.Mercury,
      jupiter: planets.Jupiter,
      saturn: planets.Saturn,
      aspects: aspects.map(a => a.line),
      city,
      birthDateStr,
    };
  }

  // 시나스트리 (두 사람의 차트 비교 궁합 분석)
  function calcSynastry(c1, c2) {
    if (!c1 || !c2 || !c1.planets || !c2.planets) return null;

    const aspectDefs = [
      { name: 'Conjunction', angle: 0, orb: 8.0, harmony: 12, nameKo: '합 (강렬한 끌림)' },
      { name: 'Trine', angle: 120, orb: 7.5, harmony: 14, nameKo: '삼합 (천생연분의 조화)' },
      { name: 'Sextile', angle: 60, orb: 6.0, harmony: 10, nameKo: '육합 (편안한 소통)' },
      { name: 'Opposition', angle: 180, orb: 7.5, harmony: -4, nameKo: '충 (자석 같은 상극의 매력)' },
      { name: 'Square', angle: 90, orb: 7.0, harmony: -5, nameKo: '사각 (도전과 불꽃튀는 케미)' }
    ];

    let score = 72;
    const interAspects = [];
    const checkPairs = [
      ['Sun', 'Moon', '영혼과 감정의 교감'],
      ['Moon', 'Sun', '정서적 지지와 이해'],
      ['Venus', 'Mars', '로맨틱한 설렘과 육체적 끌림'],
      ['Mars', 'Venus', '열정적인 애정 표현'],
      ['Sun', 'Sun', '인생 목표와 가치관의 일치'],
      ['Moon', 'Moon', '마음의 안식과 생활 습관'],
      ['Venus', 'Venus', '취향과 사랑의 언어'],
      ['Jupiter', 'Sun', '서로에게 행운을 주는 복덩이 관계']
    ];

    checkPairs.forEach(([p1, p2, desc]) => {
      if (!c1.planets[p1] || !c2.planets[p2]) return;
      const deg1 = c1.planets[p1].degTotal;
      const deg2 = c2.planets[p2].degTotal;

      let diff = Math.abs(deg1 - deg2);
      if (diff > 180) diff = 360 - diff;

      for (const asp of aspectDefs) {
        if (Math.abs(diff - asp.angle) <= asp.orb) {
          score += asp.harmony;
          interAspects.push({
            p1Name: p1,
            p2Name: p2,
            aspect: asp.name,
            nameKo: asp.nameKo,
            desc
          });
          break;
        }
      }
    });

    score = Math.max(68, Math.min(99, score));

    let title = '환상의 우주 츄르 메이트';
    if (score >= 95) title = '우주가 점지한 천생연분 묘연(猫緣)';
    else if (score >= 88) title = '포근하고 따뜻한 영혼의 안식처';
    else if (score >= 80) title = '호기심과 매력이 넘치는 찰떡궁합';
    else title = '밀당과 불꽃이 튀는 짜릿한 인연';

    return {
      score,
      title,
      interAspects,
      user1: { sun: c1.sun, moon: c1.moon, venus: c1.venus },
      user2: { sun: c2.sun, moon: c2.moon, venus: c2.venus }
    };
  }

  return {
    CITIES,
    ZODIAC_SIGNS,
    generateFullChart,
    calcSynastry
  };
})();
