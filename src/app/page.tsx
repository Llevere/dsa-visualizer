'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type TestCase = { given: unknown; expected: unknown };

type QuestionMap = Record<string, { tests: TestCase[] }>;

export default function Home() {
    const [questions, setQuestions] = useState<{ id: string; tests: TestCase[] }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch('/data/tests.json');
                const data: QuestionMap = await res.json();
                const formatted = Object.entries(data).map(([id, { tests }]) => ({
                    id,
                    tests: tests.slice(0, 3),
                }));
                setQuestions(formatted);
            } catch (err) {
                setError('Failed to load questions' + err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    return (
        <div className="p-8 font-sans max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">DSA Practice Questions</h1>
            {loading && <p>Loading questions...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <ul className="space-y-4">
                {questions.map(({ id, tests }) => (
                    <li key={id} className="border p-4 rounded hover:bg-gray-50">
                        <Link
                            href={{ pathname: `/${id}`, query: { preview: JSON.stringify(tests) } }}
                            className="text-blue-600 hover:underline text-lg font-medium"
                            onClick={() => { console.log("Clicked: ", id) }}
                        >
                            {id}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}