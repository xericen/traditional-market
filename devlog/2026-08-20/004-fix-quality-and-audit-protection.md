# GitHub Quality 보안검사 복구 및 브랜치 보호 진단

- **ID**: 004
- **날짜**: 2026-08-20
- **유형**: 설정 변경
- **리뷰 ID**: uddlzwlxpexabuuguidodcnxvnesjugn

## 작업 요약

GitHub Actions의 `Audit critical dependencies` 실패 원인을 추적해 루트 개발 도구의
critical `tar` 취약점을 해소했다. Angular CLI 22.1.5의 실행 조건에 맞춰 루트
Node.js 요구 버전과 Quality 워크플로 런타임을 Node.js 24.15로 함께 갱신했다.

GitHub 공개 API에서 `main`이 아직 보호되지 않았고 Ruleset이 없음을 확인했다.
현재 Deploy key는 코드 읽기·쓰기만 가능하고 저장소 설정 권한은 없어 Ruleset 생성은
관리자 인증이 필요한 상태다.

## 원문 요청사항

<!-- markdownlint-disable MD013 -->

```text
자꾸 푸시가 Your main branch isn't protected
Protect this branch from force pushing or deletion, or require status checks before merging. View documentation.
 실패했다고 하는데 이부분 어떻게 해?

해줘
```

<!-- markdownlint-enable MD013 -->

## 변경 파일 목록

- `package.json`
  - 루트 검사 도구 `@angular/cli`을 22.1.5로 고정
  - Node.js 요구 버전을 24.15 이상으로 갱신
- `package-lock.json`
  - 변경된 도구 체인과 무결성 정보를 잠금
- `.github/workflows/quality.yml`
  - Quality 작업의 Node.js 버전을 24.15로 갱신
- `devlog.md`
  - 본 작업 요약 행 추가
- `devlog/2026-08-20/004-fix-quality-and-audit-protection.md`
  - 원인, 변경, 검증과 차단 항목 기록

## 검증 결과

- `npm ci --ignore-scripts` 성공, 175개 패키지 설치 재현
- `npm audit --audit-level=critical` 취약점 0건 통과
- `npm run check:python`: Python 33개 파일 구문 검사 통과
- package metadata에서 Angular CLI 22.1.5와 Node.js 24.15 조건 확인
- WIZ 일반 빌드 성공
- `git diff --check` 통과
- GitHub 공개 API에서 `main.protected=false`, Ruleset 0개 확인

## 남은 리스크

- GitHub Branch Ruleset 생성은 repository administration 권한이 필요하다. 현재 환경은
  Deploy key만 있어 저장소 설정을 변경할 수 없다.
- WIZ가 생성하는 실제 Angular 18 빌드 프로젝트의 의존성은 루트 Quality audit 범위와
  별도이므로 추후 생성 빌드 의존성에 대한 보안 업그레이드 계획이 필요하다.
