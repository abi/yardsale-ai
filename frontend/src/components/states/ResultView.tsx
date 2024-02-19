import { useStore } from "../../hooks/useStore";
import ExportButton from "../ExportButton";

export function ResultView() {
  const listing = useStore((state) => state.listing);
  const imageDataUrls = useStore((state) => state.imageDataUrls);

  return (
    <div className="flex-1">
      {listing && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">{listing.title}</h3>
          <p className="text-lg text-gray-800">
            Price: <span className="font-semibold">${listing.price}</span>
          </p>
          <p className="text-md text-gray-700">
            Condition: <span className="italic">{listing.condition}</span>
          </p>
          <p className="text-md text-gray-700">
            Category: <span className="italic">{listing.category}</span>
          </p>
          <p className="text-md text-gray-700">
            Description: <span className="italic">{listing.description}</span>
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

      <div>
        <h2>Instructions</h2>
        <p>
          1. Click on the "Export as CSV" button to download the listing as a
          CSV file. Then, go to Facebook Marketplace and click on "Sell
          Something" and pick "Multiple Items".
        </p>
      </div>
    </div>
  );
}
