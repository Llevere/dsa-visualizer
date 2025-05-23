'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTestsStore } from '@/store/useTestsStore';

export default function Home() {
    const fetchTests = useTestsStore((s) => s.fetchTests);
    const getTestKeys = useTestsStore((s) => s.getTestKeys);
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<{ id: string; tests: unknown[] }[]>([]);

    useEffect(() => {
        const load = async () => {
            await fetchTests();
            const keys = getTestKeys();
            setQuestions(keys);
            setLoading(false);
        };
        load();
    }, [fetchTests, getTestKeys]);

    return (
        <div className="p-8 font-sans max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">DSA Practice Questions</h1>
            {loading && <p>Loading...</p>}
            <ul className="space-y-4">
                {questions.map(({ id }) => (
                    <li key={id} className="border p-4 rounded hover:bg-gray-50">
                        <Link
                            href={`/${id}`}
                            className="text-blue-600 hover:underline text-lg font-medium"
                        >
                            {id}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
