import { Button } from "./components/ui/button";
import { USE_TEST_PRODUCTS, WS_BACKEND_URL } from "./config";
import { useMediaLoader } from "./hooks/useMediaLoader";
import AudioRecorder from "./components/media/AudioRecorder";
import { useStore } from "./hooks/useStore";
import ExportAsCsv from "./components/ExportAsCsv";
import { Camera } from "./components/media/Camera";
import { useToast } from "./components/ui/use-toast";
import { useState } from "react";
import Footer from "./components/LandingPage";

function App() {
  const [logs, setLogs] = useState<string>("");
  const [showLogs, setShowLogs] = useState<boolean>(true);

  const listing = useStore((state) => state.listing);
  const setListing = useStore((state) => state.setListing);
  const descriptionAudio = useStore((state) => state.descriptionAudio);
  const imageDataUrls = useStore((state) => state.imageDataUrls);
  const descriptionFormat = useStore((state) => state.descriptionFormat);
  const descriptionText = useStore((state) => state.descriptionText);

  const testImageDataUrl = useMediaLoader("/product_images/plant.jpg");
  const testAudioDataUrl = useMediaLoader("/product_audios/plant.m4a");

  const { toast } = useToast();

  const signIn = () => {
    alert("Sign in");
  };

  const askForPermissions = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    stream.getTracks().forEach((track) => track.stop());
  };

  const analyze = async () => {
    let audioUrl = descriptionAudio;

    // If USE_TEST_PRODUCTS is true and , use the test audio only if no audio was recorded
    if (USE_TEST_PRODUCTS && descriptionFormat === "audio" && !audioUrl) {
      audioUrl = testAudioDataUrl;
    }

    // If USE_TEST_PRODUCTS is true, use the test image only if no image was recorded
    let imageUrl = imageDataUrls.length > 0 ? imageDataUrls[0] : null;
    if (USE_TEST_PRODUCTS && !imageUrl) {
      imageUrl = testImageDataUrl;
    }

    if (
      (descriptionFormat === "audio" && !audioUrl) ||
      (descriptionFormat === "text" && !descriptionText) ||
      !imageUrl
    ) {
      return toast({
        title: "Error",
        description: "Please record an audio and take a picture",
      });
    }

    const websocket = new WebSocket(WS_BACKEND_URL + "/analyze");

    websocket.onopen = () => {
      websocket.send(
        JSON.stringify({
          imageUrl,
          descriptionAudio: audioUrl,
          descriptionFormat: descriptionFormat,
          descriptionText: descriptionText,
        })
      );
    };

    websocket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const status = msg.status;
      if (status === "processing") {
        setLogs((prevLogs) => prevLogs + msg.response);
      } else if (status === "success") {
        setListing(msg.response);
        setShowLogs(false);
      }
    };

    websocket.onerror = () => {
      // TODO: Handle errors better
      toast({ title: "WebSocket error observed" });
    };
  };

  return (
    <>
      <div className="w-full xl:w-[1000px] mx-auto mt-2 sm:mt-4 px-4">
        {/* Navbar */}
        <nav className="border-b border-gray-200 py-2">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <img src="/logo.svg" alt="Yardsale AI Logo" className="h-6 w-6" />
              <div className="text-lg font-semibold">Yardsale AI</div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="secondary" onClick={signIn}>
                Sign in
              </Button>
              <Button onClick={signIn}>Get started</Button>
            </div>
          </div>
        </nav>

        <Button onClick={askForPermissions}>Ask for permissions</Button>

        {/* Photos section */}
        <div className="flex flex-col mt-6">
          <h2 className="text-xl font-bold pb-4">1. Add photos</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {imageDataUrls.map((url, index) => (
              <div key={index}>
                <img src={url} alt={`Image`} style={{ maxHeight: "200px" }} />
              </div>
            ))}
          </div>
          <Camera />
        </div>

        <div className="flex flex-col mt-6">
          <h2 className="text-xl font-bold pb-4">2. Talk about this product</h2>
          <AudioRecorder />
        </div>

        <div className="flex flex-col mt-6">
          <Button onClick={analyze}>Analyze</Button>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold pb-4">Logs</h2>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="mb-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            {showLogs ? "Hide Logs" : "Show Logs"}
          </button>
          {showLogs && (
            <pre className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap">
              {logs}
            </pre>
          )}
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

        <Footer />
      </div>
    </>
  );
}

export default App;
