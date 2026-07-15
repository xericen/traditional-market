# marketdb MySQL 연결 및 서비스 빌드

- **ID**: 001
- **날짜**: 2026-07-10
- **유형**: 설정 변경
- **리뷰 ID**: refqucxiltgmstiqlyldmwkjqseobrci

## 작업 요약

비어 있던 MySQL 서버에 `marketdb` 스키마와 최소 권한 애플리케이션 계정을 구성하고, 프로젝트의 `base` 및 `post` ORM namespace를 해당 DB에 연결했다.
WIZ 일반 빌드를 수행해 누락되어 있던 서비스 번들을 생성하고 로컬 및 외부 도메인의 404 복구와 실제 ORM 연결을 확인했다.

## 원문 요청사항

```text
리뷰어 요청 실행해줘
```

ReviewOps가 전달한 DB 비밀번호는 보안상 Git 추적 대상인 devlog에 복제하지 않았으며, Git에서 제외되는 런타임 설정에만 반영했다.

## 변경 파일 목록

- `config/database.py`
  - `base`, `post` namespace를 동일한 MySQL `marketdb` 스키마에 연결
  - 최소 권한 전용 계정과 `utf8mb4` 설정 적용
- `devlog.md`
  - 본 작업 요약 행 추가
- `devlog/2026-07-10/001-marketdb-connection.md`
  - 요청, 변경 내역 및 검증 결과 기록
- `build/`, `bundle/`
  - WIZ 일반 빌드로 생성된 Git 제외 산출물

## 외부 환경 변경

- MySQL에 `marketdb` 스키마 생성
- `marketdb_app` 전용 계정 생성 및 해당 스키마 범위의 CRUD/테이블 관리 권한 부여
- MySQL 기본 인증 방식 지원을 위해 WIZ Python 환경에 `cryptography 49.0.0` 설치

## 검증 결과

- WIZ 일반 빌드 성공
- `bundle/www/index.html` 및 `bundle/config/database.py` 생성 확인
- 로컬 `/`, `/access` 응답 200 확인
- `https://market.seasonai.net/`, `/access` 응답 200 확인
- 앱 로그인 API가 기대한 유효성 오류를 반환하며 ORM을 통해 `user` 테이블을 생성하는 것 확인
- 게시물 카테고리 API가 code 200과 빈 목록을 반환하며 `post`, `comment` 테이블을 생성하는 것 확인
- 전용 계정의 `SELECT 1` 성공 및 트랜잭션 쓰기/rollback 검증 성공
- 최종 테이블 `user`, `post`, `comment` 존재, 테스트 데이터 잔존 없음

## 남은 리스크

- 현재 WIZ MySQL 어댑터는 TLS 옵션을 전달하지 않아 DB 전송 구간의 서버 인증/암호화가 적용되지 않는다.
- 빌드 중 npm audit 기준 56개 취약점(7 low, 17 moderate, 32 high)이 보고되었으며 본 DB 연결 범위에서는 변경하지 않았다.
- `config/database.py`는 Git 제외 런타임 파일이므로 새 배포 환경에서는 안전한 비밀 주입 절차로 별도 구성해야 한다.
