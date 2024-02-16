import { useEffect, useRef } from "react";
import { useStore } from "../../hooks/useStore";
import { Button } from "../ui/button";
import { FaCamera } from "react-icons/fa";
import { useToast } from "../ui/use-toast";

export function CameraView() {
  const imageDataUrls = useStore((state) => state.imageDataUrls);
  const [cancel, next, addImage] = useStore((s) => [
    s.cancel,
    s.next,
    s.addImage,
  ]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // <canvas> is used to take a picture
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
    <div className="flex flex-col mt-6">
      <div className="flex items-center justify-center w-full">
        <span className="text-3xl font-bold cursor-pointer" onClick={cancel}>
          x
        </span>
        <h2 className="text-xl font-bold pb-4 pl-2 text-center flex-1">
          Capture photos
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {imageDataUrls.map((url, index) => (
          <div key={index}>
            <img src={url} alt={`Image`} style={{ maxHeight: "200px" }} />
          </div>
        ))}
      </div>
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
      <Button onClick={next}>Done</Button>
    </div>
  );
}
