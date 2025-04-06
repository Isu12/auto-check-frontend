"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import ServiceRecordGrid from "../Components/ServiceRecordTable";
import ServiceRecordForm from "../Components/ServiceRecordForm";
import { useState } from "react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>

      <ServiceRecordForm />

      <ServiceRecordGrid />
    </div>
  );
}
