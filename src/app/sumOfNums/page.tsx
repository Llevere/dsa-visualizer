'use client';

import CodeBlock from "../components/codeBlock";
import { useTestsStore } from "@/store/useTestsStore";

const solutions = [
  {
    label: "Reduce",
    code: `function solve(nums) {
  return nums.reduce((a, b) => a + b, 0);
}`
  },
  {
    label: "For Loop + Add",
    code: `function solve(nums) {
  let result = 0;
  for (let i = 0; i < nums.length; i++) {
    result += nums[i];
  }
  return result;
}`
  }
];


export default function SumOfNumsClient() {
  const { getTests } = useTestsStore();
  const tests = getTests("sumOfNums");


  return <CodeBlock tests={tests} solutions={solutions} testId="sumOfNums" />;
}
