import AudioRecorder from "../media/AudioRecorder";
import { Button } from "../ui/button";

export function ProductDescriptionView({ analyze }: { analyze: () => void }) {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col mt-6">
        <h2 className="text-xl font-bold pb-4">
          One last step... talk about your product naturally.
        </h2>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Try to mention:
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li className="text-gray-600">Brand</li>
            <li className="text-gray-600">Age</li>
            <li className="text-gray-600">Price you want to sell it for</li>
            <li className="text-gray-600">Condition</li>
          </ul>
        </div>
        <AudioRecorder />
      </div>

      <div className="flex flex-col mt-6">
        <Button onClick={analyze} className="bg-blue-400">
          Generate Listing 🪄
        </Button>
      </div>
    </div>
  );
}
