"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import ContactPage from "./contact";
import { useState } from "react";

export default function Contact() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>

<ContactPage/>
    </div>
  );
}
