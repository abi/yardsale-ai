import React from "react";
import { Button } from "./ui/button";
import { useStore } from "../hooks/useStore";

const ExportAsCsv: React.FC = () => {
  const listing = useStore((state) => state.listing);

  const downloadAsCsv = () => {
    // Ignore the category for now
    // ${listing?.category?.toUpperCase()}

    const formatCsvValue = (value: string | undefined) =>
      value?.replace(/,/g, "") || "";

    const csv = `TITLE,PRICE,CONDITION,CATEGORY,DESCRIPTION\n${formatCsvValue(
      listing?.title
    )},${listing?.price},${formatCsvValue(
      listing?.condition
    )},,${formatCsvValue(listing?.description)}`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "listing.csv";
    a.click();
  };

  return (
    <Button onClick={downloadAsCsv}>Export to Facebook Marketplace</Button>
  );
};

export default ExportAsCsv;
