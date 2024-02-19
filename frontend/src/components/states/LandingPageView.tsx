import { useStore } from "../../hooks/useStore";

export function LandingPageView() {
  const [next] = useStore((s) => [s.next]);
  return (
    <div className="flex flex-col items-center justify-center h-full flex-1">
      <div className="mt-20">
        <h1 className="text-4xl font-bold mb-4">Yardsale AI</h1>
        <p className="text-lg mb-4">
          The easiest way to sell your stuff on Facebook Marketplace. Generate a
          listing in under 2 minutes with just a few pictures.
        </p>
        <button
          onClick={next}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Start
        </button>
      </div>
    </div>
  );
}
