import React, {useState} from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

function App() {
  const [code, setCode] = useState<string>("Console.WriteLine('Hello World');");
  const [output, setOutput] = useState<string>("");

  const runCode = async () => {
    try {
      const res = await axios.post('/CodeExecution', {
        language: "C#",
        code: code
      });
      setOutput(res.data.output);
    }
    catch (err) {
      setOutput(`Error running code: ${err}`); 
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <Editor
        height="400px"
        defaultLanguage="csharp"
        defaultValue={code}
        onChange={(value) => setCode(value || "")}
      />
      <button onClick={runCode} style={{ marginTop: "10px" }}>Run</button>
      <pre style={{ marginTop: "10px", background: "#f0f0f0", padding: "10px" }}>{output}</pre>
    </div>
  );
}

export default App;