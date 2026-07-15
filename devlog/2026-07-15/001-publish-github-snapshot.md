# 공개 저장소 게시 및 민감정보 정리

- **ID**: 001
- **날짜**: 2026-07-15
- **유형**: 설정 변경
- **리뷰 ID**: uddlzwlxpexabuuguidodcnxvnesjugn

## 작업 요약

현재 WIZ 프로젝트에서 지금까지 누적된 소스·화면·devlog 변경을 공개 GitHub 저장소에 게시할 수 있도록 정리했다.
고정 기본 비밀번호와 계정 자격증명은 저장소에서 제거하고, 초기 계정은 런타임 환경변수로만 생성되도록 변경했다.

## 원문 요청사항

```text
https://github.com/xericen/traditional-market 여기에 지금까지 너랑 대화하면서 한것들 전부 (중요한 부분 가려서) 커밋한 후에, 푸시해줘
```

## 변경 파일 목록

- `README.md`
  - 공개 데모 계정값을 제거하고 초기 계정용 환경변수 안내로 교체
- `src/model/struct/user.py`
  - 고정 bcrypt 해시를 제거하고 `MARKET_*_PASSWORD` 환경변수가 있을 때만 초기 계정을 생성하도록 변경
- `devlog/2026-07-10/006-role-login-signup.md`
- `devlog/2026-07-10/007-merchant-consumer-signup.md`
  - 과거 요청·검증 기록에 포함된 예측 가능한 자격증명을 마스킹
- `devlog.md`
- `devlog/2026-07-15/001-publish-github-snapshot.md`
  - 이번 공개 저장소 게시 작업의 요약과 상세 이력 기록
- `src/angular/`, `src/app/`, `src/controller/`, `src/model/`, `src/portal/`
  - 현재 Git 작업 트리에 누적된 마켓버틀러 기능·UI·인증·역할별 화면 변경 전체 포함
- `devlog/2026-07-10/`, `devlog/2026-07-13/`
  - 이전 세션의 작업 상세 이력 전체 포함

## 검증 결과

- 현재 트리와 Git 이력에서 고신뢰 토큰·개인키 패턴이 검출되지 않음을 확인
- Git 제외 대상인 `config/`, 빌드 산출물, 캐시, 개발환경 파일이 커밋 대상에서 제외됨을 확인
- 자격증명 마스킹 후 WIZ 클린 빌드 성공
- 변경·추가된 Python 파일 AST 검사 및 `git diff --check` 통과
- 샘플 저장소의 과거 이력을 제외한 공개용 루트 커밋 생성 완료
- 대상 GitHub 저장소의 `main` 브랜치 푸시를 시도했으나, 실행 환경에 HTTPS 자격증명·GitHub CLI·SSH 키가 없어 인증 단계에서 중단됨

## 남은 리스크

- 새 배포 환경에서는 초기 계정 생성 전에 `MARKET_ADMIN_PASSWORD`, `MARKET_MERCHANT_PASSWORD`, `MARKET_CONSUMER_PASSWORD`를 안전한 비밀 관리 수단으로 주입해야 한다.
- 공개 저장소 게시 전 자동화된 보안 스캐너가 아닌 정규식 기반 검사를 사용하므로, 의미 기반 민감정보 누락 가능성은 완전히 제거할 수 없다.
- WIZ 빌드는 성공했지만 npm audit 기준 56개 취약점(7 low, 17 moderate, 32 high)이 남아 있다.
- GitHub 인증이 설정되기 전까지 대상 원격 저장소에는 커밋이 게시되지 않는다.
