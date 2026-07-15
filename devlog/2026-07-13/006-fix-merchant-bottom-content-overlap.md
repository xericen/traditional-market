# 상인 화면 최하단 콘텐츠 가림 해소

- **ID**: 006
- **날짜**: 2026-07-13
- **유형**: 버그 수정
- **리뷰 ID**: farqcubpaelqecnvcwlbcusvhumnjgcz

## 작업 요약

상인 화면을 끝까지 스크롤해도 하단 고정 메뉴가 버틀러 지원 카드의 두 번째 행을 가리던 문제를 수정했다.
실제 콘텐츠 흐름 끝에 충분한 여백을 확보하고 지원 카드 높이를 줄여, 상품 촬영부터 주문·검수까지 네 항목을 모두 확인할 수 있도록 정리했다.

## 원문 요청사항

```text
# ReviewOps Codex 작업 요청

아래 요청을 현재 프로젝트 루트에서 처리하세요. 필요한 파일을 직접 수정하고, 마지막 응답은 한국어로 간결하게 작성하세요.
스트리밍 응답은 사용하지 않습니다. 작업이 끝난 뒤 변경 요약, 확인한 내용, 남은 리스크만 정리하세요.
이 작업의 세션 단위는 아래 리뷰 ID입니다. 리뷰 ID가 같으면 같은 Codex 히스토리 맥락으로 이어서 처리하세요.

## 사용자 요청

현재 이게 맨 아래까지 내린건데 상품 촬영 아래있는 것은 볼 수 없음 이 부분 전반적으로 수정해줘

## 리뷰 요약

- 리뷰 ID: farqcubpaelqecnvcwlbcusvhumnjgcz
- 제목: 상인 역할 흐름
- 요청 링크: https://market.seasonai.net/merchant/overview
- Codex 요청자: 김민주
- 프로젝트 루트: /opt/app
- Codex 세션 ID: 019f5967-9798-7083-80b1-ab10b22507e2
- Codex 모델: 5.6 sol (gpt-5.6-sol)
- Codex 추론수준: ultra (ultra)
- 스크린샷 컨텍스트: 2번 첨부됨
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

## 스크린샷

스크린샷은 Codex 이미지 입력으로 함께 전달되었습니다.
```

## 변경 파일 목록

### 상인 화면

- `src/app/page.merchant/view.pug`
  - 실제 콘텐츠 최하단 패딩을 24px에서 128px로 확대
  - 하단 메뉴와 안전 영역을 피해 마지막 카드가 완전히 스크롤되도록 조정
  - 버틀러 지원 4개 카드를 세로형에서 압축 가로형으로 재배치
  - 아이콘 배경과 짧은 설명을 구분해 작은 화면에서 정보 식별성 개선

### 작업 이력

- `devlog.md`
  - 2026-07-13 ID 006 요약 행 추가
- `devlog/2026-07-13/006-fix-merchant-bottom-content-overlap.md`
  - 사용자 원문 요청, 변경 파일, 검증 결과 기록

## 검증 결과

- WIZ 일반 빌드(`clean: false`) 성공, EsBuild 오류 없음
- `git diff --check` 통과
- 빌드 산출물 `build/src/app/page.merchant/view.html`에서 `pb-32`와 지원 카드 4개 반영 확인
- 번들 CSS에서 `.pb-32 { padding-bottom: 8rem; }` 생성 확인
- 기존 `pb-6` 상인 콘텐츠 패턴이 제거된 것을 소스 검색으로 확인
- 외부 `/merchant/overview` 경로 HTTP 200 확인
- 공통 레이아웃과 소비자·마켓버틀러 화면은 수정하지 않아 역할별 하단 도크 구조 유지

## 남은 리스크

- 로그인 세션을 포함한 실제 브라우저 최하단 스크롤은 자동화하지 못했으며, 소스·빌드 산출물 기준으로 검증했다.
- 매우 큰 사용자 지정 글꼴을 적용하면 카드 문구가 두 줄 이상으로 늘어날 수 있다.
