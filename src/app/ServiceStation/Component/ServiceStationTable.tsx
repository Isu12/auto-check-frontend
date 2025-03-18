"use client";
import ConfirmationDialog from "../../../Components/ConfirmationDialog";
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
  CsvExportModule,
  GridApi,
} from "ag-grid-community";
import { StationInfoInterface } from "./Types/ServiceStation.Interface";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
]);

const StationInfoGrid = () => {
  const [rowData, setRowData] = useState<StationInfoInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const onGridReady = (params: any) => {
    setGridApi(params.api);
  };

  const exportToExcel = () => {
    gridApi!.exportDataAsCsv();
  };

  const [colDefs] = useState<ColDef[]>([
    {
      field: "businessRegNo",
      headerName: "Business Reg No",
      filter: "agTextColumnFilter",
    },
    {
      field: "businessName",
      headerName: "Business Name",
      filter: "agTextColumnFilter",
    },
    { field: "branch", headerName: "Branch", filter: "agTextColumnFilter" },
    { field: "address", headerName: "Address", filter: "agTextColumnFilter" },
    { field: "city", headerName: "City", filter: "agTextColumnFilter" },
    {
      field: "postalCode",
      headerName: "Postal Code",
      filter: "agNumberColumnFilter",
    },
    { field: "email", headerName: "Email", filter: "agTextColumnFilter" },
    {
      field: "phoneNumber1",
      headerName: "Phone Number 1",
      filter: "agTextColumnFilter",
    },
    {
      field: "phoneNumber2",
      headerName: "Phone Number 2",
      filter: "agTextColumnFilter",
    },
    {
      field: "ownerName",
      headerName: "Owner Name",
      filter: "agTextColumnFilter",
    },
    {
      field: "contactNumber",
      headerName: "Contact Number",
      filter: "agTextColumnFilter",
    },
    {
      field: "email2",
      headerName: "Alternate Email",
      filter: "agTextColumnFilter",
    },
    {
      field: "webUrl",
      headerName: "Website URL",
      filter: "agTextColumnFilter",
    },

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

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(
        `http://localhost:5555/api/stations/${deleteId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete service record");
      }

      // Remove the deleted record from state
      setRowData((prevData) =>
        prevData.filter((record) => record._id !== deleteId)
      );
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
      <div className="mb-4 flex justify-end">
        <Button onClick={exportToExcel} variant={"outline"}>
          Download CSV
          <Download color="black" size={28} />
        </Button>
      </div>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        pagination={true}
        paginationPageSize={10}
        domLayout="autoHeight"
        rowModelType="clientSide"
        onGridReady={onGridReady}
        modules={[
          ClientSideRowModelModule,
          PaginationModule,
          DateFilterModule,
          TextFilterModule,
          NumberFilterModule,
          CsvExportModule,
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

export default StationInfoGrid;
