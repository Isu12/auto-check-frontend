// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [stations, setStations] = useState<Station[]>([]);

  interface Station {
    _id: string;
    businessRegNo: string;
    businessName: string;
    branch: string;
    address: string;
    city: string;
    postalCode: string;
    email: string;
    phoneNumber1: string;
    phoneNumber2: string;
    ownerName: string;
    contactNumber: string;
    email2: string;
    webUrl: string;
  }

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/stations/")
      .then((res) => setStations(res.data))
      .catch((error) => console.error("Failed to fetch stations:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Service Stations</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stations.map((station) => (
          <div
            key={station._id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <p>{station.businessRegNo}</p>
            <p>{station.businessName}</p>
            <p>{station.branch}</p>
            <p>{station.address}</p>
            <p>{station.city}</p>
            <p>{station.postalCode}</p>
            <p>{station.email}</p>
            <p>{station.phoneNumber1}</p>
            <p>{station.phoneNumber2}</p>
            <p>{station.ownerName}</p>
            <p>{station.contactNumber}</p>
            <p>{station.email2}</p>
            <p>{station.webUrl}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
