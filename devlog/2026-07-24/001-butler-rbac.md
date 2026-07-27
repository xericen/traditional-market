# 버틀러 역할 기반 권한(RBAC) 적용

## 사용자 원문 요청

> 현재 쇼핑몰 관리 시스템의 버틀러 권한을 총괄관리자, 상품관리자, 주문관리자로 구분하고 역할 기반(RBAC)으로 구현해 주세요. 총괄관리자는 모든 기능, 상품관리자는 상품·콘텐츠·주문 조회·판매 통계 조회, 주문관리자는 주문·배송·고객 응대·필요 시 재고 수정·판매 통계 조회만 사용할 수 있어야 합니다. 역할별 사용 불가 기능을 차단하고, 주문관리자의 판매 통계는 조회만 가능해야 합니다. 추후 기능 추가 시 역할별 권한을 쉽게 추가·관리할 수 있도록 구성해 주세요.

- 리뷰 ID: `qmqljjcmrfxsqdinvguxfrrlsxrholjg`
- 요청자: 현예지

## 변경 내용

- `src/model/struct/rbac.py`
  - `super_admin`, `product_manager`, `order_manager` 역할과 기능 단위 권한 카탈로그를 중앙 정의했습니다.
  - 기존 `admin` 역할은 `super_admin`으로 정규화하는 호환 규칙을 추가했습니다.
  - 주문관리자는 `sales.statistics.view`만 보유하고 `sales.statistics.manage`는 보유하지 않도록 분리했습니다.
- `src/model/struct.py`, `src/model/struct/user.py`
  - RBAC 구조체를 연결하고 사용자 응답·세션에 역할명과 권한 목록을 포함했습니다.
  - 기존 admin 데이터 마이그레이션, 관리자 기본 계정 환경변수, 계정 역할 수정 로직을 추가했습니다.
- `src/controller/admin.py`, `src/controller/superadmin.py`, `src/controller/user.py`, `src/controller/consumer.py`, `src/controller/merchant.py`
  - 관리자 공통 진입과 총괄관리자 전용 계정 관리 진입을 분리했습니다.
  - 모든 컨트롤러의 역할별 리다이렉트와 세션 권한 갱신을 새 역할에 맞게 정리했습니다.
- `src/app/page.access/api.py`, `src/app/page.access/view.ts`
  - 세션에 역할 라벨·권한을 전달하고 세 관리자 역할의 로그인 목적지를 운영 콘솔로 연결했습니다.
- `src/app/layout.sidebar/view.ts`, `src/app/component.nav.sidebar/view.ts`, `src/app/component.nav.sidebar/view.pug`
  - 레이아웃 접근 검사와 하단 메뉴를 역할/권한 기반으로 전환했습니다.
  - 총괄관리자에게만 계정 메뉴를 표시하고, 각 역할에는 허용된 상품·주문 메뉴만 표시합니다.
- `src/app/page.admin/view.ts`, `src/app/page.admin/view.pug`
  - 권한별 탭 필터와 직접 URL 접근 교정을 적용했습니다.
  - 상품관리자의 주문 화면은 조회 전용으로, 주문관리자의 상품 화면은 재고 수정 전용으로 분리했습니다.
  - 화면에서 숨긴 작업도 실행 함수 진입 시 권한을 재검사하도록 방어 로직을 추가했습니다.
  - 판매 통계는 관리자 역할 공통 조회 화면으로 표시하고 변경 권한은 총괄관리자에만 예약했습니다.
- `src/app/page.members/app.json`, `src/app/page.members/api.py`, `src/app/page.members/view.ts`, `src/app/page.members/view.pug`
  - 계정 관리 페이지와 API를 총괄관리자 전용으로 변경했습니다.
  - 계정 생성, 이름/역할 수정, 삭제 UI와 API를 구현했습니다.
  - 자기 역할 변경·자기 삭제·마지막 총괄관리자 제거를 차단했습니다.
- `src/app/page.mypage/view.ts`, `src/app/page.mypage/view.pug`
  - 새 관리자 역할명과 배지 표시를 적용했습니다.

## 검증 결과

- `npm run check:python`: Python 33개 파일 문법 검사 통과
- RBAC 허용/거부 매트릭스 assertion: 통과
  - 상품관리자의 계정/공지/주문 취소/배송/문의/로그 권한 부재 확인
  - 주문관리자의 상품/콘텐츠/공지/로그/통계 수정 권한 부재 확인
  - 주문관리자의 주문/배송/문의/재고/통계 조회 권한 보유 확인
- 계정 관리 API `list`, `invite`, `update`, `remove`의 서버 권한 가드 assertion: 통과
- 변경 Pug 템플릿 4개 컴파일: 통과
- WIZ 일반 빌드: 성공 (`EsBuild complete`)

## 남은 리스크

- 상품·주문 운영 화면의 데이터는 기존과 같이 프런트엔드 데모 데이터입니다. 실제 상품 승인, 배너, 공지, 이벤트, 백업, 시스템 로그 등의 영속 API가 연결될 때 `RBAC.has_permission()` 서버 검사를 각 API에 동일하게 적용해야 합니다.
- `MARKET_PRODUCT_MANAGER_PASSWORD`, `MARKET_ORDER_MANAGER_PASSWORD`가 설정된 환경에서만 해당 기본 계정이 자동 생성됩니다. 환경변수가 없으면 총괄관리자가 계정 관리 화면에서 생성해야 합니다.
