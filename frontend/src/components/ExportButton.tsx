import React from "react";
import { Button } from "./ui/button";
import { useStore } from "../hooks/useStore";
import JSZip from "jszip";

const ExportButton: React.FC = () => {
  const listing = useStore((state) => state.listing);
  const imageDataUrls = useStore((state) => state.imageDataUrls);

  const download = async () => {
    const formatCsvValue = (value: string | undefined) =>
      value?.replace(/,/g, "") || "";

    const csv = `TITLE,PRICE,CONDITION,CATEGORY,DESCRIPTION\n${formatCsvValue(
      listing?.title
    )},${listing?.price},${formatCsvValue(
      listing?.condition
    )},,${formatCsvValue(listing?.description)}`;

    const zip = new JSZip();
    zip.file("listing.csv", csv);

    imageDataUrls.forEach((dataUrl, index) => {
      const filename = `image${index + 1}.jpg`;
      const imgData = dataUrl.replace(/^data:image\/\w+;base64,/, "");
      zip.file(filename, imgData, { base64: true });
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = window.URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "listing.zip";
    a.click();
  };
  return <Button onClick={download}>Export to Facebook Marketplace</Button>;
};

export default ExportButton;
