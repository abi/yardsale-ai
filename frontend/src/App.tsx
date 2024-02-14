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
      imageUrl:
        "https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=2586&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
