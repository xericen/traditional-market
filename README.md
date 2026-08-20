# 홍천 전통시장 마켓버틀러

[![Quality](https://github.com/xericen/traditional-market/actions/workflows/quality.yml/badge.svg)](https://github.com/xericen/traditional-market/actions/workflows/quality.yml)

> 전통시장 상인은 장사에 집중하고, 디지털 운영은 마켓버틀러가 맡습니다.

홍천 전통시장의 현장 상품을 온라인으로 연결하는 멀티 역할 커머스
프로토타입입니다. 소비자의 상품 탐색과 주문 경험뿐 아니라 상인, 마켓버틀러,
운영 관리자의 실제 업무 흐름까지 하나의 서비스로 설계했습니다.

**[서비스 둘러보기](https://market.seasonai.net) ·
[노션 서비스 정리](https://app.notion.com/p/3c26574daa5d804eaf4ccc5d7ad939cf?source=copy_link) ·
[GitHub 저장소](https://github.com/xericen/traditional-market) ·
[변경 이력](devlog.md)**

## 프로젝트 한눈에 보기

| 항목 | 내용 |
| --- | --- |
| 프로젝트 유형 | 전통시장 O2O 커머스 웹 서비스 |
| 핵심 사용자 | 소비자, 상인, 마켓버틀러, 운영 관리자 |
| 핵심 과제 | 상인의 디지털 업무 부담 없이 온라인 판매 운영 |
| 주요 구현 | 인증, 승인 워크플로, RBAC, 역할별 화면, 주문 UX |
| 기술 스택 | WIZ, Angular 18, TypeScript, Python, Peewee |
| 현재 단계 | 인증·권한은 서버 연동, 커머스·운영 일부는 UI 프로토타입 |

### 숫자로 보는 구현

- **15개 WIZ Source App**으로 소비자·상인·운영 화면 분리
- **7개 사용자 상태·역할**과 **20개 세부 권한** 모델링
- **4개 운영 역할**에 서로 다른 상품·주문·통계 권한 적용
- GitHub Actions, Dependabot, CODEOWNERS, PR·Issue 템플릿 구성

## 문제 정의

전통시장의 온라인 전환은 상품 페이지를 만드는 것만으로 끝나지 않습니다.

- 상인은 영업 중 상품 촬영, 재고 입력, 주문 확인까지 병행하기 어렵습니다.
- 소비자는 현장 상품의 상태와 구매 과정을 신뢰할 정보가 필요합니다.
- 주문이 들어오면 점포별 수거, 검수, 포장, 배송 인계가 이어져야 합니다.
- 운영 인력이 늘어나면 업무에 맞는 권한 분리와 계정 통제가 필요합니다.

이 프로젝트는 상인에게 새로운 관리 업무를 넘기는 대신, **마켓버틀러가 현장과
온라인 운영 사이를 연결하는 방식**으로 문제를 풀었습니다.

## 제안한 솔루션

```text
상인
  └─ 장사와 상품 제공에 집중
       ↓
마켓버틀러
  ├─ 점포 순회와 재고 확인
  ├─ 상품 사진·숏폼 등록
  ├─ 주문 상품 수거와 검수
  └─ 포장·배송 인계
       ↓
소비자
  └─ 탐색 → 장바구니 → 주문 → 배송 확인
```

서비스는 단순 쇼핑몰이 아니라 다음 세 운영 관점을 함께 다룹니다.

1. **소비자 경험** — 모바일 환경의 짧고 명확한 구매 흐름
2. **상인 경험** — 복잡한 입력 없이 현황을 확인하는 읽기 중심 화면
3. **운영 경험** — 실제 현장 단계와 권한에 맞춘 버틀러 콘솔

## 포트폴리오 하이라이트

### 1. 역할이 아니라 업무 단위로 설계한 RBAC

`src/model/struct/rbac.py`에 역할과 권한을 중앙화했습니다. 화면 이름에 역할을
하드코딩하지 않고 `products.create`, `orders.shipping.update`처럼 업무 단위로
권한을 정의해 기능이 추가되어도 정책을 확장할 수 있습니다.

- 총괄관리자: 전체 정책과 계정 관리
- 상품관리자: 상품·콘텐츠 운영과 주문·통계 조회
- 주문관리자: 주문·배송·문의 처리와 제한적 재고 수정
- 마켓버틀러: 현장 상품·재고·주문·배송 운영

### 2. UI와 서버를 함께 막는 이중 접근 제어

버튼을 숨기는 것만으로 보안을 처리하지 않았습니다.

- Angular 화면은 세션의 권한으로 탭과 액션을 필터링합니다.
- WIZ Controller는 페이지 진입 전 역할을 다시 확인합니다.
- 계정 관리 API는 `admin.accounts.manage` 권한을 서버에서 재검사합니다.
- 자기 계정 삭제와 마지막 총괄관리자 제거를 차단합니다.

### 3. 공개 가입과 운영 권한을 분리한 승인 워크플로

마켓버틀러 신청자가 즉시 운영 권한을 얻지 않도록 설계했습니다.

```text
market_butler 가입 신청
  → butler_pending 저장
  → 운영 화면 로그인 차단
  → 총괄관리자 검토·승인
  → market_butler 전환
  → 허용된 운영 기능 접근
```

이 흐름으로 공개 회원가입의 편의성과 운영 시스템의 보안을 분리했습니다.

### 4. WIZ 계층에 맞춘 관심사 분리

```text
Angular View
  → App API
    → Controller
      → Root Struct
        → Domain Struct
          → Peewee DB Model
```

- View는 사용자 상호작용과 표현을 담당합니다.
- Controller는 로그인과 역할별 접근을 담당합니다.
- Struct는 인증, 사용자 관리, RBAC 같은 비즈니스 규칙을 담당합니다.
- DB Model은 스키마와 영속 계층에 집중합니다.
- 공통 기능은 Portal 패키지로 분리합니다.

### 5. 프로토타입의 경계를 숨기지 않는 문서화

계정·세션·RBAC는 서버와 DB에 연결되어 있지만, 상품·주문·결제·배송 일부는
프런트엔드 데모 데이터와 브라우저 저장소를 사용합니다. 구현 완료와 검증 전인
범위를 명시해 코드 리뷰어가 기술 상태를 정확하게 판단할 수 있도록 했습니다.

## 핵심 사용자 경험

### 소비자

- 모바일 홈과 현장 상품 탐색
- 상품 상세 및 장바구니 담기 모션
- 배송 정보, 쿠폰, 결제로 이어지는 단계형 체크아웃
- 주문 내역과 재주문 흐름
- 서비스 이용 방법과 외부 배송 안내

### 상인

- 오늘 매출과 판매 상품 현황 확인
- 운영 일정과 마켓버틀러 방문 일정 확인
- 직접 상품·재고를 관리하지 않는 읽기 중심 화면
- 장사 흐름을 방해하지 않는 간결한 모바일 UI

### 마켓버틀러·운영자

- 판매 통계와 오늘 할 일
- 상품·가격·재고 운영
- 신규 주문 확인과 점포별 수거
- 수량·신선도·파손 검수
- 포장 체크리스트와 배송 인계
- 권한별 탭과 실행 액션 제한

## 권한 설계

| 기능 | 총괄 | 상품관리 | 주문관리 | 버틀러 |
| --- | :---: | :---: | :---: | :---: |
| 운영 계정 관리 | O | - | - | - |
| 시스템 정책·백업·로그 | O | - | - | - |
| 상품 검토·등록·수정 | O | O | - | O |
| 상품 삭제 | O | O | - | - |
| 가격 수정 | O | O | - | O |
| 재고 수정 | O | O | O | O |
| 숏폼·콘텐츠 운영 | O | O | - | O |
| 주문 조회 | O | O | O | O |
| 주문 취소 승인 | O | - | O | - |
| 배송 상태 변경 | O | - | O | O |
| 고객 문의 답변 | O | - | O | O |
| 판매 통계 조회 | O | O | O | O |

전체 권한 목록은
[RBAC 소스](src/model/struct/rbac.py)에서 확인할 수 있습니다.

## 시스템 아키텍처

```text
┌───────────────────────────────────────────────┐
│ Angular UI                                    │
│ Page · Layout · Component · Role Navigation   │
└───────────────────────┬───────────────────────┘
                        │ wiz.call()
┌───────────────────────▼───────────────────────┐
│ WIZ App API / Controller                      │
│ Input Validation · Session · Access Control   │
└───────────────────────┬───────────────────────┘
                        │ wiz.model()
┌───────────────────────▼───────────────────────┐
│ Domain Layer                                  │
│ Root Struct · User Struct · RBAC Struct       │
└───────────────────────┬───────────────────────┘
                        │ ORM
┌───────────────────────▼───────────────────────┐
│ Data Layer                                    │
│ Peewee · SQLite Sample · MySQL Production     │
└───────────────────────────────────────────────┘
```

### Controller 체인

```text
base
  └─ user          인증·세션·역할 동기화
       ├─ consumer
       ├─ merchant
       ├─ admin
       └─ superadmin
```

페이지를 열 때마다 DB의 현재 역할을 다시 읽어 세션을 갱신합니다. 권한이 바뀐
사용자가 이전 세션 정보만으로 보호 화면을 계속 사용하는 문제를 줄였습니다.

## 기술 스택

| 영역 | 기술 | 선택 이유 |
| --- | --- | --- |
| Framework | WIZ Framework | App·Controller·Model·Portal 구조 활용 |
| Frontend | Angular 18, TypeScript | 역할 기반 상태와 화면 구성 |
| Template | Pug, SCSS | 모바일 UI의 구조·스타일 분리 |
| Backend | Python App API | 인증·회원가입·계정 관리 구현 |
| ORM | Peewee | 사용자와 게시물 스키마 모델링 |
| Database | SQLite, MySQL | 로컬 샘플과 운영 환경 분리 |
| Security | bcrypt, Session, RBAC | 비밀번호 보호와 권한 통제 |
| Quality | GitHub Actions | push·PR 정적 검사 자동화 |
| Collaboration | Dependabot, CODEOWNERS | 의존성·리뷰 책임 관리 |

## 주요 코드 둘러보기

| 관심 영역 | 경로 |
| --- | --- |
| 인증·회원가입 API | [`src/app/page.access/api.py`](src/app/page.access/api.py) |
| 사용자 비즈니스 로직 | [`src/model/struct/user.py`](src/model/struct/user.py) |
| RBAC 정책 | [`src/model/struct/rbac.py`](src/model/struct/rbac.py) |
| 접근 제어 Controller | [`src/controller/`](src/controller/) |
| 버틀러 운영 화면 | [`src/app/page.admin/`](src/app/page.admin/) |
| 운영 계정 관리 | [`src/app/page.members/`](src/app/page.members/) |
| 소비자 구매 흐름 | [`src/app/page.checkout/`](src/app/page.checkout/) |
| 상인 현황판 | [`src/app/page.merchant/`](src/app/page.merchant/) |
| 공통 WIZ 패키지 | [`src/portal/season/`](src/portal/season/) |
| 게시물 도메인 패키지 | [`src/portal/post/`](src/portal/post/) |

## 프로젝트 구조

```text
src/
├── angular/                     # 라우팅과 전역 스타일
├── app/
│   ├── page.access/             # 로그인·회원가입
│   ├── page.dashboard/          # 소비자 홈
│   ├── page.posts*/             # 상품 탐색·상세
│   ├── page.cart/               # 장바구니
│   ├── page.checkout/           # 주문·결제
│   ├── page.orders/             # 주문 내역
│   ├── page.merchant/           # 상인 현황판
│   ├── page.admin/              # 버틀러 운영 콘솔
│   ├── page.members/            # 운영 계정 관리
│   └── layout.* / component.*   # 공통 레이아웃·내비게이션
├── controller/                  # 역할별 페이지 접근 제어
├── model/
│   ├── db/                      # Peewee 스키마
│   ├── struct/                  # User·RBAC 도메인 로직
│   └── struct.py                # Root Struct
└── portal/
    ├── season/                  # ORM·세션·공통 Service
    └── post/                    # 게시물 도메인 패키지
```

## 구현 상태

| 영역 | 상태 | 비고 |
| --- | --- | --- |
| 로그인·세션 | 서버 연동 | 사용자 DB와 세션 동기화 |
| 공개 회원가입 | 서버 연동 | 소비자·상인·버틀러 신청 |
| 버틀러 승인 | 서버 연동 | 승인 전 운영 접근 차단 |
| RBAC | 서버 연동 | 중앙 권한 정책과 Controller 적용 |
| 운영 계정 관리 | 서버 연동 | 총괄관리자 전용 |
| 소비자 상품 카탈로그 | 프로토타입 | 프런트 데이터 |
| 장바구니·체크아웃 | 프로토타입 | 브라우저 `localStorage` |
| 결제·배송사 연동 | 미연동 | 외부 API 필요 |
| 버틀러 운영 데이터 | 프로토타입 | UI와 권한 흐름 검증 단계 |

## 품질과 보안

### 자동화

`.github/workflows/quality.yml`은 `main` push와 Pull Request에서 다음을 검사합니다.

1. lockfile 기반 의존성 설치
2. Python 소스 구문 검사
3. critical npm 취약점 검사

저장소에는 Dependabot, CODEOWNERS, PR 템플릿, Issue 템플릿과 보안 제보
가이드도 포함되어 있습니다.

### 보안 원칙

- 비밀번호는 bcrypt 해시로 저장하고 응답에서 제거합니다.
- 관리자 기능은 UI와 서버 양쪽에서 권한을 확인합니다.
- 승인 대기 버틀러에게 운영 권한을 부여하지 않습니다.
- 런타임 설정과 비밀값은 Git 추적 대상에서 제외합니다.
- 자기 계정 삭제와 마지막 총괄관리자 제거를 차단합니다.
- 실제 로그인 자격증명은 공개 저장소에 제공하지 않습니다.

## 프로젝트 확인 방법

### 라이브 서비스

[market.seasonai.net](https://market.seasonai.net)에서 소비자·상인 회원가입과
서비스 흐름을 확인할 수 있습니다. 마켓버틀러 운영 화면은 승인된 계정만 접근할 수
있으며, 공개 테스트용 관리자 자격증명은 제공하지 않습니다.

### 로컬 준비

이 프로젝트는 WIZ Workspace에서 실행됩니다.

```bash
git clone https://github.com/xericen/traditional-market.git
cd traditional-market
npm ci
cp config-sample/database.py config/database.py
npm run check:python
```

그다음 WIZ Workspace에서 프로젝트 `main`을 선택해 빌드합니다. `config/`,
`build/`, `bundle/`과 비밀값은 Git에서 제외됩니다.

## 기술적 한계와 다음 단계

프로토타입의 현재 경계를 명확하게 공개합니다.

- 상품·주문·배송 데이터를 서버 도메인 모델로 이전
- PG 결제 승인과 환불 워크플로 연동
- 배송 파트너 API와 상태 이벤트 연동
- 점포별 실시간 재고 동기화
- 연락처 인증, CAPTCHA, 로그인 시도 제한 적용
- 운영 API 전체에 RBAC 서버 가드 확장
- E2E 테스트와 접근성 자동 검사 추가
- Angular 의존성 메이저 업그레이드 및 보안 검토
- 프로젝트 공개 범위에 맞는 라이선스 결정

## 이 프로젝트가 보여주는 것

- 화면 구현에 그치지 않고 **현장 운영 문제를 역할과 업무 흐름으로 모델링**한 경험
- 다중 사용자 서비스에서 **승인 상태와 세부 권한을 설계**한 경험
- 프런트엔드와 서버를 함께 고려한 **방어적 접근 제어** 구현
- WIZ의 App·Controller·Struct·Portal 계층을 활용한 **관심사 분리**
- 구현 완료와 프로토타입 범위를 구분하는 **투명한 기술 문서화**
- CI, 의존성 관리, 코드 소유권을 포함한 **협업 가능한 저장소 운영**

## 관련 문서

- [기여 가이드](CONTRIBUTING.md)
- [보안 정책](SECURITY.md)
- [전체 변경 이력](devlog.md)
- [GitHub Actions](.github/workflows/quality.yml)

---

이 저장소는 기능을 과장하기보다, 실제로 해결한 문제와 아직 해결해야 할 문제를
함께 보여주는 것을 목표로 합니다.
