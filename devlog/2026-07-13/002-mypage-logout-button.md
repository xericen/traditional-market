# 내 정보 페이지 로그아웃 버튼 추가

- **ID**: 002
- **날짜**: 2026-07-13
- **유형**: 기능 추가
- **리뷰 ID**: xtwwzdpjgmzuywbmmbhcmvwpkqkiddft

## 작업 요약

내 정보 페이지의 상단 제목 영역 오른쪽에 모바일에서도 식별하기 쉬운 로그아웃 버튼을 추가했다.
기존 `/auth/logout` 라우트를 재사용하여 세션을 종료한 뒤 로그인 화면으로 이동하도록 연결했다.

## 원문 요청사항

```text
로그아웃버튼 만들어줘
```

## 변경 파일 목록

- `src/app/page.mypage/view.pug`
  - 내 프로필 제목 오른쪽에 로그아웃 아이콘과 붉은색 보조 버튼 추가
  - `/auth/logout?returnTo=/access/login` 경로로 기존 세션 종료 동작 연결
- `devlog.md`
  - 작업 요약 행 추가
- `devlog/2026-07-13/002-mypage-logout-button.md`
  - 사용자 원문 요청, 변경 파일, 검증 결과 기록

## 검증 결과

- WIZ 일반 빌드(`clean: false`) 성공
- `git diff --check -- src/app/page.mypage/view.pug` 통과
- 운영 URL의 로그아웃 경로가 HTTP 302로 `/access/login`에 리다이렉트되는 것을 확인
- 기존에 수정되어 있던 `page.mypage/view.pug`의 상단 여백 클래스는 그대로 보존

## 남은 리스크

- 인증된 실제 브라우저 세션에서 버튼 클릭 후 세션이 종료되는 전체 흐름은 자동화하지 못했다.
- 기존 워크트리에 이번 작업과 무관한 다수의 수정 및 미추적 파일이 남아 있다.
