# 휴대폰 프레임 외부 배경 흰색 적용

- **ID**: 004
- **날짜**: 2026-07-10
- **유형**: UI/UX 개선
- **리뷰 ID**: ujbobndvpbcumbcrwrdpvxyrzychcqrm

## 작업 요약

데스크톱 리뷰 화면에서 휴대폰 프레임 바깥에 표시되던 베이지색·그라데이션 배경을 순백색으로 변경했다.
휴대폰 테두리, 그림자와 앱 내부의 아이보리·초록·주황 디자인은 그대로 유지했다.

## 원문 요청사항

```text
핸드폰 외의 배경은 흰색으로 바꿔줘
```

## 변경 파일 목록

- `src/app/layout.empty/view.scss`
  - 로그인 휴대폰 프레임 외부 stage와 layout host 배경을 흰색으로 변경
- `src/app/layout.sidebar/view.scss`
  - 소비자·운영 휴대폰 프레임 외부 stage 배경을 흰색으로 변경
- `src/angular/styles/styles.scss`
  - body 및 공통 desktop stage 배경의 흰색 fallback 적용
  - 실제 모바일 전체 화면의 앱 내부 배경은 기존 색상 유지

## 검증 결과

- WIZ 일반 빌드 성공
  - `EsBuild complete`, errors 없음
- 최종 번들에서 외부 베이지 배경값 `#e9e2d8` 0건 확인
- 최종 번들에 흰색 stage 배경 포함 확인
- 로컬 및 외부 `/access`, `/dashboard`, `/admin/overview` HTTP 200 확인
- 외부 `main.js`에도 기존 외부 베이지 배경값이 남지 않은 것 확인
- `git diff --check` 통과
- WIZ 로그에서 신규 Error/Traceback/Angular 오류 없음

## 남은 리스크

- 기존 브라우저가 이전 CSS/JS를 캐시한 경우 강력 새로고침 후 확인이 필요할 수 있다.
