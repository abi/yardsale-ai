import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { useStore } from "../../hooks/useStore";
import { FaMicrophone, FaStopCircle } from "react-icons/fa";
import { Textarea } from "../ui/textarea";

export function ProductDescriptionView({ analyze }: { analyze: () => void }) {
  const [descriptionFormat, setDescriptionFormat] = useStore((s) => [
    s.descriptionFormat,
    s.setDescriptionFormat,
  ]);
  const [descriptionText, setDescriptionText] = useStore((s) => [
    s.descriptionText,
    s.setDescriptionText,
  ]);
  const setDescriptionAudio = useStore((s) => s.setDescriptionAudio);

  // Local state
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const audioChunksRef = useRef<BlobPart[]>([]);

  // TODO: Move to a function in /media
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType,
        });

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          setDescriptionAudio(base64data as string);
        };

        audioChunksRef.current = [];
      };

      mediaRecorder.start(1000);
      setMediaRecorder(mediaRecorder);
      setStream(stream);
    } catch (error) {
      console.error("Error accessing the microphone", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  function cleanup() {
    stopRecording();

    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  }

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
        {descriptionFormat === "audio" && (
          <div className="flex justify-center space-x-4 my-4">
            {mediaRecorder?.state !== "recording" && (
              <Button
                onClick={startRecording}
                className="flex gap-2 bg-red-500"
              >
                <FaMicrophone /> Record
              </Button>
            )}
            {mediaRecorder?.state === "recording" && (
              <Button onClick={stopRecording} className="flex gap-2 bg-black">
                <FaStopCircle /> Stop
              </Button>
            )}
          </div>
        )}

        {descriptionFormat === "text" && (
          <Textarea
            placeholder="Audio description"
            value={descriptionText}
            onChange={(e) => setDescriptionText(e.target.value)}
          />
        )}

        <Button
          variant="link"
          className="text-sm text-gray-500"
          onClick={() =>
            setDescriptionFormat(
              descriptionFormat === "audio" ? "text" : "audio"
            )
          }
        >
          {descriptionFormat === "audio" ? "I prefer text" : "I prefer audio"}
        </Button>
      </div>

      <div className="flex flex-col mt-6">
        <Button
          onClick={() => {
            cleanup();
            analyze();
          }}
          className="bg-blue-400"
        >
          Generate Listing 🪄
        </Button>
      </div>
    </div>
  );
}
