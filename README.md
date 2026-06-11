# 협업 시차 계산기

필요한 오피스를 선택해 지역별 근무 시간, 공휴일, 시차를 비교하고 글로벌 팀의 회의 가능 시간을 찾는 정적 웹앱입니다.

## 배포

GitHub Pages에서 저장소 루트(`/`)를 publishing source로 설정하면 됩니다.

필요 파일:

- `index.html`
- `styles.css`
- `app.js`
- `holidays.json`
- `.nojekyll`

## 공휴일 업데이트

`holidays.json`의 `calendars.KR`과 `calendars.US`에 날짜와 이름을 추가하면 됩니다.

```json
{ "date": "2026-12-31", "name": "Company Holiday" }
```
