# 상단 장바구니·내 정보·로그아웃 버튼 제거

- **ID**: 010
- **날짜**: 2026-07-10
- **유형**: 디자인 수정
- **리뷰 ID**: kivzbnospxwlmlhzprlklajyukapxgzi

## 작업 요약

공통 모바일 헤더에서 상단 장바구니, 내 정보(프로필), 로그아웃 버튼을 제거했다.
하단 장바구니와 내 정보 내비게이션, 장바구니 수량 배지 및 담기 모션은 기존대로 유지했다.

## 원문 요청사항

```text
상단에 장바구니, 프러필 로그아웃 버튼 다 삭제해줘
```

## 변경 파일 목록

- `src/app/component.nav.sidebar/view.pug`: 상단 장바구니·내 정보·로그아웃 버튼 블록 제거
- `src/app/component.nav.sidebar/view.ts`: 상단 로그아웃 버튼 전용 미사용 `logout()` 메서드 제거
- `devlog.md`: 작업 요약 행 추가
- `devlog/2026-07-10/010-remove-header-actions.md`: 작업 상세 기록 추가

## 검증 결과

- `wiz_project_build(clean: false)`: 성공
- `git diff --check -- src/app/component.nav.sidebar/view.pug src/app/component.nav.sidebar/view.ts`: 성공
- 빌드된 공통 헤더에서 상단 `/cart`, `/mypage`, `logout()` 요소가 없고 상품 검색 버튼은 유지됨을 확인
- 하단 `data-cart-motion-target="bottom"` 장바구니 링크와 내 정보 메뉴가 유지됨을 확인

## 남은 리스크

- 인증 세션이 필요한 실제 브라우저 화면에서의 시각적 확인은 수행하지 못했다.
