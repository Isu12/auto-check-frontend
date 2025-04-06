"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import InsuranceClaimGrid from "../Components/InsuranceClaimTable";
import InsuranceClaimForm from "../Components/InsuranceClaimForm";
import { useState } from "react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>

      <InsuranceClaimForm />

      <InsuranceClaimGrid />
    </div>
  );
}
