"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import EchoTestRecordGrid from "../Components/EchoTestTable";
import EchoTestForm from "../Components/EchoTestForm";
import { useState } from "react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>

      <EchoTestForm />

      <EchoTestRecordGrid />
    </div>
  );
}
