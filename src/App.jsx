import { useState, useEffect } from "react";

export default function App() {
  const [records, setRecords] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("records");
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records));
  }, [records]);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const addRecord = () => {
    if (!selectedDate || !text) return;

    const newRecords = { ...records };
    if (!newRecords[selectedDate]) newRecords[selectedDate] = [];

    newRecords[selectedDate].push({
      text,
      time: new Date().toLocaleTimeString(),
    });

    setRecords(newRecords);
    setText("");
  };

  const deleteRecord = (date, index) => {
    const newRecords = { ...records };
    newRecords[date].splice(index, 1);
    if (newRecords[date].length === 0) delete newRecords[date];
    setRecords(newRecords);
  };

  const formatDate = (day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 500, margin: "auto" }}>
      <h2>✨ 나와의 대화</h2>
      <p>링크 열면 바로 쓰는 감정 기록</p>

      <h3>달력 기록</h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8 }}>
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const date = formatDate(day);
          const count = records[date]?.length || 0;

          return (
            <div
              key={day}
              onClick={() => setSelectedDate(date)}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 10,
                textAlign: "center",
                cursor: "pointer",
                background: selectedDate === date ? "#eee" : "white",
              }}
            >
              <div>{day}</div>
              {count > 0 && <div style={{ color: "green" }}>{count}개</div>}
            </div>
          );
        })}
      </div>

      <h3 style={{ marginTop: 20 }}>{selectedDate}</h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="오늘 감정 기록..."
        style={{ width: "100%", height: 80, marginTop: 10 }}
      />

      <button onClick={addRecord} style={{ marginTop: 10 }}>
        기록 추가
      </button>

      <div style={{ marginTop: 20 }}>
        {records[selectedDate]?.map((r, i) => (
          <div key={i} style={{ borderBottom: "1px solid #eee", padding: 8 }}>
            <div>{r.text}</div>
            <small>{r.time}</small>
            <button
              onClick={() => deleteRecord(selectedDate, i)}
              style={{ marginLeft: 10 }}
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
