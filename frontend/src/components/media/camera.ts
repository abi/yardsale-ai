// TODO: Move to a separate utility file
export function captureImageFromVideo(
  video: HTMLVideoElement | null,
  canvas: HTMLCanvasElement | null
) {
  if (!video || !canvas) {
    throw new Error("Video or canvas element is missing");
  }

  if (video && canvas) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas 2d context is missing");
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  }
}
