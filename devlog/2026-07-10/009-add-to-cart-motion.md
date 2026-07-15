# 장보기 상품의 장바구니 담기 모션 추가

- **ID**: 009
- **날짜**: 2026-07-10
- **유형**: 기능 추가
- **리뷰 ID**: riiqmtjsbmqtqnbtesblcwuzpqopxzmj

## 작업 요약

장보기 상품의 `+` 버튼을 누르면 상품 이모지가 하단 장바구니까지 곡선으로 이동하고, 도착 시 장바구니 아이콘이 반응하도록 구현했다.
저장과 배지 증가는 즉시 처리하며, 기존 차단형 성공 모달은 모션·배지·스크린리더 안내로 대체했다.

## 원문 요청사항

```text
음식을 사고 싶어서 +버튼을 누르면 장바구니에 담기긴하는데 담기는게 맞나? 이 생각이 들 때가 있어. 담기는 게 알 수 있게 +버튼을 눌럿을 때 장바구니로 담기는 모션 넣어줘
```

## 변경 파일 목록

- `src/app/page.posts/view.ts`: 상품 저장 후 곡선 이동·도착 반응 모션, 모션 축소 분기, 접근성 안내 상태 추가
- `src/app/page.posts/view.pug`: 스크린리더용 장바구니 담기 완료 상태 영역 추가
- `src/app/component.nav.sidebar/view.pug`: 상단·하단 장바구니 모션 목적지 식별 속성 추가
- `devlog.md`: 작업 요약 행 추가
- `devlog/2026-07-10/009-add-to-cart-motion.md`: 작업 상세 기록 추가

## 검증 결과

- `wiz_project_build(clean: false)`: 성공
- `git diff --check -- src/app/page.posts/view.ts src/app/page.posts/view.pug src/app/component.nav.sidebar/view.pug`: 성공
- 빌드 산출물에서 장바구니 목적지 속성, 모션 로직, `aria-live` 상태 영역 반영 확인
- 모의 DOM 실행으로 동일 상품 수량 3개 누적, 배지 갱신 이벤트 3회, 모션 2회, 임시 노드 2개 정리, `prefers-reduced-motion` 시 모션 생략 및 저장 유지 확인

## 남은 리스크

- 로컬 Headless 브라우저가 없어 실제 기기에서 모션 궤적과 체감 속도를 자동 캡처로 확인하지 못했다.
- 요청 화면인 `/posts`만 적용했으며 `/dashboard`, 상품 상세 화면의 장바구니 추가 동작은 기존 방식 그대로다.
