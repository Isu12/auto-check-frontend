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
import { StationInfoInterface } from "./Types/ServiceStation.Interface";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule
]);

const StationInfoGrid = () => {
  const [rowData, setRowData] = useState<StationInfoInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [colDefs] = useState<ColDef[]>([
    { field: "businessRegNo", headerName: "Business Reg No", filter: "agTextColumnFilter" },
    { field: "businessName", headerName: "Business Name", filter: "agTextColumnFilter" },
    { field: "branch", headerName: "Branch", filter: "agTextColumnFilter" },
    { field: "address", headerName: "Address", filter: "agTextColumnFilter" },
    { field: "city", headerName: "City", filter: "agTextColumnFilter" },
    { field: "postalCode", headerName: "Postal Code", filter: "agNumberColumnFilter" },
    { field: "email", headerName: "Email", filter: "agTextColumnFilter" },
    { field: "phoneNumber1", headerName: "Phone Number 1", filter: "agTextColumnFilter" },
    { field: "phoneNumber2", headerName: "Phone Number 2", filter: "agTextColumnFilter" },
    { field: "ownerName", headerName: "Owner Name", filter: "agTextColumnFilter" },
    { field: "contactNumber", headerName: "Contact Number", filter: "agTextColumnFilter" },
    { field: "email2", headerName: "Alternate Email", filter: "agTextColumnFilter" },
    { field: "webUrl", headerName: "Website URL", filter: "agTextColumnFilter" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5555/api/stations");
        if (!response.ok) {
          throw new Error("Failed to fetch business records");
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

export default StationInfoGrid;