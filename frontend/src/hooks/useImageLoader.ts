import { useState, useEffect } from "react";

// Helper function to load an image (from public folder) - used only for testing
export function useImageLoader(imagePath: string): string {
  const [base64Url, setBase64Url] = useState<string>("");

  useEffect(() => {
    fetch(imagePath)
      .then((response) => response.blob()) // Convert the response to a blob
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64Url(reader.result as string); // Convert blob to base64
        };
        reader.readAsDataURL(blob); // Read the blob as Data URL (base64)
      })
      .catch((error) => {
        console.error("Error fetching and converting image:", error);
      });
  }, [imagePath]); // Dependency array with imagePath ensures this runs when imagePath changes

  return base64Url;
}
