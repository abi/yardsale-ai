import { useStore } from "../../hooks/useStore";
import ExportAsCsv from "../ExportAsCsv";

export function ResultView() {
  const listing = useStore((state) => state.listing);
  return (
    <>
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

      {listing && <ExportAsCsv />}
    </>
  );
}
