
import { Metadata } from "next";
import StationInfoCardView from "../Component/StationInfoCardView";

export const metadata: Metadata = {
  title: "My Service Station",
  description: "View and manage your service station information",
};

export default function StationInfoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <StationInfoCardView />
    </div>
  );
}