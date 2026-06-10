const languageStorageKey = "crew-time-board-language";
const supportedLanguages = ["ko", "en"];
let currentLang = supportedLanguages.includes(localStorage.getItem(languageStorageKey))
  ? localStorage.getItem(languageStorageKey)
  : "ko";

const messages = {
  ko: {
    appTitle: "협업 시차 계산기",
    description: "서울, 뉴욕, LA 크루가 함께 회의 시간을 맞추는 협업 시차 계산기",
    eyebrow: "Collaboration Time Calculator",
    language: "언어",
    now: "NOW",
    currentTime: "현재 시간",
    meetingSettings: "회의 기준 시간 설정",
    base: "기준",
    meetingStart: "회의 시작",
    current: "현재",
    baseRegion: "기준 지역",
    date: "날짜",
    time: "시간",
    hourSelect: "시",
    minuteSelect: "분",
    moveWithinDay: "하루 안에서 이동",
    meetingTimeAdjust: "회의 시작 시간 조정",
    minus15Title: "15분 전",
    plus15Title: "15분 후",
    meetingLength: "회의 길이",
    participants: "참여 지역",
    editWorkHours: "업무시간 수정",
    workHoursDefaultHint: "기본값 10:00-19:00 · 타협 ±2시간",
    regionalWorkHours: "지역별 업무 기준",
    weekendHolidayExcluded: "주말과 공휴일은 업무시간에서 제외",
    defaultValue: "기본값",
    meetingSummary: "회의 요약",
    judgment: "판정",
    calculating: "계산 중",
    shareTextLabel: "공유 문구",
    copy: "복사",
    copied: "복사됨",
    selectedText: "선택됨",
    timeByRegion: "지역별 시간",
    localTime: "현지 시간",
    workApplied: "업무 기준 적용",
    recommendedMeetingTimes: "추천 회의 시간",
    recommendation: "추천",
    sameDayCandidates: "같은 날짜 후보",
    thirtyMinuteInterval: "30분 간격",
    flagSuffix: "국기",
    start: "시작",
    end: "종료",
    invalidWorkRange: "종료는 시작 이후여야 해요",
    baseDay: "기준일",
    nextDay: "다음날",
    previousDay: "전날",
    daySuffix: "일",
    weekend: "주말",
    holiday: "공휴일",
    workingHours: "업무시간",
    negotiable: "타협 가능",
    offHours: "비업무",
    notParticipating: "미참여",
    scoreGood: "좋음",
    scoreWarn: "타협 가능",
    scoreBad: "어려움",
    scoreTitleGood: "팀 적합도 좋음",
    scoreTitleWarn: "팀 적합도 보통",
    scoreTitleBad: "팀 적합도 낮음",
    hour: "시간",
    minute: "분",
    workHintPrefix: "업무 기준",
    compromiseShort: "타협 ±2h",
  },
  en: {
    appTitle: "Collaboration Time Calculator",
    description: "A collaboration time calculator for coordinating meetings across Seoul, New York, LA, and Amsterdam.",
    eyebrow: "Collaboration Time Calculator",
    language: "Language",
    now: "NOW",
    currentTime: "Current time",
    meetingSettings: "Meeting time settings",
    base: "Base",
    meetingStart: "Meeting start",
    current: "Now",
    baseRegion: "Base region",
    date: "Date",
    time: "Time",
    hourSelect: "Hour",
    minuteSelect: "Minute",
    moveWithinDay: "Move within day",
    meetingTimeAdjust: "Adjust meeting start time",
    minus15Title: "15 minutes earlier",
    plus15Title: "15 minutes later",
    meetingLength: "Meeting length",
    participants: "Participants",
    editWorkHours: "Edit working hours",
    workHoursDefaultHint: "Default 10:00-19:00 · compromise ±2h",
    regionalWorkHours: "Working hours by region",
    weekendHolidayExcluded: "Weekends and holidays are excluded",
    defaultValue: "Default",
    meetingSummary: "Meeting summary",
    judgment: "Fit",
    calculating: "Calculating",
    shareTextLabel: "Share text",
    copy: "Copy",
    copied: "Copied",
    selectedText: "Selected",
    timeByRegion: "Time by region",
    localTime: "Local time",
    workApplied: "Working hours applied",
    recommendedMeetingTimes: "Recommended meeting times",
    recommendation: "Recommendations",
    sameDayCandidates: "Same-day candidates",
    thirtyMinuteInterval: "30-min intervals",
    flagSuffix: "flag",
    start: "Start",
    end: "End",
    invalidWorkRange: "End must be later than start",
    baseDay: "base day",
    nextDay: "next day",
    previousDay: "previous day",
    daySuffix: "d",
    weekend: "Weekend",
    holiday: "Holiday",
    workingHours: "Working hours",
    negotiable: "Negotiable",
    offHours: "Off hours",
    notParticipating: "Not participating",
    scoreGood: "Good",
    scoreWarn: "Negotiable",
    scoreBad: "Difficult",
    scoreTitleGood: "Good team fit",
    scoreTitleWarn: "Moderate team fit",
    scoreTitleBad: "Low team fit",
    hour: "h",
    minute: "m",
    workHintPrefix: "Work hours",
    compromiseShort: "compromise ±2h",
  },
};

const zones = [
  {
    id: "Asia/Seoul",
    label: "서울",
    labels: { ko: "서울", en: "Seoul" },
    region: "한국",
    regions: { ko: "한국", en: "Korea" },
    flag: "🇰🇷",
    flagLabel: "대한민국",
    flagLabels: { ko: "대한민국", en: "South Korea" },
    holidayCalendar: "KR",
    accent: "#1d4ed8",
    defaultWorkStart: 10 * 60,
    defaultWorkEnd: 19 * 60,
    workStart: 10 * 60,
    workEnd: 19 * 60,
    selected: true,
  },
  {
    id: "America/New_York",
    label: "뉴욕",
    labels: { ko: "뉴욕", en: "New York" },
    region: "미국 동부",
    regions: { ko: "미국 동부", en: "U.S. East" },
    flag: "🇺🇸",
    flagLabel: "미국",
    flagLabels: { ko: "미국", en: "United States" },
    holidayCalendar: "US",
    accent: "#168a50",
    defaultWorkStart: 10 * 60,
    defaultWorkEnd: 19 * 60,
    workStart: 10 * 60,
    workEnd: 19 * 60,
    selected: true,
  },
  {
    id: "America/Los_Angeles",
    label: "LA",
    labels: { ko: "LA", en: "LA" },
    region: "미국 서부",
    regions: { ko: "미국 서부", en: "U.S. West" },
    flag: "🇺🇸",
    flagLabel: "미국",
    flagLabels: { ko: "미국", en: "United States" },
    holidayCalendar: "US",
    accent: "#c0265a",
    defaultWorkStart: 10 * 60,
    defaultWorkEnd: 19 * 60,
    workStart: 10 * 60,
    workEnd: 19 * 60,
    selected: true,
  },
  {
    id: "Europe/Amsterdam",
    label: "암스테르담",
    labels: { ko: "암스테르담", en: "Amsterdam" },
    region: "네덜란드",
    regions: { ko: "네덜란드", en: "Netherlands" },
    flagLabel: "네덜란드",
    flagLabels: { ko: "네덜란드", en: "Netherlands" },
    holidayCalendar: "NL",
    accent: "#d97706",
    defaultWorkStart: 10 * 60,
    defaultWorkEnd: 19 * 60,
    workStart: 10 * 60,
    workEnd: 19 * 60,
    selected: false,
    optional: true,
  },
];

const storageKey = "crew-time-board-work-hours";
let holidayCalendars = {};

const flagSvgs = {
  KR: `
    <svg class="flag-svg" viewBox="0 0 36 24" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="kr-taegeuk-clip">
          <circle cx="18" cy="12" r="5.2" />
        </clipPath>
      </defs>
      <rect width="36" height="24" rx="2" fill="#fff" />
      <circle cx="18" cy="12" r="5.2" fill="#cd2e3a" />
      <path
        clip-path="url(#kr-taegeuk-clip)"
        d="M12.8 13.6C14.05 10.2 16.95 10.2 18 12c1.05 1.8 3.95 1.8 5.2-1.6v6.8H12.8Z"
        fill="#0047a0"
      />
      <g fill="#111">
        <g transform="translate(9.2 6.2) rotate(-33)">
          <rect x="-3.6" y="-2.45" width="7.2" height="0.9" rx="0.12" />
          <rect x="-3.6" y="-0.45" width="7.2" height="0.9" rx="0.12" />
          <rect x="-3.6" y="1.55" width="7.2" height="0.9" rx="0.12" />
        </g>
        <g transform="translate(26.8 6.2) rotate(33)">
          <rect x="-3.6" y="-2.45" width="2.65" height="0.9" rx="0.12" /><rect x="0.95" y="-2.45" width="2.65" height="0.9" rx="0.12" />
          <rect x="-3.6" y="-0.45" width="7.2" height="0.9" rx="0.12" />
          <rect x="-3.6" y="1.55" width="2.65" height="0.9" rx="0.12" /><rect x="0.95" y="1.55" width="2.65" height="0.9" rx="0.12" />
        </g>
        <g transform="translate(9.2 17.8) rotate(33)">
          <rect x="-3.6" y="-2.45" width="7.2" height="0.9" rx="0.12" />
          <rect x="-3.6" y="-0.45" width="2.65" height="0.9" rx="0.12" /><rect x="0.95" y="-0.45" width="2.65" height="0.9" rx="0.12" />
          <rect x="-3.6" y="1.55" width="7.2" height="0.9" rx="0.12" />
        </g>
        <g transform="translate(26.8 17.8) rotate(-33)">
          <rect x="-3.6" y="-2.45" width="2.65" height="0.9" rx="0.12" /><rect x="0.95" y="-2.45" width="2.65" height="0.9" rx="0.12" />
          <rect x="-3.6" y="-0.45" width="2.65" height="0.9" rx="0.12" /><rect x="0.95" y="-0.45" width="2.65" height="0.9" rx="0.12" />
          <rect x="-3.6" y="1.55" width="2.65" height="0.9" rx="0.12" /><rect x="0.95" y="1.55" width="2.65" height="0.9" rx="0.12" />
        </g>
      </g>
    </svg>
  `,
  NL: `
    <svg class="flag-svg" viewBox="0 0 32 22" aria-hidden="true" focusable="false">
      <rect width="32" height="22" rx="2" fill="#fff" />
      <rect width="32" height="7.34" rx="2" fill="#ae1c28" />
      <rect width="32" height="7.34" y="14.66" rx="2" fill="#21468b" />
    </svg>
  `,
  US: `
    <svg class="flag-svg" viewBox="0 0 32 22" aria-hidden="true" focusable="false">
      <rect width="32" height="22" rx="2" fill="#fff" />
      <g fill="#b22234">
        <rect width="32" height="1.7" y="0" />
        <rect width="32" height="1.7" y="3.4" />
        <rect width="32" height="1.7" y="6.8" />
        <rect width="32" height="1.7" y="10.2" />
        <rect width="32" height="1.7" y="13.6" />
        <rect width="32" height="1.7" y="17" />
        <rect width="32" height="1.7" y="20.4" />
      </g>
      <rect width="14.4" height="11.9" fill="#3c3b6e" />
      <g fill="#fff">
        <circle cx="2.2" cy="2" r=".45" /><circle cx="4.6" cy="2" r=".45" /><circle cx="7" cy="2" r=".45" /><circle cx="9.4" cy="2" r=".45" /><circle cx="11.8" cy="2" r=".45" />
        <circle cx="3.4" cy="4" r=".45" /><circle cx="5.8" cy="4" r=".45" /><circle cx="8.2" cy="4" r=".45" /><circle cx="10.6" cy="4" r=".45" /><circle cx="13" cy="4" r=".45" />
        <circle cx="2.2" cy="6" r=".45" /><circle cx="4.6" cy="6" r=".45" /><circle cx="7" cy="6" r=".45" /><circle cx="9.4" cy="6" r=".45" /><circle cx="11.8" cy="6" r=".45" />
        <circle cx="3.4" cy="8" r=".45" /><circle cx="5.8" cy="8" r=".45" /><circle cx="8.2" cy="8" r=".45" /><circle cx="10.6" cy="8" r=".45" /><circle cx="13" cy="8" r=".45" />
        <circle cx="2.2" cy="10" r=".45" /><circle cx="4.6" cy="10" r=".45" /><circle cx="7" cy="10" r=".45" /><circle cx="9.4" cy="10" r=".45" /><circle cx="11.8" cy="10" r=".45" />
      </g>
    </svg>
  `,
};

const els = {
  liveClocks: document.querySelector("#liveClocks"),
  baseZone: document.querySelector("#baseZone"),
  baseDate: document.querySelector("#baseDate"),
  baseTime: document.querySelector("#baseTime"),
  baseTimePicker: document.querySelector("#baseTimePicker"),
  baseTimeButton: document.querySelector("#baseTimeButton"),
  baseTimeMenu: document.querySelector("#baseTimeMenu"),
  baseTimeHour: document.querySelector("#baseTimeHour"),
  baseTimeMinute: document.querySelector("#baseTimeMinute"),
  timeSlider: document.querySelector("#timeSlider"),
  sliderLabel: document.querySelector("#sliderLabel"),
  duration: document.querySelector("#duration"),
  nowButton: document.querySelector("#nowButton"),
  minus15: document.querySelector("#minus15"),
  plus15: document.querySelector("#plus15"),
  boardTitle: document.querySelector("#boardTitle"),
  zoneList: document.querySelector("#zoneList"),
  participants: document.querySelector("#participants"),
  workHours: document.querySelector("#workHours"),
  workHint: document.querySelector("#workHint"),
  resetWorkHours: document.querySelector("#resetWorkHours"),
  scoreTitle: document.querySelector("#scoreTitle"),
  scorePill: document.querySelector("#scorePill"),
  scoreMeter: document.querySelector("#scoreMeter"),
  shareText: document.querySelector("#shareText"),
  shareInput: document.querySelector("#shareInput"),
  copyButton: document.querySelector("#copyButton"),
  suggestions: document.querySelector("#suggestions"),
  langButtons: document.querySelectorAll("[data-lang-option]"),
};

const dateTimeFormatters = new Map();

function t(key) {
  return messages[currentLang]?.[key] ?? messages.ko[key] ?? key;
}

function applyZoneLanguage() {
  for (const zone of zones) {
    zone.label = zone.labels[currentLang] ?? zone.labels.ko;
    zone.region = zone.regions[currentLang] ?? zone.regions.ko;
    zone.flagLabel = zone.flagLabels[currentLang] ?? zone.flagLabels.ko;
  }
}

function dateLocale() {
  return currentLang === "en" ? "en-US" : "ko-KR";
}

function durationText(minutes) {
  if (currentLang === "en") {
    if (minutes >= 60 && minutes % 60 === 0) return `${minutes / 60}${t("hour")}`;
    if (minutes > 60 && minutes % 60 !== 0) {
      return `${Math.floor(minutes / 60)}${t("hour")} ${minutes % 60}${t("minute")}`;
    }
    return `${minutes}${t("minute")}`;
  }
  if (minutes >= 60 && minutes % 60 === 0) return `${minutes / 60}${t("hour")}`;
  if (minutes > 60 && minutes % 60 !== 0) {
    return `${Math.floor(minutes / 60)}${t("hour")} ${minutes % 60}${t("minute")}`;
  }
  return `${minutes}${t("minute")}`;
}

function formatter(timeZone, options, locale = "ko-KR") {
  const key = `${locale}:${timeZone}:${JSON.stringify(options)}`;
  if (!dateTimeFormatters.has(key)) {
    dateTimeFormatters.set(
      key,
      new Intl.DateTimeFormat(locale, { timeZone, ...options }),
    );
  }
  return dateTimeFormatters.get(key);
}

function partsFor(date, timeZone) {
  const parts = formatter(
    timeZone,
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    },
    "en-CA",
  ).formatToParts(date);

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );
}

function dateInputFor(date, timeZone) {
  const parts = partsFor(date, timeZone);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

function timeInputFor(date, timeZone) {
  const parts = partsFor(date, timeZone);
  return `${pad(parts.hour)}:${pad(parts.minute)}`;
}

function offsetMinutesFor(date, timeZone) {
  const parts = partsFor(date, timeZone);
  const localAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return Math.round((localAsUtc - date.getTime()) / 60000);
}

function zoneAbbr(date, timeZone) {
  const offsetMinutes = offsetMinutesFor(date, timeZone);
  const knownAbbreviations = {
    "Asia/Seoul": { 540: "KST" },
    "America/New_York": { "-300": "EST", "-240": "EDT" },
    "America/Los_Angeles": { "-480": "PST", "-420": "PDT" },
    "Europe/Amsterdam": { 60: "CET", 120: "CEST" },
  };

  const known = knownAbbreviations[timeZone]?.[String(offsetMinutes)];
  if (known) return known;

  const parts = formatter(
    timeZone,
    { timeZoneName: "short", hour: "2-digit", hourCycle: "h23" },
    "en-US",
  ).formatToParts(date);
  return parts.find((part) => part.type === "timeZoneName")?.value ?? "";
}

function utcOffsetLabel(date, timeZone) {
  const offsetMinutes = offsetMinutesFor(date, timeZone);
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absolute = Math.abs(offsetMinutes);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;
  return minutes === 0
    ? `UTC${sign}${hours}`
    : `UTC${sign}${hours}:${pad(minutes)}`;
}

function zoneTimeLabel(date, timeZone) {
  return `${zoneAbbr(date, timeZone)} (${utcOffsetLabel(date, timeZone)})`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function minutesToTime(minutes) {
  const safeMinutes = ((minutes % 1440) + 1440) % 1440;
  const hour = Math.floor(safeMinutes / 60);
  const minute = safeMinutes % 60;
  return `${pad(hour)}:${pad(minute)}`;
}

function timeToMinutes(time) {
  if (!/^\d{1,2}:\d{2}$/.test(time)) return 0;
  const [hour, minute] = time.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0;
  if (hour < 0 || hour > 24 || minute < 0 || minute > 59) return 0;
  if (hour === 24 && minute !== 0) return 0;
  return hour * 60 + minute;
}

function buildTimePickerOptions() {
  els.baseTimeHour.innerHTML = "";
  els.baseTimeMinute.innerHTML = "";

  for (let hour = 0; hour < 24; hour += 1) {
    const option = document.createElement("option");
    option.value = pad(hour);
    option.textContent = pad(hour);
    els.baseTimeHour.append(option);
  }

  for (let minute = 0; minute < 60; minute += 15) {
    const option = document.createElement("option");
    option.value = pad(minute);
    option.textContent = pad(minute);
    els.baseTimeMinute.append(option);
  }
}

function syncTimePickerDisplay() {
  const value = els.baseTime.value || "00:00";
  const [hour, minute] = value.split(":");
  els.baseTimeButton.textContent = value;
  els.baseTimeHour.value = pad(Number(hour) || 0);
  els.baseTimeMinute.value = pad(Number(minute) || 0);
}

function closeTimePicker() {
  els.baseTimeMenu.hidden = true;
  els.baseTimeButton.setAttribute("aria-expanded", "false");
}

function toggleTimePicker() {
  const nextOpen = els.baseTimeMenu.hidden;
  els.baseTimeMenu.hidden = !nextOpen;
  els.baseTimeButton.setAttribute("aria-expanded", String(nextOpen));
  if (nextOpen) els.baseTimeHour.focus();
}

function updateTimeFromPicker() {
  const minutes = Number(els.baseTimeHour.value) * 60 + Number(els.baseTimeMinute.value);
  els.baseTime.value = minutesToTime(minutes);
  syncTimeControlsFromZone();
}

function workHoursLabel(zone) {
  return `${minutesToTime(zone.workStart)}-${minutesToTime(zone.workEnd)}`;
}

function flagName(zone) {
  return `<span class="flag-label"><span class="flag" role="img" aria-label="${zone.flagLabel} ${t("flagSuffix")}">${flagSvgs[zone.holidayCalendar]}</span><span>${zone.label}</span></span>`;
}

function textFlagName(zone) {
  return zone.label;
}

function suggestionZoneName(zone) {
  return `${zone.holidayCalendar} ${zone.label}`;
}

function selectedZones() {
  return zones.filter((zone) => zone.selected);
}

function visibleZones() {
  return zones.filter((zone) => zone.selected || !zone.optional);
}

function syncParticipantInputs() {
  for (const zone of zones) {
    const input = els.participants.querySelector(
      `[data-participant-zone="${zone.id}"]`,
    );
    if (input) input.checked = zone.selected;
  }
}

function syncBaseZoneOptions() {
  const selectedValue = els.baseZone.value || "Asia/Seoul";
  els.baseZone.innerHTML = "";

  for (const zone of zones) {
    const option = document.createElement("option");
    option.value = zone.id;
    option.textContent = `${textFlagName(zone)} (${zone.region})`;
    els.baseZone.append(option);
  }

  els.baseZone.value = selectedValue;
}

function syncDurationOptions() {
  for (const option of els.duration.querySelectorAll("[data-duration-label]")) {
    option.textContent = durationText(Number(option.value));
  }
}

function applyStaticText() {
  document.documentElement.lang = currentLang;
  document.title = t("appTitle");
  document.querySelector('meta[name="description"]')?.setAttribute("content", t("description"));

  for (const element of document.querySelectorAll("[data-i18n]")) {
    element.textContent = t(element.dataset.i18n);
  }
  for (const element of document.querySelectorAll("[data-i18n-title]")) {
    element.setAttribute("title", t(element.dataset.i18nTitle));
  }
  for (const element of document.querySelectorAll("[data-i18n-aria]")) {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  }

  for (const button of els.langButtons) {
    button.classList.toggle("is-active", button.dataset.langOption === currentLang);
    button.setAttribute("aria-pressed", String(button.dataset.langOption === currentLang));
  }
}

function applyLanguage(lang, shouldRender = true) {
  currentLang = supportedLanguages.includes(lang) ? lang : "ko";
  localStorage.setItem(languageStorageKey, currentLang);
  applyZoneLanguage();
  applyStaticText();
  syncBaseZoneOptions();
  syncDurationOptions();
  buildParticipantControls();
  buildWorkHourControls();
  if (shouldRender) render();
}

function buildParticipantControls() {
  els.participants.innerHTML = "";

  for (const zone of zones) {
    const label = document.createElement("label");
    label.className = "participant-toggle";
    label.dataset.participantLabel = zone.id;
    label.style.setProperty("--zone-color", zone.accent);
    label.innerHTML = `
      <input data-participant-zone="${zone.id}" type="checkbox" ${zone.selected ? "checked" : ""} />
      <span class="participant-mark" aria-hidden="true"></span>
      ${flagName(zone)}
    `;

    const input = label.querySelector("input");
    input.addEventListener("change", () => {
      zone.selected = input.checked;
      if (selectedZones().length === 0) {
        zone.selected = true;
        input.checked = true;
      }
      syncParticipantInputs();
      render();
    });

    els.participants.append(label);
  }
}

function buildHolidayCalendars(data) {
  holidayCalendars = {};
  const calendars = data?.calendars ?? {};

  for (const [calendarId, holidays] of Object.entries(calendars)) {
    holidayCalendars[calendarId] = Object.fromEntries(
      holidays.map((holiday) => [holiday.date, holiday.name]),
    );
  }
}

async function loadHolidays() {
  try {
    const response = await fetch("./holidays.json?v=20260611-1", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Holiday load failed: ${response.status}`);
    buildHolidayCalendars(await response.json());
  } catch {
    holidayCalendars = {};
  }
}

function hourLabel(minutes) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return minute === 0 ? String(hour).padStart(2, "0") : minutesToTime(minutes);
}

function isValidWorkRange(start, end) {
  return (
    Number.isFinite(start) &&
    Number.isFinite(end) &&
    start >= 0 &&
    end <= 1440 &&
    start < end
  );
}

function loadWorkHours() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
    for (const zone of zones) {
      const range = saved[zone.id];
      if (!range) continue;
      const start = Number(range.start);
      const end = Number(range.end);
      if (isValidWorkRange(start, end)) {
        zone.workStart = start;
        zone.workEnd = end;
      }
    }
  } catch {
    localStorage.removeItem(storageKey);
  }
}

function saveWorkHours() {
  const payload = Object.fromEntries(
    zones.map((zone) => [
      zone.id,
      { start: zone.workStart, end: zone.workEnd },
    ]),
  );
  localStorage.setItem(storageKey, JSON.stringify(payload));
}

function resetWorkHours() {
  for (const zone of zones) {
    zone.workStart = zone.defaultWorkStart;
    zone.workEnd = zone.defaultWorkEnd;
  }
  localStorage.removeItem(storageKey);
  syncWorkHourInputs();
  render();
}

function syncWorkHourInputs() {
  if (!els.workHours) return;
  for (const zone of zones) {
    const startInput = els.workHours.querySelector(
      `[data-zone-id="${zone.id}"][data-work-edge="start"]`,
    );
    const endInput = els.workHours.querySelector(
      `[data-zone-id="${zone.id}"][data-work-edge="end"]`,
    );
    if (startInput) startInput.value = minutesToTime(zone.workStart);
    if (endInput) endInput.value = minutesToTime(zone.workEnd);
  }
}

function buildWorkHourControls() {
  els.workHours.innerHTML = "";

  for (const zone of zones) {
    const row = document.createElement("div");
    row.className = "work-hour-row";
    row.style.setProperty("--zone-color", zone.accent);
    row.innerHTML = `
      <div class="work-hour-zone">
        <span class="zone-dot" aria-hidden="true"></span>
        <strong>${flagName(zone)}</strong>
      </div>
      <label>
        <span>${t("start")}</span>
        <input data-zone-id="${zone.id}" data-work-edge="start" type="text" inputmode="numeric" pattern="[0-9]{2}:[0-9]{2}" placeholder="HH:MM" />
      </label>
      <label>
        <span>${t("end")}</span>
        <input data-zone-id="${zone.id}" data-work-edge="end" type="text" inputmode="numeric" pattern="[0-9]{2}:[0-9]{2}" placeholder="HH:MM" />
      </label>
      <small>${t("invalidWorkRange")}</small>
    `;

    const startInput = row.querySelector('[data-work-edge="start"]');
    const endInput = row.querySelector('[data-work-edge="end"]');
    const updateRange = () => {
      const start = timeToMinutes(startInput.value);
      const end = timeToMinutes(endInput.value);
      if (!isValidWorkRange(start, end)) {
        row.classList.add("is-invalid");
        return;
      }
      row.classList.remove("is-invalid");
      zone.workStart = start;
      zone.workEnd = end;
      saveWorkHours();
      render();
    };

    startInput.addEventListener("input", updateRange);
    startInput.addEventListener("change", updateRange);
    endInput.addEventListener("input", updateRange);
    endInput.addEventListener("change", updateRange);

    els.workHours.append(row);
  }

  syncWorkHourInputs();
}

function addMinutesToInput(minutesDelta) {
  const next = Number(els.timeSlider.value) + minutesDelta;
  const wrapped = ((next % 1440) + 1440) % 1440;
  els.timeSlider.value = String(wrapped);
  els.baseTime.value = minutesToTime(wrapped);
  syncTimePickerDisplay();
  render();
}

function zonedTimeToUtc(dateValue, timeValue, timeZone) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hour, minute] = timeValue.split(":").map(Number);
  const targetUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  let utc = targetUtc;

  for (let index = 0; index < 4; index += 1) {
    const parts = partsFor(new Date(utc), timeZone);
    const asUtc = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
    );
    const diff = asUtc - utc;
    const nextUtc = targetUtc - diff;
    if (nextUtc === utc) break;
    utc = nextUtc;
  }

  return new Date(utc);
}

function formatClock(date, timeZone, withSeconds = false) {
  return formatter(timeZone, {
    hour: "2-digit",
    minute: "2-digit",
    second: withSeconds ? "2-digit" : undefined,
    hourCycle: "h23",
  }).format(date);
}

function formatDate(date, timeZone) {
  return formatter(timeZone, {
    month: "short",
    day: "numeric",
    weekday: "short",
  }, dateLocale()).format(date);
}

function localMinutes(date, timeZone) {
  const parts = partsFor(date, timeZone);
  return parts.hour * 60 + parts.minute;
}

function localDayKey(date, timeZone) {
  const parts = partsFor(date, timeZone);
  return Date.UTC(parts.year, parts.month - 1, parts.day);
}

function isWeekend(date, timeZone) {
  const day = new Date(localDayKey(date, timeZone)).getUTCDay();
  return day === 0 || day === 6;
}

function holidayFor(date, zone) {
  const calendar = holidayCalendars[zone.holidayCalendar];
  if (!calendar) return null;
  return calendar[dateInputFor(date, zone.id)] ?? null;
}

function holidayLabel(holiday) {
  return currentLang === "en" && /[가-힣]/.test(holiday) ? t("holiday") : holiday;
}

function dayRelation(date, timeZone, baseDateValue) {
  const [year, month, day] = baseDateValue.split("-").map(Number);
  const baseKey = Date.UTC(year, month - 1, day);
  const diff = Math.round((localDayKey(date, timeZone) - baseKey) / 86400000);
  if (diff === 0) return t("baseDay");
  if (diff === 1) return t("nextDay");
  if (diff === -1) return t("previousDay");
  return currentLang === "en"
    ? `${diff > 0 ? "+" : ""}${diff}${t("daySuffix")}`
    : diff > 0 ? `+${diff}${t("daySuffix")}` : `${diff}${t("daySuffix")}`;
}

function compactDayTag(date, timeZone, baseDateValue) {
  const [year, month, day] = baseDateValue.split("-").map(Number);
  const baseKey = Date.UTC(year, month - 1, day);
  const diff = Math.round((localDayKey(date, timeZone) - baseKey) / 86400000);
  if (diff === 0) return "";
  return currentLang === "en"
    ? `(${diff > 0 ? "+" : ""}${diff}${t("daySuffix")})`
    : diff > 0 ? `(+${diff}${t("daySuffix")})` : `(${diff}${t("daySuffix")})`;
}

function rangeStatus(startMinute, duration, zone, instant) {
  const endMinute = startMinute + duration;
  const crossesMidnight = endMinute > 1440;
  const holiday = holidayFor(instant, zone);
  if (holiday) {
    return { key: "off", label: holidayLabel(holiday), score: 0 };
  }
  if (isWeekend(instant, zone.id)) {
    return { key: "off", label: t("weekend"), score: 0 };
  }
  const inFocus =
    !crossesMidnight &&
    startMinute >= zone.workStart &&
    endMinute <= zone.workEnd;
  const compromiseStart = Math.max(0, zone.workStart - 2 * 60);
  const compromiseEnd = Math.min(1440, zone.workEnd + 2 * 60);
  const inEdge =
    !crossesMidnight && startMinute >= compromiseStart && endMinute <= compromiseEnd;

  if (inFocus) {
    return { key: "focus", label: t("workingHours"), score: 2 };
  }
  if (inEdge) {
    return { key: "edge", label: t("negotiable"), score: 1 };
  }
  return { key: "off", label: t("offHours"), score: 0 };
}

function renderTimeline(timeline, startMinute, duration, zone) {
  timeline.innerHTML = "";
  const workStartPct = (zone.workStart / 1440) * 100;
  const workEndPct = (zone.workEnd / 1440) * 100;
  timeline.style.background = `linear-gradient(90deg, #dbe6ef 0 ${workStartPct}%, #dcefe5 ${workStartPct}% ${workEndPct}%, #dbe6ef ${workEndPct}% 100%)`;
  const firstWidth = Math.min(duration, 1440 - startMinute);
  const segments = [
    { left: startMinute, width: firstWidth },
    { left: 0, width: duration - firstWidth },
  ].filter((segment) => segment.width > 0);

  for (const segment of segments) {
    const node = document.createElement("span");
    node.className = "meeting-segment";
    node.style.setProperty("--left", `${(segment.left / 1440) * 100}%`);
    node.style.setProperty("--width", `${(segment.width / 1440) * 100}%`);
    timeline.append(node);
  }
}

function buildZoneRow(zone, instant, endInstant, duration, baseDateValue) {
  const startMinute = localMinutes(instant, zone.id);
  const status = zone.selected
    ? rangeStatus(startMinute, duration, zone, instant)
    : { key: "excluded", label: t("notParticipating"), score: 0 };
  const row = document.createElement("article");
  row.className = `zone-row ${zone.id === els.baseZone.value ? "is-base" : ""} ${
    zone.selected ? "" : "is-excluded"
  }`;
  row.style.setProperty("--zone-color", zone.accent);

  const zoneName = document.createElement("div");
  zoneName.className = "zone-name";
  zoneName.innerHTML = `
      <span class="zone-dot" aria-hidden="true"></span>
    <div>
      <strong>${flagName(zone)}</strong>
      <span>${zone.region} · ${zoneTimeLabel(instant, zone.id)}</span>
    </div>
  `;

  const timeMain = document.createElement("div");
  timeMain.className = "time-main";
  timeMain.innerHTML = `
    <strong>${formatClock(instant, zone.id)}-${formatClock(endInstant, zone.id)}</strong>
    <span>${formatDate(instant, zone.id)} · ${dayRelation(instant, zone.id, baseDateValue)}</span>
  `;

  const timelineWrap = document.createElement("div");
  timelineWrap.className = "timeline-wrap";
  timelineWrap.innerHTML = `
    <span class="status ${status.key}">${status.label}</span>
    <div class="timeline" aria-hidden="true"></div>
    <div class="timeline-labels" aria-hidden="true">
      <span>00</span><span>${hourLabel(zone.workStart)}</span><span>${hourLabel(zone.workEnd)}</span><span>24</span>
    </div>
  `;
  renderTimeline(timelineWrap.querySelector(".timeline"), startMinute, duration, zone);

  row.append(zoneName, timeMain, timelineWrap);
  return { row, status };
}

function scoreSummary(score, maxScore, statuses = []) {
  const hasUnavailable = statuses.some((status) => status.score === 0);
  const ratio = maxScore > 0 ? score / maxScore : 0;
  if (!hasUnavailable && ratio >= 0.8) return { label: t("scoreGood"), className: "good", title: t("scoreTitleGood") };
  if (!hasUnavailable && ratio >= 0.5) {
    return { label: t("scoreWarn"), className: "warn", title: t("scoreTitleWarn") };
  }
  return { label: t("scoreBad"), className: "bad", title: t("scoreTitleBad") };
}

function renderLiveClocks() {
  const now = new Date();
  const visible = visibleZones();
  els.liveClocks.dataset.count = String(visible.length);
  els.liveClocks.parentElement.classList.toggle("is-expanded", visible.length > 3);
  els.liveClocks.innerHTML = visible
    .map(
      (zone) => `
        <div class="live-clock">
          <span class="live-clock-name">${flagName(zone)}</span>
          <strong>${formatClock(now, zone.id, true)}</strong>
          <span class="live-clock-date">${formatDate(now, zone.id)}</span>
        </div>
      `,
    )
    .join("");
}

function renderSuggestions(baseDateValue, baseZone, duration) {
  const candidates = [];
  const selected = selectedZones();
  const maxScore = selected.length * 2;

  for (let minute = 0; minute < 1440; minute += 30) {
    const timeValue = minutesToTime(minute);
    const instant = zonedTimeToUtc(baseDateValue, timeValue, baseZone);
    let score = 0;
    const labels = [];
    const statuses = [];

    for (const zone of selected) {
      const status = rangeStatus(
        localMinutes(instant, zone.id),
        duration,
        zone,
        instant,
      );
      score += status.score;
      statuses.push(status);
      labels.push(
        `${suggestionZoneName(zone)} ${formatClock(instant, zone.id)}${compactDayTag(
          instant,
          zone.id,
          baseDateValue,
        )}`,
      );
    }

    const allAvailable = statuses.every((status) => status.score > 0);
    candidates.push({
      minute,
      timeValue,
      instant,
      score,
      maxScore,
      labels,
      statuses,
      allAvailable,
    });
  }

  candidates.sort((a, b) => {
    if (a.allAvailable !== b.allAvailable) return a.allAvailable ? -1 : 1;
    if (b.score !== a.score) return b.score - a.score;
    const current = Number(els.timeSlider.value);
    return Math.abs(a.minute - current) - Math.abs(b.minute - current);
  });

  els.suggestions.innerHTML = "";
  const availableCandidates = candidates.filter((candidate) => candidate.allAvailable);
  const visibleCandidates = availableCandidates.length > 0 ? availableCandidates : candidates;

  for (const candidate of visibleCandidates.slice(0, 5)) {
    const summary = scoreSummary(candidate.score, candidate.maxScore, candidate.statuses);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "suggestion";
    button.style.setProperty(
      "--accent",
      summary.className === "good"
        ? "var(--green)"
        : summary.className === "warn"
          ? "var(--amber)"
          : "var(--rose)",
    );
    button.innerHTML = `
      <strong>${candidate.timeValue} · ${summary.label}</strong>
      <span>${candidate.labels.join(" · ")}</span>
    `;
    button.addEventListener("click", () => {
      els.baseTime.value = candidate.timeValue;
      els.timeSlider.value = String(candidate.minute);
      syncTimePickerDisplay();
      render();
    });
    els.suggestions.append(button);
  }
}

function render() {
  const baseZone = els.baseZone.value;
  const baseDateValue = els.baseDate.value;
  const baseTimeValue = els.baseTime.value || "00:00";
  const duration = Number(els.duration.value);
  const instant = zonedTimeToUtc(baseDateValue, baseTimeValue, baseZone);
  const endInstant = new Date(instant.getTime() + duration * 60 * 1000);
  const selected = selectedZones();
  const maxScore = selected.length * 2;

  els.sliderLabel.textContent = baseTimeValue;
  els.boardTitle.textContent = selected.map((zone) => zone.label).join(" · ");
  els.workHint.innerHTML = `${t("workHintPrefix")} (${t("compromiseShort")}): ${selected
    .map((zone) => `${flagName(zone)} ${hourLabel(zone.workStart)}-${hourLabel(zone.workEnd)}`)
    .join(" · ")}`;
  els.zoneList.innerHTML = "";

  let score = 0;
  const displayPieces = [];
  const selectedStatuses = [];

  for (const zone of visibleZones()) {
    const { row, status } = buildZoneRow(
      zone,
      instant,
      endInstant,
      duration,
      baseDateValue,
    );
    if (zone.selected) {
      score += status.score;
      selectedStatuses.push(status);
      displayPieces.push(
        `${textFlagName(zone)} ${formatClock(instant, zone.id)}${compactDayTag(
          instant,
          zone.id,
          baseDateValue,
        )}`,
      );
    }
    els.zoneList.append(row);
  }

  const summary = scoreSummary(score, maxScore, selectedStatuses);
  els.scoreTitle.textContent = summary.title;
  els.scorePill.textContent = `${summary.label} · ${score}/${maxScore}`;
  els.scorePill.className = `score-pill ${summary.className}`;
  els.scoreMeter.style.width = `${Math.round((score / maxScore) * 100)}%`;

  const durationLabel = durationText(duration);
  const share = `${formatDate(instant, baseZone)} ${displayPieces.join(" / ")} · ${durationLabel}`;
  els.shareText.textContent = share;
  els.shareInput.value = share;

  renderSuggestions(baseDateValue, baseZone, duration);
  renderLiveClocks();
}

function syncTimeControlsFromZone() {
  els.timeSlider.value = String(timeToMinutes(els.baseTime.value || "00:00"));
  syncTimePickerDisplay();
  render();
}

function setNowInBaseZone() {
  const now = new Date();
  const rounded = Math.round(localMinutes(now, els.baseZone.value) / 15) * 15;
  els.baseDate.value = dateInputFor(now, els.baseZone.value);
  els.baseTime.value = minutesToTime(rounded);
  els.timeSlider.value = String(rounded % 1440);
  syncTimePickerDisplay();
  render();
}

async function init() {
  applyZoneLanguage();
  applyStaticText();
  syncBaseZoneOptions();
  syncDurationOptions();
  els.baseZone.value = "Asia/Seoul";
  await loadHolidays();
  loadWorkHours();
  buildTimePickerOptions();
  buildParticipantControls();
  buildWorkHourControls();
  setNowInBaseZone();
  renderLiveClocks();
  window.setInterval(renderLiveClocks, 1000);

  els.baseZone.addEventListener("change", setNowInBaseZone);
  els.baseDate.addEventListener("input", render);
  els.baseDate.addEventListener("change", render);
  els.baseTimeButton.addEventListener("click", toggleTimePicker);
  els.baseTimeHour.addEventListener("change", updateTimeFromPicker);
  els.baseTimeMinute.addEventListener("change", updateTimeFromPicker);
  document.addEventListener("click", (event) => {
    if (!els.baseTimePicker.contains(event.target)) closeTimePicker();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeTimePicker();
  });
  els.timeSlider.addEventListener("input", () => {
    els.baseTime.value = minutesToTime(Number(els.timeSlider.value));
    syncTimePickerDisplay();
    render();
  });
  els.duration.addEventListener("change", render);
  els.nowButton.addEventListener("click", setNowInBaseZone);
  els.resetWorkHours.addEventListener("click", resetWorkHours);
  els.minus15.addEventListener("click", () => addMinutesToInput(-15));
  els.plus15.addEventListener("click", () => addMinutesToInput(15));
  for (const button of els.langButtons) {
    button.addEventListener("click", () => applyLanguage(button.dataset.langOption));
  }
  els.copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(els.shareInput.value);
      els.copyButton.textContent = t("copied");
    } catch {
      els.shareInput.select();
      els.copyButton.textContent = t("selectedText");
    }
    window.setTimeout(() => {
      els.copyButton.textContent = t("copy");
    }, 1400);
  });
}

init();
