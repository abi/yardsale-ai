import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { FaCamera, FaPlay, FaStop } from "react-icons/fa";
import clsx from "clsx";
import { useStore } from "../../hooks/useStore";

export function Camera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // <canvas> is used to take a picture
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const setImageDataUrls = useStore((state) => state.setImageDataUrls);

  const startCamera = async () => {
    if (!isCameraOn) {
      // Turn on the camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (error) {
        // TODO: Switch to toast
        console.error("Error accessing the camera", error);
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        // TODO: Look into avoiding this cast
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    }
  };

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

      setImageDataUrls([imageDataUrl]);
    }
  };

  return (
    <div>
      <Button
        onClick={startCamera}
        className="flex gap-2 bg-slate-500 active:bg-slate-500"
      >
        {isCameraOn ? <FaStop /> : <FaPlay />} {isCameraOn ? "Stop" : "Start"}
      </Button>
      {isCameraOn && (
        <Button onClick={takePicture} className="flex gap-2 bg-green-400">
          <FaCamera /> Take Picture
        </Button>
      )}
      <video
        ref={videoRef}
        autoPlay
        style={{ width: "100%" }}
        className={clsx({ hidden: !isCameraOn })}
      ></video>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}
