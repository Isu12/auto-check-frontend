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
  GridApi,
  CsvExportModule,
} from "ag-grid-community";
import { ServiceRecordInterface } from "../types/ServiceRecord.Interface";
import { Trash2, Download, Search, Eye, Edit } from "lucide-react";
import ConfirmationDialog from "../../../Components/ConfirmationDialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  fetchServiceRecords,
  deleteServiceRecord,
  updateServiceRecord
} from "../../ServiceRecord/Services/ServiceRecord.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import ViewServiceRecordModal from "./ServiceRecord";
import EditServiceRecordModal from "./EditServiceRecordModal";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  CsvExportModule,
]);

const ServiceRecordGrid = () => {
  const [rowData, setRowData] = useState<ServiceRecordInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editRecord, setEditRecord] = useState<ServiceRecordInterface | null>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ServiceRecordInterface | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const onGridReady = (params: any) => {
    setGridApi(params.api);
  };

  const exportToExcel = () => {
    gridApi!.exportDataAsCsv();
  };

  const filteredRowData = rowData.filter((record) =>
    Object.values(record).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleEditClick = (record: ServiceRecordInterface) => {
    setEditRecord(record);
    setIsEditModalOpen(true);
  };


  const handleViewClick = (record: ServiceRecordInterface) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true); // This will trigger the modal open
  };

  const handleCloseViewModal = () => {
    setSelectedRecord(null); // Reset the record state when closing the modal
    setIsViewModalOpen(false); // Close the modal
  };

  const handleSaveEditedRecord = async (updatedRecord: ServiceRecordInterface) => {
    try {
      // Create an updatedValues object with the fields you want to update
      const updatedValues = {
        ServiceCost: updatedRecord.ServiceCost, // Example field you want to update
        // You can add other fields here as necessary
      };
  
      // Call your API or service function to save the updated record
      await updateServiceRecord(updatedRecord, updatedValues);
  
      setRowData((prevData) =>
        prevData.map((record) =>
          record._id === updatedRecord._id ? updatedRecord : record
        )
      );
      toast.success("Service record updated successfully!");
    } catch (error) {
      toast.error("Error updating service record");
    }
  };
  


  const [colDefs] = useState<ColDef[]>([
    { field: "OdometerReading", headerName: "Odometer Reading", filter: "agNumberColumnFilter", valueFormatter: (params) => `${params.value} Km` },
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
      valueFormatter: (params) => `Rs. ${params.value}`,
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
      field: "InvoiceImageURL",
      headerName: "Invoice Image",
      cellRenderer: (params: { value: string }) => {
        if (!params.value) return "No Image";
        return (
          <img
            src={params.value}
            alt="Invoice"
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              cursor: "pointer",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
            onClick={() => window.open(params.value, "_blank")}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/50"; // Fallback image
            }}
          />
        );
      },
      sortable: false,
      filter: false,
    },       
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: (params: { data: ServiceRecordInterface }) => {
        return (
          <div style={{ display: "flex", gap: "10px" }} className="action-buttons">
            <button onClick={() => params.data._id && handleDeleteClick(params.data._id)}>
              <Trash2 size={20} color="red" className="ml-3" />
            </button>

            <button onClick={() => handleEditClick(params.data)}>
              <Edit size={20} color="navy" className="ml-3" />
            </button>

            <button onClick={() => handleViewClick(params.data)}>
              <Eye size={20} color="green" className="ml-3" />
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
        const data = await fetchServiceRecords();
        setRowData(data);
      } catch (error: any) {
        setError(error.message);
        window.alert("Error fetching data: " + error.message);
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
      await deleteServiceRecord(deleteId);
      // Remove the deleted record from state
      setRowData((prevData) => prevData.filter((record) => record._id !== deleteId));
      toast.success("Service record deleted successfully!");
    } catch (error: any) {
      toast.error("Error! Deleting the service record");
    } finally {
      setIsDialogOpen(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color={"#3498db"} />
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
      <div className="mb-4 flex justify-end">
        <div className="relative w-full max-w-md mr-5">
          <Search className="absolute right-4 mt-2 text-gray-400" size={18} />
          <Input
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:ring focus:ring-blue-200"
            type="text"
            placeholder="Search service records..."
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
        rowData={filteredRowData}
        columnDefs={colDefs}
        pagination={true}
        paginationPageSize={15}
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

      {isViewModalOpen && selectedRecord && (
        <ViewServiceRecordModal
          recordId={selectedRecord._id ?? ""}
          onClose={handleCloseViewModal} // Add a close handler
        />
      )}

      {isEditModalOpen && editRecord && (
        <EditServiceRecordModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          record={editRecord}
          onSave={handleSaveEditedRecord}
        />
      )}

    </div>
  );
};

export default ServiceRecordGrid;
function saveServiceRecord(updatedRecord: ServiceRecordInterface) {
  throw new Error("Function not implemented.");
}

