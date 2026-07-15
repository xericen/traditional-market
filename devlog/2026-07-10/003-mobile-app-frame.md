# 모바일 앱 프레임 및 화면 재설계

- **ID**: 003
- **날짜**: 2026-07-10
- **유형**: UI/UX 개선
- **리뷰 ID**: ujbobndvpbcumbcrwrdpvxyrzychcqrm

## 작업 요약

기존 반응형 웹 화면을 390~430px 휴대폰 폭을 기준으로 다시 구성했다.
1440px 리뷰 화면에서는 중앙에 실제 휴대폰 형태의 프레임으로 보이고, 실제 모바일에서는 화면 전체를 사용하도록 로그인·소비자·버틀러 운영 화면을 일관된 앱 구조로 변경했다.

## 원문 요청사항

```text
앱 모양으로 보고 싶어서 핸드폰 크기를 바탕으로 화면을 변경해줘야해. 그에맞춰서 디자인도 바꿔줘
```

## 변경 파일 목록

### 공통 휴대폰 프레임

- `src/app/layout.empty/view.pug`, `view.scss`
  - 로그인 화면을 최대 430px 휴대폰 셸 안에 배치
  - 데스크톱용 기기 테두리·라운드·노치·상태바와 내부 단일 스크롤 구현
  - 실제 모바일에서는 전체 화면으로 전환하고 safe-area 적용
  - 로딩 및 공용 모달을 휴대폰 프레임 안으로 제한
- `src/app/layout.sidebar/view.pug`, `view.scss`
  - 소비자·운영 페이지에 동일한 휴대폰 셸 적용
  - 하단 내비게이션 공간을 포함한 내부 스크롤 구조와 프레임 한정 로딩 적용
- `src/angular/styles/styles.scss`
  - 앱 프레임 배경·기기 토큰과 스크롤·safe-area 보조 스타일 추가
- `src/angular/index.pug`
  - iPhone/PWA safe-area 지원을 위한 `viewport-fit=cover` 추가

### 앱 헤더·하단 내비게이션

- `src/app/component.nav.sidebar/view.pug`, `view.scss`
  - 데스크톱 메뉴를 제거하고 430px 앱 헤더로 재구성
  - 홍천중앙시장 위치, 검색, 장바구니를 상단 앱 바로 배치
  - 홈·장보기·장바구니·주문·운영의 5개 하단 탭 적용
  - 장바구니 수량과 모바일 safe-area 처리
- `src/app/component.nav.sidebar/view.ts`
  - 기존 장바구니 수량·활성 메뉴 동작 유지

### 로그인·소비자 화면

- `src/app/page.access/view.pug`, `view.scss`, `view.ts`
  - 데스크톱 2열 로그인을 모바일 온보딩 화면으로 전환
  - 오늘의 시장 소개, 소비자 바로 시작, 4단계 구매 흐름, 운영자 로그인을 한 화면에 재배치
- `src/app/page.dashboard/view.pug`
  - 히어로·핫상품 영상·카테고리·추천 상품을 모바일 단일 흐름으로 고정
  - 추천 상품은 휴대폰에 맞는 2열 카드 적용
- `src/app/page.posts/view.pug`
  - 상품 검색·필터·배너·상품 목록을 모바일 2열 기준으로 재배치
- `src/app/page.posts.item/view.pug`
  - 데스크톱 2열 상세를 이미지 → 정보 → 구매 CTA의 모바일 순서로 전환
  - 유효하지 않은 높이 유틸리티를 명시적 52px로 보정
- `src/app/page.cart/view.pug`
  - 장바구니와 주문 요약의 데스크톱 분할·sticky를 제거하고 모바일 순차 흐름으로 변경
- `src/app/page.orders/view.pug`
  - 주문 상태·검수·배송·주문 목록을 한 열 모바일 타임라인으로 변경

### 버틀러 운영 화면·기존 보조 화면

- `src/app/page.admin/view.pug`
  - 운영 대시보드, 상품 등록, 주문 접수, 검수, 발송 화면의 다열 구성을 모바일 카드 흐름으로 전환
  - 탭별 작업 화면에서 불필요한 통계 반복 제거
  - 상품 가격·재고·마감시간을 라벨이 있는 3열 모바일 메타 카드로 개선
- `src/app/page.members/view.pug`, `view.scss`
  - 데스크톱 분기 제거, 초대 모달을 휴대폰 프레임 기준으로 제한, 호스트 높이 보완
- `src/app/page.mypage/view.pug`, `view.scss`
  - 모바일 고정 레이아웃과 호스트 높이 보완
- 주요 Pug 화면 전체
  - 브라우저 1440px을 기준으로 발동하던 `sm/md/lg/xl/2xl` 분기를 제거해 휴대폰 프레임 안에서 모바일 레이아웃을 유지

## 검증 결과

- WIZ 일반 빌드 반복 수행 및 최종 성공
  - 최종 결과: `EsBuild complete`, errors 없음
- 로컬 주요 경로 HTTP 200 확인
  - `/access`, `/dashboard`, `/posts`, 상품 상세, `/cart`, `/orders`
  - `/admin/overview`, `products`, `orders`, `inspection`, `dispatch`
- 외부 `https://market.seasonai.net`의 주요 소비자·운영 경로 HTTP 200 확인
- 외부 `main.js`에서 430px 프레임, 기기 노치, 모바일 하단 내비게이션 토큰 확인
- 외부 HTML에서 `viewport-fit=cover` 반영 확인
- 핵심 화면의 viewport 기반 반응형 토큰 0건, 브라우저 전체 기준 `fixed`/화면 높이 클래스 0건 확인
- 공용 모달의 휴대폰 프레임 범위 override가 최종 번들에 포함된 것 확인
- `git diff --check` 통과
- WIZ 로그에서 신규 Error/Traceback/Angular 오류 없음

## 남은 리스크

- 자동화된 실제 브라우저 캡처 도구가 없는 환경이므로 360×800, 390×844, 430×932 실기기 시각 검수는 별도로 필요하다.
- 상품·주문·검수 데이터는 이전 작업과 동일하게 샘플 및 `localStorage` 기반이며 운영 DB/API 연동은 별도 범위다.
- 실제 상품 사진·영상이 제공되지 않아 현재 컬러 카드와 이모지 시각화가 유지된다.
