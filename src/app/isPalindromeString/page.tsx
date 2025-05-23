'use client';

import CodeBlock from "../components/codeBlock";
import { useTestsStore } from "@/store/useTestsStore";
import QuestionTitle from "../components/questionTitle"
const solutions = [
    {
        label: "Replace + Split + Reverse",
        code: `/**
 * @param {string} s
 * @return {boolean}
 */
var solve = function(s) {
  if(s.length < 2) return true;
  const charactersCombined = s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const characteresReverse = charactersCombined.split("").reverse().join("");
  return charactersCombined === characteresReverse;
};`
    },
    {
        label: "For Loop",
        code: `/**
 * @param {string} str
 * @return {boolean}
 */
function solve(str) {
  let cleaned = "";
  for (let i = 0; i < str.length; i++) {
    const ch = str[i].toLowerCase();
    if ((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9")) {
      cleaned += ch;
    }
  }

  let reversed = "";
  for (let i = cleaned.length - 1; i >= 0; i--) {
    reversed += cleaned[i];
  }

  return cleaned === reversed;
}`
    }
];


export default function SumOfNumsClient() {
    const { getTests } = useTestsStore();
    const testId = "isPalindromeString"
    const tests = getTests(testId);

    return <div>
        <QuestionTitle>Determine if the string is the same in reverse</QuestionTitle>
        <CodeBlock tests={tests} solutions={solutions} testId={testId} />
    </div>;
}
