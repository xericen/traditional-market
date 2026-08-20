# 홍천 전통시장 마켓버틀러

[![Quality](https://github.com/xericen/traditional-market/actions/workflows/quality.yml/badge.svg)](https://github.com/xericen/traditional-market/actions/workflows/quality.yml)

홍천 전통시장의 현장 상품을 온라인에서 탐색·주문하고, 상인과 마켓버틀러가 판매 운영을 지원하는 WIZ Framework 기반 웹 서비스입니다.

- 서비스: [market.seasonai.net](https://market.seasonai.net)
- 저장소: [xericen/traditional-market](https://github.com/xericen/traditional-market)
- 변경 이력: [devlog.md](devlog.md)
- 기여 방법: [CONTRIBUTING.md](CONTRIBUTING.md)
- 보안 정책: [SECURITY.md](SECURITY.md)

## 목차

- [서비스 목표](#서비스-목표)
- [현재 구현 범위](#현재-구현-범위)
- [사용자와 역할](#사용자와-역할)
- [핵심 이용 흐름](#핵심-이용-흐름)
- [화면 경로](#화면-경로)
- [기술 구성](#기술-구성)
- [아키텍처](#아키텍처)
- [프로젝트 구조](#프로젝트-구조)
- [데이터와 저장 방식](#데이터와-저장-방식)
- [로컬 개발 준비](#로컬-개발-준비)
- [환경변수와 초기 계정](#환경변수와-초기-계정)
- [빌드와 검증](#빌드와-검증)
- [협업 및 배포](#협업-및-배포)
- [보안 주의사항](#보안-주의사항)
- [알려진 제한사항](#알려진-제한사항)
- [문제 해결](#문제-해결)

## 서비스 목표

전통시장을 직접 방문하기 어려운 소비자에게 현장 상품을 소개하고 주문 흐름을
제공하면서, 디지털 운영 부담은 상인이 아닌 마켓버틀러가 맡는 구조를 지향합니다.

- 소비자는 시장 상품을 탐색하고 장바구니·배송·결제·주문 내역 흐름을 이용합니다.
- 상인은 장사에 집중하면서 판매 현황과 운영 일정을 확인합니다.
- 마켓버틀러는 점포 순회, 상품 촬영·등록, 주문 수거, 검수·포장, 배송 인계를 관리합니다.
- 총괄관리자는 운영 계정과 권한을 통제합니다.

## 현재 구현 범위

| 영역 | 구현 상태 | 저장 방식 |
| --- | --- | --- |
| 로그인·로그아웃·세션 | 구현 | 서버 세션 + 사용자 DB |
| 소비자·상인 회원가입 | 구현 | 사용자 DB |
| 마켓버틀러 신청·승인 | 구현 | 승인 전 `butler_pending`, 승인 후 `market_butler` |
| 역할 기반 접근 제어 | 구현 | 서버 Controller + RBAC 권한 카탈로그 |
| 관리자 계정 관리 | 구현 | 사용자 DB, 총괄관리자 전용 |
| 상품 탐색·상세·장바구니 | UI 프로토타입 | 카탈로그는 프런트 데이터, 장바구니는 브라우저 `localStorage` |
| 배송·결제·주문 내역 | UI 프로토타입 | 브라우저 `localStorage` |
| 상인 현황판 | UI 프로토타입 | 프런트 데모 데이터 |
| 버틀러 운영 콘솔 | UI 프로토타입 + 화면 권한 제어 | 프런트 데모 데이터 |
| 게시물 Portal 패키지 | 포함 | Peewee ORM 구조 제공 |

> 계정·세션·RBAC는 서버에 연결되어 있습니다. 상품, 결제, 배송, 버틀러 운영
> 데이터 일부는 아직 실제 외부 결제·배송·상품 API가 아닌 데모 또는 브라우저
> 로컬 데이터입니다.

## 사용자와 역할

### 서비스 역할

| 역할 코드 | 표시 이름 | 주요 범위 | 기본 진입 경로 |
| --- | --- | --- | --- |
| `consumer` | 소비자 | 상품 탐색, 장바구니, 주문, 마이페이지 | `/dashboard` |
| `merchant` | 상인 | 상인 현황판, 판매·운영 일정 확인 | `/merchant/overview` |
| `butler_pending` | 마켓버틀러 승인 대기 | 운영 권한 없음 | 로그인 차단 및 승인 안내 |
| `market_butler` | 마켓버틀러 | 상품·재고·주문·배송 현장 운영 | `/admin/overview` |
| `product_manager` | 상품관리자 | 상품·콘텐츠 운영, 주문·통계 조회 | `/admin/overview` |
| `order_manager` | 주문관리자 | 주문·배송·문의·필요 재고 관리 | `/admin/overview` |
| `super_admin` | 총괄관리자 | 전체 기능 및 관리자 계정 관리 | `/admin/overview` |

### 버틀러 RBAC 권한

권한 정책의 단일 진실 공급원은 `src/model/struct/rbac.py`입니다.

| 기능 | 총괄관리자 | 상품관리자 | 주문관리자 | 마켓버틀러 |
| --- | :---: | :---: | :---: | :---: |
| 관리자 계정 관리 | O | - | - | - |
| 시스템 정책·백업·로그 | O | - | - | - |
| 이벤트 승인·공지 작성 | O | - | - | - |
| 상품 검토·등록·수정 | O | O | - | O |
| 상품 삭제 | O | O | - | - |
| 가격 수정 | O | O | - | O |
| 재고 수정 | O | O | O | O |
| 숏폼 등록 | O | O | - | O |
| 배너 등록 | O | O | - | - |
| 주문 조회 | O | O | O | O |
| 주문 취소 승인 | O | - | O | - |
| 배송 상태 변경 | O | - | O | O |
| 고객 문의 답변 | O | - | O | O |
| 판매 통계 조회 | O | O | O | O |
| 판매 통계 관리 | O | - | - | - |

화면에서 버튼이나 탭을 숨기는 것만으로 권한을 판단하지 않습니다. 계정 관리 API는
`admin.accounts.manage` 권한을 서버에서 다시 검사하며, 보호 페이지는 역할별
Controller를 거칩니다. 실제 상품·주문 API를 추가할 때도 각 함수에서 동일한 서버
권한 검사가 필요합니다.

## 핵심 이용 흐름

### 소비자

1. `/access/signup`에서 소비자 계정으로 가입하거나 로그인합니다.
2. `/dashboard`와 `/posts`에서 상품을 탐색합니다.
3. 상품을 장바구니에 담고 `/cart`에서 수량을 조정합니다.
4. `/checkout`에서 배송 정보와 결제 단계를 진행합니다.
5. 완료된 주문을 `/orders`에서 확인합니다.

### 상인

1. 상인 계정으로 가입하거나 로그인합니다.
2. `/merchant/overview`에서 판매 현황, 판매 상품, 운영 일정을 확인합니다.
3. 필요한 경우 마켓버틀러 지원 흐름을 이용합니다.

### 마켓버틀러

1. 회원가입에서 마켓버틀러를 선택하면 `butler_pending` 계정으로 생성됩니다.
2. 승인 대기 상태에서는 운영 화면에 로그인할 수 없습니다.
3. 총괄관리자가 `/members`에서 신청 계정을 승인합니다.
4. 승인 후 `/admin/overview`에서 부여된 권한 범위의 운영 탭을 사용합니다.

### 총괄관리자

1. `/members`에서 계정을 생성·수정·삭제하거나 버틀러 신청을 승인합니다.
2. 자기 역할 변경, 자기 계정 삭제, 마지막 총괄관리자 제거는 서버에서 차단됩니다.
3. `/admin/:tab?`에서 전체 운영 기능을 관리합니다.

## 화면 경로

| 경로 | 대상 | 설명 |
| --- | --- | --- |
| `/access/login` | 비로그인 사용자 | 로그인 |
| `/access/signup` | 비로그인 사용자 | 소비자·상인·마켓버틀러 회원가입 |
| `/dashboard` | 소비자 | 시장 홈과 추천 상품 |
| `/posts` | 소비자 | 상품 목록 |
| `/posts/:id/:tab?` | 소비자 | 상품 상세 |
| `/cart` | 소비자 | 장바구니 |
| `/checkout/:step?` | 소비자 | 배송·쿠폰·결제 단계 |
| `/orders` | 소비자 | 주문 내역 |
| `/guide/:tab?` | 소비자 | 이용 안내 |
| `/merchant/overview` | 상인 | 상인 현황판 |
| `/admin/overview` | 운영 인력 | 판매 통계와 오늘 할 일 |
| `/admin/products` | 권한 보유 운영 인력 | 상품·가격·재고 관리 |
| `/admin/orders` | 권한 보유 운영 인력 | 주문 조회 |
| `/admin/inspection` | 권한 보유 운영 인력 | 검수·고객 응대 |
| `/admin/dispatch` | 권한 보유 운영 인력 | 배송 상태 관리 |
| `/members` | 총괄관리자 | 사용자·운영 계정 및 버틀러 승인 관리 |
| `/mypage` | 로그인 사용자 | 프로필·비밀번호·로그아웃 |

경로 파라미터만 변경될 때 Angular가 같은 컴포넌트를 재사용하므로, 탭 페이지는 Router 이벤트를 구독해 상태를 갱신합니다.

## 기술 구성

| 계층 | 기술 |
| --- | --- |
| Framework | WIZ Framework |
| Frontend | Angular 18, TypeScript, Pug, SCSS |
| Backend | Python App API, WIZ Controller |
| Data | Peewee ORM |
| Database | SQLite 샘플 설정, MySQL 운영 설정 지원 |
| Session | Season Portal session model |
| Package | `season` 공통 패키지, `post` 도메인 패키지 |
| CI | GitHub Actions |
| Dependency management | npm lockfile + Dependabot |

## 아키텍처

### 요청 처리 흐름

```text
브라우저
  └─ Angular Page / Layout / Component
       └─ wiz.call("function", form data)
            └─ App api.py
                 └─ Root Struct
                      ├─ User / RBAC Struct
                      └─ Portal package Struct
                           └─ Peewee DB Model
```

페이지 접근 전에는 Controller 체인이 먼저 실행됩니다.

```text
base
  └─ user                 로그인 및 세션·역할 갱신
       ├─ consumer        소비자 전용
       ├─ merchant        상인 전용
       ├─ admin           운영 인력 공통
       └─ superadmin      admin.accounts.manage 권한 필수
```

### Struct와 Package

- `src/model/struct.py`는 프로젝트 Root Struct입니다.
- `struct.user`는 사용자 인증·가입·계정 관리 로직을 제공합니다.
- `struct.rbac`는 역할 정규화, 표시 이름, 권한 조회를 제공합니다.
- 알 수 없는 속성은 `portal/{name}/struct`로 위임되어 Portal 패키지를 재사용합니다.
- `src/portal/season/`은 ORM, 세션, 공통 Service와 기반 기능을 제공합니다.
- `src/portal/post/`는 게시물 DB·Struct·컴포넌트를 패키지로 분리합니다.

## 프로젝트 구조

```text
.
├── .github/
│   ├── workflows/quality.yml       # push/PR 품질검사
│   ├── dependabot.yml              # 의존성 업데이트
│   ├── CODEOWNERS                  # 기본 코드 소유자
│   └── ISSUE_TEMPLATE/             # Issue 템플릿
├── config-sample/
│   └── database.py                 # 비밀값 없는 SQLite 예시
├── devlog/
│   └── YYYY-MM-DD/                 # 작업 단위 상세 이력
├── scripts/
│   └── check_python_syntax.py      # Python 정적 구문 검사
├── src/
│   ├── angular/                    # Angular 라우팅·전역 스타일
│   ├── app/
│   │   ├── component.nav.sidebar/  # 역할 기반 하단 내비게이션
│   │   ├── layout.empty/           # 로그인·회원가입 레이아웃
│   │   ├── layout.sidebar/         # 인증 화면 공통 레이아웃
│   │   ├── page.access/            # 인증·회원가입 API/UI
│   │   ├── page.admin/             # 버틀러 운영 콘솔
│   │   ├── page.members/           # 총괄관리자 계정 관리
│   │   ├── page.merchant/          # 상인 현황판
│   │   └── page.*/                 # 소비자 기능 페이지
│   ├── controller/                 # 역할별 페이지 접근 제어
│   ├── model/
│   │   ├── db/user.py              # 사용자 테이블
│   │   ├── struct/user.py          # 사용자 비즈니스 로직
│   │   ├── struct/rbac.py          # RBAC 정책
│   │   └── struct.py               # Root Struct
│   └── portal/
│       ├── season/                  # WIZ 공통 기반 패키지
│       └── post/                    # 게시물 패키지
├── CONTRIBUTING.md
├── SECURITY.md
├── devlog.md
├── package.json
└── package-lock.json
```

WIZ 빌드가 생성하는 `build/`, `bundle/`, 로컬 `config/`, `node_modules/`, 캐시는 Git에서 제외됩니다.

## 데이터와 저장 방식

### 서버 저장

사용자 테이블은 `base` namespace를 사용합니다.

| 필드 | 설명 |
| --- | --- |
| `id` | 로그인 식별자, 최대 32자 |
| `email` | 고유 이메일 |
| `password` | bcrypt 해시 |
| `name` | 표시 이름 |
| `mobile` | 연락처 |
| `role` | 역할 코드 |
| `created`, `updated` | 생성·수정 시각 |

비밀번호는 응답 데이터에서 제거되며 평문으로 DB에 저장하지 않습니다.

### 브라우저 저장

현재 소비자 주문 프로토타입은 아래 키를 사용합니다.

| localStorage 키 | 용도 |
| --- | --- |
| `market-cart` | 장바구니 |
| `market-delivery` | 배송지 초안 |
| `market-checkout` | 결제 단계 초안 |
| `market-orders` | 완료 주문 내역 |

브라우저 저장소를 지우거나 다른 브라우저·기기를 사용하면 해당 데이터가 공유되지
않습니다. 운영 전에는 서버 주문 DB와 결제·배송 API로 교체해야 합니다.

## 로컬 개발 준비

### 요구사항

- WIZ Framework Workspace
- Node.js 20.11 이상
- npm
- Python 3
- SQLite 또는 MySQL

### 저장소 준비

```bash
git clone https://github.com/xericen/traditional-market.git
cd traditional-market
npm ci
cp config-sample/database.py config/database.py
npm run check:python
```

`config/database.py`는 Git에서 제외됩니다. 샘플 설정은 다음 namespace를 SQLite로 구성합니다.

- `base` → 사용자 데이터
- `post` → 게시물·댓글 데이터

운영 MySQL을 사용할 때는 WIZ/Season ORM이 요구하는 형식으로
`config/database.py`를 별도 구성하고, 접속정보를 저장소에 커밋하지 마세요.

### WIZ 실행

1. WIZ Workspace에서 이 디렉터리를 프로젝트로 등록하거나 선택합니다.
2. 현재 프로젝트가 `main`인지 확인합니다.
3. WIZ 프로젝트 빌드를 실행합니다.
4. 서비스의 `/access/login` 또는 `/access/signup`으로 접속합니다.

이 저장소의 `npm` 명령은 정적 검사와 의존성 관리용입니다. WIZ 서비스 실행 자체는 WIZ 개발환경에서 수행합니다.

## 환경변수와 초기 계정

초기 계정이 DB에 없고 대응하는 환경변수가 설정된 경우에만 계정이 생성됩니다.

| 환경변수 | 기본 ID | 역할 |
| --- | --- | --- |
| `MARKET_ADMIN_PASSWORD` | `admin` | 총괄관리자 |
| `MARKET_ADMIN2_PASSWORD` | `admin2` | 상품관리자 |
| `MARKET_ADMIN3_PASSWORD` | `admin3` | 주문관리자 |
| `MARKET_MERCHANT_PASSWORD` | `merchant` | 상인 |
| `MARKET_CONSUMER_PASSWORD` | `consumer` | 소비자 |

- 실제 비밀번호는 저장소에 포함하지 않습니다.
- 환경변수가 없으면 해당 초기 계정을 자동 생성하지 않습니다.
- 최초 생성 후 환경변수를 제거하고 마이페이지에서 강한 비밀번호로 변경하세요.
- 운영 환경에서는 Secret Manager 또는 배포 플랫폼의 비밀 저장소를 사용하세요.

공개 회원가입은 `consumer`, `merchant`, `market_butler`만 허용합니다.
관리자 역할은 공개 회원가입으로 생성할 수 없습니다.

## 빌드와 검증

### 로컬 정적 검사

```bash
npm ci --ignore-scripts
npm run check:python
npm run audit:dependencies
git diff --check
```

| 명령 | 검사 내용 |
| --- | --- |
| `npm ci --ignore-scripts` | lockfile 기반 재현 가능한 의존성 설치 |
| `npm run check:python` | `src/` 아래 Python 파일 구문 검사 |
| `npm run audit:dependencies` | critical 수준 npm 취약점 검사 |
| `git diff --check` | trailing whitespace 등 패치 오류 검사 |

### WIZ 빌드 기준

- 기존 함수 내부 수정과 UI·문서 변경: 일반 빌드
- App API 함수 추가·삭제·이름 변경: 클린 빌드
- 새 Controller·Model 연결 또는 캐시 문제가 의심되는 변경: 클린 빌드 권장
- `build/`와 `bundle/`은 생성 산출물이므로 직접 수정하지 않습니다.

### CI

`.github/workflows/quality.yml`은 `main` push와 Pull Request에서 다음을 실행합니다.

1. Node.js 20.11 및 Python 3.12 설정
2. 잠금 의존성 설치
3. Python 구문 검사
4. critical npm 취약점 검사

## 협업 및 배포

### 브랜치와 커밋

- 최신 `main`에서 짧은 작업 브랜치를 만듭니다.
- `feat/`, `fix/`, `docs/`, `refactor/`, `chore/` 접두사를 권장합니다.
- Conventional Commits 형식으로 커밋합니다.

```text
feat: add merchant order status filter
fix: prevent unauthorized admin navigation
docs: expand project setup guide
```

### Pull Request 완료 기준

- WIZ 빌드 성공
- 자동 품질검사 통과
- 권한과 민감정보 노출 검토
- 화면 변경 시 스크린샷 첨부
- `devlog.md` 요약 행 및 대응하는 상세 devlog 작성
- 코드 소유자 리뷰 후 병합

자세한 내용은 [CONTRIBUTING.md](CONTRIBUTING.md)를 확인하세요.

## 보안 주의사항

- `config/`, 환경변수, 세션, 비밀번호, API 키, DB 접속정보를 커밋하지 않습니다.
- 사용자 비밀번호는 bcrypt로 저장하고 API 응답에서 제거합니다.
- 관리자 기능은 UI 표시 여부와 별개로 서버에서 권한을 다시 검사합니다.
- 마켓버틀러 신청자는 승인 전 운영 권한을 받지 않습니다.
- 총괄관리자 자기 삭제와 마지막 총괄관리자 제거를 차단합니다.
- 취약점은 공개 Issue가 아니라 [보안 정책](SECURITY.md)의 비공개 경로로 제보합니다.

## 알려진 제한사항

- 상품·주문·결제·배송의 일부 데이터는 데모 또는 브라우저 로컬 상태입니다.
- 실제 결제 승인, 주문 영속화, 배송사 연동, 재고 동기화가 아직 필요합니다.
- 운영 콘솔의 상품·주문 데이터가 서버 API로 전환될 때 모든 변경 API에 RBAC 검사를 추가해야 합니다.
- 연락처 본인 확인, CAPTCHA, 가입 시도 제한은 아직 적용되지 않았습니다.
- npm audit 결과는 시점에 따라 달라질 수 있으며 Angular 메이저 업그레이드가 필요한 항목은 별도 호환성 검토가 필요합니다.
- 저장소 라이선스는 아직 명시되지 않았습니다.

## 문제 해결

### 초기 관리자 계정이 생성되지 않음

대응하는 `MARKET_*_PASSWORD` 환경변수가 설정됐는지와 `base` DB 연결을
확인하세요. 환경변수가 없으면 기본 계정은 생성되지 않습니다.

### 마켓버틀러 신청 계정으로 로그인할 수 없음

정상적인 승인 대기 동작입니다. 총괄관리자가 `/members`에서 해당 계정을 승인해야 합니다.

### 장바구니 또는 주문 내역이 다른 브라우저에서 보이지 않음

현재 해당 데이터는 브라우저 `localStorage`에 저장됩니다. 브라우저·프로필·기기 간에는 공유되지 않습니다.

### 새 App API 함수가 404를 반환함

새 함수 추가·삭제·이름 변경 후에는 WIZ 클린 빌드를 수행하세요.

### DB 접속정보 파일이 Git에 나타나지 않음

`config/`는 의도적으로 Git에서 제외됩니다. 배포 환경마다 안전한 비밀 주입 방식으로 별도 구성하세요.

### 페이지가 다른 역할 화면으로 이동함

Controller가 현재 DB 역할을 다시 읽고 허용되지 않은 페이지 접근을 역할별 홈으로
리다이렉트합니다. 사용자 역할과 `src/model/struct/rbac.py` 권한을 확인하세요.

## 변경 이력

작업 단위 변경 이력은 [devlog.md](devlog.md)에 기록합니다. 각 변경은 날짜별 상세
문서에서 원문 요청, 변경 파일, 검증 결과와 남은 리스크를 확인할 수 있습니다.
