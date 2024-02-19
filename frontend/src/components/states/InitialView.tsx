import { FaPlay } from "react-icons/fa";
import { useStore } from "../../hooks/useStore";
import { Button } from "../ui/button";

export function InitialView() {
  const next = useStore((s) => s.next);

  const askForPermissions = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    stream.getTracks().forEach((track) => track.stop());
    next();
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex justify-center mt-20">
        <span className="text-6xl">🏷️</span>
      </div>
      <h1 className="text-3xl leading-snug font-bold mt-4 mb-10 text-center">
        Craft the perfect FB marketplace listing in under 2 mins.
      </h1>
      <ol className="text-xl mb-12 space-y-4">
        <li>
          <span className="font-bold">Step 1:</span> 📸 Take 2-3 pics of your
          product
        </li>
        <li>
          <span className="font-bold">Step 2:</span> 🗣️ Talk about the product
        </li>
        <li>
          <span className="font-bold">Step 3:</span> ✅ Your listing is ready!
        </li>
      </ol>
      <Button
        onClick={askForPermissions}
        size="lg"
        className="flex gap-x-2 text-xl"
      >
        Start <FaPlay />
      </Button>
    </div>
  );
}
