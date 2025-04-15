"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import ModificationRequestGrid from "../Components/ModificationRequestTable";
import ModificationRequestForm from "../Components/ModificationRequestForm";
import { useState } from "react";


export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>

      <ModificationRequestForm />

      <ModificationRequestGrid />
    </div>
  );
}