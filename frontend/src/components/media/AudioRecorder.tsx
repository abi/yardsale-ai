import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { useStore } from "../../hooks/useStore";
import { FaMicrophone, FaStopCircle } from "react-icons/fa";
import { Textarea } from "../ui/textarea";

export default function AudioRecorder() {
  const [descriptionFormat, setDescriptionFormat] = useStore((s) => [
    s.descriptionFormat,
    s.setDescriptionFormat,
  ]);
  // Text
  const descriptionText = useStore((state) => state.descriptionText);
  const setDescriptionText = useStore((state) => state.setDescriptionText);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  // Audio
  const audioChunksRef = useRef<BlobPart[]>([]);
  const setDescriptionAudio = useStore((state) => state.setDescriptionAudio);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newMediaRecorder = new MediaRecorder(stream);

      newMediaRecorder.ondataavailable = (e) => {
        console.log("Collecting data");
        audioChunksRef.current.push(e.data);
      };

      newMediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, {
          type: newMediaRecorder.mimeType,
        });

        console.log(blob);

        // Read as Data URL (base64)
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          setDescriptionAudio(base64data as string);
        };

        // Clear the chunks array
        audioChunksRef.current = [];
      };

      // Start recording with a time slice of 1000ms
      newMediaRecorder.start(1000);
      setMediaRecorder(newMediaRecorder);
      console.log("Recording started");
    } catch (error) {
      console.error("Error accessing the microphone", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      console.log("Recording stopped by user");
    }
  };

  return (
    <>
      {descriptionFormat === "audio" && (
        <div className="flex justify-center space-x-4 my-4">
          {mediaRecorder?.state !== "recording" && (
            <Button onClick={startRecording} className="flex gap-2 bg-red-500">
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

      {/* Switch to text toggle */}
      <Button
        variant="link"
        className="text-sm text-gray-500"
        onClick={() =>
          setDescriptionFormat(descriptionFormat === "audio" ? "text" : "audio")
        }
      >
        {descriptionFormat === "audio" ? "I prefer text" : "I prefer audio"}
      </Button>
    </>
  );
}
