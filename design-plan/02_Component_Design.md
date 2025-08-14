# 02. 컴포넌트 설계 (Component Design)

## 1. 컴포넌트 계층 구조

- 컴포넌트는 **Presentational Component**와 **Container Component**로 역할을 분리하여 설계.
- **Container Components**: 데이터 로직, 상태 관리 등 비즈니스 로직을 처리. (예: `views/HomePage.vue`)
- **Presentational Components**: 데이터를 props로 받아 화면에 표시하는 역할에 집중. (예: `components/ui/BaseButton.vue`)

```
src/
|-- components/
|   |-- layout/
|   |   |-- TheHeader.vue       (사이트 헤더)
|   |   `-- TheFooter.vue       (사이트 푸터)
|   |
|   |-- effects/
|   |   |-- EffectCanvas.vue    (Three.js 캔버스 래퍼)
|   |   `-- EffectControls.vue  (효과 파라미터 컨트롤 UI)
|   |
|   |-- library/
|   |   |-- EffectList.vue      (효과 목록)
|   |   `-- EffectListItem.vue  (개별 효과 아이템)
|   |
|   |-- common/
|   |   |-- InfoPanel.vue       (선택된 효과 상세 정보 패널)
|   |   `-- LoadingSpinner.vue  (로딩 인디케이터)
|   |
|   `-- ui/
|       |-- BaseButton.vue      (기본 버튼)
|       `-- BaseSlider.vue      (슬라이더 컨트롤)
|
`-- views/
    |-- HomePage.vue            (메인 페이지, 모든 컴포넌트를 조합)
    `-- NotFoundPage.vue        (404 페이지)
```

## 2. 주요 컴포넌트 명세

### 2.1. `EffectCanvas.vue`

- **역할**: Three.js의 `WebGLRenderer`를 초기화하고, Scene과 Camera를 관리하는 컨테이너.
- **Props**: `effectName` (string) - 현재 렌더링할 효과의 이름.
    - `params` (object) - 현재 적용할 파라미터 값 (Pinia에서 주입)
- **로직**:
    - `effectName` prop이 변경되면, 해당 이름에 맞는 3D 효과 모듈(`effects/${effectName}.effect.js`)을 동적으로 import.
    - 로드된 모듈의 `init` 함수를 호출하여 Scene에 효과를 추가하고, `animate` 함수를 렌더링 루프에 등록.
    - 사용자의 마우스 입력에 따라 Camera를 제어 (OrbitControls).
 - **에러/로딩**:
     - 모듈 로딩 실패 시 사용자에게 토스트/패널로 안내, 기본 장면으로 복귀.
     - 캔버스 초기화 전에는 `LoadingSpinner` 표시.
 - **접근성**:
     - 캔버스 포커스 가능(tabindex) 및 키보드 단축키(재생/정지, 리셋) 제공.

### 2.2. `EffectControls.vue`

- **역할**: 현재 선택된 효과의 파라미터를 조작할 수 있는 UI를 제공.
- **Props**: `effectParams` (object) - 컨트롤할 파라미터 목록과 현재 값.
- **이벤트**: `@update:param` (key, value) - 사용자가 파라미터 값을 변경했을 때 발생.
 - **컨트랙트**:
     - 입력: `{ [key]: { type, value, min, max, step } }`
     - 출력: `emit('update:param', key, nextValue)`
- **로직**:
    - `effectParams` 객체를 순회하며 각 파라미터 타입에 맞는 UI 컨트롤(슬라이더, 컬러 피커 등)을 동적으로 생성.
    - 값이 변경되면 이벤트를 통해 부모 컴포넌트에 알림.

### 2.3. `EffectList.vue`

- **역할**: Pinia 스토어에서 효과 목록을 가져와 `EffectListItem`으로 렌더링.
- **로직**:
    - `effectStore`의 `effects` 상태를 구독.
    - 사용자가 특정 아이템을 클릭하면 `effectStore`의 `selectEffect` 액션을 호출.
 - **빈 상태 처리**: 목록 없음/로딩/에러 3상태 UI 제공.

### 2.4. `InfoPanel.vue`

- **역할**: 현재 선택된 효과의 상세 정보를 표시.
- **로직**:
    - `effectStore`의 `selectedEffect` 상태를 구독하여 화면에 정보를 렌더링.
    - 패널의 열고 닫힘 상태는 `uiStore`에서 관리.
 - **접근성**:
     - 패널 열림 시 포커스 트랩, `Esc`로 닫기.
