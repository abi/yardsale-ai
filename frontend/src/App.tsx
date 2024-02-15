import { Button } from "./components/ui/button";
import { HTTP_BACKEND_URL, USE_TEST_PRODUCTS } from "./config";
import { useAuthenticatedFetch } from "./hooks/useAuthenticatedFetch";
import { useMediaLoader } from "./hooks/useMediaLoader";
import AudioRecorder from "./components/media/AudioRecorder";
import { useStore } from "./hooks/useStore";
import ExportAsCsv from "./components/ExportAsCsv";
import { Camera } from "./components/media/Camera";
import { useToast } from "./components/ui/use-toast";

function App() {
  const listing = useStore((state) => state.listing);
  const setListing = useStore((state) => state.setListing);
  const audioDataUrl = useStore((state) => state.audioDataUrl);
  const imageDataUrls = useStore((state) => state.imageDataUrls);

  const testImageDataUrl = useMediaLoader("/product_images/plant.jpg");
  const testAudioDataUrl = useMediaLoader("/product_audios/plant.m4a");

  const { toast } = useToast();
  const fetch = useAuthenticatedFetch();

  const signIn = () => {
    alert("Sign in");
  };

  const analyze = async () => {
    let audioUrl = audioDataUrl;
    // If USE_TEST_PRODUCTS is true, use the test audio only if no audio was recorded
    if (USE_TEST_PRODUCTS && !audioUrl) {
      audioUrl = testAudioDataUrl;
    }

    // If USE_TEST_PRODUCTS is true, use the test image only if no image was recorded
    let imageUrl = imageDataUrls.length > 0 ? imageDataUrls[0] : null;
    if (USE_TEST_PRODUCTS && !imageUrl) {
      imageUrl = testImageDataUrl;
    }

    if (!audioUrl || !imageUrl) {
      return toast({
        title: "Error",
        description: "Please record an audio and take a picture",
      });
    }

    const res = await fetch(`${HTTP_BACKEND_URL}/analyze`, "POST", {
      imageUrl,
      audioDescription: audioUrl,
    });
    setListing(res.response);
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
