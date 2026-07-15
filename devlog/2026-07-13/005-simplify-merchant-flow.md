# 상인 장사 중심 간편 흐름 전환

- **ID**: 005
- **날짜**: 2026-07-13
- **유형**: 버그 수정
- **리뷰 ID**: farqcubpaelqecnvcwlbcusvhumnjgcz

## 작업 요약

상인 화면에서 상품 등록, 사진 촬영, 재고 입력, 판매 상태 변경, 주문 검색·접수·상태 변경 등 직접 관리 기능을 제거했다.
상인은 평소처럼 장사하고 마켓버틀러가 방문·전화로 필요한 내용만 전달하는 읽기 중심 화면으로 단순화했으며, 상인 하단 메뉴도 장사 홈과 내 정보만 남겼다.

## 원문 요청사항

```text
# ReviewOps Codex 작업 요청

아래 요청을 현재 프로젝트 루트에서 처리하세요. 필요한 파일을 직접 수정하고, 마지막 응답은 한국어로 간결하게 작성하세요.
스트리밍 응답은 사용하지 않습니다. 작업이 끝난 뒤 변경 요약, 확인한 내용, 남은 리스크만 정리하세요.
이 작업의 세션 단위는 아래 리뷰 ID입니다. 리뷰 ID가 같으면 같은 Codex 히스토리 맥락으로 이어서 처리하세요.

## 사용자 요청

👨‍🌾 상인
평소처럼 장사만 함
상품 등록 X
사진 촬영 X
재고 입력 X
주문 확인도 최소화
➡️ 디지털을 거의 신경 쓰지 않아도 됨. 이거라 상품 추가 등 이런 필요없는 기능은 빼줘

## 리뷰 요약

- 리뷰 ID: farqcubpaelqecnvcwlbcusvhumnjgcz
- 제목: 상인 역할 흐름
- 요청 링크: https://market.seasonai.net/merchant/overview
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

- 리뷰 ID: farqcubpaelqecnvcwlbcusvhumnjgcz
- 제목: 상인 역할 흐름
- 상태: open
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

## 스크린샷

스크린샷은 Codex 이미지 입력으로 함께 전달되었습니다.
```

## 변경 파일 목록

### 상인 간편 화면

- `src/app/page.merchant/view.pug`
  - 상품·재고·판매 상태·주문 상태를 조작하는 탭, 버튼, 입력 폼 전체 제거
  - 앱 상시 확인이 불필요하다는 안내와 방문·전화 기반 단일 주문 알림으로 전환
  - 오늘 장사 자동 요약과 마켓버틀러 대행 업무를 읽기 전용으로 표시
- `src/app/page.merchant/view.ts`
  - 상품·재고·주문 관리용 샘플 상태와 이벤트 메서드 제거
  - 날짜 표시와 폐기된 products/orders 주소의 overview 정규화만 유지
- `src/app/page.merchant/view.scss`
  - 제거된 탭·차트·패널용 스타일 삭제, 화면에 필요한 호스트·히어로 스타일만 유지

### 공통 내비게이션

- `src/app/component.nav.sidebar/view.pug`
  - 상인 메뉴의 상품·주문 링크 제거
  - 상인 하단 메뉴를 장사 홈·내 정보 2개 항목으로 단순화
  - 소비자·마켓버틀러 메뉴는 유지

### 작업 이력

- `devlog.md`
  - 2026-07-13 ID 005 요약 행 추가
- `devlog/2026-07-13/005-simplify-merchant-flow.md`
  - 사용자 원문 요청, 변경 파일, 검증 결과 기록

## 검증 결과

- WIZ 일반 빌드(`clean: false`) 성공, EsBuild 오류 없음
- `git diff --check` 통과
- 상인 페이지에서 버튼·입력·클릭 이벤트·양방향 입력 바인딩이 남지 않은 것을 소스 검색으로 확인
- `/merchant/products`, `/merchant/orders` 링크 및 상품 추가·재고 입력·주문 상태 변경 문구가 상인 화면과 상인 메뉴에서 제거된 것을 확인
- 빌드 산출물 `build/src/app/page.merchant/view.html`에 신규 장사 중심 안내 화면 반영 확인
- 소비자·마켓버틀러 하단 메뉴 분기와 링크 유지 확인
- 외부 `/merchant/overview`, `/merchant/products`, `/merchant/orders` 경로 HTTP 200 확인

## 남은 리스크

- 오늘 판매 금액, 버틀러 처리 건수, 전달 알림은 현재 시연용 정적 데이터이며 실제 주문·정산 데이터 연동이 필요하다.
- 폐기된 products/orders 주소의 overview 이동은 소스와 빌드 기준으로 검증했으며, 로그인 세션을 포함한 브라우저 자동화 검증은 수행하지 않았다.
- 실제 방문·전화 전달 프로세스와 연락처 연동은 운영 정책 확정 후 연결이 필요하다.
