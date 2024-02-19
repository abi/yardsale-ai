import { useEffect, useRef } from "react";
import { useStore } from "../../hooks/useStore";
import { Button } from "../ui/button";
import { FaCamera, FaTimes } from "react-icons/fa";
import { useToast } from "../ui/use-toast";
import { captureImageFromVideo } from "../media/camera";

export function CameraView() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // <canvas> is used to take a picture
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageDataUrls = useStore((state) => state.imageDataUrls);
  const [cancel, next, addImage] = useStore((s) => [
    s.cancel,
    s.next,
    s.addImage,
  ]);

  const { toast } = useToast();

  // Start the camera when the component mounts
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

  function cleanup() {
    if (videoRef.current && videoRef.current.srcObject) {
      console.log("cleaning up");
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  }

  const takePicture = () => {
    if (imageDataUrls.length >= 6) {
      toast({
        title: "Limit Reached",
        description:
          "You can't capture more photos. Please hit the 'Done' button to continue.",
      });
      return;
    }

    // TODO: More robust error handling here
    const imageUrl = captureImageFromVideo(videoRef.current, canvasRef.current);
    if (!imageUrl) {
      toast({ title: "Error", description: "Error taking picture" });
    } else {
      addImage(imageUrl);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-3 items-center w-full mt-2">
        <span
          className="text-xl font-bold cursor-pointer text-gray-500 justify-self-start"
          onClick={() => {
            cleanup();
            cancel();
          }}
        >
          <FaTimes />
        </span>
        <h2 className="text-xl font-bold text-center">Take Pics</h2>
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
      <Button
        onClick={() => {
          cleanup();
          next();
        }}
        className="mt-4"
      >
        Done
      </Button>
      <div className="flex flex-col flex-1 items-center justify-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Captured Pics
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {imageDataUrls.map((url, index) => (
            <div key={index} className="max-w-xs">
              <img
                src={url}
                alt={`Image ${index}`}
                className="object-contain w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
