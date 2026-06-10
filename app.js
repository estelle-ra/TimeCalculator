const zones = [
  {
    id: "Asia/Seoul",
    label: "서울",
    region: "한국",
    flag: "🇰🇷",
    flagLabel: "대한민국",
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
    region: "미국 동부",
    flag: "🇺🇸",
    flagLabel: "미국",
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
    region: "미국 서부",
    flag: "🇺🇸",
    flagLabel: "미국",
    holidayCalendar: "US",
    accent: "#c0265a",
    defaultWorkStart: 10 * 60,
    defaultWorkEnd: 19 * 60,
    workStart: 10 * 60,
    workEnd: 19 * 60,
    selected: true,
  },
];

const storageKey = "crew-time-board-work-hours";
let holidayCalendars = {};

const els = {
  liveClocks: document.querySelector("#liveClocks"),
  baseZone: document.querySelector("#baseZone"),
  baseDate: document.querySelector("#baseDate"),
  baseTime: document.querySelector("#baseTime"),
  timeSlider: document.querySelector("#timeSlider"),
  sliderLabel: document.querySelector("#sliderLabel"),
  duration: document.querySelector("#duration"),
  nowButton: document.querySelector("#nowButton"),
  minus15: document.querySelector("#minus15"),
  plus15: document.querySelector("#plus15"),
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
};

const dateTimeFormatters = new Map();

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

function zoneAbbr(date, timeZone) {
  const parts = formatter(
    timeZone,
    { timeZoneName: "short", hour: "2-digit", hourCycle: "h23" },
    "en-US",
  ).formatToParts(date);
  return parts.find((part) => part.type === "timeZoneName")?.value ?? "";
}

function utcOffsetLabel(date, timeZone) {
  const parts = partsFor(date, timeZone);
  const localAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  const offsetMinutes = Math.round((localAsUtc - date.getTime()) / 60000);
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
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function workHoursLabel(zone) {
  return `${minutesToTime(zone.workStart)}-${minutesToTime(zone.workEnd)}`;
}

function flagName(zone) {
  return `<span class="flag" role="img" aria-label="${zone.flagLabel} 국기">${zone.flag}</span><span>${zone.label}</span>`;
}

function textFlagName(zone) {
  return `${zone.flag} ${zone.label}`;
}

function selectedZones() {
  return zones.filter((zone) => zone.selected);
}

function syncParticipantInputs() {
  for (const zone of zones) {
    const input = els.participants.querySelector(
      `[data-participant-zone="${zone.id}"]`,
    );
    if (input) input.checked = zone.selected;
  }
}

function buildParticipantControls() {
  els.participants.innerHTML = "";

  for (const zone of zones) {
    const label = document.createElement("label");
    label.className = "participant-toggle";
    label.dataset.participantLabel = zone.id;
    label.style.setProperty("--zone-color", zone.accent);
    label.innerHTML = `
      <input data-participant-zone="${zone.id}" type="checkbox" checked />
      <span class="participant-mark" aria-hidden="true"></span>
      <span>${flagName(zone)}</span>
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
    const response = await fetch("./holidays.json?v=20260610-1", {
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
        <span>시작</span>
        <input data-zone-id="${zone.id}" data-work-edge="start" type="time" step="900" />
      </label>
      <label>
        <span>종료</span>
        <input data-zone-id="${zone.id}" data-work-edge="end" type="time" step="900" />
      </label>
      <small>종료는 시작 이후여야 해요</small>
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
  }).format(date);
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

function dayRelation(date, timeZone, baseDateValue) {
  const [year, month, day] = baseDateValue.split("-").map(Number);
  const baseKey = Date.UTC(year, month - 1, day);
  const diff = Math.round((localDayKey(date, timeZone) - baseKey) / 86400000);
  if (diff === 0) return "기준일";
  if (diff === 1) return "다음날";
  if (diff === -1) return "전날";
  return diff > 0 ? `+${diff}일` : `${diff}일`;
}

function compactDayTag(date, timeZone, baseDateValue) {
  const [year, month, day] = baseDateValue.split("-").map(Number);
  const baseKey = Date.UTC(year, month - 1, day);
  const diff = Math.round((localDayKey(date, timeZone) - baseKey) / 86400000);
  if (diff === 0) return "";
  return diff > 0 ? `(+${diff}일)` : `(${diff}일)`;
}

function rangeStatus(startMinute, duration, zone, instant) {
  const endMinute = startMinute + duration;
  const crossesMidnight = endMinute > 1440;
  const holiday = holidayFor(instant, zone);
  if (holiday) {
    return { key: "off", label: holiday, score: 0 };
  }
  if (isWeekend(instant, zone.id)) {
    return { key: "off", label: "주말", score: 0 };
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
    return { key: "focus", label: "업무시간", score: 2 };
  }
  if (inEdge) {
    return { key: "edge", label: "타협 가능", score: 1 };
  }
  return { key: "off", label: "비업무", score: 0 };
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
    : { key: "excluded", label: "미참여", score: 0 };
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
  if (!hasUnavailable && ratio >= 0.8) return { label: "좋음", className: "good", title: "팀 적합도 좋음" };
  if (!hasUnavailable && ratio >= 0.5) {
    return { label: "타협 가능", className: "warn", title: "팀 적합도 보통" };
  }
  return { label: "어려움", className: "bad", title: "팀 적합도 낮음" };
}

function renderLiveClocks() {
  const now = new Date();
  els.liveClocks.innerHTML = zones
    .map(
      (zone) => `
        <div class="live-clock">
          <div class="live-clock-top">
            <span class="live-clock-name">${flagName(zone)}</span>
            <span class="live-now">NOW</span>
          </div>
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
        `${textFlagName(zone)} ${formatClock(instant, zone.id)}${compactDayTag(
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
  els.workHint.textContent = `업무 기준(타협 ±2h): ${selected
    .map((zone) => `${textFlagName(zone)} ${hourLabel(zone.workStart)}-${hourLabel(zone.workEnd)}`)
    .join(" · ")}`;
  els.zoneList.innerHTML = "";

  let score = 0;
  const displayPieces = [];
  const selectedStatuses = [];

  for (const zone of zones) {
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

  const durationLabel =
    duration >= 60 && duration % 60 === 0
      ? `${duration / 60}시간`
      : `${duration}분`;
  const share = `${formatDate(instant, baseZone)} ${displayPieces.join(" / ")} · ${durationLabel}`;
  els.shareText.textContent = share;
  els.shareInput.value = share;

  renderSuggestions(baseDateValue, baseZone, duration);
}

function syncTimeControlsFromZone() {
  els.timeSlider.value = String(timeToMinutes(els.baseTime.value || "00:00"));
  render();
}

function setNowInBaseZone() {
  const now = new Date();
  const rounded = Math.round(localMinutes(now, els.baseZone.value) / 15) * 15;
  els.baseDate.value = dateInputFor(now, els.baseZone.value);
  els.baseTime.value = minutesToTime(rounded);
  els.timeSlider.value = String(rounded % 1440);
  render();
}

async function init() {
  for (const zone of zones) {
    const option = document.createElement("option");
    option.value = zone.id;
    option.textContent = `${textFlagName(zone)} (${zone.region})`;
    els.baseZone.append(option);
  }

  els.baseZone.value = "Asia/Seoul";
  await loadHolidays();
  loadWorkHours();
  buildParticipantControls();
  buildWorkHourControls();
  setNowInBaseZone();
  renderLiveClocks();
  window.setInterval(renderLiveClocks, 1000);

  els.baseZone.addEventListener("change", setNowInBaseZone);
  els.baseDate.addEventListener("input", render);
  els.baseDate.addEventListener("change", render);
  els.baseTime.addEventListener("input", syncTimeControlsFromZone);
  els.baseTime.addEventListener("change", syncTimeControlsFromZone);
  els.timeSlider.addEventListener("input", () => {
    els.baseTime.value = minutesToTime(Number(els.timeSlider.value));
    render();
  });
  els.duration.addEventListener("change", render);
  els.nowButton.addEventListener("click", setNowInBaseZone);
  els.resetWorkHours.addEventListener("click", resetWorkHours);
  els.minus15.addEventListener("click", () => addMinutesToInput(-15));
  els.plus15.addEventListener("click", () => addMinutesToInput(15));
  els.copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(els.shareInput.value);
      els.copyButton.textContent = "복사됨";
    } catch {
      els.shareInput.select();
      els.copyButton.textContent = "선택됨";
    }
    window.setTimeout(() => {
      els.copyButton.textContent = "복사";
    }, 1400);
  });
}

init();
