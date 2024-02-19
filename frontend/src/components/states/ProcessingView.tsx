import { useState } from "react";
import { useStore } from "../../hooks/useStore";

export function ProcessingView() {
  const [showLogs, setShowLogs] = useState<boolean>(true);

  const processingLogs = useStore((s) => s.processingLogs);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold pb-4">Logs</h2>
      <button
        onClick={() => setShowLogs(!showLogs)}
        className="mb-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
      >
        {showLogs ? "Hide Logs" : "Show Logs"}
      </button>
      {showLogs && (
        <pre className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap">
          {processingLogs}
        </pre>
      )}
    </div>
  );
}
