"use client";
import type { NextApiRequest, NextApiResponse } from "next";
import { NodeVM } from "vm2";
import path from "path";
import fs from "fs";

type TestCase = { given: unknown; expected: unknown };
type QuestionResult = { pass: boolean; timeMs: number };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { code, testId }: { code: string; testId: string } = req.body;

  try {
    const filePath = path.join(process.cwd(), "public", "data", "tests.json");
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const allTests = JSON.parse(fileContents);

    const question = allTests[testId];
    if (!question || !Array.isArray(question.tests)) {
      return res.status(400).json({ error: `No tests found for ${testId}` });
    }

    const failedTests: TestCase[] = [];
    const results: QuestionResult[] = question.tests.map((test: TestCase) => {
      const logs: string[] = [];
      const vm = new NodeVM({
        console: "redirect",
        sandbox: {},
        timeout: 1000,
        wrapper: "commonjs",
      });

      vm.on("console.log", (msg) => logs.push(String(msg)));

      try {
        const wrappedCode = `
          const _nonce = ${Math.random()};
          module.exports = (function() {
            ${code}
            return solve(${JSON.stringify(test.given)});
          })();
        `;
        const start = performance.now();
        const result = vm.run(wrappedCode, "vm.js");
        const end = performance.now();
        const passed = JSON.stringify(result) === JSON.stringify(test.expected);
        if (!passed) {
          failedTests.push(test);
        }
        return {
          pass: passed,
          timeMs: end - start,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error(err);
        throw new Error(message);
        //return { pass: false, timeMs: 0 };
      }
    });

    return res.status(200).json({
      passed: results.filter((r) => r.pass).length,
      failed: failedTests,
      total: results.length,
      avgTime:
        results.reduce((sum, r) => sum + (r.timeMs || 0), 0) / results.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
