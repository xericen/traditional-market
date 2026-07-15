# 기업형 Git 협업 및 저장소 표준화

- **ID**: 002
- **날짜**: 2026-07-15
- **유형**: 설정 변경
- **리뷰 ID**: uddlzwlxpexabuuguidodcnxvnesjugn

## 작업 요약

공개 저장소를 지속적으로 운영할 수 있도록 실제 저장소를 `origin/main`으로 정렬하고 기존 샘플 이력을 별도 로컬 참조로 보존했다.
프로젝트 문서, 협업 규칙, 보안 정책, PR·Issue 템플릿, CODEOWNERS, Dependabot 및 GitHub Actions 품질검사를 추가했다.

## 원문 요청사항

```text
기업들이 git 사용하는 거 처럼 나도 그렇게 올려줘.
```

## 변경 파일 목록

- `README.md`: 서비스 목적·기능·구조·개발 및 협업 절차 중심으로 전면 개편
- `.gitignore`, `package.json`, `package-lock.json`: 재현 가능한 npm 설치와 검증 명령 구성
- `.editorconfig`, `.gitattributes`: 편집기·개행 표준 정의
- `CONTRIBUTING.md`, `SECURITY.md`: 브랜치·커밋·PR·보안 제보 정책 정의
- `scripts/check_python_syntax.py`: WIZ Python 소스 정적 구문 검사 추가
- `.github/CODEOWNERS`: 기본 코드 소유자 지정
- `.github/pull_request_template.md`: 리뷰·검증 체크리스트 추가
- `.github/ISSUE_TEMPLATE/*`: 버그·기능·보안 제보 경로 표준화
- `.github/dependabot.yml`: npm 및 GitHub Actions 정기 업데이트 설정
- `.github/workflows/quality.yml`: 잠금 의존성 설치, Python 구문, critical audit 자동 검사
- `devlog.md`, `devlog/2026-07-15/002-enterprise-git-workflow.md`: 작업 이력 기록

## 저장소 운영 변경

- 실제 프로젝트 원격을 `origin`으로 사용
- 기존 WIZ 샘플 원격은 `upstream`으로 보존
- 로컬 `main`이 `origin/main`을 직접 추적하도록 정렬
- 기존 샘플 기반 로컬 이력은 `sample-history` 브랜치로 보존

## 검증 결과

- WIZ 일반 빌드 성공
- `npm ci --ignore-scripts` 잠금 의존성 재설치 성공
- Python 소스 31개 정적 구문 검사 통과
- `package.json`, `package-lock.json` JSON 파싱 확인
- GitHub 설정 YAML 5개 lint 통과
- `git diff --check` 및 고신뢰 토큰·개인키 패턴 검사 통과
- `npm audit --audit-level=critical` 통과(critical 0건)

## 남은 리스크

- GitHub Branch protection과 필수 리뷰 규칙은 저장소 관리자 권한으로 별도 활성화해야 한다.
- 프로젝트 라이선스는 소유자의 정책 결정이 필요해 이번 변경에 포함하지 않았다.
- Angular 18 CLI 의존성에 npm audit 기준 25개 취약점(4 low, 7 moderate, 14 high)이 남아 있으며, 자동 수정은 Angular 22 메이저 업그레이드를 요구해 별도 호환성 검토가 필요하다.
