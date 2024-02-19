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
      <h2 className="text-2xl font-bold pb-4 mt-4">
        Final step: Talk about your item like you would to a friend
      </h2>

      <div className="bg-white rounded-lg p-2">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Try to mention:
        </h3>
        <ul className="list-disc list-inside space-y-0.5">
          <li className="text-gray-600 text-sm">Brand</li>
          <li className="text-gray-600 text-sm">Age</li>
          <li className="text-gray-600 text-sm">Price</li>
          <li className="text-gray-600 text-sm">Condition</li>
        </ul>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {descriptionFormat === "audio" && (
          <div className="flex justify-center space-x-4 my-2">
            {mediaRecorder?.state !== "recording" && (
              <Button
                onClick={startRecording}
                size="lg"
                className="flex gap-2 bg-red-500 text-lg"
              >
                <FaMicrophone /> Record
              </Button>
            )}
            {mediaRecorder?.state === "recording" && (
              <Button
                onClick={stopRecording}
                size="lg"
                className="flex gap-2 bg-black text-lg"
              >
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
          className="text-xs text-gray-400 underline"
          onClick={() =>
            setDescriptionFormat(
              descriptionFormat === "audio" ? "text" : "audio"
            )
          }
        >
          {descriptionFormat === "audio"
            ? "I prefer to type"
            : "I prefer to speak"}
        </Button>
      </div>

      <div className="flex flex-col mb-10">
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
