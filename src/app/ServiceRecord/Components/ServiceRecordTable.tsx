"use client";

import { AgGridReact } from "ag-grid-react";
import { useState, useEffect } from "react";
import {
  ColDef,
  ModuleRegistry,
  ClientSideRowModelModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
} from "ag-grid-community";
import { ServiceRecordInterface } from "./types/ServiceRecord.Interface";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule
]);


const ServiceRecordGrid = () => {
  const [rowData, setRowData] = useState<ServiceRecordInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [colDefs] = useState<ColDef[]>([
    { field: "OdometerReading", headerName: "Odometer Reading", filter: "agNumberColumnFilter"},
    { field: "DateOfService", headerName: "Date of Service", filter: "agDateColumnFilter"},
    { field: "ServiceType", headerName: "Service Type", filter: "agTextColumnFilter"},
    { field: "DescriptionOfIssue", headerName: "Description of Issue", filter: "agTextColumnFilter"},
    { field: "Diagnosis", headerName: "Diagnosis", filter: "agTextColumnFilter" },
    { field: "ServiceDetails", headerName: "Service Details", filter: "agTextColumnFilter"},
    { field: "PartsUsed", headerName: "Parts Used", filter: "agTextColumnFilter"},
    {
      field: "ServiceCost",
      headerName: "Service Cost",
      filter: "agNumberColumnFilter",
      valueFormatter: (params) => `$${params.value}`,
    },
    { field: "WarrantyInfo", headerName: "Warranty Info", filter: "agTextColumnFilter" },
    { field: "NextServiceDate", headerName: "Next Service Date", filter: "agDateColumnFilter"},
    { field: "RecommendedServices", headerName: "Recommended Services", filter: "agTextColumnFilter"},
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5555/api/service-record/");
        if (!response.ok) {
          throw new Error("Failed to fetch service records");
        }
        const data = await response.json();
        setRowData(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        pagination={true}
        paginationPageSize={10}
        domLayout="autoHeight"
        rowModelType="clientSide"
        modules={[
          ClientSideRowModelModule,
          PaginationModule,
          DateFilterModule,
          TextFilterModule,
          NumberFilterModule
        ]}
      />
    </div>
  );
};

export default ServiceRecordGrid;
