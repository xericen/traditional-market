# 회원가입 마켓버틀러 선택 항목 제거

- **ID**: 004
- **날짜**: 2026-07-13
- **유형**: 디자인 수정
- **리뷰 ID**: hqitgritkgeaydqeemzbhowtgjaeaswg

## 작업 요약

회원가입 유형에 비활성 카드로 표시되던 마켓버틀러 항목을 제거했다.
가입 유형은 상인과 소비자 2열만 남기고, 화면의 가입 안내 문구에서도 마켓버틀러 역할 설명을 제거했다.

## 원문 요청사항

```text
마켓 버클러 없애줘,
```

## 변경 파일 목록

- `src/app/page.access/view.ts`
  - signupRoles에서 비활성 admin·마켓버틀러 카드 제거
  - 비활성 역할 전용 스타일 분기 제거
- `src/app/page.access/view.pug`
  - 가입 유형을 3열에서 상인·소비자 2열로 변경
  - 비활성 마켓버틀러 라디오 속성 제거
  - 상단·폼 안내·하단의 마켓버틀러 역할 안내 문구 정리
- `devlog.md`
- `devlog/2026-07-13/004-remove-market-butler-signup-option.md`
  - 작업 요약 및 상세 이력 기록

## 검증 결과

- WIZ 일반 빌드(`clean: false`) 성공
- page.access 소스와 컴파일 HTML에서 마켓버틀러 한글 표기가 제거됐음을 확인
- signupRoles가 merchant·consumer 두 항목만 포함하고 admin 항목이 없음을 확인
- 생성 번들에서 마켓버틀러 가입 카드와 admin 선택값 제거 확인
- `/access/login`, `/access/signup` 로컬 HTTP 200 확인
- `git diff --check` 통과

## 남은 리스크

- 실행 환경에 Headless 브라우저가 없어 실제 화면 캡처 기반 시각 회귀 테스트는 수행하지 못했다.
