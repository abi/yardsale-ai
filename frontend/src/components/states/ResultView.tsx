import { useStore } from "../../hooks/useStore";
import { URLS } from "../../urls";
import ExportButton from "../ExportButton";

export function ResultView() {
  const listing = useStore((state) => state.listing);
  const imageDataUrls = useStore((state) => state.imageDataUrls);

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold pb-4 mt-8">Your listing is ready!</h2>
      {listing && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">{listing.title}</h3>
          <p className="text-lg text-gray-800">
            Price: <span className="font-semibold">${listing.price}</span>
          </p>
          <p className="text-md text-gray-700">
            Condition:{" "}
            <span className="font-semibold">{listing.condition}</span>
          </p>
          <p className="text-md text-gray-700">
            Category: <span className="font-semibold">{listing.category}</span>
          </p>
          <p className="text-md text-gray-700">
            Description: <span>{listing.description}</span>
          </p>
        </div>
      )}

      <div className="flex flex-col flex-1 items-center justify-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Photos</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {imageDataUrls.map((url, index) => (
            <div key={index} className="max-w-xs">
              <img
                src={url}
                alt={`Image ${index}`}
                className="object-contain w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>

      {listing && <ExportButton />}

      <div className="text-center text-sm mt-4 mb-10">
        <a
          href={URLS["fb-marketplace-instructions"]}
          target="_blank"
          rel="noopener noreferrer"
        >
          Show me instructions for uploading to Facebook Marketplace
        </a>
      </div>
    </div>
  );
}
