import { USE_TEST_PRODUCTS, WS_BACKEND_URL } from "./config";
import { useMediaLoader } from "./hooks/useMediaLoader";
import { useStore } from "./hooks/useStore";
import { useToast } from "./components/ui/use-toast";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import { AppState } from "./types";
import { CameraView } from "./components/states/CameraView";
import { ProductDescriptionView } from "./components/states/ProductDescriptionView";
import { ProcessingView } from "./components/states/ProcessingView";
import { ResultView } from "./components/states/ResultView";
import { NavBar } from "./components/NavBar";
import { InitialView } from "./components/states/InitialView";

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

  // Scroll to the top of the page when the view changes
  useEffect(() => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  }, [appState]);

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
        {appState !== AppState.CAMERA && <NavBar />}

        {/* Main content */}
        {appState === AppState.INITIAL && <InitialView />}
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

        {/* Footer */}
        {appState !== AppState.CAMERA && <Footer />}
      </div>
    </>
  );
}

export default App;
