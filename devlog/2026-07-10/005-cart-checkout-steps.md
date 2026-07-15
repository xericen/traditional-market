# 장바구니와 2단계 주문 결제 흐름 분리

- **ID**: 005
- **날짜**: 2026-07-10
- **유형**: 기능 추가

## 작업 요약

장바구니 화면에는 담은 상품과 수량 조절·삭제 기능만 남기고, 하단 우측 주문하기 버튼에서 별도 주문 화면으로 이동하도록 분리했다.
주문 화면은 Step 1 배송·픽업 정보, Step 2 쿠폰·포인트·결제 수단 및 최종 결제로 구성하고 주문 내역의 결제 완료 표시까지 연결했다.

## 원문 요청사항

```text
장바구니  페이지에 현재 담음 상품 주무하는 거 까지 다 나와있는데, 장바구니에는 내가 담음 물건만 보여야하고 오측 하단에 주문하기 버튼을 만들어서 주문하기를 눌러야 그 이후에 쿠폰 어떤걸쓰는지 본인 어디로 보내는지 등 그리고 결제하기까지 되게 step1,2이렇게 넘어갈 수 있게 해줘
```

## 변경 파일 목록

- `src/app/page.cart/view.ts`
  - 장바구니 데이터·수량·삭제 로직만 유지하고 주문 화면 이동을 추가
  - 문자열 수량 증가 오류를 막도록 수량 계산을 숫자로 정규화
- `src/app/page.cart/view.pug`
  - 배송·쿠폰·결제 영역을 제거하고 상품 목록 전용 화면과 우측 하단 주문하기 CTA 구성
- `src/app/page.cart/view.scss`
  - 모바일 하단 내비게이션 위 주문 CTA 위치 스타일 추가
- `src/app/page.checkout/app.json`
  - `/checkout/:step?` 주문 페이지 등록
- `src/app/page.checkout/view.ts`
  - 단계 라우팅, 배송지·픽업 검증, 쿠폰·포인트 계산, 결제 수단 선택, 주문 저장 흐름 구현
- `src/app/page.checkout/view.pug`
  - Step 1 배송 정보와 Step 2 할인·결제 화면 및 하단 단계 CTA 구현
- `src/app/page.checkout/view.scss`
  - 단계 화면의 하단 액션 독 스타일 추가
- `src/app/page.orders/view.pug`
  - 새 주문의 결제 수단·결제 완료 상태와 완료 안내 표시
- `src/app/component.nav.sidebar/view.ts`
  - 체크아웃 경로에서도 장바구니 메뉴 활성 상태 유지
- `src/app/layout.sidebar/view.ts`
- `src/app/layout.empty/view.ts`
  - Layout이 공통 Service의 루트 앱 참조를 덮어쓰지 않도록 초기화 수정
  - 반복되던 `detectChanges` undefined 오류 원인 제거
- `devlog.md`
- `devlog/2026-07-10/005-cart-checkout-steps.md`
  - 작업 요약 및 상세 이력 기록

## 검증 결과

- WIZ 일반 빌드(`clean: false`) 2회 성공
- `/cart`, `/checkout/1`, `/checkout/2`, `/orders` 로컬 HTTP 응답 모두 200 확인
- 생성 번들에서 `checkout/:step?` 라우트 및 `PageCheckoutComponent` 등록 확인
- Node 로직 하네스로 상품 합계, 쿠폰·포인트·배송비 계산, `paymentStatus: paid` 주문 저장, `/orders?placed=1` 이동 확인
- 소스 전체에서 `service.init(this)` 잔존 호출이 없음을 확인

## 남은 리스크

- 현재 프로젝트 구조에 맞춰 주문·결제 결과는 브라우저 `localStorage`에 저장하는 프로토타입이다.
- 실제 사용자별 쿠폰 조회, 주문 API, PG 승인·취소·실패 처리는 별도 백엔드 및 결제사 연동이 필요하다.
- 실행 환경에 Headless 브라우저가 없어 실제 클릭 기반 시각 회귀 테스트는 수행하지 못했다.
