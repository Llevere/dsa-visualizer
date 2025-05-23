'use client';

import CodeBlock from "../components/codeBlock";
import { useTestsStore } from "@/store/useTestsStore";
import QuestionTitle from "../components/questionTitle";

const solutions = [
  {
    label: "Compare string in reverse",
    code: `/**
 * @param {number} x
 * @return {boolean}
 */
var solve = function(x) {
  var asc = x.toString();
  var desc = "";
  for (let i = asc.length - 1; i > -1; i--) {
    desc += asc[i];
  }
  return asc == desc;
}`
  }
];


export default function SumOfNumsClient() {
  const { getTests } = useTestsStore();
  const testId = "isPalindromeNumber"
  const tests = getTests(testId);

  return (<div>
    <QuestionTitle>Determine if the number is the same in reverse</QuestionTitle>
    <CodeBlock tests={tests} solutions={solutions} testId={testId} /></div>);
}
