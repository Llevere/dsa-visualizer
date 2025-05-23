'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import CodeBlock from "../components/codeBlock";

const solutions = [
    {
        label: "Reduce",
        code:
            `/**
 * @param {number[]} nums
 * @return {number}
 */
function solve(nums) {
  return nums.reduce((a, b) => a + b, 0);
}`,
    },
    {
        label: "For Loop + Add",
        code:
            `/**
 * @param {number[]} nums
 * @return {number}
 */
function solve(nums) {
  let result = 0;
  for(let i = 0; i < nums.length; i++) {
    result = add(result, nums[i]);
  }
  return result;
}

function add(a, b) {
  return a + b;
}`,
    },
];

export default function SumOfNums() {
    const [mounted, setMounted] = useState(false);
    const tests = JSON.parse(useSearchParams()?.get('preview') || '[]');
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <CodeBlock tests={tests} solutions={solutions} testId="sumOfNums" />
    );
}