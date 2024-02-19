import { useStore } from "../hooks/useStore";
import { AppState } from "../types";
import { Button } from "./ui/button";

export function NavBar() {
  const [appState, cancel] = useStore((s) => [s.appState, s.cancel]);

  return (
    <nav className="border-b border-gray-200 py-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <img src="/logo.svg" alt="Yardsale AI Logo" className="h-6 w-6" />
          <div className="text-lg font-semibold">Yardsale AI</div>
        </div>
        {/* TODO: Only show this on landing page */}
        {/* {appState === AppState.LANDING_PAGE && (
          <div className="flex items-center space-x-4">
            <Button variant="secondary" onClick={signIn}>
              Sign in
            </Button>
            <Button onClick={signIn}>Get started</Button>
          </div>
        )} */}
        {appState !== AppState.INITIAL &&
          appState !== AppState.LANDING_PAGE && (
            <Button variant="secondary" onClick={cancel}>
              Cancel
            </Button>
          )}
      </div>
    </nav>
  );
}
