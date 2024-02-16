import { Button } from "./components/ui/button";
import { USE_TEST_PRODUCTS, WS_BACKEND_URL } from "./config";
import { useMediaLoader } from "./hooks/useMediaLoader";
import { useStore } from "./hooks/useStore";
import { useToast } from "./components/ui/use-toast";
import { useState } from "react";
import Footer from "./components/LandingPage";
import { AppState } from "./types";
import { CameraView } from "./components/states/CameraView";
import { ProductDescriptionView } from "./components/states/ProductDescriptionView";
import { ProcessingView } from "./components/states/ProcessingView";
import { ResultView } from "./components/states/ResultView";
import { FaPlay } from "react-icons/fa";

function App() {
  const [logs, setLogs] = useState<string>("");
  const [showLogs, setShowLogs] = useState<boolean>(true);

  const [appState, next] = useStore((s) => [s.appState, s.next]);
  const setListing = useStore((state) => state.setListing);
  const imageDataUrls = useStore((state) => state.imageDataUrls);
  const descriptionFormat = useStore((state) => state.descriptionFormat);
  const descriptionAudio = useStore((state) => state.descriptionAudio);
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
    next();
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
      next();
    };

    websocket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const status = msg.status;
      if (status === "processing") {
        setLogs((prevLogs) => prevLogs + msg.response);
      } else if (status === "success") {
        setListing(msg.response);
        setShowLogs(false);
        next();
      }
    };

    websocket.onerror = () => {
      // TODO: Handle errors better
      toast({ title: "WebSocket error observed" });
    };
  };

  return (
    <>
      <div className="w-full xl:w-[1000px] mx-auto mt-2 sm:mt-4 px-4 min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="border-b border-gray-200 py-2">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <img src="/logo.svg" alt="Yardsale AI Logo" className="h-6 w-6" />
              <div className="text-lg font-semibold">Yardsale AI</div>
            </div>
            {/* TODO: Only show this on landing page */}
            {appState === AppState.RESULT && (
              <div className="flex items-center space-x-4">
                <Button variant="secondary" onClick={signIn}>
                  Sign in
                </Button>
                <Button onClick={signIn}>Get started</Button>
              </div>
            )}
          </div>
        </nav>

        {appState === AppState.INITIAL && (
          <div className="flex flex-col flex-1">
            <h1 className="text-3xl font-bold mt-10 mb-10">
              Let's craft the perfect Facebook marketplace listing in just a
              couple of minutes.
            </h1>
            <h2 className="text-xl font-semibold mb-10">
              Step 1: Capture a few pictures of your product <br /> Step 2: Talk
              about the product <br />
              Step 3: Your listing is ready!
            </h2>
            <Button
              onClick={askForPermissions}
              size="lg"
              className="flex gap-x-2 text-xl"
            >
              Start <FaPlay />
            </Button>
          </div>
        )}

        {appState === AppState.CAMERA && <CameraView />}

        {appState === AppState.PRODUCT_DESCRIPTION && (
          <ProductDescriptionView analyze={analyze} />
        )}

        {appState === AppState.PROCESSING && (
          <ProcessingView
            showLogs={showLogs}
            setShowLogs={setShowLogs}
            logs={logs}
          />
        )}

        {appState === AppState.RESULT && <ResultView />}

        <Footer />
      </div>
    </>
  );
}

export default App;
