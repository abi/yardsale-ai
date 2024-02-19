import { IS_HOSTED } from "./config";
import { useStore } from "./hooks/useStore";
import Footer from "./components/Footer";
import { AppState } from "./types";
import { CameraView } from "./components/states/CameraView";
import { ProductDescriptionView } from "./components/states/ProductDescriptionView";
import { ProcessingView } from "./components/states/ProcessingView";
import { ResultView } from "./components/states/ResultView";
import { NavBar } from "./components/NavBar";
import { InitialView } from "./components/states/InitialView";
import { LandingPageView } from "./components/states/LandingPageView";
import { useUser } from "@clerk/clerk-react";
import FullPageSpinner from "./components/custom-ui/FullPageSpinner";
import { useScrollToTop } from "./hooks/useScrollToTop";

function App() {
  // App state
  const [appState] = useStore((s) => [s.appState]);

  // Auth state
  const { isSignedIn, isLoaded } = useUser();

  // Scroll to the top of the page when the view changes
  useScrollToTop();

  // If Clerk is still loading, show a spinner
  if (IS_HOSTED && !isLoaded) return <FullPageSpinner />;

  return (
    <>
      <div className="w-full xl:w-[1000px] mx-auto mt-2 sm:mt-4 px-4 min-h-screen flex flex-col">
        {/* Navbar */}
        {appState !== AppState.CAMERA && <NavBar />}

        {/* Clerk is loaded but user is not signed in, show landing page */}
        {IS_HOSTED && !isSignedIn ? (
          <LandingPageView />
        ) : (
          <>
            {/* User is signed in */}
            {appState === AppState.INITIAL && <InitialView />}
            {appState === AppState.CAMERA && <CameraView />}
            {appState === AppState.PRODUCT_DESCRIPTION && (
              <ProductDescriptionView />
            )}
            {appState === AppState.PROCESSING && <ProcessingView />}
            {appState === AppState.RESULT && <ResultView />}
          </>
        )}

        {/* Footer */}
        {appState !== AppState.CAMERA && <Footer />}
      </div>
    </>
  );
}

export default App;
