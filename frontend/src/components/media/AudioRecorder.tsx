import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { useStore } from "../../hooks/useStore";
import { FaMicrophone, FaStopCircle } from "react-icons/fa";

export default function AudioRecorder() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const audioChunksRef = useRef<BlobPart[]>([]);
  const setAudioDataUrl = useStore((state) => state.setAudioDataUrl);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newMediaRecorder = new MediaRecorder(stream);

      newMediaRecorder.ondataavailable = (e) => {
        console.log("Collecting data");
        audioChunksRef.current.push(e.data);
      };

      newMediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        console.log(blob);

        // Read as Data URL (base64)
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          setAudioDataUrl(base64data as string);
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
    <div className="flex justify-center space-x-4 my-4">
      <Button onClick={startRecording} className="flex gap-2 bg-red-500">
        <FaMicrophone /> Record
      </Button>
      <Button onClick={stopRecording} className="flex gap-2 bg-black">
        <FaStopCircle /> Stop
      </Button>
    </div>
  );
}
