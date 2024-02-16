import { useStore } from "../../hooks/useStore";
import { Camera } from "../media/Camera";
import { Button } from "../ui/button";

export function CameraView() {
  const imageDataUrls = useStore((state) => state.imageDataUrls);
  const [cancel, next] = useStore((s) => [s.cancel, s.next]);

  return (
    <div className="flex flex-col mt-6">
      <div className="flex items-center justify-center w-full">
        <span className="text-3xl font-bold cursor-pointer" onClick={cancel}>
          x
        </span>
        <h2 className="text-xl font-bold pb-4 pl-2 text-center flex-1">
          Capture photos
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {imageDataUrls.map((url, index) => (
          <div key={index}>
            <img src={url} alt={`Image`} style={{ maxHeight: "200px" }} />
          </div>
        ))}
      </div>
      <Camera />
      <Button onClick={next}>Done</Button>
    </div>
  );
}
