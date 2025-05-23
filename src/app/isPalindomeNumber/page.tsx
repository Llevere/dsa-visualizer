'use client';

import CodeBlock from "../components/codeBlock";
import { useTestsStore } from "@/store/useTestsStore";

const solutions = [
    {
        label: "Comapre string in reverse",
        code: `/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
  var asc = x.toString();
  var desc = "";
  for (let i = asc.length - 1; i > -1; i--) {
    desc += asc[i];
  }
  return asc == desc;
}`
    },
    //         {
    //             label: "For Loop",
    //             code: `/**
    //  * @param {string} str
    //  * @return {boolean}
    //  */
    // function solve(str) {
    //   let cleaned = "";
    //   for (let i = 0; i < str.length; i++) {
    //     const ch = str[i].toLowerCase();
    //     if (ch >= "a" && ch <= "z") {
    //       cleaned += ch;
    //     }
    //   }

    //   let reversed = "";
    //   for (let i = cleaned.length - 1; i >= 0; i--) {
    //     reversed += cleaned[i]; // inefficient: string concatenation in loop
    //   }

    //   return cleaned === reversed;
    // }`
    //         }
];


export default function SumOfNumsClient() {
    const { getTests } = useTestsStore();
    const testId = "isPalindromeNumber"
    const tests = getTests(testId);

    return <CodeBlock tests={tests} solutions={solutions} testId={testId} />;
}
