import { useEffect, useRef } from "react";
import { useStore } from "../../hooks/useStore";
import { Button } from "../ui/button";
import { FaCamera, FaTimes } from "react-icons/fa";
import { captureImageFromVideo } from "../media/camera";
import toast from "react-hot-toast";

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
        toast.error("Error accessing the camera");
      }
    };

    startCamera();
  }, []);

  function cleanup() {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  }

  const takePicture = () => {
    if (imageDataUrls.length >= 6) {
      toast.error(
        "You can't capture more photos. Please hit the 'Done' button to continue."
      );
      return;
    }

    // TODO: More robust error handling here
    const imageUrl = captureImageFromVideo(videoRef.current, canvasRef.current);

    if (!imageUrl) {
      toast.error("Error taking picture");
    } else {
      toast("Nice shot!", {
        icon: "📷",
      });
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

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center w-full col-start-2">
            <button
              onClick={takePicture}
              className="h-16 w-16 rounded-full bg-red-500 flex items-center justify-center text-white"
            >
              <FaCamera />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center w-full">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Captured Pics
            </h3>
            <div className="flex overflow-x-scroll gap-4 mb-4 w-full">
              {imageDataUrls.map((url, index) => (
                <div key={index} className="flex-none">
                  <img
                    src={url}
                    alt={`Image ${index}`}
                    className="object-contain max-w-[40px] h-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
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
    </div>
  );
}
