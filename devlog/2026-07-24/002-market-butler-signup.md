# 마켓 버틀러 회원가입 및 승인 흐름 추가

- **ID**: 002
- **날짜**: 2026-07-24
- **유형**: 회원가입·권한
- **리뷰 ID**: krhxisaoqtscvkwrmtwqhhtlpignpynb

## 작업 요약
회원가입 화면에 마켓 버틀러 유형을 추가했습니다.
공개 가입 직후 운영 권한이 노출되지 않도록 계정은 승인 대기로 생성하며, 총괄관리자가 회원 관리 화면에서 승인한 뒤에만 마켓 버틀러 운영 화면과 권한을 사용할 수 있게 연결했습니다.

## 원문 요청사항
```text
회원가입에 버틀러도 회원가입할 수 있게 만들어줘.
```

## 변경 파일 목록
- `src/app/page.access/view.pug`, `src/app/page.access/view.ts`: 마켓 버틀러 가입 카드, 승인 안내, 신청 완료 처리 추가
- `src/app/page.access/api.py`: 마켓 버틀러 가입 허용, 승인 대기 자동 로그인 차단, 대기 계정 로그인 안내 추가
- `src/model/struct/rbac.py`, `src/model/struct/user.py`: `market_butler`·`butler_pending` 역할, 최소 운영 권한, 가입 대기 저장 규칙 추가
- `src/app/page.members/view.pug`, `src/app/page.members/view.ts`: 승인 대기 역할 표시와 총괄관리자 전용 마켓 버틀러 승인 버튼 추가
- `src/controller/admin.py`, `src/controller/consumer.py`, `src/controller/merchant.py`, `src/controller/superadmin.py`, `src/controller/user.py`: 승인된 마켓 버틀러의 운영 화면 목적지 연결
- `src/app/layout.sidebar/view.ts`, `src/app/component.nav.sidebar/view.ts`: 승인된 마켓 버틀러의 관리자 레이아웃·메뉴 진입 연결
- `src/app/page.mypage/view.pug`, `src/app/page.mypage/view.ts`: 마켓 버틀러 역할명과 배지 표시 추가
- `devlog.md`, `devlog/2026-07-24/002-market-butler-signup.md`: 작업 요약 및 상세 기록

## 확인 결과
- WIZ 일반 빌드(`clean: false`) 성공
- `npm run check:python`: Python 33개 파일 문법 검사 통과
- 회원가입·승인·RBAC assertion 통과
  - 마켓 버틀러 신청 계정이 `butler_pending`으로 저장되고 권한이 비어 있는지 확인
  - 승인 후 `market_butler`로 전환되고 상품·재고·숏폼·주문·검수·배송 운영 권한이 부여되는지 확인
  - 계정 관리·시스템 정책·백업·로그·통계 수정·상품 삭제 권한이 부여되지 않는지 확인
  - `admin`·`super_admin` 공개 회원가입이 거부되는지 확인
- 회원가입 API 흐름 assertion 통과
  - 대기 계정 자동 로그인 차단 및 승인 안내 확인
  - 기존 상인 회원가입·목적지 유지 확인
  - 승인 대기 계정 로그인 403 안내 확인
- `git diff --check` 통과
- `https://market.seasonai.net/access/signup` HTTP 200 응답 확인

## 남은 리스크
- 실제 회원가입은 운영 DB에 계정을 생성하므로 검증 과정에서는 테스트 계정을 만들지 않았습니다.
- 연락처 본인 확인, 가입 시도 제한, CAPTCHA는 아직 없어 승인 대기 단계에서 총괄관리자가 신청자를 확인해야 합니다.
- 관리자 운영 화면의 상품·주문 데이터는 기존과 같이 프런트엔드 데모 데이터이며, 영속 API 연결 시 동일한 서버 권한 검사가 필요합니다.
