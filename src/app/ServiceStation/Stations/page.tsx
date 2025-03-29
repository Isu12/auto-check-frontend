"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import ServiceStationGrid from "../Component/ServiceStationTable";
import ServiceStationForm from "../Component/ServiceStationForm";

export default function Home() {
  return (
    <div>
    <ServiceStationForm />
      <ServiceStationGrid />
    </div>
  );
}