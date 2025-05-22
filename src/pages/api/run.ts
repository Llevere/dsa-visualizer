import type { NextApiRequest, NextApiResponse } from "next";
import { NodeVM } from "vm2";

type TestCase = {
  input: unknown;
  expected: unknown;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { code, tests }: { code: string; tests: TestCase[] } = req.body;

  try {
    const results = tests.map((test) => {
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
        module.exports = (function() {
          ${code}
          return solve(${JSON.stringify(test.input)});
        })();
      `;

        const start = performance.now();
        const result = vm.run(wrappedCode, "vm.js");
        const end = performance.now();

        return {
          input: test.input,
          expected: test.expected,
          actual: result,
          pass: JSON.stringify(result) === JSON.stringify(test.expected),
          logs,
          timeMs: end - start,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return {
          input: test.input,
          expected: test.expected,
          error: message,
          pass: false,
          logs,
        };
      }
    });

    res.status(200).json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
}
