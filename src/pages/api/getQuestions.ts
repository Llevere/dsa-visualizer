// import type { NextApiRequest, NextApiResponse } from "next";
// import tests from "@/data/tests.json"; // ✅ Import JSON directly

// type QuestionMap = Record<
//   string,
//   { tests: { input: unknown; expected: unknown }[] }
// >;

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<QuestionMap>
// ) {
//   if (req.method !== "GET") return res.status(405).end();
//   res.status(200).json(tests);
// }
