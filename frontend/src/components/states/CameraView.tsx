import { useStore } from "../../hooks/useStore";
import { Camera } from "../media/Camera";

export function CameraView() {
  const imageDataUrls = useStore((state) => state.imageDataUrls);

  return (
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
  );
}
