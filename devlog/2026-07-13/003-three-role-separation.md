# 상인·소비자·마켓버틀러 역할 분리

- **ID**: 003
- **날짜**: 2026-07-13
- **유형**: 버그 수정
- **리뷰 ID**: jqxnpnfixjdhkudyyireehpdivhplztq

## 작업 요약

이전 화면에서 상인 역할이 마켓버틀러로 잘못 표시된 문제를 바로잡고, 서비스 역할을 상인·소비자·마켓버틀러 세 가지로 명확히 분리했다.
기존 내부 `admin` 권한은 DB와 접근 제어의 호환성을 위해 유지하되 사용자 화면에서는 마켓버틀러로 표시하고, 버틀러 계정은 공개 가입이 아닌 홍천상인회 발급 방식으로 안내했다.

## 원문 요청사항

```text
그러면 역할이 3개여야하는 거 아니야? 상인, 소비자, 버클러
```

## 변경 파일 목록

### 역할 선택·공통 내비게이션

- `src/app/page.access/view.ts`
  - 가입 유형을 상인·소비자·마켓버틀러로 표시
  - 마켓버틀러는 상인회 발급 계정으로 비활성 안내
  - 상인 가입 버튼과 설명을 원래 역할에 맞게 복원
- `src/app/page.access/view.pug`
  - 세 역할 카드와 발급 정책 안내 표시
- `src/app/component.nav.sidebar/view.ts`
  - 내부 `admin`은 마켓버틀러, `merchant`는 상인 점포, `consumer`는 소비자로 표시
- `src/app/component.nav.sidebar/view.pug`
  - 상인 메뉴와 마켓버틀러 운영 메뉴를 각각 분리

### 역할별 화면

- `src/app/page.merchant/view.pug`
  - 상인 전용 점포 화면과 마켓버틀러 지원 범위를 명확화
- `src/app/page.admin/view.pug`
  - 관리자 표현을 마켓버틀러 운영 콘솔로 변경
- `src/app/page.members/view.ts`
  - 세 역할 필터 순서와 `admin` 표시명을 마켓버틀러로 변경
- `src/app/page.members/view.pug`
  - 계정 발급 역할 목록에서 마켓버틀러 명칭 사용
- `src/app/page.mypage/view.ts`
  - 내부 역할값을 사용자용 역할명으로 변환하는 함수 추가
- `src/app/page.mypage/view.pug`
  - 프로필 역할 배지에 상인·소비자·마켓버틀러 명칭 표시
- `src/model/struct/user.py`
  - 신규 기본 운영 계정 이름과 설명을 마켓버틀러 기준으로 정리

### 작업 이력

- `devlog.md`
  - 2026-07-13 ID 003 요약 행 추가
- `devlog/2026-07-13/003-three-role-separation.md`
  - 사용자 원문 요청, 변경 파일, 검증 결과 기록

## 검증 결과

- WIZ 일반 빌드(`clean: false`) 성공, EsBuild 오류 없음
- `git diff --check` 통과
- 소스에서 상인·소비자·마켓버틀러 세 역할 표기 확인
- 기존 내부 권한값 `admin / merchant / consumer`와 공개 가입 허용값 `merchant / consumer` 유지 확인
- 외부 `/access/signup`, `/merchant/overview`, `/admin/overview`, `/dashboard` 경로 모두 HTTP 200 확인

## 남은 리스크

- 내부 권한 키 `admin`은 기존 DB·컨트롤러 호환성을 위해 유지되며, 화면에서만 마켓버틀러로 표시한다.
- 기존 DB의 기본 운영 계정 이름이 이미 `관리자`로 저장되어 있다면 이름 필드는 자동 변경되지 않지만 역할 배지는 마켓버틀러로 표시된다.
- 역할별 실제 로그인 후 전체 화면 이동은 브라우저 자동화 없이 빌드·라우팅·소스 기준으로 검증했다.
