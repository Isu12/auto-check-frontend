"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import InsuranceClaimGrid from "../Components/InsuranceClaimTable";
import { useState } from "react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>


      <InsuranceClaimGrid />
    </div>
  );
}
