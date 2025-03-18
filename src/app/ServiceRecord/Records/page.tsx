"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import ServiceRecordGrid from "../Components/ServiceRecordTable";
import ServiceRecordForm from "../Components/ServiceRecordForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      {/* <Button 
        variant={'default'} 
        className="mb-3" 
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close Service Record Form" : "Add Service Record"}
      </Button> */}

      <ServiceRecordForm />

      <ServiceRecordGrid />
    </div>
  );
}
