import React, { useState, useEffect } from "react";

const STORAGE_KEY = "nawa-records";

function today() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function App() {
  const [records, setRecords] = useState({});
  const [currentDate, setCurrentDate] = useState(today());
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const addRecord = () => {
    if (!text.trim()) return;

    const next = {
      ...records,
      [currentDate]: [...(records[currentDate] || []), text],
    };

    setRecords(next);
    setText("");
  };

  const deleteRecord = (index) => {
    const day = records[currentDate] || [];
    const nextDay = day.filter((_, i) => i !== index);

    const next = {
      ...records,
      [currentDate]: nextDay,
    };

    setRecords(next);
  };

  // 백업 저장
  const exportBackup = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      records,
    };

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "nawa-backup.json";
    a.click();

    URL.revokeObjectURL(url);

    setMessage("백업 파일 저장 완료");
    setTimeout(() => setMessage(""), 2000);
  };

  // 백업 불러오기
  const importBackup = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);

        if (!parsed.records) {
          throw new Error("invalid");
        }

        setRecords(parsed.records);

        setMessage("백업 복원 완료");
        setTimeout(() => setMessage(""), 2000);
      } catch {
        setMessage("백업 파일 오류");
        setTimeout(() => setMessage(""), 2000);
      }
    };

    reader.readAsText(file);
  };

  const dayRecords = records[currentDate] || [];

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>

      <h1>✨ 나와의 대화</h1>

      <p>
        링크 열면 바로 쓰는 감정 기록<br />
        기록은 각자 기기에만 저장됩니다
      </p>

      <div style={{ marginBottom: 20 }}>
        <button onClick={exportBackup}>백업 저장</button>

        <button
          onClick={() =>
            document.getElementById("backupFile").click()
          }
          style={{ marginLeft: 10 }}
        >
          백업 불러오기
        </button>

        <input
          id="backupFile"
          type="file"
          accept="application/json"
          onChange={importBackup}
          style={{ display: "none" }}
        />
      </div>

      {message && (
        <div style={{ marginBottom: 20 }}>{message}</div>
      )}

      <input
        type="date"
        value={currentDate}
        onChange={(e) => setCurrentDate(e.target.value)}
      />

      <div style={{ marginTop: 20 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="오늘 감정 기록..."
          style={{ width: "100%", height: 80 }}
        />
      </div>

      <button onClick={addRecord} style={{ marginTop: 10 }}>
        기록 추가
      </button>

      <div style={{ marginTop: 20 }}>
        {dayRecords.map((item, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            {item}

            <button
              onClick={() => deleteRecord(i)}
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
