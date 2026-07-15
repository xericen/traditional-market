# 홍천시장 마켓 버틀러 앱 전체 흐름 디자인

- **ID**: 002
- **날짜**: 2026-07-10
- **유형**: 기능 추가
- **리뷰 ID**: ujbobndvpbcumbcrwrdpvxyrzychcqrm

## 작업 요약

공용 폴더의 PPT 7장과 HWPX 기획 문서를 분석해 홍천중앙시장 전용 ‘마켓 버틀러’ 앱으로 전체 UI를 재설계했다.
소비자의 핫상품 영상 → 오늘 상품 → 상세 → 장바구니 → 주문 추적 흐름과, 상인회·청년 버틀러의 상품 등록 → 주문 접수 → 현장 검수 → 발송·픽업 흐름을 각각 클릭 가능한 화면으로 구현했다.

## 원문 요청사항

```text
공용파일에 있는 PPT와 내용을 보고 앱 디자인 해줘
```

## 반영한 기획 내용

- 홍천중앙시장 한 곳에 집중하는 초기 MVP
- 도시 거주 자녀·관광객·바쁜 직장인을 위한 현장 방문 보완재
- 상인이 직접 입력하지 않고 상인회·지역 청년 버틀러가 상품·콘텐츠·검수를 담당하는 구조
- 10~20초 오늘의 핫상품 영상, 홍총떡·올챙이국수 밀키트·시그니처 상자
- 주문 접수 → 상인회 검수 중 → 준비 완료 → 배송·픽업 완료 상태 흐름
- PPT의 아이보리·브라운·초록·주황 팔레트와 SUIT 한글 타이포그래피

## 변경 파일 목록

### 공통 브랜드·레이아웃

- `src/angular/index.pug`
  - 문서 언어, 제목, 메타 설명, PWA 테마를 홍천장날 브랜드로 변경
- `src/angular/styles/styles.scss`
  - 명시적 밝은 배경, 시장 컬러 토큰, 기본 폼·렌더링 스타일 추가
- `src/app/layout.empty/view.ts`, `view.scss`
  - 로그인 화면의 검은 투명 배경 문제를 제거하고 레이아웃 Service 초기화 보완
- `src/app/layout.sidebar/view.pug`, `view.ts`, `view.scss`
  - 기존 좌측 SaaS 사이드바를 소비자용 상단 헤더·모바일 하단 내비게이션 셸로 재구성
- `src/app/component.nav.sidebar/view.pug`, `view.ts`
  - 홍천장날 로고, 오늘의 시장·장보기·주문조회·버틀러 센터 메뉴와 장바구니 수량 동기화 구현

### 로그인·소비자 앱

- `src/app/page.access/view.pug`, `view.ts`, `view.scss`
  - 상인회·버틀러 로그인과 소비자 시장 둘러보기의 2축 진입 화면 구현
- `src/app/page.dashboard/app.json`, `view.pug`, `view.ts`, `view.scss`
  - 10~20초 핫상품, 추천 상품, 카테고리, 시그니처 상자, 버틀러 검수 안내 홈 구현
  - 공개 장보기 진입을 위해 controller를 `base`로 조정
- `src/app/page.posts/app.json`, `api.py`, `view.pug`, `view.ts`, `view.scss`
  - 오늘 상품 검색·카테고리·정렬·재고·마감·장바구니 흐름 구현
  - 잘못된 Python `//` 주석을 유효한 주석으로 정리
- `src/app/page.posts.item/app.json`, `api.py`, `view.pug`, `view.ts`, `view.scss`
  - 상품 상세, 현장 영상, 점포 이야기, 버틀러 검수 메모, 대체 제안 동의, 수량·장바구니 구현
- `src/app/page.cart/app.json`, `view.pug`, `view.ts`, `view.scss`
  - 신규 장바구니 페이지 생성
  - 수량·대체 제안, 배송·픽업, 주소·시간, 쿠폰·포인트, 주문 접수 흐름 구현
- `src/app/page.orders/app.json`, `view.pug`, `view.ts`, `view.scss`
  - 신규 주문 추적 페이지 생성
  - 상태 타임라인, 버틀러 메시지, 검수 기록, 배송·픽업 정보, 재주문 구현

### 상인회·버틀러 운영 앱

- `src/app/page.admin/app.json`, `view.pug`, `view.ts`, `view.scss`
  - 신규 `/admin/:tab?` 운영 콘솔 생성
  - 오늘 운영 대시보드, 상품 사진·영상 등록, 주문 접수함, 점포별 피킹, 품절·대체 제안, 검수 체크리스트, 검수 미디어, 배송기사·픽업 처리 흐름 구현
  - Angular 동일 컴포넌트 재사용에 맞춰 `NavigationEnd` 기반 탭 동기화 적용

## 검증 결과

- WIZ 일반 빌드 2회 성공
  - 최종 결과: `EsBuild complete`, errors 없음
- 로컬 주요 경로 HTTP 200 확인
  - `/access`
  - `/dashboard`
  - `/posts`
  - `/posts/hongchongtteok/detail`
  - `/cart`
  - `/orders`
  - `/admin/orders`
- `/main.css`, `/main.js`, SUIT 폰트 자산 HTTP 200 확인
- 외부 `https://market.seasonai.net`의 `/access`, `/dashboard`, `/posts`, `/cart`, `/orders` HTTP 200 확인
- 외부 `main.js`에서 `Hongcheon Market Butler`, `market-cart`, `Butler tracking` 신규 번들 토큰 확인
- 빌드 CSS/JS에 신규 시장 컬러, 반응형 레이아웃, 신규 page 앱 포함 확인
- `git diff --check` 통과
- 요청 경로 확인 후 WIZ 로그에서 신규 Error/Traceback/Angular 오류 없음

## 남은 리스크

- 이번 작업은 디자인·전체 클릭 흐름 범위로, 상품·점포·주문·검수·배송 상태는 샘플 데이터와 브라우저 `localStorage`를 사용한다.
- 실제 운영 전 Product/Store/Order/Inspection 모델과 API, 결제, 재고 마감 자동화, 미디어 업로드, 고객 알림, 정산 연동이 필요하다.
- PPT/HWPX에 실제 상품 사진·영상 자산이 없어 현재 상품 이미지는 컬러 카드와 이모지로 시각화했다. 실제 상인·상품 촬영본으로 교체해야 브랜드 신뢰도가 완성된다.
- 운영 콘솔은 기존 사용자 인증 controller를 사용하지만, 상인회 관리자·버틀러별 세부 권한 정책은 별도 구현이 필요하다.
