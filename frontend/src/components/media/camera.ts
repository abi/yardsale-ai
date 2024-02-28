export function captureImageFromVideo(
  video: HTMLVideoElement | null,
  canvas: HTMLCanvasElement | null
) {
  if (!video || !canvas) {
    throw new Error("Video or canvas element is missing");
  }

  // Get the video's actual width and height
  const targetWidth = video.videoWidth;
  const targetHeight = video.videoHeight;

  // Set the canvas size to the target dimensions
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas 2d context is missing");
  }

  // Draw the video frame to the canvas, maintaining aspect ratio
  context.drawImage(video, 0, 0, targetWidth, targetHeight);
  return canvas.toDataURL("image/png");
}
