# 상인 판매 상품·매출 상세·운영 일정 현황판 확장

- 작업 ID: 007
- 작업일: 2026-07-13
- 유형: 기능 개선
- 리뷰 ID: farqcubpaelqecnvcwlbcusvhumnjgcz

## 작업 요약

상인이 직접 디지털 업무를 처리하지 않으면서도 가게 운영에 필요한 현황을 확인할 수 있도록 장사 홈을 읽기 전용 현황판으로 확장했습니다.
기존 소비자·관리자 화면의 상품 정보와 일치하는 판매 상품, 오늘 온라인 매출 상세, 준비 알림, 영업·버틀러 방문·주문 마감·정산 일정을 한 화면에 배치했습니다.

## 원문 요청사항

```text
# ReviewOps Codex 작업 요청

아래 요청을 현재 프로젝트 루트에서 처리하세요. 필요한 파일을 직접 수정하고, 마지막 응답은 한국어로 간결하게 작성하세요.
스트리밍 응답은 사용하지 않습니다. 작업이 끝난 뒤 변경 요약, 확인한 내용, 남은 리스크만 정리하세요.
이 작업의 세션 단위는 아래 리뷰 ID입니다. 리뷰 ID가 같으면 같은 Codex 히스토리 맥락으로 이어서 처리하세요.

## 사용자 요청

상인에서 본인이 어떤 상품을 차고있는지 알 수 있게 해주는 게 좋을 거 같긴해, 또 오늘의 매출 등 자세히 보게 할 수 있게. 또 상인에게 필요한 것들 넣어줘. 웬만한건 다 버틀러가 하는데 상인은 가게를 운영하는 사람이니까 이외에도,

## 리뷰 요약

- 리뷰 ID: farqcubpaelqecnvcwlbcusvhumnjgcz
- 제목: 상인 역할 흐름
- 요청 링크: https://market.seasonai.net/merchant/overview
- Codex 요청자: 김민주
- 프로젝트 루트: /opt/app
- Codex 세션 ID: 019f5967-9798-7083-80b1-ab10b22507e2
- Codex 모델: 5.6 sol (gpt-5.6-sol)
- Codex 추론수준: ultra (ultra)
- 스크린샷 컨텍스트: 없음
- 에이전트 작업 지시서 컨텍스트: 포함됨
- HTML 문서 생성 규칙 컨텍스트: 없음
- HTML 문서 설정 컨텍스트: 없음
- HTML 프로젝트 인스트럭션 파일: 없음
- 첨부파일 컨텍스트: 0개

## 세션 처리

저장된 Codex 세션을 resume해 이전 대화 맥락을 우선 사용하세요. 이전 Codex 히스토리는 이 요청에 포함되지 않습니다.

## 에이전트 작업 지시서

# 에이전트 작업 지시서

## 리뷰 정보

- 리뷰 ID: farqcubpaelqecnvcwlbcusvhumnjgcz
- 제목: 상인 역할 흐름
- 상태: in_progress
- 우선순위: normal
- 분류: content
- 프로젝트: traditional market
- 프로젝트 종류: web_service
- 요청 링크: https://market.seasonai.net/merchant/overview
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

- GET https://market.seasonai.net/access/assets/lang/en.json 200
- GET https://market.seasonai.net/assets/lang/en.json 200
- GET https://market.seasonai.net/access/assets/lang/ko.json 200
- GET https://market.seasonai.net/assets/lang/ko.json 200
- POST https://market.seasonai.net/wiz/api/page.access/check 200
- GET https://market.seasonai.net/wiz/api/page.access/check 200
- POST https://market.seasonai.net/wiz/api/page.access/login 200
- GET https://market.seasonai.net/wiz/api/page.access/login 200
- GET https://market.seasonai.net/main.css 200
- GET https://market.seasonai.net/vendor.js 200
- GET https://review.season.co.kr/assets/reviewops-sdk.js 0
- GET https://market.seasonai.net/main.js 200
- GET https://market.seasonai.net/merchant/assets/lang/en.json 200
- GET https://market.seasonai.net/merchant/assets/lang/ko.json 200
- GET https://market.seasonai.net/assets/lang/en.json 200
- GET https://market.seasonai.net/assets/lang/ko.json 200
- POST https://market.seasonai.net/wiz/api/page.access/check 200
- GET https://market.seasonai.net/wiz/api/page.access/check 200
- POST https://market.seasonai.net/wiz/api/page.mypage/get 200
- GET https://market.seasonai.net/wiz/api/page.mypage/get 200

## 환경 로그 요약

- reviewops-sdk: SDK 0.1.10
- reviewops-sdk: SDK 0.1.10 / https://market.seasonai.net
- reviewops-sdk: SDK 0.1.10 / https://market.seasonai.net
- reviewops-sdk: SDK 0.1.10 / https://market.seasonai.net
- iframe-fingerprint: restricted / https://market.seasonai.net
- iframe-fingerprint: restricted / https://market.seasonai.net
- reviewops-sdk: SDK 0.1.10 / https://market.seasonai.net
- reviewops-sdk: SDK 0.1.10 / https://market.seasonai.net
- reviewops-sdk: SDK 0.1.10 / https://market.seasonai.net
- reviewops-sdk: SDK 0.1.10 / https://market.seasonai.net
```

## 변경 파일

- src/app/page.merchant/view.pug
  - 오늘 온라인 매출을 주문 수·판매 수량·평균 주문·상품별·결제수단별로 상세 표시했습니다.
  - 기존 상품 정보와 일치하는 공개 상품, 버틀러 확인 재고, 오늘 판매량, 주문 마감 시간을 추가했습니다.
  - 점포 영업시간, 버틀러 방문, 온라인 주문 마감, 다음 정산 일정을 추가했습니다.
  - 촬영·등록·재고·주문은 버틀러가 처리한다는 안내와 하단 pb-32 여백을 유지했습니다.
- src/app/page.merchant/view.ts
  - 상품·매출·결제·운영 일정용 읽기 전용 표시 데이터를 추가했습니다.
  - 홍총떡 5장 가격 12,000원, 재고 14팩, 주문 마감 16:00을 기존 카탈로그와 맞췄습니다.
- devlog.md
  - 작업 요약 행을 추가했습니다.
- devlog/2026-07-13/007-expand-merchant-store-dashboard.md
  - 요청 원문, 변경 파일, 검증 결과를 기록했습니다.

## 검증 결과

- WIZ 프로젝트 일반 빌드(clean=false) 성공
- 생성된 view.html에서 오늘 매출 상세, 판매 중인 상품, 가게 운영 일정, 버틀러 처리 안내와 pb-32 하단 여백 확인
- 상인 화면에 button, 링크, 입력 폼, click 이벤트, ngModel 등 직접 조작 요소가 없음을 확인
- 매출 36,000원 = 3팩 × 12,000원, 결제수단 합계 36,000원 정합성 확인
- page.posts, page.posts.item, page.admin의 홍총떡 상품명·가격·재고·마감 시간과 일치 확인
- git diff --check 통과
- https://market.seasonai.net/merchant/overview 응답 코드 200 확인

## 남은 리스크

- 현재 상품·매출·일정은 시연용 정적 데이터이며 실제 주문·POS·정산 API와 연동되지 않습니다.
- 로그인 상태의 실제 모바일 브라우저에서 전체 스크롤과 고정 하단 메뉴 겹침을 자동 시각 검증하지는 못했습니다.
