# Three.js 효과 개발 가이드

이 디렉토리는 Three.js 효과 모듈을 개발하고 관리하는 가이드 문서를 포함합니다.

## 📚 문서 목록

- **[빠른 시작](./QUICK_START.md)** - 5분 안에 효과 만들기
- **[개발자 도구](./DEVELOPER_TOOLS.md)** - 개발 환경 설정 및 도구 사용법
- **[상세 가이드](./EFFECTS_DEVELOPMENT.md)** - 완전한 효과 개발 가이드

## 🚀 빠른 링크

- [효과 타입 정의](../../frontend/src/effects/types.ts)
- [예제 효과](../../frontend/src/effects/examples/gnParticles.ts)
- [템플릿](../../frontend/src/effects/examples/template.ts)
- [효과 로더](../../frontend/src/effects/loader.ts)

## 📋 개발 워크플로우

1. **효과 생성**: `npm run create-effect <name>`
2. **효과 구현**: `index.ts` 파일 편집
3. **효과 검증**: `npm run validate-effect`
4. **개발 서버**: `npm run dev:effect`
5. **테스트**: 앱에서 효과 선택 및 테스트

## 🔗 관련 문서

- [Three.js 공식 문서](https://threejs.org/docs/)
- [Three.js 예제](https://threejs.org/examples/)
- [프로젝트 README](../../README.md)

