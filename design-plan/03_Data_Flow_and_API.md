# 03. 데이터 흐름 및 API 설계 (Data Flow & API Design)

## 1. 데이터 흐름 (Data Flow)

- 애플리케이션의 데이터는 단방향 데이터 흐름(Unidirectional Data Flow) 원칙을 따름.

```
1. [Component Event] (예: 효과 클릭)
       |
       v
2. [Action] (Pinia Store의 액션 호출, 예: `effectStore.selectEffect(id)`)
       |
       v
3. [API Call / Mock] (필요시 비동기 데이터 요청)
       |
       v
4. [Mutation] (액션 내에서 state 변경, 예: `state.selectedEffect = ...`)
       |
       v
5. [State Change] (Pinia Store의 상태 변경)
       |
       v
6. [Component Update] (변경된 state를 구독하는 컴포넌트 자동 리렌더링)
```

## 2. 상태 관리 (Pinia Stores)

### 2.1. `effectStore.js`

- **state**:
    - `effects: Effect[]`: 전체 효과 목록.
    - `selectedEffect: Effect | null`: 현재 선택된 효과 객체.
    - `currentParams: object`: 현재 효과에 적용된 파라미터 값.
    - `status: 'idle' | 'loading' | 'succeeded' | 'failed'`: 데이터 로딩 상태.
- **actions**:
   - `fetchEffects()`: 비동기 로드. `status`를 단계적으로 갱신하고 오류 시 `failed`로 설정.
   - `selectEffect(id: string)`: `selectedEffect` 설정 및 `currentParams` 초기화.
   - `updateParam(key: string, value: any)`: 파라미터 업데이트 및 효과 모듈에 반영될 수 있도록 상태 변경.
 - **getters**:
   - `selectedParams`: 현재 효과의 파라미터 스냅샷 반환.

### 2.2. `uiStore.js`

- **state**:
    - `isInfoPanelVisible: boolean`: 정보 패널의 표시 여부.
    - `isLibraryVisible: boolean`: 효과 라이브러리 패널의 표시 여부.
- **actions**:
    - `toggleInfoPanel()`: 정보 패널의 표시 상태를 토글.
    - `toggleLibrary()`: 라이브러리 패널의 표시 상태를 토글.
 - **getters**:
     - `isOverlayOpen`: 오버레이 계열(정보/라이브러리) 중 하나라도 열려있는지.

## 2.3. 서비스 시그니처

- `services/api.js`
  - `getEffects(): Promise<Effect[]>`

## 3. API 명세 (가상)

- **Endpoint**: `/api/effects`
- **Method**: `GET`
- **Response Body**: `Effect[]`

```typescript
// API 응답 객체 타입 정의
interface Effect {
  id: string; // 고유 ID (예: 'gn-particles')
  name: string; // 효과 이름 (예: 'GN 입자')
  description: string; // 효과에 대한 설명
  thumbnail: string; // 썸네일 이미지 URL
  relatedGundam: string[]; // 관련 기체 이름 배열
  defaultParams: {
    [key: string]: {
      type: 'slider' | 'color';
      value: number | string;
      min?: number;
      max?: number;
      step?: number;
    };
  };
}
```

## 4. Mock 데이터 구현

- **위치**: `src/mock/effects.json`
- **내용**: 위 `Effect[]` 타입 정의를 따르는 JSON 배열.
- **구현 방식**:
    - API 호출 서비스(`services/api.js`) 내에서 개발 환경일 경우, 실제 `fetch` 대신 `effects.json` 파일을 `import`하여 반환하도록 분기 처리.
    - 이를 통해 추후 API가 준비되었을 때, 서비스 로직의 수정만으로 쉽게 전환 가능.

```javascript
// services/api.js (개발/운영 전환이 쉬운 구조)

// const API_BASE_URL = '/api'; // TODO: 실제 API 준비되면 주석 해제
const IS_DEV = process.env.NODE_ENV === 'development';

export const getEffects = async () => {
  if (IS_DEV) {
    // 개발 환경: mock 데이터를 동적 import로 로드 (Webpack code-splitting)
    const mock = await import('@/mock/effects.json');
    return mock.default;
  }

  // 운영 환경: 실제 API 호출 (준비되면 아래 주석 해제)
  // const response = await fetch(`${API_BASE_URL}/effects`);
  // if (!response.ok) throw new Error('Failed to fetch effects');
  // return response.json();

  // 임시: 운영에서도 동일 mock 사용 (API 준비 전)
  const mock = await import('@/mock/effects.json');
  return mock.default;
};
```

### 4.1. Webpack 환경 변수 관리

- `DefinePlugin`으로 `process.env.NODE_ENV`를 주입하여 `development`/`production` 분기를 처리.
- 경로 별칭 `@`는 Webpack `resolve.alias`로 `src`를 가리키도록 설정.
