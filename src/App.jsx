import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Sparkles,
  Lock,
  LogOut,
  Shield,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

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

const PROFILES_KEY = "nawa-private-profiles-v10";
const ACTIVE_PROFILE_KEY = "nawa-private-active-profile-v10";
const THEME_KEY = "nawa-theme-v10";

const THEMES = [
  { key: "beige", label: "🌾 베이지" },
  { key: "sky", label: "☁️ 스카이" },
  { key: "green", label: "🌿 그린" },
  { key: "rose", label: "🌸 로즈" },
  { key: "dark", label: "🌙 다크" },
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

const simpleHash = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return String(h);
};

const makeProfileStorageKey = (id) => `nawa-private-records-${id}`;
const makeUiStorageKey = (id) => `nawa-private-ui-${id}`;

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
  message: "",
  selfMessage: "",
  canDo: "",
  cannotDo: "",
  positive: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const createProfile = (name, pin) => ({
  id: `profile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name,
  pinHash: simpleHash(pin),
  createdAt: new Date().toISOString(),
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

const readProfiles = () => {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveProfiles = (profiles) => localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));

const readRecords = (id) => {
  try {
    const raw = localStorage.getItem(makeProfileStorageKey(id));
    const parsed = raw ? JSON.parse(raw) : {};
    return normalizeRecords(parsed);
  } catch {
    return {};
  }
};

const saveRecords = (id, records) => localStorage.setItem(makeProfileStorageKey(id), JSON.stringify(records));

const readUi = (id) => {
  try {
    const raw = localStorage.getItem(makeUiStorageKey(id));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveUi = (id, ui) => localStorage.setItem(makeUiStorageKey(id), JSON.stringify(ui));
const toggleInList = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

const themeClass = (theme) => {
  if (theme === "dark") return "bg-slate-950 text-white";
  if (theme === "green") return "bg-emerald-50 text-slate-900";
  if (theme === "sky") return "bg-sky-50 text-slate-900";
  if (theme === "rose") return "bg-rose-50 text-slate-900";
  return "bg-stone-50 text-slate-900";
};

const cardClass = (theme) => {
  if (theme === "dark") return "bg-slate-900 border-slate-700 text-white";
  if (theme === "green") return "bg-white/95 border-emerald-100";
  if (theme === "sky") return "bg-white/95 border-sky-100";
  if (theme === "rose") return "bg-white/95 border-rose-100";
  return "bg-white border-stone-200";
};

const mutedClass = (theme) => {
  if (theme === "dark") return "text-slate-300";
  if (theme === "green") return "text-emerald-600";
  if (theme === "sky") return "text-sky-600";
  if (theme === "rose") return "text-rose-400";
  return "text-slate-600";
};

const accentClass = (theme) => {
  if (theme === "dark") return "text-white";
  if (theme === "green") return "text-emerald-700";
  if (theme === "sky") return "text-sky-700";
  if (theme === "rose") return "text-rose-500";
  return "text-slate-700";
};

const fieldClass = (theme) => {
  if (theme === "dark") return "bg-transparent border border-white/40 text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0";
  if (theme === "green") return "bg-white border-emerald-200 text-slate-900 placeholder:text-emerald-400";
  if (theme === "sky") return "bg-white border-sky-200 text-slate-900 placeholder:text-sky-400";
  if (theme === "rose") return "bg-white border-rose-200 text-slate-900 placeholder:text-rose-300";
  return "bg-white border-stone-300 text-slate-900 placeholder:text-stone-400";
};

const outlineBtnClass = (theme) => (theme === "dark" ? "text-white border-slate-500 bg-slate-800 hover:bg-slate-700 hover:text-white" : "");

const heroClass = (theme) => {
  if (theme === "dark") return "border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white";
  if (theme === "green") return "border-emerald-100 bg-gradient-to-br from-emerald-50 via-lime-50 to-white";
  if (theme === "sky") return "border-sky-100 bg-gradient-to-br from-sky-50 via-cyan-50 to-white";
  if (theme === "rose") return "border-rose-100 bg-gradient-to-br from-rose-50 via-pink-50 to-white";
  return "border-neutral-200 bg-gradient-to-br from-neutral-50 via-neutral-100 to-white";
};

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
    <Card className={`rounded-3xl shadow-sm ${cardClass(theme)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xl">달력 기록</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setMonthCursor(new Date(year, month - 1, 1))} className={`rounded-xl ${outlineBtnClass(theme)}`}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-sm font-medium min-w-24 text-center">{year}년 {month + 1}월</div>
            <Button variant="outline" size="icon" onClick={() => setMonthCursor(new Date(year, month + 1, 1))} className={`rounded-xl ${outlineBtnClass(theme)}`}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center mb-2">
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
                    ? theme === "dark"
                      ? "bg-slate-700 border-white text-white"
                      : theme === "green"
                        ? "bg-emerald-100 border-emerald-400"
                        : theme === "sky"
                          ? "bg-sky-100 border-sky-400"
                          : theme === "rose"
                            ? "bg-rose-100 border-rose-400"
                            : "bg-neutral-100 border-neutral-300"
                    : theme === "dark"
                      ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                      : "bg-white hover:bg-slate-50"
                }`}
              >
                <span>{dateObj.getDate()}</span>
                <span className={`text-[10px] leading-none ${count > 0 ? (theme === "dark" ? "text-emerald-300" : "text-emerald-600") : "opacity-0"}`}>{count}개</span>
              </button>
            );
          })}
        </div>
        <div className={`mt-3 text-xs ${mutedClass(theme)}`}>작성한 날은 개수로 표시돼. 날짜를 누르면 그날 기록을 볼 수 있어.</div>
      </CardContent>
    </Card>
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
    <Card className={`rounded-3xl shadow-sm ${cardClass(theme)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xl">{currentDate} 기록</CardTitle>
          <Button onClick={onCreate} className="rounded-2xl">
            <Plus className="w-4 h-4 mr-1" />추가
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.length === 0 ? (
            <div className={`text-sm ${mutedClass(theme)}`}>이 날짜에는 아직 기록이 없어.</div>
          ) : (
            entries.map((entry, idx) => {
              const itemKey = `${entry.id}::${idx}`;
              const isEditing = editingKey === itemKey;
              return (
                <div
                  key={`${entry.id}-${idx}`}
                  className={`rounded-2xl border px-3 py-3 flex items-center justify-between gap-3 ${
                    selectedEntryId === entry.id
                      ? theme === "dark"
                        ? "border-white bg-slate-800"
                        : theme === "green"
                          ? "border-emerald-300 bg-emerald-50"
                          : theme === "sky"
                            ? "border-sky-300 bg-sky-50"
                            : theme === "rose"
                              ? "border-rose-300 bg-rose-50"
                              : "border-amber-300 bg-amber-50"
                      : cardClass(theme)
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className={`rounded-xl h-10 ${fieldClass(theme)}`}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              onRename(entry, editingTitle, idx);
                              setEditingKey("");
                              setEditingTitle("");
                            }}
                            className="rounded-xl"
                          >
                            완료
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingKey("");
                              setEditingTitle("");
                            }}
                            className={`rounded-xl ${outlineBtnClass(theme)}`}
                          >
                            취소
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => onSelect(entry.id)} className="text-left w-full">
                        <div className="font-medium truncate">{entry.title?.trim() || `${idx + 1}번째 기록`}</div>
                        <div className={`text-xs ${mutedClass(theme)}`}>{entry.timeLabel || "시간 미지정"}</div>
                      </button>
                    )}
                  </div>

                  {!isEditing ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingKey((prev) => (prev === itemKey ? "" : itemKey));
                          setEditingTitle(entry.title || "");
                        }}
                        className={`shrink-0 text-xs px-2 py-1 rounded-lg border ${theme === "dark" ? "border-slate-600 hover:bg-slate-700" : "border-slate-200 hover:bg-slate-50"}`}
                      >
                        수정
                      </button>
                      <Button type="button" variant="ghost" onClick={() => onCopy(entry)} className={`rounded-xl px-3 ${mutedClass(theme)} hover:text-emerald-600`}>
                        복사
                      </Button>
                      <Button type="button" variant="ghost" size="icon" onClick={() => onDelete(entry.id)} className={`rounded-xl ${mutedClass(theme)} hover:text-red-600`}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SectionCard({ title, children, subtitle, theme }) {
  return (
    <Card className={`rounded-3xl shadow-sm ${cardClass(theme)}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{title}</CardTitle>
        {subtitle ? <p className={`text-sm ${mutedClass(theme)}`}>{subtitle}</p> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function CollapsibleGroup({ title, items, selected, onToggle, defaultOpen = false, theme }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`border rounded-2xl overflow-hidden ${theme === "dark" ? "bg-slate-900 border-slate-700" : cardClass(theme)}`}>
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between px-4 py-4 text-left">
        <div>
          <div className={`font-semibold text-base ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{title}</div>
          <div className={`text-sm ${mutedClass(theme)}`}>{open ? "접기" : "눌러서 펼치기"}</div>
        </div>
        {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {open ? (
        <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) => {
            const id = `${title}-${item}`;
            return (
              <label key={item} htmlFor={id} className={`flex items-start gap-3 rounded-2xl border p-3 cursor-pointer ${theme === "dark" ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}>
                <Checkbox id={id} checked={selected.includes(item)} onCheckedChange={() => onToggle(item)} className="mt-0.5" />
                <span className="text-[15px] leading-6">{item}</span>
              </label>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function AuthScreen({ profiles, onCreateProfile, onUnlock, theme }) {
  const [mode, setMode] = useState(profiles.length === 0 ? "create" : "unlock");
  const [selectedProfileId, setSelectedProfileId] = useState(profiles[0]?.id || "");
  const [pinInput, setPinInput] = useState("");
  const [newName, setNewName] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const selectedProfile = profiles.find((p) => p.id === selectedProfileId);

  const handleUnlock = () => {
    if (!selectedProfile) return;
    if (simpleHash(pinInput) !== selectedProfile.pinHash) {
      setError("비밀번호가 맞지 않아.");
      return;
    }
    setError("");
    onUnlock(selectedProfile.id);
  };

  const handleCreate = () => {
    if (!newName.trim()) return setError("사용자 이름을 적어줘.");
    if (newPin.length < 4) return setError("비밀번호는 4자리 이상으로 해줘.");
    if (newPin !== confirmPin) return setError("비밀번호 확인이 맞지 않아.");
    setError("");
    onCreateProfile(newName.trim(), newPin);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${themeClass(theme)}`}>
      <Card className={`w-full max-w-lg rounded-3xl shadow-sm ${cardClass(theme)}`}>
        <CardHeader className="pb-3">
          <div className={`flex items-center gap-2 ${accentClass(theme)}`}>
            <Shield className="w-5 h-5" />
            <CardTitle className="text-2xl">나와의 대화</CardTitle>
          </div>
          <p className={`text-sm ${mutedClass(theme)}`}>오늘의 마음을 조용히 돌아보고, 나를 다정하게 살피는 시간으로 써줘.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {mode === "unlock" ? (
            <div className="space-y-3">
              <div className={`text-sm ${mutedClass(theme)}`}>계정 선택</div>
              <div className="space-y-2">
                {profiles.length === 0 ? <div className={`text-sm ${mutedClass(theme)}`}>아직 계정이 없어. 아래에서 회원가입해줘.</div> : profiles.map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => setSelectedProfileId(profile.id)}
                    className={`w-full text-left rounded-2xl border px-4 py-3 ${selectedProfileId === profile.id ? (theme === "dark" ? "border-white bg-slate-800" : "border-slate-300 bg-slate-50") : cardClass(theme)}`}
                  >
                    <div className="font-medium">{profile.name}</div>
                  </button>
                ))}
              </div>
              <Input type="password" value={pinInput} onChange={(e) => setPinInput(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); handleUnlock(); } }} placeholder="비밀번호 입력" className={`rounded-2xl h-11 ${fieldClass(theme)}`} />
              <Button onClick={handleUnlock} className="w-full rounded-2xl"><Lock className="w-4 h-4 mr-1" />열기</Button>
              <div className="text-center pt-2">
                <button type="button" onClick={() => setMode("create")} className={`text-sm underline ${mutedClass(theme)}`}>회원가입</button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="이름" className={`rounded-2xl h-11 ${fieldClass(theme)}`} />
              <Input type="password" value={newPin} onChange={(e) => setNewPin(e.target.value)} placeholder="비밀번호 4자리 이상" onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); handleCreate(); } }} className={`rounded-2xl h-11 ${fieldClass(theme)}`} />
              <Input type="password" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} placeholder="비밀번호 확인" className={`rounded-2xl h-11 ${fieldClass(theme)}`} />
              <Button onClick={handleCreate} className="w-full rounded-2xl"><Plus className="w-4 h-4 mr-1" />사용자 만들기</Button>
              <div className="text-center pt-2">
                <button type="button" onClick={() => setMode("unlock")} className={`text-sm underline ${mutedClass(theme)}`}>로그인으로 돌아가기</button>
              </div>
            </div>
          )}
          {error ? <div className="text-sm text-red-500">{error}</div> : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default function NawaTimePrivateApp() {
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPin, setEditPin] = useState("");
  const [editPinConfirm, setEditPinConfirm] = useState("");
  const [showStats, setShowStats] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "beige");
  const [profiles, setProfiles] = useState(() => readProfiles());
  const [activeProfileId, setActiveProfileId] = useState(() => localStorage.getItem(ACTIVE_PROFILE_KEY) || "");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [records, setRecords] = useState({});
  const [currentDate, setCurrentDate] = useState(todayString());
  const [selectedEntryId, setSelectedEntryId] = useState("");
  const [entry, setEntry] = useState(emptyEntry(todayString()));
  const [savedMessage, setSavedMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const copyMessageTimer = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [monthCursor, setMonthCursor] = useState(parseYmd(todayString()));
  const saveTimer = useRef(null);

  const activeProfile = useMemo(() => profiles.find((p) => p.id === activeProfileId), [profiles, activeProfileId]);
  const dayEntries = useMemo(() => records[currentDate] || [], [records, currentDate]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    saveProfiles(profiles);
  }, [profiles]);

  useEffect(() => {
    if (activeProfile) setEditName(activeProfile.name);
  }, [activeProfile]);

  useEffect(() => {
    if (!isUnlocked || !activeProfileId) return;
    localStorage.setItem(ACTIVE_PROFILE_KEY, activeProfileId);

    const nextRecords = readRecords(activeProfileId);
    const ui = readUi(activeProfileId);
    const nextDate = ui.currentDate || todayString();
    const nextEntries = nextRecords[nextDate] || [];
    const nextEntryId = ui.selectedEntryId && nextEntries.some((e) => e.id === ui.selectedEntryId)
      ? ui.selectedEntryId
      : nextEntries[0]?.id || "";

    setRecords(nextRecords);
    setCurrentDate(nextDate);
    setMonthCursor(parseYmd(nextDate));
    setSelectedEntryId(nextEntryId);
    setEntry(nextEntryId ? nextEntries.find((e) => e.id === nextEntryId) || emptyEntry(nextDate) : emptyEntry(nextDate));
    setShowStats(false);
    setEditProfileOpen(false);
  }, [activeProfileId, isUnlocked]);

  useEffect(() => {
    if (!isUnlocked || !activeProfileId) return;
    saveUi(activeProfileId, { currentDate, selectedEntryId });
    setMonthCursor(parseYmd(currentDate));
  }, [activeProfileId, currentDate, selectedEntryId, isUnlocked]);

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
    if (!isUnlocked || !activeProfileId || !selectedEntryId) return;

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
        saveRecords(activeProfileId, next);
        return next;
      });
      setSavedMessage("자동 저장됨");
      window.clearTimeout(window.__nawaSaveMessageTimer);
      window.__nawaSaveMessageTimer = window.setTimeout(() => setSavedMessage(""), 800);
    }, 900);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [entry, selectedEntryId, activeProfileId, isUnlocked, records]);

  const stats = useMemo(() => {
    const all = Object.values(records || {}).flat();
    const countMap = (arrs) => {
      const map = {};
      arrs.flat().forEach((item) => {
        map[item] = (map[item] || 0) + 1;
      });
      return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
    };
    return {
      totalDays: Object.keys(records || {}).filter((k) => (records[k] || []).length > 0).length,
      totalEntries: all.length,
      negativeTop: countMap(all.map((r) => r.negative || [])),
      needsTop: countMap(all.map((r) => r.needs || [])),
      positiveTop: countMap(all.map((r) => r.positive || [])),
    };
  }, [records]);

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
    saveRecords(activeProfileId, nextRecords);

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

  const handleCreateProfile = (name, pin) => {
    const profile = createProfile(name, pin);
    const nextProfiles = [...profiles, profile];
    setProfiles(nextProfiles);
    saveRecords(profile.id, {});
    saveUi(profile.id, { currentDate: todayString(), selectedEntryId: "" });
    setActiveProfileId(profile.id);
    setIsUnlocked(true);
  };

  const handleUnlock = (profileId) => {
    setActiveProfileId(profileId);
    setIsUnlocked(true);
  };

  const updateProfileInfo = () => {
    if (!activeProfile) return;
    const nextName = editName.trim() || activeProfile.name;
    if (editPin && editPin.length < 4) return alert("비밀번호는 4자리 이상으로 해줘.");
    if (editPin && editPin !== editPinConfirm) return alert("비밀번호 확인이 맞지 않아.");

    const updated = profiles.map((profile) =>
      profile.id === activeProfileId
        ? { ...profile, name: nextName, pinHash: editPin ? simpleHash(editPin) : profile.pinHash }
        : profile,
    );
    setProfiles(updated);
    setEditProfileOpen(false);
    setEditPin("");
    setEditPinConfirm("");
    setSavedMessage("개인정보 수정 완료");
    setTimeout(() => setSavedMessage(""), 1600);
  };

  const handleCopyEntry = async (targetEntry) => {
    const text = `제목: ${targetEntry.title || ""}
날짜: ${targetEntry.date} ${targetEntry.timeLabel || ""}

무슨 일이 있었나:
${targetEntry.reason || ""}

공감:
${targetEntry.empathy || ""}

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
      setCopyMessage("복사완료");
      copyMessageTimer.current = setTimeout(() => setCopyMessage(""), 1500);
    } catch {
      if (copyMessageTimer.current) clearTimeout(copyMessageTimer.current);
      setCopyMessage("복사 실패");
      copyMessageTimer.current = setTimeout(() => setCopyMessage(""), 1500);
    }
  };

  const logout = () => {
    setIsUnlocked(false);
    setSavedMessage("");
    setEditProfileOpen(false);
    setShowStats(false);
  };

  if (!isUnlocked) {
    return <AuthScreen profiles={profiles} onCreateProfile={handleCreateProfile} onUnlock={handleUnlock} theme={theme} />;
  }

  return (
    <div className={`min-h-screen p-3 sm:p-4 md:p-6 ${themeClass(theme)}`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-[380px_minmax(0,1fr)] gap-5">
        <div className="space-y-5 xl:sticky xl:top-6 self-start">
          <Card className={`rounded-3xl shadow-sm ${heroClass(theme)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`flex items-center gap-2 ${accentClass(theme)}`}>
                    <Sparkles className="w-5 h-5" />
                    <CardTitle className="text-2xl">나와의 대화</CardTitle>
                  </div>
                  <p className={`text-sm mt-1 ${theme === "dark" ? "text-slate-300" : "text-slate-500"}`}>개인 잠금 감정 기록</p>
                </div>
                <Button variant="outline" onClick={logout} className={`rounded-2xl ${outlineBtnClass(theme)}`}>
                  <LogOut className="w-4 h-4 mr-1" />로그아웃
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className={`text-sm mb-1 ${theme === "dark" ? "text-slate-300" : "text-slate-500"}`}>현재 사용자</div>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold text-base">{activeProfile?.name || "내 기록"}</div>
                    <div className={`text-xs mt-3 ${theme === "dark" ? "text-slate-300" : "text-slate-500"}`}>오늘의 마음을 편안하게 적어 내려가는, 나를 위한 작은 기록 공간이야.</div>
                  </div>
                  <button type="button" onClick={() => setEditProfileOpen((v) => !v)} className={`shrink-0 rounded-full border p-2 ${theme === "dark" ? "border-slate-600 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}>
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {copyMessage ? (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-4 py-2 rounded-xl shadow-lg z-50">
                  {copyMessage}
                </div>
              ) : savedMessage ? (
                <div className={`text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-500"}`}>{savedMessage}</div>
              ) : null}

              {editProfileOpen ? (
                <div className={`mt-3 border rounded-2xl p-3 space-y-3 ${cardClass(theme)}`}>
                  <div className="text-sm font-semibold">개인정보 수정</div>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="이름 수정" className={`rounded-xl h-10 ${fieldClass(theme)}`} />
                  <Input type="password" value={editPin} onChange={(e) => setEditPin(e.target.value)} placeholder="새 비밀번호" className={`rounded-xl h-10 ${fieldClass(theme)}`} />
                  <Input type="password" value={editPinConfirm} onChange={(e) => setEditPinConfirm(e.target.value)} placeholder="새 비밀번호 확인" className={`rounded-xl h-10 ${fieldClass(theme)}`} />
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => { setEditProfileOpen(false); setEditPin(""); setEditPinConfirm(""); }} className={`rounded-xl ${outlineBtnClass(theme)}`}>
                      취소
                    </Button>
                    <Button onClick={updateProfileInfo} className="rounded-xl">저장</Button>
                  </div>
                </div>
              ) : null}

              {showStats ? (
                <div className={`mt-3 border rounded-2xl p-3 space-y-3 ${cardClass(theme)}`}>
                  <div className="text-sm font-semibold">감정 통계</div>
                  <div className={`text-xs ${mutedClass(theme)}`}>총 작성 일수: {stats.totalDays}일 · 총 기록 수: {stats.totalEntries}개</div>
                  <div>
                    <div className="text-sm font-medium mb-1">자주 체크한 부정 감정</div>
                    <div className="space-y-1">
                      {stats.negativeTop.length
                        ? stats.negativeTop.map(([k, v]) => <div key={k} className="text-sm flex justify-between"><span>{k}</span><span>{v}회</span></div>)
                        : <div className={`text-sm ${mutedClass(theme)}`}>아직 기록이 없어.</div>}
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className={`rounded-3xl shadow-sm ${cardClass(theme)}`}>
            <CardContent className="p-4">
              <div className="mb-3">
                <div className="text-base font-semibold">테마</div>
                <div className={`text-xs mt-1 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>원하는 분위기로 바꿔서 기록해봐.</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTheme(item.key)}
                    className={`px-3 py-3 rounded-xl text-sm transition border ${theme === item.key ? (item.key === "dark" ? "bg-slate-700 text-white shadow-sm border-slate-600" : "bg-white shadow-sm border-slate-300") : "opacity-80 border-slate-200"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <MonthCalendar records={records} currentDate={currentDate} onSelectDate={setCurrentDate} theme={theme} monthCursor={monthCursor} setMonthCursor={setMonthCursor} />
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
                saveRecords(activeProfileId, next);
                return next;
              });
              if (selectedEntryId === targetEntry.id) {
                setEntry((prev) => ({ ...prev, title: nextTitle, updatedAt: new Date().toISOString() }));
              }
              setSavedMessage("제목을 수정했어");
              setTimeout(() => setSavedMessage(""), 1200);
            }}
            theme={theme}
            currentDate={currentDate}
          />
        </div>

        <div className="space-y-5 pb-24 md:pb-6 min-w-0">
          <SectionCard title="▶ 기록 제목" subtitle="한날에 여러 번 쓸 수 있어서 구분용 제목을 적어두면 좋아." theme={theme}>
            <Input value={entry.title} onChange={(e) => updateEntry({ title: e.target.value })} placeholder="예: 아침에 든 생각" className={`rounded-2xl h-11 ${fieldClass(theme)}`} />
          </SectionCard>

          <SectionCard title="▶ 기분이 어때?" subtitle="감정표는 하나도 빠뜨리지 않고 모두 넣었어. 눌러서 펼치면 돼." theme={theme}>
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

          <SectionCard title="▶ 무엇 때문에?" theme={theme}>
            <Textarea value={entry.reason} onChange={(e) => updateEntry({ reason: e.target.value })} className={`min-h-40 rounded-3xl ${fieldClass(theme)}`} />
          </SectionCard>

          <SectionCard title="▶ 그래서 그런 감정이 들었구나" subtitle="그럴 수 있지, 이해돼." theme={theme}>
            <Textarea value={entry.empathy} onChange={(e) => updateEntry({ empathy: e.target.value })} className={`min-h-36 rounded-3xl ${fieldClass(theme)}`} />
          </SectionCard>

          <SectionCard title="▶ 그럼 네가 그 상대(또는 자신)에게 바라는 것은 무엇이야?" theme={theme}>
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
              <div className={`border rounded-2xl p-4 space-y-3 ${cardClass(theme)}`}>
                <div className="font-semibold">기타</div>
                <label className="flex items-center gap-3">
                  <Checkbox checked={entry.needsOtherChecked} onCheckedChange={() => updateEntry({ needsOtherChecked: !entry.needsOtherChecked })} />
                  <span>기타 항목 사용</span>
                </label>
                <Input value={entry.needsOtherText} onChange={(e) => updateEntry({ needsOtherText: e.target.value })} placeholder="기타 내용을 적어줘" className={`rounded-2xl h-11 ${fieldClass(theme)}`} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="▶ 네가 상대에게 하고 싶은 말은 뭐야?" theme={theme}>
            <Textarea value={entry.message} onChange={(e) => updateEntry({ message: e.target.value })} className={`min-h-44 rounded-3xl ${fieldClass(theme)}`} />
          </SectionCard>

          <SectionCard
            title="▶ 너는 자신에게 어떤 말을 해주고 싶어?"
            subtitle="자신에게 공감, 지지, 격려, 응원, 칭찬, 사랑, 축복의 말을 해줘. 예: 많이 힘들었지? 어떤 일이든지 나에게 말하면 내가 다 들어줄게. 나는 항상 네 편이고 너를 응원하고 있어. 사랑해."
            theme={theme}
          >
            <Textarea value={entry.selfMessage} onChange={(e) => updateEntry({ selfMessage: e.target.value })} className={`min-h-44 rounded-3xl ${fieldClass(theme)}`} />
          </SectionCard>

          <SectionCard title="▶ 네가 원하는 것을 이루기 위해 무엇을 할 수 있을까?" theme={theme}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className={`text-sm ${mutedClass(theme)}`}>할 수 있는 것</div>
                <Textarea value={entry.canDo} onChange={(e) => updateEntry({ canDo: e.target.value })} className={`min-h-44 rounded-3xl ${fieldClass(theme)}`} />
              </div>
              <div className="space-y-2">
                <div className={`text-sm ${mutedClass(theme)}`}>할 수 없는 것</div>
                <Textarea value={entry.cannotDo} onChange={(e) => updateEntry({ cannotDo: e.target.value })} className={`min-h-44 rounded-3xl ${fieldClass(theme)}`} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="▶ 지금은 기분이 어때?" theme={theme}>
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
            <Button
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
                  saveRecords(activeProfileId, next);
                  return next;
                });
                setSavedMessage("저장하였습니다");
                setTimeout(() => {
                  setSavedMessage("");
                  setIsSaving(false);
                }, 1200);
              }}
              className={`w-full h-12 rounded-2xl text-base shadow-lg transition-all duration-150 ${isSaving ? "scale-[0.98] opacity-90" : "scale-100"}`}
            >
              <Check className="w-4 h-4 mr-2" />{isSaving ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
