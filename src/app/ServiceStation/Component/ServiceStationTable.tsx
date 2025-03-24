import ConfirmationDialog from "../../../Components/ConfirmationDialog";
import { AgGridReact } from "ag-grid-react";
import { useState, useEffect } from "react";
import { GridReadyEvent } from "ag-grid-community"; // Import the correct type

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
import { Download, Trash2, Eye, Search } from "lucide-react"; // Added Eye icon for viewing
import { Button } from "@/Components/ui/button";
import Modal from "../Component/Modal";
import ViewServiceRecordModal from "../Component/Modal";
import { Input } from "@/Components/ui/input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<StationInfoInterface | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRowData = rowData.filter((record) =>
    Object.values(record).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const onGridReady = (params: any) => {
    setGridApi(params.api);
  };

  const exportToExcel = () => {
    gridApi!.exportDataAsCsv();
  };

  const handleEyeClick = (record: StationInfoInterface) => {
    setSelectedStation(record); // Replace setSelectedRecord with setSelectedStation
    setIsViewModalOpen(true); // This will trigger the modal open
  };
  

  const handleCloseViewModal = () => {
    setSelectedStation(null); // Reset to null instead of selectedRecord
    setIsViewModalOpen(false); // Close the modal
  };
  
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`http://localhost:5555/api/stations/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete service record");
      }

      setRowData((prevData) => prevData.filter((record) => record._id !== deleteId));
      toast.success("Service Record Deleted");
    } catch (error: any) {
      toast.error("Error deleting record: " + error.message);
    } finally {
      setIsDialogOpen(false);
      setDeleteId(null);
    }
  };

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
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: (params: { data: StationInfoInterface }) => {
        return (
          <div style={{ display: "flex", gap: "10px" }} className="action-buttons">
            <button onClick={() => handleEyeClick(params.data)}>
              <Eye size={24} color="green" className="ml-3" /> {/* Eye icon for viewing */}
            </button>
            <button onClick={() => handleDeleteClick(params.data._id ?? "")}>
              <Trash2 size={24} color="red" className="ml-3" />
            </button>
          </div>
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
      <div className="mb-4 flex justify-end">
        <div className="relative w-full max-w-md mr-5">
          <Search className="absolute right-4 mt-2 text-gray-400" size={18} />
          <Input
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:ring focus:ring-blue-200"
            type="text"
            placeholder="Search service stations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={exportToExcel} variant={"outline"}>
          Download CSV
          <Download color="black" size={28} />
        </Button>
      </div>
      <AgGridReact
        rowData={filteredRowData}  // Now using the filtered data
        columnDefs={colDefs}
        pagination={true}
        paginationPageSize={10}
        domLayout="autoHeight"
        rowModelType="clientSide"
        onGridReady={onGridReady}
      />

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this service record?"
        title="Delete Confirmation"
      />

{isViewModalOpen && selectedStation && (
        <ViewServiceRecordModal
          recordId={selectedStation._id ?? ""}
          onClose={handleCloseViewModal} // Add a close handler
        />
      )}
    </div>
  );
};

export default StationInfoGrid;

