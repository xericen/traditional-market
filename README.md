# 홍천 전통시장 마켓버틀러

[![Quality](https://github.com/xericen/traditional-market/actions/workflows/quality.yml/badge.svg)](https://github.com/xericen/traditional-market/actions/workflows/quality.yml)

홍천 전통시장의 상품을 온라인에서 탐색·주문하고, 상인과 마켓버틀러가 판매 운영을 지원하는 WIZ Framework 기반 웹 서비스입니다.

## 주요 기능

- 소비자: 상품 탐색, 장바구니, 주문·결제 흐름, 주문 내역, 이용 안내
- 상인: 판매 현황과 운영 일정 확인, 마켓버틀러 지원 요청
- 관리자·마켓버틀러: 상품·주문·운영 단계 통합 관리
- 공통: 역할 기반 로그인·회원가입, 프로필 및 비밀번호 관리

## 기술 구성

- WIZ Framework
- Angular 18 / TypeScript / Pug / SCSS
- Python / Peewee ORM
- MySQL 운영 설정, SQLite 샘플 설정

## 프로젝트 구조

```text
src/
├── angular/                 # Angular 빌드 설정과 전역 스타일
├── app/                     # Page, Layout, Component 앱
├── controller/              # 인증·역할별 접근 제어
├── model/                   # 프로젝트 DB Model과 Struct
└── portal/                  # 재사용 가능한 WIZ 패키지
config-sample/               # 비밀값이 없는 설정 예시
devlog/                      # 작업 단위 상세 변경 이력
```

## 주요 경로

| 경로 | 역할 |
|---|---|
| `/access/login` | 로그인 |
| `/access/signup` | 회원가입 |
| `/dashboard` | 소비자 홈 |
| `/posts` | 시장 상품 목록 |
| `/cart` | 장바구니 |
| `/checkout` | 주문·결제 |
| `/orders` | 주문 내역 |
| `/merchant/overview` | 상인 현황판 |
| `/admin/overview` | 마켓버틀러 운영 화면 |

## 개발 환경

이 저장소는 WIZ 프로젝트 디렉터리입니다. WIZ Workspace에서 프로젝트를 선택해 빌드·실행합니다.

```bash
cp config-sample/database.py config/database.py
npm ci
npm run check:python
```

`config/`, 빌드 산출물, 캐시와 로컬 개발환경 파일은 Git에서 제외됩니다. 운영 DB 접속정보 등 비밀값은 저장소에 커밋하지 않습니다.

## 초기 계정 보안 설정

초기 계정이 없는 환경에서만 아래 환경변수로 비밀번호를 주입합니다. 최초 생성 후 환경변수를 제거하고 비밀번호를 변경하세요.

- `MARKET_ADMIN_PASSWORD`
- `MARKET_MERCHANT_PASSWORD`
- `MARKET_CONSUMER_PASSWORD`

## 협업 방식

- 변경은 `main`에서 분기한 짧은 작업 브랜치에서 진행합니다.
- Conventional Commits 형식으로 커밋합니다.
- Pull Request에서 자동 품질검사와 리뷰를 통과한 뒤 병합합니다.
- 모든 WIZ 프로젝트 파일 변경은 `devlog.md`와 상세 devlog를 함께 갱신합니다.

자세한 규칙은 [CONTRIBUTING.md](CONTRIBUTING.md), 보안 제보는 [SECURITY.md](SECURITY.md)를 확인하세요.

## 변경 이력

작업 단위 변경 이력은 [devlog.md](devlog.md)에 기록합니다.
