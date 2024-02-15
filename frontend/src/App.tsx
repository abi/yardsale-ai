import { useRef } from "react";
import { Button } from "./components/ui/button";
import { HTTP_BACKEND_URL } from "./config";
import { useAuthenticatedFetch } from "./hooks/useAuthenticatedFetch";
import { useMediaLoader } from "./hooks/useMediaLoader";
import AudioRecorder from "./components/media/AudioRecorder";
import { useStore } from "./hooks/useStore";
import ExportAsCsv from "./components/ExportAsCsv";

function App() {
  const listing = useStore((state) => state.listing);
  const setListing = useStore((state) => state.setListing);
  const audioDataUrl = useStore((state) => state.audioDataUrl);

  // Video recording
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const customFetch = useAuthenticatedFetch();
  const testImageDataUrl = useMediaLoader("/product_images/plant.jpg");
  // const testAudioDataUrl = useMediaLoader("/product_audios/plant.m4a");

  const signIn = () => {
    alert("Sign in");
  };

  const analyze = async () => {
    console.log(audioDataUrl);

    const res = await customFetch(`${HTTP_BACKEND_URL}/analyze`, "POST", {
      imageUrl: testImageDataUrl,
      audioDescription: audioDataUrl,
    });

    setListing(res.response);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing the camera", error);
    }
  };

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
      // You can now use this imageDataUrl as the source for an image or to save the photo
      console.log(imageDataUrl);
    }
  };

  return (
    <>
      <div className="w-full xl:w-[1000px] mx-auto mt-2 sm:mt-4 px-4">
        {/* Navbar */}
        <nav className="border-b border-gray-200 py-2">
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">Sell Anything</div>
            <div className="flex items-center space-x-4">
              <Button variant="secondary" onClick={signIn}>
                Sign in
              </Button>
              <Button onClick={signIn}>Get started</Button>
            </div>
          </div>
        </nav>

        {/* Photos section */}
        <div className="flex flex-col mt-6">
          <h2 className="text-xl font-bold pb-4">1. Add photos</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <img
              src={testImageDataUrl}
              alt="Example 1"
              style={{ maxHeight: "200px" }}
            />
          </div>

          <div>
            <Button onClick={startCamera}>Start Camera</Button>
            <Button onClick={takePicture}>Take Picture</Button>
            <video
              className="hidden"
              ref={videoRef}
              autoPlay
              style={{ width: "100%" }}
            ></video>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          </div>
        </div>

        <div className="flex flex-col mt-6">
          <h2 className="text-xl font-bold pb-4">
            2. Talking about this product
          </h2>
          <AudioRecorder />
        </div>

        <div className="flex flex-col mt-6">
          <Button onClick={analyze}>Analyze</Button>
        </div>

        {listing && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">{listing.title}</h3>
            <p className="text-lg text-gray-800">
              Price: <span className="font-semibold">${listing.price}</span>
            </p>
            <p className="text-md text-gray-700">
              Condition: <span className="italic">{listing.condition}</span>
            </p>
            <p className="text-md text-gray-700">
              Category: <span className="italic">{listing.category}</span>
            </p>
            <p className="text-md text-gray-700">
              Description: <span className="italic">{listing.description}</span>
            </p>
          </div>
        )}

        {listing && <ExportAsCsv />}
      </div>
    </>
  );
}

export default App;
