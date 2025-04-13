"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import VehicleRegistrationForm from "../Components/VehicleRegistrationForm";
import VehicleRegistrationTable from "../Components/VehicleRegistrationTable";
import IncompleteRegistrations from "../Components/IncomRegistration";

export default function Home() {
  return (
    <div>
    
      <VehicleRegistrationForm onSuccess={function (): void {
        throw new Error("Function not implemented.");
      } } />
      <VehicleRegistrationTable />
    </div>
  );
}
