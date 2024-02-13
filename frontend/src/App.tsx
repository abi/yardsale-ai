import "./App.css";
import { Button } from "./components/ui/button";
import { HTTP_BACKEND_URL } from "./config";
import { useAuthenticatedFetch } from "./hooks/useAuthenticatedFetch";

function App() {
  const fetch = useAuthenticatedFetch();

  const signIn = () => {
    alert("Sign in");
  };

  const analyze = async () => {
    await fetch(`${HTTP_BACKEND_URL}/analyze`, "POST", {
      video: "test",
    });
  };

  return (
    <>
      <div className="w-full xl:w-[1000px] mx-auto mt-4">
        {/* Navbar */}
        <nav className="border-b border-gray-200 px-4 py-2">
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

        <Button onClick={analyze}>Analyze</Button>
      </div>
    </>
  );
}

export default App;
