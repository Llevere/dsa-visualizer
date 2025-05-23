'use client';

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import DisplayQuestionDetail from "./displayQuestionDetail";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type SolutionObject = {
    "label": string,
    "code": string
}

type QuestionResult = {
    input: Array<number>,
    expected: number,
    actual?: number,
    pass: boolean,
    logs: Array<string>,
    timeMs: number,
    error?: string
}
type SubmissionSummary = { passed: number; total: number; avgTime: number };
type TestCase = { given: unknown; expected: unknown };

type Props = {
    tests: TestCase[];
    solutions: SolutionObject[];
    testId: string;
}

export default function CodeBlock({ tests, solutions, testId }: Props) {
    const [mounted, setMounted] = useState(false);
    const [results, setResults] = useState<Record<number, QuestionResult[]>>({});
    const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [solutionCodes, setSolutionCodes] = useState<string[]>(
        solutions.map((s) => s.code)
    );

    const [summaries, setSummaries] = useState<Record<number, SubmissionSummary>>({});

    useEffect(() => {
        setMounted(true);
    }, []);

    const runCode = async (code: string, index: number) => {
        setLoadingIndex(index);
        setError(null);
        setSummaries({})
        try {
            const res = await axios.post("/api/run", {
                code,
                tests,
            });
            setResults((prev) => ({ ...prev, [index]: res.data.results }));
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            setError(msg);
            console.error(err)
        }
        setLoadingIndex(null);
    };

    const submitCode = async (code: string, index: number) => {
        setLoadingIndex(index);
        setError(null);
        setResults({})
        try {
            const res = await axios.post("/api/submit", {
                code,
                tests,
                testId
            });
            const { passed, total, avgTime } = res.data;
            //setResults((prev) => ({ ...prev, [index]: fullResults }));
            setSummaries((prev) => ({ ...prev, [index]: { passed, total, avgTime } }));

        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            setError(msg);
            console.error(err)
        }
        setLoadingIndex(null);
    };

    if (!mounted) return null;

    return (
        <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
            <div className="flex justify-center">
                <h1>Question</h1>
                <p>Get the sum of an array of numbers</p>
            </div>

            <h2>Compare Solutions</h2>
            {solutions.map((solution, i) => (
                <div key={i} style={{ marginBottom: 30 }}>
                    <h3>{solution.label}</h3>
                    <MonacoEditor
                        className="editorHeight"
                        defaultLanguage="javascript"
                        value={solutionCodes[i]}
                        onChange={(value) =>
                            setSolutionCodes((prev) =>
                                prev.map((code, idx) => (idx === i ? value ?? "" : code))
                            )
                        }
                        options={{
                            readOnly: false,
                            formatOnType: true,
                            formatOnPaste: true,
                            automaticLayout: true,
                            minimap: { enabled: false },
                            tabSize: 2,
                            insertSpaces: true
                        }}
                        beforeMount={(monaco) => {
                            // Enable diagnostics/validation
                            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                                noSemanticValidation: false,
                                noSyntaxValidation: false,
                            });

                            // Enable default formatting for JavaScript
                            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                                target: monaco.languages.typescript.ScriptTarget.ESNext,
                                allowNonTsExtensions: true,
                            });
                        }}
                    />
                    <button
                        onClick={() => runCode(solutionCodes[i], i)}
                        disabled={loadingIndex === i}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingIndex === i ? "Running..." : "Run"}
                    </button>

                    <button
                        onClick={() => submitCode(solutionCodes[i], i)}
                        disabled={loadingIndex === i}
                        className="mt-2 ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingIndex === i ? "Running..." : "Submit"}
                    </button>

                    <div className="results">
                        {results[i] && results[i].map((r, j) => (
                            <DisplayQuestionDetail key={j} index={j} data={r} />
                        ))}
                        {summaries[i] && (
                            <p className="text-sm text-gray-600 mt-2">
                                ✅ {summaries[i].passed}/{summaries[i].total} passed — Avg time: {summaries[i].avgTime.toFixed(2)} ms
                            </p>
                        )}

                    </div>
                </div>
            ))}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </div>
    );
}