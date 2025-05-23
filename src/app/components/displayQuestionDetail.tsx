'use client'
type QuestionResult = {
    input: Array<number>,
    expected: number,
    actual?: number,
    pass: boolean,
    logs: Array<string>,
    timeMs: number,
    error?: string
}

interface Props {
    index: number,
    data: QuestionResult
}
export default function DisplayQuestionDetail({ index, data }: Props) {
    return (
        <div
            style={{
                backgroundColor: 'black',
                border: "1px solid white",
                padding: 10,
                marginBottom: 5,
                borderRadius: 6,
            }}
        >
            <strong>Test {index + 1}</strong>: {data.pass ? "✅ Passed" : "❌ Failed"}
            <br />
            Input: {JSON.stringify(data.input)}
            <br />
            Expected: {JSON.stringify(data.expected)}
            <br />
            Actual: {JSON.stringify(data.actual)}
            <br />
            Time: {data.timeMs?.toFixed(2)} ms
            <br />
            {data.error && <div>Error: {data.error}</div>}
        </div>
    )
}