# 역할별 로그인·회원가입 및 전용 페이지 진입

- **ID**: 006
- **날짜**: 2026-07-10
- **유형**: 기능 추가
- **리뷰 ID**: hqitgritkgeaydqeemzbhowtgjaeaswg

## 작업 요약

홍천장날 모바일 디자인과 같은 초록·주황·크림색 스타일로 로그인과 소비자 회원가입 화면을 구성하고 기본 진입 경로를 로그인으로 변경했다.
관리자·상인·소비자 기본 계정을 bcrypt로 저장하고, 로그인 후 각 역할 전용 페이지로 이동하도록 서버 컨트롤러와 SPA 접근 가드를 연결했다.

## 원문 요청사항

```text
처음 https://market.seasonai.net/dashboard 들어가기 전에 동일한 스타일로 로그인 페이지, 회원가입 페이지 만들어줘. 총 3가지를 만들어주면 되는데, 관리자, 상인, 소비자 계정을 아이디 비번을 각각 관리자 -> [REDACTED] 상인 [REDACTED] 소비자 -> [REDACTED] 로 만들어줘. 관리자는 관리자 페이지 소비자는 소비자 페이지 상인은 상인 페이지 각각 들어갈 수 있게 해주면 됨.
```

## 변경 파일 목록

### 로그인·회원가입 UI와 진입 경로

- `src/app/page.access/app.json`
- `src/app/page.access/view.ts`
- `src/app/page.access/view.pug`
- `src/app/page.access/view.scss`
- `src/app/page.access/api.py`
  - `/access/login`, `/access/signup` 모드와 로그인·회원가입·세션 확인·로그아웃 API 구현
  - 일반 회원가입 역할을 소비자로 고정하고 성공 시 소비자 페이지로 이동
- `src/angular/app/app-routing.module.ts`
- `config/season.py`
  - 기본 진입 및 인증/PWA 시작 URL을 `/access/login`으로 설정

### 기본 계정과 인증 상태

- `src/model/db/user.py`
- `src/model/struct.py`
- `src/model/struct/user.py`
  - 역할별 기본 계정과 bcrypt 인증 구현(공개 저장소용 자격증명 마스킹)
  - 소비자 회원가입 검증 및 비밀번호 제외 응답 처리
- `src/portal/season/libs/src/auth.ts`
  - 공통 프론트엔드 인증 상태를 프로젝트 로그인 API의 DB·역할 검증 결과와 연결

### 역할별 접근 제어와 내비게이션

- `src/controller/user.py`
- `src/controller/admin.py`
- `src/controller/merchant.py`
- `src/controller/consumer.py`
  - 미로그인 사용자는 로그인으로, 다른 역할은 자신의 전용 홈으로 이동
- `src/app/layout.sidebar/view.ts`
- `src/app/component.nav.sidebar/view.ts`
- `src/app/component.nav.sidebar/view.pug`
  - SPA 내부 이동에서도 역할별 접근을 검사하고 역할별 메뉴·홈·로그아웃 제공
- `src/app/page.admin/app.json`
- `src/app/page.merchant/app.json`
- `src/app/page.members/app.json`
- `src/app/page.dashboard/app.json`
- `src/app/page.posts/app.json`
- `src/app/page.posts.item/app.json`
- `src/app/page.cart/app.json`
- `src/app/page.checkout/app.json`
- `src/app/page.orders/app.json`
- `src/app/page.mypage/app.json`
  - 페이지별 admin·merchant·consumer·user 컨트롤러 연결
- `src/app/page.merchant/view.pug`
  - 상인 화면에서 접근할 수 없던 소비자 화면 링크를 상인 주문 관리 링크로 교체
- `devlog.md`
- `devlog/2026-07-10/006-role-login-signup.md`
  - 작업 요약 및 상세 이력 기록

## 검증 결과

- WIZ 클린 빌드(`clean: true`) 성공
- 관리자·상인·소비자 로그인 API가 모두 200과 올바른 역할·목적지를 반환함을 확인
  - 관리자 → `/admin/overview`
  - 상인 → `/merchant/overview`
  - 소비자 → `/dashboard`
- 로그인 후 세션 확인 API가 각 역할을 정확히 반환하고, 로그아웃 후 미인증 상태로 전환됨을 확인
- 잘못된 관리자 비밀번호가 401로 거절됨을 확인
- 회원가입 성공 시 서버가 전달된 admin 역할을 무시하고 consumer 계정·세션을 생성한 뒤 `/dashboard`로 안내함을 확인
- 회원가입 검증용 계정은 확인 직후 관리자 API로 삭제하여 테스트 데이터를 정리
- 짧은 비밀번호 회원가입이 400으로 거절됨을 확인
- 미로그인 및 교차 역할 사용자의 소비자 보호 API 접근이 로그인 또는 해당 역할 홈으로 리다이렉트됨을 확인
- 대상 Python 9개 파일 AST 파싱 및 `git diff --check` 통과
- 클린 빌드 산출물에 상인 주문 관리 링크 반영 확인

## 남은 리스크

- 공개 저장소에는 기본 비밀번호를 포함하지 않으며, 배포 시 안전한 비밀 주입 절차가 필요하다.
- 로그인 시도 제한, 세션 강제 폐기·접속 감사 로그는 현재 최소 인증 범위에 포함되지 않았다.
- 빌드 의존성 감사에서 기존 npm 취약점 56건(낮음 7, 보통 17, 높음 32)이 보고되어 별도 업데이트 검토가 필요하다.
- 실행 환경에 Headless 브라우저가 없어 실제 클릭 기반 시각 회귀 테스트는 수행하지 못했다.
