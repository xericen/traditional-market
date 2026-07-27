# admin 총괄관리자 로그인 복구

- **ID**: 004
- **날짜**: 2026-07-24
- **유형**: 계정·인증
- **리뷰 ID**: krhxisaoqtscvkwrmtwqhhtlpignpynb

## 작업 요약
`admin/[REDACTED]` 로그인이 실패하는 원인을 운영 DB에서 확인하고 총괄관리자 계정의 비밀번호를 재설정했습니다.
기존 `super_admin` 역할과 전체 RBAC 권한은 유지하면서 요청한 로그인 조합을 bcrypt 비밀번호로 적용했습니다.

## 원문 요청사항
```text
admin/ [REDACTED]은 왜 로그인 안돼?
```

## 원인
- `admin` 계정과 `super_admin` 역할은 정상적으로 존재했습니다.
- DB에 저장된 기존 bcrypt 비밀번호가 `admin`과 일치하지 않아 로그인 API가 401을 반환했습니다.

## 변경 내용
- 운영 DB `user` 테이블
  - `admin` 계정의 역할을 `super_admin`으로 유지
  - 요청된 비밀번호를 새 bcrypt 해시로 저장
- `devlog.md`, `devlog/2026-07-24/004-admin-login-recovery.md`
  - 원인, 조치 및 검증 결과 기록

## 확인 결과
- `admin/[REDACTED]` 실서비스 로그인 200 확인
- 로그인 역할 `super_admin`, 목적지 `/admin/overview` 확인
- 총괄관리자 전체 20개 RBAC 권한 일치 확인
- 계정 관리 API 정상 접근 확인
- `admin2` 상품관리자와 `admin3` 주문관리자 로그인 회귀 확인
- `git diff --check` 통과

## 남은 리스크
- 총괄관리자 비밀번호는 검토가 끝나면 프로필에서 강한 값으로 변경해야 합니다.
