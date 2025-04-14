import { AgGridReact } from "ag-grid-react";
import { useState, useEffect, useMemo } from "react";
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
  GridReadyEvent,
} from "ag-grid-community";
import { ModificationRequestInterface } from "../Types/ModificationRequest.Interface";
import { Trash2, Edit, Download, Search, Eye } from "lucide-react";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { Button } from "../../auth/ui/button";
import { Input } from "../../auth/ui/input";
import {
  fetchModificationRequest,
  updateModificationRequest,
  deleteModificationRequest
} from "../../ModificationRequest/ModificationControl/ModificationRequest";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import ViewModificationRequestModal from "./ModificationViewModal";
import ModificationEditForm from "./ModificationEdit";
import { useAuthToken } from "@/app/auth/hooks/accessHook";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  CsvExportModule,
]);

const ModificationRequestGrid = () => {
  const [rowData, setRowData] = useState<ModificationRequestInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editRecord, setEditRecord] = useState<ModificationRequestInterface | null>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ModificationRequestInterface|null>(null);
  const accessToken = useAuthToken();

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const exportToCsv = () => {
    gridApi?.exportDataAsCsv();
  };

  // Memoize filtered data to avoid unnecessary recalculations
  const filteredRowData = useMemo(() => {
    return rowData.filter((record) =>
      Object.values(record).some((value) =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [rowData, searchQuery]);

  const handleEditClick = (record: ModificationRequestInterface) => {
    setEditRecord(record);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (record: ModificationRequestInterface) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setSelectedRecord(null);
    setIsViewModalOpen(false);
  };

  const handleSaveEditedRecord = async (updatedRecord: ModificationRequestInterface) => {
    if (!accessToken) return;
    try {
      const updatedValues = {
        VehicleId: updatedRecord.vehicleId,
        OwnerId: updatedRecord.ownerId,
        ModificationType: updatedRecord.modificationType,
        Description: updatedRecord.description,
        ProposedChanges: updatedRecord.proposedChanges,
      };

      await updateModificationRequest(updatedRecord, updatedValues, accessToken);

      setRowData((prevData) =>
        prevData.map((record) =>
          record._id === updatedRecord._id ? updatedRecord : record
        )
      );
      toast.success("Modification request updated successfully!");
    } catch (error) {
      toast.error("Error updating modification request");
    }
  };

  const colDefs: ColDef[] = [
    { field: "vehicleId", headerName: "Vehicle ID", filter: "agTextColumnFilter" },
    { field: "ownerId", headerName: "Owner ID", filter: "agTextColumnFilter" },
    { field: "modificationType", headerName: "Modification Type", filter: "agTextColumnFilter" },
    { field: "description", headerName: "Description", filter: "agTextColumnFilter" },
    { field: "proposedChanges", headerName: "Proposed Changes", filter: "agTextColumnFilter" },
    { field: "status", headerName: "Status", filter: "agTextColumnFilter" },
    {
      field: "images",
      headerName: "Images",
      cellRenderer: (params: { value: string }) => {
        if (!params.value) return "No Image";
        return (
          <img
            src={params.value}
            alt="Image"
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
              target.src = "https://via.placeholder.com/50";
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
      cellRenderer: (params: { data: any }) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => handleViewClick(params.data)}>
            <Eye size={20} color="orange" className="ml-3" />
          </button>
          <button onClick={() => handleDeleteClick(params.data._id)}>
            <Trash2 size={20} color="red" className="ml-3" />
          </button>
          <button onClick={() => handleEditClick(params.data)}>
            <Edit size={20} color="navy" className="ml-3" />
          </button>
        </div>
      ),
      sortable: false,
      filter: false,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;
      try {
        setLoading(true);
        const data = await fetchModificationRequest(accessToken);
        setRowData(data);
        setError(null);
      } catch (error: any) {
        setError(error.message);
        toast.error("Error fetching data: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accessToken]); // Added accessToken as dependency

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId || !accessToken) return;
    try {
      await deleteModificationRequest(deleteId, accessToken);
      setRowData((prevData) => prevData.filter((record) => record._id !== deleteId));
      toast.success("Modification request deleted successfully!");
    } catch (error: any) {
      toast.error("Error Deleting the modification request");
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

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
      <div className="mb-4 flex justify-end">
        <div className="relative w-full max-w-md mr-5">
          <Search className="absolute right-4 mt-2 text-gray-400" size={18} />
          <Input
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:ring focus:ring-blue-200"
            type="text"
            placeholder="Search Vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button onClick={exportToCsv} variant="outline">
          Download CSV <Download color="black" size={20} />
        </Button>
      </div>
      
      <AgGridReact 
        rowData={filteredRowData} 
        columnDefs={colDefs} 
        onGridReady={onGridReady} 
        pagination={true} 
        paginationPageSize={15} 
        domLayout="autoHeight"
        rowModelType="clientSide"
      />

      <ConfirmationDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onConfirm={handleConfirmDelete} 
        message="Are you sure, you want to delete this modification request?" 
        title="Delete Confirmation" 
      />

      {isViewModalOpen && selectedRecord && (
        <ViewModificationRequestModal 
          recordId={selectedRecord._id ?? ""}
          onClose={handleCloseViewModal}
        />
      )}

      {isEditModalOpen && editRecord && (
        <ModificationEditForm
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          record={editRecord}
          onSave={handleSaveEditedRecord}
        />
      )}
    </div>
  );
};

export default ModificationRequestGrid;