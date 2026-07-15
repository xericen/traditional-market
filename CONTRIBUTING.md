# 기여 가이드

## 작업 흐름

1. 최신 `main`에서 작업 브랜치를 만듭니다.
2. 한 브랜치에는 하나의 논리적 변경만 포함합니다.
3. 검증과 devlog를 완료한 뒤 Pull Request를 생성합니다.
4. 자동 검사와 리뷰를 통과하면 squash 또는 rebase 방식으로 병합합니다.

권장 브랜치 접두사:

- `feat/`: 기능 추가
- `fix/`: 버그 수정
- `docs/`: 문서 변경
- `refactor/`: 동작을 유지하는 구조 개선
- `chore/`: 설정·도구 정비

## 커밋 규칙

Conventional Commits 형식을 사용합니다.

```text
feat: add merchant order status filter
fix: prevent unauthorized admin navigation
docs: update local setup guide
```

커밋에는 비밀값, 런타임 `config/`, 빌드 산출물, 캐시를 포함하지 않습니다.

## 변경 전 확인

- 현재 WIZ 프로젝트가 `main`인지 확인합니다.
- `src/portal/` 패키지를 수정하기 전 해당 패키지의 `README.md`를 확인합니다.
- 새 API 함수 추가·삭제·이름 변경 시 WIZ 클린 빌드를 수행합니다.

## 제출 전 확인

```bash
npm ci
npm run check:python
npm run audit:dependencies
```

- WIZ 빌드가 성공해야 합니다.
- `git diff --check`가 통과해야 합니다.
- `devlog.md` 요약 행과 대응하는 상세 devlog가 있어야 합니다.
- 사용자 입력, 권한 검증, 응답 데이터의 민감정보 노출을 확인합니다.
