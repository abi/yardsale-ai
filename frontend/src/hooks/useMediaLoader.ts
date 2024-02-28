import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Helper function to load a media file (image or audio from public folder) - used only for testing
export function useMediaLoader(mediaPath: string): string {
  const [base64MediaUrl, setBase64MediaUrl] = useState<string>("");

  useEffect(() => {
    fetch(mediaPath)
      .then((response) => response.blob()) // Convert the response to a blob
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (!reader.result) {
            toast.error("Error reading the media file");
            return;
          }

          setBase64MediaUrl(reader.result as string); // Convert blob to base64

          // Handle m4a audio files
          if (mediaPath.endsWith(".m4a")) {
            setBase64MediaUrl(
              `data:audio/m4a;base64,${reader.result.toString().split(",")[1]}`
            );
          }
        };
        reader.readAsDataURL(blob); // Read the blob as Data URL (base64)
      })
      .catch((error) => {
        console.error("Error fetching and converting media:", error);
      });
  }, [mediaPath]); // Dependency array with mediaPath ensures this runs when mediaPath changes

  return base64MediaUrl;
}
