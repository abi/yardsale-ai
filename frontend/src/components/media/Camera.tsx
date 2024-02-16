import { useEffect, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import { useStore } from "../../hooks/useStore";
import { useToast } from "../ui/use-toast";

export function Camera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // <canvas> is used to take a picture
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const addImage = useStore((state) => state.addImage);

  const { toast } = useToast();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        toast({ title: "Error", description: "Error accessing the camera" });
      }
    };

    startCamera();
  }, [toast]);

  const takePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      // Draw the video frame to the canvas and capture as an image
      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/png");

      addImage(imageDataUrl);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-y-4">
      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        style={{ width: "100%" }}
      ></video>

      {/* Hidden element used for taking a picture */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      <button
        onClick={takePicture}
        className="h-16 w-16 rounded-full bg-red-500 flex items-center justify-center text-white"
      >
        <FaCamera />
      </button>
    </div>
  );
}
