# 05. API 서비스와 Mock 데이터 구현 가이드

## 1. API 서비스 아키텍처

### 1.1. 설계 원칙
- **환경별 분기**: 개발환경에서는 Mock 데이터, 운영환경에서는 실제 API
- **재사용성**: 일관된 인터페이스로 다양한 데이터 소스 지원
- **에러 처리**: 네트워크 오류, 데이터 형식 오류 등 포괄적 처리
- **캐싱 전략**: 불필요한 네트워크 요청 최소화

### 1.2. 서비스 구조
```
src/services/
├── api.js              # 메인 API 서비스
├── httpClient.js       # HTTP 클라이언트 래퍼
├── errorHandler.js     # 에러 처리 유틸리티
├── cache.js            # 캐싱 시스템
└── validators.js       # 데이터 검증 함수들
```

### 1.3. Mock 데이터 구조
```
src/mock/
├── effects.json        # 효과 목록 데이터
├── presets.json        # 프리셋 데이터
├── settings.json       # 앱 설정 데이터
└── responses/          # 세부 응답 시뮬레이션
    ├── success.json
    ├── errors.json
    └── loading.json
```

## 2. HTTP 클라이언트 구현

### 2.1. httpClient.js

```javascript
/**
 * HTTP 클라이언트 래퍼
 * fetch API를 감싸서 공통 기능 제공
 */

class HttpClient {
  constructor(config = {}) {
    this.baseURL = config.baseURL || '';
    this.timeout = config.timeout || 10000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers
    };
    
    // 요청/응답 인터셉터
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  /**
   * 요청 인터셉터 추가
   * @param {Function} interceptor - (config) => config
   */
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * 응답 인터셉터 추가
   * @param {Function} successHandler - (response) => response
   * @param {Function} errorHandler - (error) => error
   */
  addResponseInterceptor(successHandler, errorHandler) {
    this.responseInterceptors.push({ successHandler, errorHandler });
  }

  /**
   * 요청 설정 처리
   * @param {Object} config 요청 설정
   * @returns {Object} 처리된 설정
   */
  async processRequestConfig(config) {
    let processedConfig = {
      ...config,
      headers: {
        ...this.defaultHeaders,
        ...config.headers
      }
    };

    // 인터셉터 적용
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }

    return processedConfig;
  }

  /**
   * 응답 처리
   * @param {Response} response fetch 응답 객체
   * @returns {Promise<any>} 처리된 응답 데이터
   */
  async processResponse(response) {
    let processedResponse = response;

    // 성공/실패 인터셉터 적용
    for (const { successHandler, errorHandler } of this.responseInterceptors) {
      try {
        if (response.ok) {
          processedResponse = await successHandler(processedResponse);
        } else {
          processedResponse = await errorHandler(processedResponse);
        }
      } catch (error) {
        console.warn('인터셉터 처리 중 오류:', error);
      }
    }

    return processedResponse;
  }

  /**
   * 기본 요청 메서드
   * @param {string} url 요청 URL
   * @param {Object} options 요청 옵션
   * @returns {Promise<any>} 응답 데이터
   */
  async request(url, options = {}) {
    const config = await this.processRequestConfig({
      ...options,
      method: options.method || 'GET'
    });

    // 타임아웃 처리
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const fullURL = this.baseURL + url;
      
      const response = await fetch(fullURL, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // 응답 처리
      const processedResponse = await this.processResponse(response);

      if (!processedResponse.ok) {
        throw new Error(`HTTP ${processedResponse.status}: ${processedResponse.statusText}`);
      }

      // JSON 응답 파싱
      const data = await processedResponse.json();
      return data;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error(`요청 타임아웃: ${url}`);
      }
      
      throw error;
    }
  }

  /**
   * GET 요청
   */
  async get(url, params = {}, options = {}) {
    const searchParams = new URLSearchParams(params);
    const fullURL = searchParams.toString() ? `${url}?${searchParams}` : url;
    
    return this.request(fullURL, {
      ...options,
      method: 'GET'
    });
  }

  /**
   * POST 요청
   */
  async post(url, data = null, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : null
    });
  }

  /**
   * PUT 요청
   */
  async put(url, data = null, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : null
    });
  }

  /**
   * DELETE 요청
   */
  async delete(url, options = {}) {
    return this.request(url, {
      ...options,
      method: 'DELETE'
    });
  }
}

// 기본 클라이언트 인스턴스 생성
const httpClient = new HttpClient({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : '',
  timeout: 15000
});

// 공통 인터셉터 설정
httpClient.addRequestInterceptor((config) => {
  // 요청 로깅 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    console.log(`HTTP ${config.method} ${config.url}`, config);
  }
  return config;
});

httpClient.addResponseInterceptor(
  (response) => {
    // 성공 응답 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log('HTTP Response:', response.status, response.statusText);
    }
    return response;
  },
  (error) => {
    // 에러 응답 로깅
    console.error('HTTP Error:', error);
    return Promise.reject(error);
  }
);

export default httpClient;
```

### 2.2. cache.js

```javascript
/**
 * 간단한 메모리 캐싱 시스템
 */

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5분
  }

  /**
   * 캐시에 데이터 저장
   * @param {string} key 캐시 키
   * @param {any} data 저장할 데이터
   * @param {number} ttl TTL (밀리초)
   */
  set(key, data, ttl = this.defaultTTL) {
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now() + ttl);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Cache SET: ${key} (TTL: ${ttl}ms)`);
    }
  }

  /**
   * 캐시에서 데이터 가져오기
   * @param {string} key 캐시 키
   * @returns {any|null} 캐시된 데이터 또는 null
   */
  get(key) {
    const expiry = this.timestamps.get(key);
    
    if (!expiry || Date.now() > expiry) {
      // 만료된 캐시 제거
      this.delete(key);
      return null;
    }
    
    const data = this.cache.get(key);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Cache HIT: ${key}`);
    }
    
    return data;
  }

  /**
   * 캐시에서 데이터 제거
   * @param {string} key 캐시 키
   */
  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Cache DELETE: ${key}`);
    }
  }

  /**
   * 모든 캐시 제거
   */
  clear() {
    this.cache.clear();
    this.timestamps.clear();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Cache CLEAR: All entries removed');
    }
  }

  /**
   * 만료된 캐시 정리
   */
  cleanup() {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, expiry] of this.timestamps.entries()) {
      if (now > expiry) {
        this.delete(key);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0 && process.env.NODE_ENV === 'development') {
      console.log(`Cache CLEANUP: ${cleanedCount} expired entries removed`);
    }
  }

  /**
   * 캐시 상태 정보
   * @returns {Object} 캐시 통계
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    
    for (const expiry of this.timestamps.values()) {
      if (now > expiry) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }
    
    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      memoryUsage: JSON.stringify([...this.cache.values()]).length
    };
  }
}

// 전역 캐시 인스턴스
const cacheManager = new CacheManager();

// 주기적 정리 (1분마다)
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheManager.cleanup();
  }, 60 * 1000);
}

export default cacheManager;
```

## 3. Mock 데이터 구현

### 3.1. effects.json

```json
{
  "effects": [
    {
      "id": "gnParticles",
      "name": "GN 입자",
      "description": "GN 드라이브에서 방출되는 고에너지 입자들이 만들어내는 환상적인 빛의 향연",
      "thumbnail": "/images/effects/gn-particles-thumb.jpg",
      "relatedGundam": ["가넷 건담", "엑시아", "더블오", "큐안타"],
      "category": "particles",
      "defaultParams": {
        "particleCount": {
          "type": "slider",
          "value": 2000,
          "min": 500,
          "max": 5000,
          "step": 100
        },
        "particleSize": {
          "type": "slider",
          "value": 0.08,
          "min": 0.02,
          "max": 0.15,
          "step": 0.01
        },
        "speed": {
          "type": "slider",
          "value": 1.5,
          "min": 0.5,
          "max": 3.0,
          "step": 0.1
        },
        "spread": {
          "type": "slider",
          "value": 8.0,
          "min": 2.0,
          "max": 15.0,
          "step": 0.5
        },
        "color": {
          "type": "color",
          "value": "#00FF88"
        },
        "glowIntensity": {
          "type": "slider",
          "value": 1.2,
          "min": 0.5,
          "max": 2.5,
          "step": 0.1
        },
        "flowDirection": {
          "type": "slider",
          "value": 1.0,
          "min": -2.0,
          "max": 2.0,
          "step": 0.1
        },
        "turbulence": {
          "type": "slider",
          "value": 0.5,
          "min": 0.0,
          "max": 2.0,
          "step": 0.1
        }
      }
    },
    {
      "id": "newtypeFlash",
      "name": "뉴타입 섬광",
      "description": "뉴타입의 정신적 각성 순간에 발생하는 강렬한 금색 섬광과 충격파",
      "thumbnail": "/images/effects/newtype-flash-thumb.jpg",
      "relatedGundam": ["뉴 건담", "유니콘 건담", "바나지", "아무로"],
      "category": "energy",
      "defaultParams": {
        "intensity": {
          "type": "slider",
          "value": 1.5,
          "min": 0.5,
          "max": 3.0,
          "step": 0.1
        },
        "flashSpeed": {
          "type": "slider",
          "value": 2.0,
          "min": 0.5,
          "max": 5.0,
          "step": 0.1
        },
        "waveCount": {
          "type": "slider",
          "value": 3,
          "min": 1,
          "max": 8,
          "step": 1
        },
        "color": {
          "type": "color",
          "value": "#FFD700"
        },
        "pulseRate": {
          "type": "slider",
          "value": 1.2,
          "min": 0.3,
          "max": 3.0,
          "step": 0.1
        },
        "shockwaveSize": {
          "type": "slider",
          "value": 10,
          "min": 3,
          "max": 30,
          "step": 1
        }
      }
    },
    {
      "id": "minofskyParticles",
      "name": "미노프스키 입자",
      "description": "MS의 핵융합 반응에서 생성되는 미노프스키 입자의 전자기 간섭 효과",
      "thumbnail": "/images/effects/minofsky-particles-thumb.jpg",
      "relatedGundam": ["건담", "자쿠", "겔구그", "모든 MS"],
      "category": "particles",
      "defaultParams": {
        "particleCount": {
          "type": "slider",
          "value": 1500,
          "min": 300,
          "max": 4000,
          "step": 100
        },
        "particleSize": {
          "type": "slider",
          "value": 0.06,
          "min": 0.01,
          "max": 0.12,
          "step": 0.01
        },
        "speed": {
          "type": "slider",
          "value": 1.0,
          "min": 0.3,
          "max": 2.5,
          "step": 0.1
        },
        "spread": {
          "type": "slider",
          "value": 12.0,
          "min": 5.0,
          "max": 25.0,
          "step": 1.0
        },
        "color": {
          "type": "color",
          "value": "#FF6B35"
        },
        "interference": {
          "type": "slider",
          "value": 0.7,
          "min": 0.0,
          "max": 2.0,
          "step": 0.1
        },
        "density": {
          "type": "slider",
          "value": 1.0,
          "min": 0.3,
          "max": 2.0,
          "step": 0.1
        }
      }
    },
    {
      "id": "beamSaber",
      "name": "빔 사벨",
      "description": "미노프스키 입자를 압축해 형성한 고온의 플라즈마 날",
      "thumbnail": "/images/effects/beam-saber-thumb.jpg",
      "relatedGundam": ["건담", "자쿠", "겔구그", "대부분의 MS"],
      "category": "weapons",
      "defaultParams": {
        "length": {
          "type": "slider",
          "value": 8.0,
          "min": 3.0,
          "max": 15.0,
          "step": 0.5
        },
        "width": {
          "type": "slider",
          "value": 0.3,
          "min": 0.1,
          "max": 0.8,
          "step": 0.05
        },
        "color": {
          "type": "color",
          "value": "#FF69B4"
        },
        "intensity": {
          "type": "slider",
          "value": 1.8,
          "min": 0.8,
          "max": 3.0,
          "step": 0.1
        },
        "flickering": {
          "type": "slider",
          "value": 0.3,
          "min": 0.0,
          "max": 1.0,
          "step": 0.1
        },
        "sparks": {
          "type": "toggle",
          "value": true
        },
        "humming": {
          "type": "toggle",
          "value": false
        }
      }
    },
    {
      "id": "psycoFrame",
      "name": "사이코 프레임",
      "description": "뉴타입의 정신파에 반응하여 발광하는 사이코뮤 소재",
      "thumbnail": "/images/effects/psyco-frame-thumb.jpg",
      "relatedGundam": ["뉴 건담", "사자비", "유니콘 건담"],
      "category": "energy",
      "defaultParams": {
        "glowIntensity": {
          "type": "slider",
          "value": 2.0,
          "min": 0.5,
          "max": 4.0,
          "step": 0.1
        },
        "color": {
          "type": "color",
          "value": "#00BFFF"
        },
        "pulseSpeed": {
          "type": "slider",
          "value": 1.5,
          "min": 0.5,
          "max": 4.0,
          "step": 0.1
        },
        "resonance": {
          "type": "slider",
          "value": 0.8,
          "min": 0.0,
          "max": 2.0,
          "step": 0.1
        },
        "wireframe": {
          "type": "toggle",
          "value": true
        },
        "destructiveMode": {
          "type": "toggle",
          "value": false
        }
      }
    }
  ],
  "categories": [
    { "id": "particles", "name": "입자 효과", "description": "다양한 입자 시스템" },
    { "id": "energy", "name": "에너지", "description": "에너지 방출 및 공명 효과" },
    { "id": "weapons", "name": "무기", "description": "빔 사벨, 빔 라이플 등 무기 효과" },
    { "id": "environment", "name": "환경", "description": "우주 공간, 성운 등 배경 효과" }
  ],
  "metadata": {
    "version": "1.0.0",
    "lastUpdated": "2024-01-01T00:00:00Z",
    "totalEffects": 5,
    "supportedFormats": ["webgl", "webgl2"]
  }
}
```

### 3.2. presets.json

```json
{
  "presets": [
    {
      "id": "low-performance",
      "name": "저사양 모드",
      "description": "저사양 기기를 위한 최적화된 설정",
      "icon": "⚡",
      "globalParams": {
        "particleCount": 500,
        "particleSize": 0.04,
        "intensity": 0.7,
        "glowIntensity": 0.8
      },
      "effectOverrides": {
        "gnParticles": {
          "particleCount": 800,
          "turbulence": 0.2
        },
        "newtypeFlash": {
          "waveCount": 2,
          "shockwaveSize": 6
        }
      }
    },
    {
      "id": "balanced",
      "name": "균형 모드",
      "description": "성능과 품질의 균형잡힌 설정",
      "icon": "⚖️",
      "globalParams": {
        "particleCount": 1500,
        "particleSize": 0.06,
        "intensity": 1.0,
        "glowIntensity": 1.2
      }
    },
    {
      "id": "high-quality",
      "name": "고품질 모드",
      "description": "최고 품질의 시각 효과",
      "icon": "💎",
      "globalParams": {
        "particleCount": 3000,
        "particleSize": 0.08,
        "intensity": 1.5,
        "glowIntensity": 1.8
      },
      "effectOverrides": {
        "gnParticles": {
          "particleCount": 4000,
          "turbulence": 0.8
        },
        "newtypeFlash": {
          "waveCount": 5,
          "shockwaveSize": 15
        }
      }
    },
    {
      "id": "cinematic",
      "name": "시네마틱 모드",
      "description": "영화같은 드라마틱한 효과",
      "icon": "🎬",
      "globalParams": {
        "particleCount": 2500,
        "particleSize": 0.1,
        "intensity": 2.0,
        "glowIntensity": 2.5
      },
      "effectOverrides": {
        "newtypeFlash": {
          "intensity": 2.5,
          "flashSpeed": 1.0,
          "waveCount": 6
        },
        "psycoFrame": {
          "glowIntensity": 3.0,
          "pulseSpeed": 0.8
        }
      }
    }
  ],
  "customPresets": []
}
```

## 4. 메인 API 서비스 구현

### 4.1. api.js

```javascript
import httpClient from './httpClient.js';
import cacheManager from './cache.js';
import { validateEffectData, validatePresetData } from './validators.js';

/**
 * 환경별 데이터 소스 분기
 */
const IS_DEV = process.env.NODE_ENV === 'development';
const USE_MOCK = IS_DEV || !process.env.API_ENDPOINT;

/**
 * Mock 데이터 지연 시뮬레이션
 * @param {number} delay 지연 시간 (ms)
 */
const simulateDelay = (delay = 500) => {
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * 효과 목록 가져오기
 * @param {Object} options 요청 옵션
 * @returns {Promise<Array>} 효과 목록
 */
export async function getEffects(options = {}) {
  const cacheKey = 'effects-list';
  const { forceRefresh = false, category = null } = options;

  // 캐시 확인 (강제 새로고침이 아닌 경우)
  if (!forceRefresh) {
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      return filterEffectsByCategory(cachedData, category);
    }
  }

  try {
    let effectsData;

    if (USE_MOCK) {
      // Mock 데이터 사용
      await simulateDelay(300); // 네트워크 지연 시뮬레이션
      
      const mockData = await import('@/mock/effects.json');
      effectsData = mockData.default.effects;
      
      console.log('Mock 데이터에서 효과 목록 로드');
    } else {
      // 실제 API 호출
      const response = await httpClient.get('/effects', {
        category,
        version: '1.0'
      });
      
      effectsData = response.effects || response;
      console.log('API에서 효과 목록 로드');
    }

    // 데이터 검증
    if (!validateEffectData(effectsData)) {
      throw new Error('효과 데이터 형식이 올바르지 않습니다.');
    }

    // 캐시 저장 (5분)
    cacheManager.set(cacheKey, effectsData, 5 * 60 * 1000);

    return filterEffectsByCategory(effectsData, category);

  } catch (error) {
    console.error('효과 목록 로드 실패:', error);
    
    // 폴백: 캐시된 데이터 반환 시도
    const fallbackData = cacheManager.get(cacheKey);
    if (fallbackData) {
      console.warn('네트워크 오류로 인해 캐시된 데이터 사용');
      return filterEffectsByCategory(fallbackData, category);
    }
    
    throw new Error('효과 목록을 불러올 수 없습니다. 네트워크 연결을 확인해주세요.');
  }
}

/**
 * 특정 효과 상세 정보 가져오기
 * @param {string} effectId 효과 ID
 * @returns {Promise<Object>} 효과 상세 정보
 */
export async function getEffectDetails(effectId) {
  if (!effectId) {
    throw new Error('효과 ID가 필요합니다.');
  }

  const cacheKey = `effect-${effectId}`;
  
  // 캐시 확인
  const cachedData = cacheManager.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    let effectData;

    if (USE_MOCK) {
      // Mock 데이터에서 찾기
      const effects = await getEffects();
      effectData = effects.find(effect => effect.id === effectId);
      
      if (!effectData) {
        throw new Error(`효과를 찾을 수 없습니다: ${effectId}`);
      }
      
      await simulateDelay(200);
    } else {
      // 실제 API 호출
      const response = await httpClient.get(`/effects/${effectId}`);
      effectData = response;
    }

    // 캐시 저장 (10분)
    cacheManager.set(cacheKey, effectData, 10 * 60 * 1000);

    return effectData;

  } catch (error) {
    console.error(`효과 상세 정보 로드 실패: ${effectId}`, error);
    throw error;
  }
}

/**
 * 프리셋 목록 가져오기
 * @returns {Promise<Array>} 프리셋 목록
 */
export async function getPresets() {
  const cacheKey = 'presets-list';
  
  // 캐시 확인
  const cachedData = cacheManager.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    let presetsData;

    if (USE_MOCK) {
      await simulateDelay(200);
      
      const mockData = await import('@/mock/presets.json');
      presetsData = mockData.default.presets;
    } else {
      const response = await httpClient.get('/presets');
      presetsData = response.presets || response;
    }

    // 데이터 검증
    if (!validatePresetData(presetsData)) {
      throw new Error('프리셋 데이터 형식이 올바르지 않습니다.');
    }

    // 캐시 저장 (15분)
    cacheManager.set(cacheKey, presetsData, 15 * 60 * 1000);

    return presetsData;

  } catch (error) {
    console.error('프리셋 목록 로드 실패:', error);
    throw new Error('프리셋 목록을 불러올 수 없습니다.');
  }
}

/**
 * 사용자 설정 저장 (추후 구현용)
 * @param {Object} settings 사용자 설정
 * @returns {Promise<boolean>} 저장 성공 여부
 */
export async function saveUserSettings(settings) {
  try {
    if (USE_MOCK) {
      // 로컬 스토리지에 저장
      localStorage.setItem('kirakira-settings', JSON.stringify(settings));
      await simulateDelay(100);
      return true;
    } else {
      await httpClient.post('/user/settings', settings);
      return true;
    }
  } catch (error) {
    console.error('사용자 설정 저장 실패:', error);
    throw new Error('설정을 저장할 수 없습니다.');
  }
}

/**
 * 사용자 설정 불러오기 (추후 구현용)
 * @returns {Promise<Object>} 사용자 설정
 */
export async function getUserSettings() {
  try {
    if (USE_MOCK) {
      const settings = localStorage.getItem('kirakira-settings');
      return settings ? JSON.parse(settings) : {};
    } else {
      const response = await httpClient.get('/user/settings');
      return response;
    }
  } catch (error) {
    console.error('사용자 설정 로드 실패:', error);
    return {}; // 기본 설정 반환
  }
}

/**
 * 앱 상태 확인 (헬스 체크)
 * @returns {Promise<Object>} 앱 상태 정보
 */
export async function getAppStatus() {
  try {
    if (USE_MOCK) {
      await simulateDelay(100);
      return {
        status: 'healthy',
        version: '1.0.0',
        environment: 'development',
        features: {
          webgl: true,
          webgl2: true,
          touchEvents: 'ontouchstart' in window
        }
      };
    } else {
      const response = await httpClient.get('/status');
      return response;
    }
  } catch (error) {
    console.error('앱 상태 확인 실패:', error);
    return {
      status: 'error',
      message: error.message
    };
  }
}

// 유틸리티 함수들

/**
 * 카테고리별 효과 필터링
 * @param {Array} effects 효과 목록
 * @param {string|null} category 카테고리
 * @returns {Array} 필터링된 효과 목록
 */
function filterEffectsByCategory(effects, category) {
  if (!category) return effects;
  
  return effects.filter(effect => effect.category === category);
}

/**
 * 효과 검색
 * @param {string} query 검색어
 * @param {Object} options 검색 옵션
 * @returns {Promise<Array>} 검색 결과
 */
export async function searchEffects(query, options = {}) {
  const { category = null, limit = 10 } = options;
  
  const allEffects = await getEffects({ category });
  
  if (!query) return allEffects.slice(0, limit);
  
  const searchTerms = query.toLowerCase().split(' ');
  
  const results = allEffects.filter(effect => {
    const searchText = [
      effect.name,
      effect.description,
      ...effect.relatedGundam
    ].join(' ').toLowerCase();
    
    return searchTerms.every(term => searchText.includes(term));
  });
  
  return results.slice(0, limit);
}

/**
 * 인기 효과 목록 (추후 구현용)
 * @param {number} limit 제한 개수
 * @returns {Promise<Array>} 인기 효과 목록
 */
export async function getPopularEffects(limit = 5) {
  try {
    const allEffects = await getEffects();
    
    // Mock: 임의로 인기 효과 선정
    const shuffled = [...allEffects].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
    
  } catch (error) {
    console.error('인기 효과 로드 실패:', error);
    return [];
  }
}

/**
 * 캐시 무효화
 * @param {string|null} pattern 패턴 (null이면 전체)
 */
export function invalidateCache(pattern = null) {
  if (!pattern) {
    cacheManager.clear();
    console.log('모든 캐시 무효화');
  } else {
    // 패턴 매칭하여 특정 캐시만 무효화
    const keys = Array.from(cacheManager.cache.keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        cacheManager.delete(key);
      }
    });
    console.log(`캐시 무효화: ${pattern}`);
  }
}
```

### 4.2. validators.js

```javascript
/**
 * 데이터 검증 함수들
 */

/**
 * 효과 데이터 검증
 * @param {any} data 검증할 데이터
 * @returns {boolean} 유효성 여부
 */
export function validateEffectData(data) {
  if (!Array.isArray(data)) {
    console.error('효과 데이터는 배열이어야 합니다.');
    return false;
  }

  for (const effect of data) {
    if (!validateSingleEffect(effect)) {
      return false;
    }
  }

  return true;
}

/**
 * 개별 효과 객체 검증
 * @param {Object} effect 효과 객체
 * @returns {boolean} 유효성 여부
 */
function validateSingleEffect(effect) {
  const required = ['id', 'name', 'description', 'category', 'defaultParams'];
  
  for (const field of required) {
    if (!(field in effect)) {
      console.error(`효과 객체에 필수 필드가 없습니다: ${field}`);
      return false;
    }
  }

  // ID 형식 검증
  if (typeof effect.id !== 'string' || !/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(effect.id)) {
    console.error(`잘못된 효과 ID 형식: ${effect.id}`);
    return false;
  }

  // 파라미터 검증
  if (!validateParameters(effect.defaultParams)) {
    return false;
  }

  return true;
}

/**
 * 파라미터 객체 검증
 * @param {Object} params 파라미터 객체
 * @returns {boolean} 유효성 여부
 */
function validateParameters(params) {
  if (typeof params !== 'object' || params === null) {
    console.error('파라미터는 객체여야 합니다.');
    return false;
  }

  for (const [key, param] of Object.entries(params)) {
    if (!validateSingleParameter(key, param)) {
      return false;
    }
  }

  return true;
}

/**
 * 개별 파라미터 검증
 * @param {string} key 파라미터 키
 * @param {Object} param 파라미터 객체
 * @returns {boolean} 유효성 여부
 */
function validateSingleParameter(key, param) {
  if (!param.type || !param.hasOwnProperty('value')) {
    console.error(`파라미터 ${key}에 type 또는 value가 없습니다.`);
    return false;
  }

  const validTypes = ['slider', 'color', 'toggle', 'select'];
  if (!validTypes.includes(param.type)) {
    console.error(`지원하지 않는 파라미터 타입: ${param.type}`);
    return false;
  }

  // 타입별 검증
  switch (param.type) {
    case 'slider':
      if (typeof param.value !== 'number') {
        console.error(`슬라이더 파라미터 ${key}의 값은 숫자여야 합니다.`);
        return false;
      }
      if (param.min !== undefined && param.value < param.min) {
        console.error(`파라미터 ${key}의 값이 최소값보다 작습니다.`);
        return false;
      }
      if (param.max !== undefined && param.value > param.max) {
        console.error(`파라미터 ${key}의 값이 최대값보다 큽니다.`);
        return false;
      }
      break;

    case 'color':
      if (typeof param.value !== 'string' || !/^#[0-9A-F]{6}$/i.test(param.value)) {
        console.error(`컬러 파라미터 ${key}의 값은 유효한 헥스 색상이어야 합니다.`);
        return false;
      }
      break;

    case 'toggle':
      if (typeof param.value !== 'boolean') {
        console.error(`토글 파라미터 ${key}의 값은 불린이어야 합니다.`);
        return false;
      }
      break;

    case 'select':
      if (!Array.isArray(param.options) || param.options.length === 0) {
        console.error(`선택 파라미터 ${key}에 유효한 옵션이 없습니다.`);
        return false;
      }
      if (!param.options.includes(param.value)) {
        console.error(`선택 파라미터 ${key}의 값이 옵션에 없습니다.`);
        return false;
      }
      break;
  }

  return true;
}

/**
 * 프리셋 데이터 검증
 * @param {any} data 검증할 데이터
 * @returns {boolean} 유효성 여부
 */
export function validatePresetData(data) {
  if (!Array.isArray(data)) {
    console.error('프리셋 데이터는 배열이어야 합니다.');
    return false;
  }

  for (const preset of data) {
    if (!validateSinglePreset(preset)) {
      return false;
    }
  }

  return true;
}

/**
 * 개별 프리셋 검증
 * @param {Object} preset 프리셋 객체
 * @returns {boolean} 유효성 여부
 */
function validateSinglePreset(preset) {
  const required = ['id', 'name', 'description'];
  
  for (const field of required) {
    if (!(field in preset)) {
      console.error(`프리셋에 필수 필드가 없습니다: ${field}`);
      return false;
    }
  }

  // globalParams 검증 (있는 경우)
  if (preset.globalParams && typeof preset.globalParams !== 'object') {
    console.error('프리셋의 globalParams는 객체여야 합니다.');
    return false;
  }

  // effectOverrides 검증 (있는 경우)
  if (preset.effectOverrides && typeof preset.effectOverrides !== 'object') {
    console.error('프리셋의 effectOverrides는 객체여야 합니다.');
    return false;
  }

  return true;
}

/**
 * URL 유효성 검증
 * @param {string} url URL 문자열
 * @returns {boolean} 유효성 여부
 */
export function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 파일 크기 검증
 * @param {number} size 파일 크기 (바이트)
 * @param {number} maxSize 최대 크기 (바이트)
 * @returns {boolean} 유효성 여부
 */
export function validateFileSize(size, maxSize) {
  return typeof size === 'number' && size > 0 && size <= maxSize;
}
```

## 5. 구현 체크리스트

### 5.1. 기본 인프라
- [ ] HTTP 클라이언트 구현
- [ ] 캐싱 시스템 구현  
- [ ] 에러 처리 시스템 구현
- [ ] 데이터 검증 함수 구현

### 5.2. Mock 데이터
- [ ] `effects.json` 작성
- [ ] `presets.json` 작성
- [ ] 응답 시뮬레이션 구현
- [ ] 지연 시뮬레이션 구현

### 5.3. API 서비스
- [ ] 효과 목록 API 구현
- [ ] 효과 상세 정보 API 구현
- [ ] 프리셋 API 구현
- [ ] 검색 기능 구현

### 5.4. 통합 테스트
- [ ] 스토어와 API 연동 테스트
- [ ] 캐싱 동작 확인
- [ ] 에러 상황 테스트
- [ ] 성능 테스트

## 6. 다음 단계

API 서비스 구현이 완료되면 다음 문서로 진행하세요:

1. **06_Styling_Implementation_Guide.md** - 스타일링 시스템 구현
2. **07_Testing_Setup_Guide.md** - 테스팅 환경 설정

## 7. 트러블슈팅

### 7.1. 일반적인 문제들

#### CORS 오류
- 개발 서버 프록시 설정
- API 서버 CORS 헤더 확인

#### 캐시 문제
- 캐시 키 충돌 확인
- TTL 설정 검토

#### Mock 데이터 로딩 실패
- 파일 경로 확인
- JSON 형식 검증

#### 타임아웃 오류
- 타임아웃 설정 조정
- 네트워크 상태 확인
