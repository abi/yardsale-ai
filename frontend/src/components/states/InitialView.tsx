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
      <h1 className="text-3xl font-bold mt-10 mb-10">
        Let's craft the perfect Facebook marketplace listing in just a couple of
        minutes.
      </h1>
      <h2 className="text-xl font-semibold mb-10">
        Step 1: Capture a few pictures of your product <br /> Step 2: Talk about
        the product <br />
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
  );
}
