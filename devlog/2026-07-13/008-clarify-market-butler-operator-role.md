# 마켓 버틀러 온라인 판매 전담 운영 흐름 정립

- **ID**: 008
- **날짜**: 2026-07-13
- **유형**: 기능 개선
- **리뷰 ID**: krhxisaoqtscvkwrmtwqhhtlpignpynb

## 작업 요약

마켓 버틀러(홍천상인회)를 상인을 보조하는 역할이 아니라, 쿠팡과 같은 온라인몰의 판매자 업무를 대신 수행하는 실질 운영자로 명확히 정리했다.
오전 점포 순회와 재고 확인부터 촬영·상품 운영·주문 수거·품질 검수·증빙 업로드·포장·배달업체 인계까지 단계별 화면과 시연 상태를 연결했다.

## 원문 요청사항

```text
# ReviewOps Codex 작업 요청

아래 요청을 현재 프로젝트 루트에서 처리하세요. 필요한 파일을 직접 수정하고, 마지막 응답은 한국어로 간결하게 작성하세요.
스트리밍 응답은 사용하지 않습니다. 작업이 끝난 뒤 변경 요약, 확인한 내용, 남은 리스크만 정리하세요.
이 작업의 세션 단위는 아래 리뷰 ID입니다. 리뷰 ID가 같으면 같은 Codex 히스토리 맥락으로 이어서 처리하세요.

## 사용자 요청

👔 마켓 버틀러(홍천상인회)
실질적인 운영자입니다.
오전에 시장 돌면서 재고 확인
상품 사진 촬영
숏폼 영상 촬영
상품 등록
가격 수정
품절 처리
주문 확인
상품 품질 검수
검수 사진/영상 업로드
포장
배달업체 전달
즉, 쿠팡 판매자 역할을 상인이 아니라 '마켓 버틀러'가 대신하는 구조입니다. 맞게 수덩해줘

## 리뷰 요약

- 리뷰 ID: krhxisaoqtscvkwrmtwqhhtlpignpynb
- 제목: 마켓 버틀러
- 요청 링크: https://market.seasonai.net/admin/orders
- Codex 요청자: 김민주
- 프로젝트 루트: /opt/app
- Codex 세션 ID: 신규
- Codex 모델: 5.6 sol (gpt-5.6-sol)
- Codex 추론수준: ultra (ultra)
- 스크린샷 컨텍스트: 1번 첨부됨
- 에이전트 작업 지시서 컨텍스트: 포함됨
- HTML 문서 생성 규칙 컨텍스트: 없음
- HTML 문서 설정 컨텍스트: 없음
- HTML 프로젝트 인스트럭션 파일: 없음
- 첨부파일 컨텍스트: 0개

## 에이전트 작업 지시서

# 에이전트 작업 지시서

## 리뷰 정보

- 리뷰 ID: krhxisaoqtscvkwrmtwqhhtlpignpynb
- 제목: 마켓 버틀러
- 상태: open
- 우선순위: normal
- 분류: design
- 프로젝트: traditional market
- 프로젝트 종류: web_service
- 요청 링크: https://market.seasonai.net/admin/orders
- 화면: 1440x900
- 캡처 방식: reviewops-sdk-dom-snapshot
- 스크린샷 첨부: yes
- 리뷰 첨부 파일: 0개

## 리뷰어 요청 내용

-

## 첨부 파일

-

## 콘솔 로그 요약

-

## 네트워크 로그 요약

- GET https://market.seasonai.net/vendor.js 200
- GET https://market.seasonai.net/main.js 200
- GET https://market.seasonai.net/access/assets/lang/en.json 200
- GET https://market.seasonai.net/access/assets/lang/ko.json 200
- GET https://market.seasonai.net/assets/lang/en.json 200
- GET https://market.seasonai.net/assets/lang/ko.json 200
- POST https://market.seasonai.net/wiz/api/page.access/check 200
- GET https://market.seasonai.net/wiz/api/page.access/check 200
- POST https://market.seasonai.net/wiz/api/page.access/login 200
- GET https://market.seasonai.net/wiz/api/page.access/login 200
- GET https://market.seasonai.net/main.css 200
- GET https://market.seasonai.net/vendor.js 200
- GET https://review.season.co.kr/assets/reviewops-sdk.js 0
- GET https://market.seasonai.net/main.js 200
- GET https://market.seasonai.net/admin/assets/lang/en.json 200
- GET https://market.seasonai.net/admin/assets/lang/ko.json 200
- GET https://market.seasonai.net/assets/lang/en.json 200
- GET https://market.seasonai.net/assets/lang/ko.json 200
- POST https://market.seasonai.net/wiz/api/page.access/check 200
- GET https://market.seasonai.net/wiz/api/page.access/check 200

## 환경 로그 요약

- reviewops-sdk: SDK 0.1.10
- reviewops-sdk: SDK 0.1.10 / https://market.seasonai.net
- reviewops-sdk: SDK 0.1.10 / https://market.seasonai.net
- iframe-fingerprint: restricted / https://market.seasonai.net
- browser-fingerprint: MacIntel / ko-KR / 2560x1440
- iframe-fingerprint: restricted / https://market.seasonai.net
- reviewops-sdk: SDK 0.1.10 / https://market.seasonai.net
- reviewops-sdk: SDK 0.1.10 / https://market.seasonai.net
- reviewops-sdk: SDK 0.1.10 / https://market.seasonai.net

## 스크린샷

스크린샷은 Codex 이미지 입력으로 함께 전달되었습니다.
```

## 변경 파일 목록

### 마켓 버틀러 운영 콘솔

- src/app/page.admin/view.ts
  - 6단계 전담 운영 흐름과 오전 점포 순회 체크 상태를 추가했다.
  - 상품 가격·재고 저장 및 명시적 품절 처리 상태를 추가했다.
  - 주문 확인, 점포별 수거, 품절 반영, 대체상품 제안·고객 승인 상태를 연결했다.
  - 검수·증빙·포장 상태를 주문별로 분리하고, 완료한 선택 주문을 배송 인계 목록에 추가했다.
  - 배달업체 인계 시 외부 접수정보와 인계 시각을 기록하고 원 주문 상태를 갱신했다.
- src/app/page.admin/view.pug
  - 마켓 버틀러가 상인을 대신하는 실질 운영자임을 명시했다.
  - 오전 재고 확인, 사진·숏폼 촬영, 상품 등록·가격 수정·품절 처리 UI를 구성했다.
  - 주문·수거, 검수 증빙 업로드, 포장, 배달업체 인계를 독립 단계로 표시했다.
  - 단계 차단 안내, 진행률, 터치 영역, 폼 레이블과 ARIA 속성을 보완했다.

### 공통 역할 표기

- src/app/component.nav.sidebar/view.pug
  - 마켓 버틀러 하단 메뉴의 주문 항목을 주문·수거로 명확히 했다.
- src/app/page.access/view.pug
  - 관리자 계정 표현을 제거하고 홍천상인회가 발급하는 마켓 버틀러 운영 계정으로 안내했다.
- src/app/page.orders/view.ts
  - 소비자 주문 상태의 상인회 검수 중 표현을 마켓 버틀러 검수 중으로 통일했다.

### 작업 이력

- devlog.md
  - 2026-07-13 ID 008 요약 행을 추가했다.
- devlog/2026-07-13/008-clarify-market-butler-operator-role.md
  - 요청 원문, 변경 파일, 검증 결과와 남은 리스크를 기록했다.

## 검증 결과

- WIZ 프로젝트 일반 빌드(clean: false) 성공: EsBuild 완료, 오류 없음
- git diff --check 통과
- 신규 page.admin 파일의 no-index whitespace 검사에서 오류 출력 없음
- 빌드 산출물에서 재고 확인, 숏폼 촬영, 가격·재고 저장, 품절 처리, 주문·수거, 검수 증빙, 포장, 배달업체 인계 문구와 바인딩 확인
- 주문별 workflow 초기화·저장, 품절 대체 승인 차단, 선택 주문의 dispatchOrders 추가, 인계 후 원 주문 상태 갱신 로직 확인
- /admin/orders 외부 경로 HTTP 200 확인

## 남은 리스크

- 현재 page.admin에는 api.py가 없으며 상품·주문·검수·포장·인계 데이터는 프런트 시연 상태라 새로고침하면 초기화된다.
- 사진·숏폼·검수 증빙 업로드는 실제 파일 저장이 아닌 UI 시연이며, 상품·주문 DB와 소비자 주문 상태에 영구 반영되지 않는다.
- 외부 배송 파트너와 접수번호·배송 상태 조회 API가 아직 연결되지 않았다.
- 로그인 세션을 포함한 실제 모바일 브라우저의 전체 클릭 흐름은 자동화하지 않았으며 WIZ 빌드·정적 산출물·HTTP 응답 기준으로 확인했다.
