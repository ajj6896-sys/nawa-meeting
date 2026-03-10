import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

const NEGATIVE_GROUPS = [
  { key: "fear", title: "걱정 / 두려움", items: ["걱정되는", "암담한", "염려되는", "근심하는", "신경 쓰이는", "무서운", "겁나는", "두려운", "주눅 든"] },
  { key: "anxiety", title: "불안 / 긴장", items: ["불안한", "초조한", "긴장된", "조마조마한", "불편한"] },
  { key: "awkward", title: "곤란 / 어색함", items: ["난처한", "쑥스러운", "괴로운", "답답한", "갑갑한", "서먹한", "어색한", "찝찝한"] },
  { key: "sadness", title: "슬픔 / 상실", items: ["슬픈", "그리운", "우울한", "막막한", "서글픈", "서러운", "울적한", "참담한", "비참한", "속상한"] },
  { key: "lonely", title: "외로움", items: ["외로운", "고독한", "공허한", "쓸쓸한"] },
  { key: "fatigue", title: "무기력 / 피로", items: ["무력한", "무기력한", "침울한", "피곤한", "고된", "따분한", "지겨운", "절망스러운", "실망스러운", "좌절한", "힘든"] },
  { key: "boredom", title: "지루함", items: ["무료한", "지친", "심심한", "질린", "지루한"] },
  { key: "confused", title: "당황 / 혼란", items: ["혼란스러운", "놀란", "민망한", "당황한", "부끄러운"] },
  { key: "anger", title: "분노", items: ["화나는", "분한", "억울한", "짜증나는"] },
];

const NEED_GROUPS = [
  { key: "autonomy", title: "자율성", items: ["자신의 꿈·목표·가치를 선택할 자유", "목표를 이루는 방법을 스스로 선택할 자유"] },
  { key: "survival", title: "신체적 / 생존", items: ["공기", "음식", "물", "주거", "휴식", "수면", "안전", "신체적 접촉", "편안함", "운동"] },
  { key: "social", title: "사회적 / 정서", items: ["소통", "관계", "우정", "존중", "공감", "이해", "지지", "협력", "사랑", "관심", "소속감", "신뢰"] },
  { key: "play", title: "놀이 / 재미", items: ["즐거움", "재미", "유머", "웃음"] },
  { key: "meaning", title: "삶의 의미", items: ["기여", "도전", "발견", "보람", "의미", "희망", "열정"] },
  { key: "truth", title: "진실성", items: ["정직", "진실", "개성", "자기존중", "비전", "꿈"] },
  { key: "peace", title: "아름다움 / 평화", items: ["아름다움", "평화", "조화", "질서", "평온함"] },
  { key: "selfRealization", title: "자아구현", items: ["성취", "배움", "성장", "창조성", "자기표현", "자신감"] },
];

const POSITIVE_GROUPS = [
  { key: "gratitude", title: "감사 / 기쁨", items: ["고마운", "감사한", "기쁜", "반가운", "행복한", "편안함", "편안한", "홀가분한", "느긋한", "차분한", "평온한", "고요한"] },
  { key: "energy", title: "활력", items: ["활기찬", "신나는", "짜릿한", "기력이 넘치는", "힘이 솟는"] },
  { key: "hope", title: "희망 / 기대", items: ["희망에 찬", "기대에 부푼", "자신감 있는"] },
  { key: "warmth", title: "사랑 / 따뜻함", items: ["사랑하는", "친근한", "훈훈한", "따뜻한", "포근한"] },
  { key: "satisfaction", title: "만족 / 성취", items: ["뿌듯한", "만족스러운", "상쾌한", "개운한", "후련한", "든든한"] },
  { key: "moved", title: "감동", items: ["감동받은", "뭉클한", "감격스러운", "벅찬", "환희에 찬", "황홀한"] },
  { key: "interest", title: "흥미", items: ["흥미로운", "재미있는"] },
];

const RECORDS_KEY = "nawa-records-v12";
const UI_KEY = "nawa-ui-v12";
const THEME_KEY = "nawa-theme-v12";

const THEMES = [
  { key: "cream", label: "🍦 크림" },
  { key: "sage", label: "🌿 세이지" },
  { key: "lavender", label: "🪻 라벤더" },
  { key: "peach", label: "🍑 피치" },
  { key: "night", label: "🌙 나이트" },
];

const todayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const nowTimeString = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseYmd = (s) => {
  const [y, m, d] = (s || todayString()).split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};
const entryId = () => `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const emptyEntry = (date = todayString()) => ({
  id: entryId(),
  date,
  timeLabel: nowTimeString(),
  title: "",
  negative: [],
  reason: "",
  empathy: "",
  needs: [],
  needsOtherChecked: false,
  needsOtherText: "",
  needsEmpathy: "",
  message: "",
  selfMessage: "",
  canDo: "",
  cannotDo: "",
  positive: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const normalizeRecords = (raw) => {
  if (!raw || typeof raw !== "object") return {};
  const out = {};
  Object.entries(raw).forEach(([date, value]) => {
    if (Array.isArray(value)) {
      out[date] = value.map((entry) => ({ ...emptyEntry(date), ...entry, date, id: entry.id || entryId() }));
    } else if (value && typeof value === "object") {
      out[date] = [{ ...emptyEntry(date), ...value, date, id: value.id || entryId() }];
    } else {
      out[date] = [];
    }
  });
  return out;
};

const readRecords = () => {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return normalizeRecords(parsed);
  } catch {
    return {};
  }
};

const saveRecords = (records) => localStorage.setItem(RECORDS_KEY, JSON.stringify(records));

const readUi = () => {
  try {
    const raw = localStorage.getItem(UI_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveUi = (ui) => localStorage.setItem(UI_KEY, JSON.stringify(ui));
const toggleInList = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

const themeClass = (theme) => {
  if (theme === "night") return "min-h-screen bg-[#181926] text-[#f7f4ee]";
  if (theme === "sage") return "min-h-screen bg-[#f3f8f2] text-[#2f3a32]";
  if (theme === "lavender") return "min-h-screen bg-[#faf5ff] text-[#43324f]";
  if (theme === "peach") return "min-h-screen bg-[#fff6f1] text-[#4a342b]";
  return "min-h-screen bg-[#fffaf2] text-[#4b3f35]";
};

const cardClass = (theme) => {
  if (theme === "night") return "bg-[#232537] border border-[#3a3d57] text-[#f7f4ee]";
  if (theme === "sage") return "bg-white/95 border border-[#d7e7d7]";
  if (theme === "lavender") return "bg-white/95 border border-[#eadcf8]";
  if (theme === "peach") return "bg-white/95 border border-[#f6d9cb]";
  return "bg-white border border-[#eadfce]";
};

const mutedClass = (theme) => {
  if (theme === "night") return "text-[#c8c3d9]";
  if (theme === "sage") return "text-[#5f7a67]";
  if (theme === "lavender") return "text-[#7a5c91]";
  if (theme === "peach") return "text-[#a0624f]";
  return "text-[#8a6f5a]";
};

const accentClass = (theme) => {
  if (theme === "night") return "text-[#f7f4ee]";
  if (theme === "sage") return "text-[#42614b]";
  if (theme === "lavender") return "text-[#6d4d86]";
  if (theme === "peach") return "text-[#b85c38]";
  return "text-[#8b5e3c]";
};

const fieldClass = (theme) => {
  if (theme === "night") return "w-full rounded-2xl border border-[#4a4d69] bg-[#2a2d44] px-4 py-3 text-[#f7f4ee] outline-none";
  if (theme === "sage") return "w-full rounded-2xl border border-[#cfe0cf] bg-white px-4 py-3 text-[#2f3a32] outline-none";
  if (theme === "lavender") return "w-full rounded-2xl border border-[#dcc9f0] bg-white px-4 py-3 text-[#43324f] outline-none";
  if (theme === "peach") return "w-full rounded-2xl border border-[#f0cbbb] bg-white px-4 py-3 text-[#4a342b] outline-none";
  return "w-full rounded-2xl border border-[#e6d7c3] bg-white px-4 py-3 text-[#4b3f35] outline-none";
};

const heroClass = (theme) => {
  if (theme === "night") return "border border-[#3a3d57] bg-gradient-to-br from-[#232537] via-[#202233] to-[#181926]";
  if (theme === "sage") return "border border-[#d7e7d7] bg-gradient-to-br from-[#eef7ed] via-[#f7fbf6] to-white";
  if (theme === "lavender") return "border border-[#eadcf8] bg-gradient-to-br from-[#f6effd] via-[#fbf7ff] to-white";
  if (theme === "peach") return "border border-[#f6d9cb] bg-gradient-to-br from-[#fff0e8] via-[#fff7f2] to-white";
  return "border border-[#eadfce] bg-gradient-to-br from-[#fff8ef] via-[#fffcf7] to-white";
};

function BaseButton({ children, className = "", type = "button", onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 font-medium transition active:scale-[0.98] ${className}`}
    >
      {children}
    </button>
  );
}

function BaseInput(props) {
  return <input {...props} />;
}

function BaseTextarea(props) {
  return <textarea {...props} />;
}

function BaseCheckbox({ checked, onChange, id }) {
  return <input id={id} type="checkbox" checked={checked} onChange={onChange} className="mt-1 h-4 w-4" />;
}

function MonthCalendar({ records, currentDate, onSelectDate, theme, monthCursor, setMonthCursor }) {
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay();
  const totalDays = last.getDate();
  const cells = [];

  for (let i = 0; i < startDay; i += 1) cells.push(null);
  for (let d = 1; d <= totalDays; d += 1) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className={`rounded-3xl p-5 shadow-sm ${cardClass(theme)}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-xl font-semibold">달력 기록</div>
        <div className="flex items-center gap-2">
          <BaseButton
            onClick={() => setMonthCursor(new Date(year, month - 1, 1))}
            className={`h-10 w-10 rounded-xl border p-0 ${theme === "night" ? "border-[#4a4d69] bg-[#232537]" : "border-slate-200 bg-white"}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </BaseButton>
          <div className="min-w-24 text-center text-sm font-medium">{year}년 {month + 1}월</div>
          <BaseButton
            onClick={() => setMonthCursor(new Date(year, month + 1, 1))}
            className={`h-10 w-10 rounded-xl border p-0 ${theme === "night" ? "border-[#4a4d69] bg-[#232537]" : "border-slate-200 bg-white"}`}
          >
            <ChevronRight className="h-4 w-4" />
          </BaseButton>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-2 text-center">
        {weekdays.map((w) => <div key={w} className={`text-xs font-medium ${mutedClass(theme)}`}>{w}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((dateObj, idx) => {
          if (!dateObj) return <div key={`empty-${idx}`} className="aspect-square rounded-xl" />;
          const dateKey = ymd(dateObj);
          const count = (records[dateKey] || []).length;
          const isSelected = dateKey === currentDate;
          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(dateKey)}
              className={`aspect-square rounded-2xl border text-sm font-medium flex flex-col items-center justify-center gap-1 ${
                isSelected
                  ? theme === "night"
                    ? "bg-[#2f3248] border-[#c8c3d9]"
                    : "bg-black/5 border-slate-300"
                  : theme === "night"
                    ? "bg-[#232537] border-[#3a3d57]"
                    : "bg-white border-slate-200"
              }`}
            >
              <span>{dateObj.getDate()}</span>
              <span className={`text-[10px] leading-none ${count > 0 ? "text-emerald-600" : "opacity-0"}`}>{count}개</span>
            </button>
          );
        })}
      </div>

      <div className={`mt-3 text-xs ${mutedClass(theme)}`}>기록이 있는 날은 개수로 표시돼. 날짜를 누르면 그날의 마음을 다시 볼 수 있어.</div>
    </div>
  );
}

function EntryList({ entries, selectedEntryId, onSelect, onCreate, onDelete, onCopy, onRename, theme, currentDate }) {
  const [editingKey, setEditingKey] = useState("");
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    if (!entries.some((item, idx) => `${item.id}::${idx}` === editingKey)) {
      setEditingKey("");
      setEditingTitle("");
    }
  }, [entries, editingKey]);

  return (
    <div className={`rounded-3xl p-5 shadow-sm ${cardClass(theme)}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-xl font-semibold">{currentDate} 기록</div>
        <BaseButton onClick={onCreate} className="bg-slate-900 text-white">
          <Plus className="mr-1 h-4 w-4" />새 기록
        </BaseButton>
      </div>

      <div className="space-y-2">
        {entries.length === 0 ? (
          <div className={`text-sm ${mutedClass(theme)}`}>이 날에는 아직 적어둔 마음이 없어.</div>
        ) : (
          entries.map((entry, idx) => {
            const itemKey = `${entry.id}::${idx}`;
            const isEditing = editingKey === itemKey;
            return (
              <div
                key={`${entry.id}-${idx}`}
                className={`rounded-2xl border px-3 py-3 flex items-center justify-between gap-3 ${
                  selectedEntryId === entry.id
                    ? theme === "night"
                      ? "border-[#c8c3d9] bg-[#2a2d44]"
                      : "border-slate-300 bg-slate-50"
                    : cardClass(theme)
                }`}
              >
                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <div className="space-y-2">
                      <BaseInput
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className={fieldClass(theme)}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <BaseButton
                          onClick={() => {
                            onRename(entry, editingTitle, idx);
                            setEditingKey("");
                            setEditingTitle("");
                          }}
                          className="bg-slate-900 text-white"
                        >
                          완료
                        </BaseButton>
                        <BaseButton
                          onClick={() => {
                            setEditingKey("");
                            setEditingTitle("");
                          }}
                          className="border border-slate-200 bg-white"
                        >
                          취소
                        </BaseButton>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={() => onSelect(entry.id)} className="w-full text-left">
                      <div className="truncate font-medium">{entry.title?.trim() || `${idx + 1}번째 기록`}</div>
                      <div className={`text-xs ${mutedClass(theme)}`}>{entry.timeLabel || "시간 미지정"}</div>
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="flex shrink-0 items-center gap-1">
                    <BaseButton
                      onClick={() => {
                        setEditingKey((prev) => (prev === itemKey ? "" : itemKey));
                        setEditingTitle(entry.title || "");
                      }}
                      className="border border-slate-200 bg-white px-3 py-1 text-xs"
                    >
                      수정
                    </BaseButton>
                    <BaseButton onClick={() => onCopy(entry)} className="px-3 py-1 text-sm">복사</BaseButton>
                    <BaseButton onClick={() => onDelete(entry.id)} className="px-2 py-1 text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </BaseButton>
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function SectionCard({ title, children, subtitle, theme }) {
  return (
    <div className={`rounded-3xl p-5 shadow-sm ${cardClass(theme)}`}>
      <div className="mb-3">
        <div className="text-xl font-semibold">{title}</div>
        {subtitle ? <p className={`mt-1 text-sm leading-6 ${mutedClass(theme)}`}>{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

function CollapsibleGroup({ title, items, selected, onToggle, defaultOpen = false, theme }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`overflow-hidden rounded-2xl border ${theme === "night" ? "border-[#3a3d57] bg-[#232537]" : "border-slate-200 bg-white"}`}>
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between px-4 py-4 text-left">
        <div>
          <div className={`text-base font-semibold ${theme === "night" ? "text-[#f7f4ee]" : "text-slate-900"}`}>{title}</div>
          <div className={`text-sm ${mutedClass(theme)}`}>{open ? "접어둘래" : "천천히 펼쳐볼래"}</div>
        </div>
        {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="grid grid-cols-1 gap-3 px-4 pb-4 md:grid-cols-2">
          {items.map((item) => {
            const id = `${title}-${item}`;
            return (
              <label key={item} htmlFor={id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 ${theme === "night" ? "border-[#3a3d57] hover:bg-[#2a2d44]" : "border-slate-200 hover:bg-slate-50"}`}>
                <BaseCheckbox id={id} checked={selected.includes(item)} onChange={() => onToggle(item)} />
                <span className="text-[15px] leading-6">{item}</span>
              </label>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
function InfoCards({ theme }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className={`rounded-2xl p-4 ${cardClass(theme)}`}>
        <div className="mb-1 text-sm font-semibold">이 앱은 어떤 도구야?</div>
        <p className={`text-sm leading-6 ${mutedClass(theme)}`}>
          감정을 고르고 질문을 따라가며 자기 대화를 기록하는 개인용 마음 기록장이야.
        </p>
      </div>

      <div className={`rounded-2xl p-4 ${cardClass(theme)}`}>
        <div className="mb-1 text-sm font-semibold">기록 저장 방식</div>
        <p className={`text-sm leading-6 ${mutedClass(theme)}`}>
          기록은 이 브라우저에만 저장돼. 기기를 바꾸거나 브라우저 데이터를 지우면 기록이 사라질 수 있어.
        </p>
      </div>

      <div className={`rounded-2xl p-4 ${cardClass(theme)}`}>
        <div className="mb-1 text-sm font-semibold">기록 보관 방법</div>
        <p className={`text-sm leading-6 ${mutedClass(theme)}`}>
          각 기록 오른쪽의 <b>복사</b> 버튼으로 내용을 바로 복사할 수 있어.
          중요한 기록은 따로 붙여넣어 보관해두는 걸 권장해.
        </p>
      </div>

      <div className={`rounded-2xl p-4 ${cardClass(theme)}`}>
        <div className="mb-1 text-sm font-semibold">사용 전 알아둘 점</div>
        <p className={`text-sm leading-6 ${mutedClass(theme)}`}>
          이 앱은 감정 정리와 자기 대화를 돕는 기록 도구야.
          상담, 치료, 의료적 판단을 대신하지 않아.
        </p>
      </div>
    </div>
  );
}
export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "cream");
  const [records, setRecords] = useState(() => readRecords());
  const [currentDate, setCurrentDate] = useState(() => readUi().currentDate || todayString());
  const [selectedEntryId, setSelectedEntryId] = useState(() => readUi().selectedEntryId || "");
  const [entry, setEntry] = useState(emptyEntry(todayString()));
  const [savedMessage, setSavedMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const copyMessageTimer = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [monthCursor, setMonthCursor] = useState(parseYmd(readUi().currentDate || todayString()));
  const saveTimer = useRef(null);

  const dayEntries = useMemo(() => records[currentDate] || [], [records, currentDate]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    saveUi({ currentDate, selectedEntryId });
    setMonthCursor(parseYmd(currentDate));
  }, [currentDate, selectedEntryId]);

  useEffect(() => {
    const entries = records[currentDate] || [];
    if (entries.length === 0) {
      const newEntry = emptyEntry(currentDate);
      setSelectedEntryId(newEntry.id);
      setEntry(newEntry);
      return;
    }
    const target = entries.find((e) => e.id === selectedEntryId) || entries[0];
    setSelectedEntryId(target.id);
    if (JSON.stringify(target) !== JSON.stringify(entry)) setEntry(target);
  }, [currentDate, records]);

  useEffect(() => {
    if (!selectedEntryId) return;
    const day = records[entry.date] || [];
    const prev = day.find((e) => e.id === selectedEntryId);
    if (prev && JSON.stringify(prev) === JSON.stringify(entry)) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setRecords((old) => {
        const currentDay = old[entry.date] || [];
        const exists = currentDay.some((e) => e.id === selectedEntryId);
        const nextDay = exists
          ? currentDay.map((e) => (e.id === selectedEntryId ? { ...entry, updatedAt: new Date().toISOString() } : e))
          : [...currentDay, { ...entry, updatedAt: new Date().toISOString() }];
        const next = { ...old, [entry.date]: nextDay };
        saveRecords(next);
        return next;
      });
      setSavedMessage("살포시 저장됐어");
      window.clearTimeout(window.__nawaSaveMessageTimer);
      window.__nawaSaveMessageTimer = window.setTimeout(() => setSavedMessage(""), 800);
    }, 900);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [entry, selectedEntryId, records]);

  const updateEntry = (patch) => setEntry((prev) => ({ ...prev, ...patch, updatedAt: new Date().toISOString() }));

  const createEntryForDate = (date = currentDate) => {
    const newEntry = emptyEntry(date);
    setCurrentDate(date);
    setSelectedEntryId(newEntry.id);
    setEntry(newEntry);
  };

  const deleteEntry = (id) => {
    const day = records[currentDate] || [];
    const nextDay = day.filter((e) => e.id !== id);
    const nextRecords = { ...records, [currentDate]: nextDay };
    setRecords(nextRecords);
    saveRecords(nextRecords);

    if (selectedEntryId === id) {
      if (nextDay[0]) {
        setSelectedEntryId(nextDay[0].id);
        setEntry(nextDay[0]);
      } else {
        const fresh = emptyEntry(currentDate);
        setSelectedEntryId(fresh.id);
        setEntry(fresh);
      }
    }
  };

  const handleCopyEntry = async (targetEntry) => {
    const needsList = [
      ...(targetEntry.needs || []),
      ...(targetEntry.needsOtherChecked && targetEntry.needsOtherText?.trim() ? [targetEntry.needsOtherText.trim()] : []),
    ];

    const text = `제목: ${targetEntry.title || ""}
날짜: ${targetEntry.date} ${targetEntry.timeLabel || ""}

그때 들었던 감정:
${(targetEntry.negative || []).join(", ") || ""}

무슨 일이 있었나:
${targetEntry.reason || ""}

그래서 그런 감정이 들었구나:
${targetEntry.empathy || ""}

바랐던 것 / 필요했던 것:
${needsList.join(", ") || ""}

그렇구나~
${targetEntry.needsEmpathy || ""}

내가 하고 싶은 말:
${targetEntry.message || ""}

나에게 해주고 싶은 말:
${targetEntry.selfMessage || ""}

할 수 있는 것:
${targetEntry.canDo || ""}

할 수 없는 것:
${targetEntry.cannotDo || ""}

지금 느끼는 감정:
${(targetEntry.positive || []).join(", ") || ""}`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      if (copyMessageTimer.current) clearTimeout(copyMessageTimer.current);
      setCopyMessage("복사됐어");
      copyMessageTimer.current = setTimeout(() => setCopyMessage(""), 1500);
    } catch {
      if (copyMessageTimer.current) clearTimeout(copyMessageTimer.current);
      setCopyMessage("복사에 실패했어");
      copyMessageTimer.current = setTimeout(() => setCopyMessage(""), 1500);
    }
  };

  return (
    <div className={`${themeClass(theme)} p-3 sm:p-4 md:p-6`}>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-5 xl:sticky xl:top-6 xl:self-start">
          <div className={`rounded-3xl p-5 shadow-sm ${heroClass(theme)}`}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className={`flex items-center gap-2 ${accentClass(theme)}`}>
                  <Sparkles className="h-5 w-5" />
                  <div className="text-2xl font-semibold">나와의 대화</div>
                </div>
                <p className={`mt-1 text-sm ${mutedClass(theme)}`}>마음을 천천히 적어둘 수 있는 작은 기록장</p>
              </div>
            </div>

            <div>
              <div className={`text-sm ${mutedClass(theme)}`}>기록은 이 브라우저에 저장돼</div>
              <div className={`mt-2 text-xs leading-6 ${mutedClass(theme)}`}>중요한 기록은 복사해서 따로 보관해두면 좋아. 링크를 같이 써도 기록은 각자 기기 안에 남아.</div>
            </div>

            {copyMessage ? (
              <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-black px-4 py-2 text-sm text-white shadow-lg">
                {copyMessage}
              </div>
            ) : savedMessage ? (
              <div className={`mt-4 text-sm ${mutedClass(theme)}`}>{savedMessage}</div>
            ) : null}
          </div>

          <div className={`rounded-3xl p-4 shadow-sm ${cardClass(theme)}`}>
            <div className="mb-3">
              <div className="text-base font-semibold">테마</div>
              <div className={`mt-1 text-xs ${mutedClass(theme)}`}>오늘 마음에 잘 어울리는 분위기로 골라봐.</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTheme(item.key)}
                  className={`rounded-xl border px-3 py-3 text-sm transition ${
                    theme === item.key
                      ? item.key === "night"
                        ? "border-[#4a4d69] bg-[#2f3248] text-[#f7f4ee] shadow-sm"
                        : "border-[#d9c6b0] bg-white shadow-sm"
                      : "border-slate-200 opacity-80"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <MonthCalendar
            records={records}
            currentDate={currentDate}
            onSelectDate={setCurrentDate}
            theme={theme}
            monthCursor={monthCursor}
            setMonthCursor={setMonthCursor}
          />

          <EntryList
            entries={dayEntries}
            selectedEntryId={selectedEntryId}
            onSelect={setSelectedEntryId}
            onCreate={() => createEntryForDate(currentDate)}
            onDelete={deleteEntry}
            onCopy={handleCopyEntry}
            onRename={(targetEntry, nextTitle, idx) => {
              setRecords((old) => {
                const day = old[targetEntry.date] || [];
                const nextDay = day.map((item, i) => {
                  if (i !== idx) return item;
                  return { ...item, title: nextTitle, updatedAt: new Date().toISOString() };
                });
                const next = { ...old, [targetEntry.date]: nextDay };
                saveRecords(next);
                return next;
              });
              if (selectedEntryId === targetEntry.id) {
                setEntry((prev) => ({ ...prev, title: nextTitle, updatedAt: new Date().toISOString() }));
              }
              setSavedMessage("제목을 살짝 고쳐뒀어");
              setTimeout(() => setSavedMessage(""), 1200);
            }}
            theme={theme}
            currentDate={currentDate}
          />
        </div>

        <div className="min-w-0 space-y-5 pb-24 md:pb-6">
          <InfoCards theme={theme} />
          <SectionCard title="▶ 오늘의 기록 제목" subtitle="하루에 여러 번 적을 수도 있으니까, 나중에 보기 편한 이름을 붙여줘." theme={theme}>
            <BaseInput
              value={entry.title}
              onChange={(e) => updateEntry({ title: e.target.value })}
              placeholder="예: 아침에 들었던 마음"
              className={fieldClass(theme)}
            />
          </SectionCard>

          <SectionCard title="▶ 지금 어떤 마음이 들어?" subtitle="마음이 닿는 감정을 천천히 골라봐." theme={theme}>
            <div className="space-y-3">
              {NEGATIVE_GROUPS.map((group, idx) => (
                <CollapsibleGroup
                  key={group.key}
                  title={group.title}
                  items={group.items}
                  selected={entry.negative}
                  onToggle={(item) => updateEntry({ negative: toggleInList(entry.negative, item) })}
                  defaultOpen={idx === 0}
                  theme={theme}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="▶ 무슨 일이 있었을까?" subtitle="천천히 떠오르는 만큼만 적어도 괜찮아." theme={theme}>
            <BaseTextarea value={entry.reason} onChange={(e) => updateEntry({ reason: e.target.value })} className={`${fieldClass(theme)} min-h-40`} />
          </SectionCard>

          <SectionCard title="▶ 그래서 그런 감정이 들었구나" subtitle="그랬다면 충분히 그럴 수 있었겠다고, 마음을 한번 다정하게 바라봐." theme={theme}>
            <BaseTextarea value={entry.empathy} onChange={(e) => updateEntry({ empathy: e.target.value })} className={`${fieldClass(theme)} min-h-36`} />
          </SectionCard>

          <SectionCard title="▶ 그때 내가 바랐던 건 뭐였을까?" subtitle="상대에게서, 혹은 나 자신에게서 바랐던 걸 골라봐." theme={theme}>
            <div className="space-y-3">
              {NEED_GROUPS.map((group) => (
                <CollapsibleGroup
                  key={group.key}
                  title={group.title}
                  items={group.items}
                  selected={entry.needs}
                  onToggle={(item) => updateEntry({ needs: toggleInList(entry.needs, item) })}
                  theme={theme}
                />
              ))}
              <div className={`rounded-2xl border p-4 space-y-3 ${cardClass(theme)}`}>
                <div className="font-semibold">기타</div>
                <label className="flex items-center gap-3">
                  <BaseCheckbox checked={entry.needsOtherChecked} onChange={() => updateEntry({ needsOtherChecked: !entry.needsOtherChecked })} />
                  <span>직접 적어볼래</span>
                </label>
                <BaseInput
                  value={entry.needsOtherText}
                  onChange={(e) => updateEntry({ needsOtherText: e.target.value })}
                  placeholder="떠오르는 바람이나 필요를 적어줘"
                  className={fieldClass(theme)}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="▶️ 그렇구나~"
            subtitle="욕구가 채워지지 않아서 더 속상했을 수도 있어. 그 마음을 한 번 더 다정하게 안아줘."
            theme={theme}
          >
            <BaseTextarea
              value={entry.needsEmpathy}
              onChange={(e) => updateEntry({ needsEmpathy: e.target.value })}
              placeholder="예: 연락을 바랐는데 닿지 않아서 더 속상하고 답답했구나."
              className={`${fieldClass(theme)} min-h-36`}
            />
          </SectionCard>

          <SectionCard title="▶ 네가 상대에게 하고 싶은 말은 뭐야?" subtitle="마음속에 남아 있는 말을 조용히 꺼내봐." theme={theme}>
            <BaseTextarea value={entry.message} onChange={(e) => updateEntry({ message: e.target.value })} className={`${fieldClass(theme)} min-h-44`} />
          </SectionCard>

          <SectionCard
            title="▶ 너는 자신에게 어떤 말을 해주고 싶어?"
            subtitle="공감, 지지, 응원, 칭찬… 지금의 나에게 다정한 말을 건네줘."
            theme={theme}
          >
            <BaseTextarea value={entry.selfMessage} onChange={(e) => updateEntry({ selfMessage: e.target.value })} className={`${fieldClass(theme)} min-h-44`} />
          </SectionCard>

          <SectionCard title="▶ 내가 해볼 수 있는 건 무엇일까?" subtitle="할 수 있는 것과, 지금은 내 힘으로 어려운 것을 나눠 적어봐." theme={theme}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className={`text-sm ${mutedClass(theme)}`}>할 수 있는 것</div>
                <BaseTextarea value={entry.canDo} onChange={(e) => updateEntry({ canDo: e.target.value })} className={`${fieldClass(theme)} min-h-44`} />
              </div>
              <div className="space-y-2">
                <div className={`text-sm ${mutedClass(theme)}`}>할 수 없는 것</div>
                <BaseTextarea value={entry.cannotDo} onChange={(e) => updateEntry({ cannotDo: e.target.value })} className={`${fieldClass(theme)} min-h-44`} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="▶ 지금은 마음이 어때?" subtitle="조금 달라진 감정이 있다면 골라봐." theme={theme}>
            <div className="space-y-3">
              {POSITIVE_GROUPS.map((group) => (
                <CollapsibleGroup
                  key={group.key}
                  title={group.title}
                  items={group.items}
                  selected={entry.positive}
                  onToggle={(item) => updateEntry({ positive: toggleInList(entry.positive, item) })}
                  theme={theme}
                />
              ))}
            </div>
          </SectionCard>

          <div className="sticky bottom-4 z-20">
            <BaseButton
              onClick={() => {
                setIsSaving(true);
                const updatedEntry = { ...entry, updatedAt: new Date().toISOString() };
                setRecords((old) => {
                  const currentDay = old[updatedEntry.date] || [];
                  const exists = currentDay.some((e) => e.id === selectedEntryId);
                  const nextDay = exists
                    ? currentDay.map((e) => (e.id === selectedEntryId ? updatedEntry : e))
                    : [...currentDay, updatedEntry];
                  const next = { ...old, [updatedEntry.date]: nextDay };
                  saveRecords(next);
                  return next;
                });
                setSavedMessage("포근하게 저장해뒀어");
                setTimeout(() => {
                  setSavedMessage("");
                  setIsSaving(false);
                }, 1200);
              }}
              className={`w-full h-12 bg-slate-900 text-base text-white shadow-lg ${isSaving ? "scale-[0.98] opacity-90" : "scale-100"}`}
            >
              <Check className="mr-2 h-4 w-4" />{isSaving ? "저장 중..." : "저장하기"}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  );
}