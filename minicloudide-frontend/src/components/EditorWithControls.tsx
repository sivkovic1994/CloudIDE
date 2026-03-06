import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const EditorWithControls: React.FC = () => {
  const [language, setLanguage] = useState<string>("python");
  const [theme, setTheme] = useState<string>("vs-dark");
  const [code, setCode] = useState<string>("print(\"Hello World\")");
  const [history, setHistory] = useState<string[]>([]);
  const [output, setOutput] = useState<string>("");

  const runCode = async () => {
    try {
      const res = await axios.post("/CodeExecution", {
        language: language === "python" ? "Python" :"C#",
        code: code
      });
      setOutput(res.data.output || "");
    } catch (err) {
      setOutput(`Error running code: ${err}`);
    }
  };

  const saveScript = async () => {
  try {
    const res = await axios.post("/CodeExecution/save", {
      language: language === "csharp" ? "C#" : "Python",
      code: code
    });

    setHistory(res.data);
  } catch (err) {
    console.error(err);
  }
};

  // Add F5 shortcut to run code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F5") {
        e.preventDefault(); // prevent browser refresh
        runCode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, language]);

  // Clear code and history when language changes
  useEffect(() => {
    setCode("");
    setHistory([]);
  }, [language]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "10px" }}>
      
      {/* Controls */}
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
        <label>
          Language:
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="python">Python</option>
            <option value="csharp">C#</option>
          </select>
        </label>

        <label>
          Theme:
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="vs-dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>

        {/* Run button */}
        <button onClick={runCode}>Run (F5)</button>
        <button onClick={saveScript}>Save</button>
      </div>

      {/* Editor */}
      <div style={{ flexGrow: 1, minHeight: "300px" }}>
        <Editor
          height="100%"
          language={language}
          theme={theme}
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            automaticLayout: true,
          }}
        />
      </div>

      {/* Output */}
      <pre style={{ marginTop: "10px", background: "#f0f0f0", padding: "10px", minHeight: "100px" }}>
        {output}
      </pre>

      {/* History */}
      <div style={{ marginTop: "10px" }}>
        <h3>History</h3>
        {history.map((script, index) => (
          <div key={index}>
            <button onClick={() => setCode(script)}>
              Load script {index + 1}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorWithControls;