"use client";

// Ensure styles are imported for the grid layout to work
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';
import { useState, useEffect } from 'react';
import { ColDef, ModuleRegistry } from 'ag-grid-community'; // Correct imports
import { ClientSideRowModelModule } from 'ag-grid-community'; // Import the required module

// Register the module needed for client-side row model
ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface ServiceRecordInterface {
  OdometerReading: number;
  DateOfService: string;
  ServiceType: string;
  DescriptionOfIssue: string;
  Diagnosis: string;
  ServiceDetails: string;
  PartsUsed: string;
  ServiceCost: number;
  WarrantyInfo: string;
  NextServiceDate: string;
  RecommendedServices: string;
}

const ServiceRecordGrid = () => {
  const [rowData, setRowData] = useState<ServiceRecordInterface[]>([]); // Correctly typed state for the data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state, type refined to string | null

  // Column definitions for the grid
  const [colDefs] = useState<ColDef[]>([
    { field: "OdometerReading", headerName: "Odometer Reading" },
    { field: "DateOfService", headerName: "Date of Service" },
    { field: "ServiceType", headerName: "Service Type" },
    { field: "DescriptionOfIssue", headerName: "Description of Issue" },
    { field: "Diagnosis", headerName: "Diagnosis" },
    { field: "ServiceDetails", headerName: "Service Details" },
    { field: "PartsUsed", headerName: "Parts Used" },
    {
      field: "ServiceCost",
      headerName: "Service Cost",
      valueFormatter: (params) => `$${params.value}`, // Optional formatting for currency
    },
    { field: "WarrantyInfo", headerName: "Warranty Info" },
    { field: "NextServiceDate", headerName: "Next Service Date" },
    { field: "RecommendedServices", headerName: "Recommended Services" },
  ]);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5555/api/service-record/');
        if (!response.ok) {
          throw new Error('Failed to fetch service records');
        }
        const data = await response.json();
        setRowData(data); // Set the fetched data in state
      } catch (error: any) {
        setError(error.message); // Handle errors
      } finally {
        setLoading(false); // Stop the loading state
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Show loading message if data is still being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if there's an error fetching data
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="ag-theme-quartz" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        pagination={true}
        domLayout="autoHeight"
        rowModelType="clientSide" // Set rowModelType as clientSide (default for client-side operations)
      />
    </div>
  );
};

export default ServiceRecordGrid;
