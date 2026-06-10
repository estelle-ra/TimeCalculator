# 협업 시차 계산기

서울, 뉴욕, LA 멤버가 함께 회의 시간을 맞출 수 있는 정적 웹앱입니다.

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
