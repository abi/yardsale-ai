import { useState, useEffect } from "react";

// Helper function to load a media file (image or audio from public folder) - used only for testing
export function useMediaLoader(mediaPath: string): string {
  const [base64MediaUrl, setBase64MediaUrl] = useState<string>("");

  useEffect(() => {
    fetch(mediaPath)
      .then((response) => response.blob()) // Convert the response to a blob
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64MediaUrl(reader.result as string); // Convert blob to base64
        };
        reader.readAsDataURL(blob); // Read the blob as Data URL (base64)
      })
      .catch((error) => {
        console.error("Error fetching and converting media:", error);
      });
  }, [mediaPath]); // Dependency array with mediaPath ensures this runs when mediaPath changes

  return base64MediaUrl;
}
