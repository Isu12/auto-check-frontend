"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import VehicleCardsDisplay from "./components/vehicleList";
import { useState } from "react";

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>

      <VehicleCardsDisplay/>
    </div>
  );
}
