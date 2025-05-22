'use client';

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const defaultSolutions = [
  {
    label: "Reduce",
    code: `function solve(arr) {
  console.log("Solving", arr);
  return arr.reduce((a, b) => a + b, 0);
}`,
  },
  {
    label: "For Loop + Add",
    code: `function solve(arr) {
  console.log("Solving", arr);
  let result = 0;
  for(let i = 0; i < arr.length; i++) {
    result = add(result, arr[i]);
  }
  return result;
}

function add(a, b) {
  return a + b;
}`,
  },
];

interface questionResult {
  input: Array<number>,
  expected: number,
  actual?: number,
  pass: boolean,
  logs: Array<string>,
  timeMs: number,
  error?: string
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [results, setResults] = useState<Record<number, questionResult[]>>({});
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const runCode = async (code: string, index: number) => {
    setLoadingIndex(index);
    setError(null);
    try {
      const res = await axios.post("/api/run", {
        code,
        tests: [
          { input: [1, 2, 3], expected: 6 },
          { input: [5, 5], expected: 10 },
          { input: [10, -3], expected: 7 },
        ],
      });
      setResults((prev) => ({ ...prev, [index]: res.data.results }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    }
    setLoadingIndex(null);
  };

  if (!mounted) return null;

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>Compare Solutions</h2>
      {defaultSolutions.map((solution, i) => (
        <div key={i} style={{ marginBottom: 30 }}>
          <h3>{solution.label}</h3>
          <MonacoEditor
            height="200px"
            defaultLanguage="javascript"
            value={solution.code}
            options={{ readOnly: false }}
          />
          <button
            onClick={() => runCode(solution.code, i)}
            style={{ marginTop: 10 }}
            disabled={loadingIndex === i}
          >
            {loadingIndex === i ? "Running..." : "Run"}
          </button>
          <div style={{ marginTop: 10 }}>
            {(results[i] || []).map((r, j) => (
              <div
                key={j}
                style={{
                  backgroundColor: 'black',
                  border: "1px solid white",
                  padding: 10,
                  marginBottom: 5,
                  borderRadius: 6,
                }}
              >
                <strong>Test {j + 1}</strong>: {r.pass ? "✅ Passed" : "❌ Failed"}
                <br />
                Input: {JSON.stringify(r.input)}
                <br />
                Expected: {JSON.stringify(r.expected)}
                <br />
                Actual: {JSON.stringify(r.actual)}
                <br />
                Time: {r.timeMs?.toFixed(2)} ms
                <br />
                Logs: {(r.logs || []).join(" | ") || 'None'}
                {r.error && <div>Error: {r.error}</div>}
              </div>
            ))}
          </div>
        </div>
      ))}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}