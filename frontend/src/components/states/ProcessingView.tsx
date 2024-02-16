export function ProcessingView({
  showLogs,
  setShowLogs,
  logs,
}: {
  showLogs: boolean;
  setShowLogs: (show: boolean) => void;
  logs: string;
}) {
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
          {logs}
        </pre>
      )}
    </div>
  );
}
