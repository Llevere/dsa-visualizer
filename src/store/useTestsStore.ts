import { create } from "zustand";
import { persist } from "zustand/middleware";
type TestCase = { given: unknown; expected: unknown };
type QuestionMap = Record<string, { tests: TestCase[] }>;

type TestStore = {
  tests: QuestionMap;
  setTests: (data: QuestionMap) => void;
  getTests: (testId: string) => TestCase[];
  fetchTests: () => Promise<void>;
  getTestKeys: () => { id: string; tests: TestCase[] }[];
};

export const useTestsStore = create<TestStore>()(
  persist(
    (set, get) => ({
      tests: {},
      setTests: (data) => set({ tests: data }),

      getTests: (testId) => {
        return get().tests[testId]?.tests.splice(0, 3);
      },

      fetchTests: async () => {
        try {
          const res = await fetch("/data/tests.json");
          const data: QuestionMap = await res.json();
          set({ tests: data });
        } catch (error) {
          console.error("Failed to fetch tests:", error);
        }
      },

      getTestKeys: () => {
        const tests = get().tests;
        return Object.entries(tests).map(([id, { tests }]) => ({
          id,
          tests: tests.slice(0, 3),
        }));
      },
    }),
    {
      name: "dsa-tests", // key in localStorage
    }
  )
);
