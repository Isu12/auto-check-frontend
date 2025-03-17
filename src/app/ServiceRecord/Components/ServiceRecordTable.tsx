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
import { Trash2 } from "lucide-react";
import ConfirmationDialog from "../../../components/ConfirmationDialog";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
]);

const ServiceRecordGrid = () => {
  const [rowData, setRowData] = useState<ServiceRecordInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [colDefs] = useState<ColDef[]>([
    { field: "OdometerReading", headerName: "Odometer Reading", filter: "agNumberColumnFilter" },
    {
      field: "DateOfService",
      headerName: "Date of Service",
      filter: "agDateColumnFilter",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString();
      },
    },
    { field: "ServiceType", headerName: "Service Type", filter: "agTextColumnFilter" },
    { field: "DescriptionOfIssue", headerName: "Description of Issue", filter: "agTextColumnFilter" },
    { field: "Diagnosis", headerName: "Diagnosis", filter: "agTextColumnFilter" },
    { field: "ServiceDetails", headerName: "Service Details", filter: "agTextColumnFilter" },
    { field: "PartsUsed", headerName: "Parts Used", filter: "agTextColumnFilter" },
    {
      field: "ServiceCost",
      headerName: "Service Cost",
      filter: "agNumberColumnFilter",
      valueFormatter: (params) => `$${params.value}`,
    },
    { field: "WarrantyInfo", headerName: "Warranty Info", filter: "agTextColumnFilter" },
    {
      field: "NextServiceDate",
      headerName: "Next Service Date",
      filter: "agDateColumnFilter",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString();
      },
    },
    { field: "RecommendedServices", headerName: "Recommended Services", filter: "agTextColumnFilter" },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: (params: { data: { _id: string } }) => {
        return (
          <button onClick={() => handleDeleteClick(params.data._id)}>
            <Trash2 size={20} color="red" />
          </button>
        );
      },
      sortable: false,
      filter: false,
    },
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
        window.alert("Error fetching data: " + error.message); // Replaced toast error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`http://localhost:5555/api/service-record/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete service record");
      }

      // Remove the deleted record from state
      setRowData((prevData) => prevData.filter((record) => record._id !== deleteId));
      window.alert("Service Record Deleted"); // Replaced toast success
    } catch (error: any) {
      window.alert("Error deleting record: " + error.message); // Replaced toast error
    } finally {
      setIsDialogOpen(false);
      setDeleteId(null);
    }
  };

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
          NumberFilterModule,
        ]}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this service record?"
        title="Delete Confirmation"
      />
    </div>
  );
};

export default ServiceRecordGrid;
