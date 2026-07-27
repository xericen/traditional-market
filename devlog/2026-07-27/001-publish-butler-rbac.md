# 버틀러 RBAC 및 가입 승인 변경 배포

- **ID**: 001
- **날짜**: 2026-07-27
- **유형**: 배포
- **리뷰 ID**: uddlzwlxpexabuuguidodcnxvnesjugn

## 작업 요약

누적된 버틀러 역할 기반 권한, 버틀러 회원가입·승인, 역할별 관리자 계정과 관련 화면 변경을 검증해 GitHub에 배포한다.
공개 devlog에 남아 있던 예측 가능한 로그인 조합은 커밋 전에 마스킹한다.

## 원문 요청사항

```text
버틀러 작업한 거 커밋하고푸시해줘
```

## 변경 파일 목록

- `src/model/struct/rbac.py`, `src/model/struct.py`, `src/model/struct/user.py`: 버틀러 역할·권한 카탈로그와 계정 승인·관리 로직
- `src/controller/*.py`: 총괄관리자와 역할별 접근 제어·목적지 연결
- `src/app/page.access/*`: 버틀러 가입·승인 대기·역할 세션 처리
- `src/app/page.admin/*`, `src/app/page.members/*`: 권한별 운영 화면과 총괄관리자 전용 계정 관리
- `src/app/component.nav.sidebar/*`, `src/app/layout.sidebar/*`, `src/app/page.mypage/*`: 권한 기반 메뉴·레이아웃·역할 표시
- `src/app/page.dashboard/view.pug`: 홈 포스터 문구 수정
- `README.md`: 역할별 초기 계정 환경변수 문서화
- `devlog.md`, `devlog/2026-07-22/*`, `devlog/2026-07-24/*`, `devlog/2026-07-27/001-publish-butler-rbac.md`: 누적 작업 및 배포 이력 기록

## 검증 결과

- WIZ 클린 빌드 성공
- `npm run check:python`: Python 33개 파일 구문 검사 통과
- RBAC 역할별 핵심 허용·차단 매트릭스 assertion 통과
- `git diff --check` 및 고신뢰 토큰·개인키·고정 로그인 조합 검사 통과
- 공개 devlog의 예측 가능한 로그인 조합 마스킹 확인

## 남은 리스크

- 운영 화면 일부는 프런트엔드 데모 데이터이므로 영속 API 연결 시 서버 RBAC 검사를 동일하게 적용해야 한다.
- 운영 관리자 계정은 강한 비밀번호와 별도 비밀 관리 절차를 사용해야 한다.
- npm audit 기준 33개 취약점(4 low, 7 moderate, 21 high, 1 critical)이 남아 있다. critical `tar` 항목의 자동 수정은 Angular CLI 22 메이저 업그레이드를 요구하므로 별도 호환성 검토가 필요하다.
