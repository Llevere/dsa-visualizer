export default function QuestionTitle({ children }) {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-5 border border-gray-300 rounded-lg p-6 shadow-md">
      <h1 className="text-2xl font-bold">Question</h1>
      <p className="text-white-600 mt-2">{children}</p>
    </div>
  );
}
