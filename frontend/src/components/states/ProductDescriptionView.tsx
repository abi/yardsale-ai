import AudioRecorder from "../media/AudioRecorder";
import { Button } from "../ui/button";

export function ProductDescriptionView({ analyze }: { analyze: () => void }) {
  return (
    <>
      <div className="flex flex-col mt-6">
        <h2 className="text-xl font-bold pb-4">2. Talk about this product</h2>
        <AudioRecorder />
      </div>

      <div className="flex flex-col mt-6">
        <Button onClick={analyze}>Analyze</Button>
      </div>
    </>
  );
}
