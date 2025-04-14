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
import { InsuranceClaimInterface } from "../types/insurance-claim.interface";
import { Trash2, Download, Search, Eye, Edit } from "lucide-react";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchInsuranceClaimRecords,
  deleteInsuranceClaimRecord,
  updateInsuranceClaimRecord
} from "../Services/insurance-claim.servie"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import ViewInsuranceClaimModal from "../Components/InsuranceClaim";
import EditInsuranceClaimModal from "./EditInsuranceClaimModal";
import { useAuthToken } from "@/app/auth/hooks/accessHook";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  CsvExportModule,
]);

const InsuranceClaimGrid = () => {
  const [rowData, setRowData] = useState<InsuranceClaimInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editRecord, setEditRecord] = useState<InsuranceClaimInterface | null>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<InsuranceClaimInterface | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const accessToken = useAuthToken();

  const onGridReady = (params: any) => {
    setGridApi(params.api);
  };

  const exportToExcel = () => {
    gridApi!.exportDataAsCsv();
  };

  const filteredRowData = rowData.filter((record) =>
    Object.values(record).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleEditClick = (record: InsuranceClaimInterface) => {
    setEditRecord(record);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (record: InsuranceClaimInterface) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setSelectedRecord(null);
    setIsViewModalOpen(false);
  };

  const handleSaveEditedRecord = async (updatedRecord: InsuranceClaimInterface) => {
    if (!accessToken) return;

    try {
      const updatedValues = {
        IssuedDate: updatedRecord.ClaimAmountApproved,
        ExpiryDate: updatedRecord.ClaimAmountRequested,
        TestingCenterName: updatedRecord.ClaimDate,
        TestingCenterBranch: updatedRecord.ClaimType,
      };
      await updateInsuranceClaimRecord(updatedRecord, updatedValues, accessToken);

      setRowData((prevData) =>
        prevData.map((record) =>
          record._id === updatedRecord._id ? updatedRecord : record
        )
      );
      toast.success("Insurance claim updated successfully!");
    } catch (error) {
      toast.error("Error updating insurance claim");
    }
  };

  const [colDefs] = useState<ColDef[]>([
    {
      headerName: "Reg No",
      filter: "agTextColumnFilter",
      valueGetter: (params) => params.data.vehicle?.Registration_no || 'N/A'
    },
    {
      headerName: "Chassis No",
      filter: "agTextColumnFilter",
      valueGetter: (params) => params.data.vehicle?.Chasisis_No || 'N/A'
    },
    { field: "InsuranceID", headerName: "Insurance ID", filter: "agTextColumnFilter" },
    {
      field: "ClaimDate",
      headerName: "Claim Date",
      filter: "agDateColumnFilter",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString();
      },
    },
    { field: "ClaimType", headerName: "Claim Type", filter: "agTextColumnFilter" },
    {
      field: "ClaimAmountRequested",
      headerName: "Amount Requested",
      filter: "agNumberColumnFilter",
      valueFormatter: (params) => params.value ? `LKR ${params.value.toFixed(2)}` : ''
    },
    {
      field: "ClaimAmountApproved",
      headerName: "Amount Approved",
      filter: "agNumberColumnFilter",
      valueFormatter: (params) => params.value ? `LKR ${params.value.toFixed(2)}` : ''
    },
    { field: "DamageDescription", headerName: "Damage Description", filter: "agTextColumnFilter" },
    {
      headerName: "Damage Images",
      cellRenderer: (params: { data: InsuranceClaimInterface }) => {
        const images = [
          params.data.DamageImageURL1,
          params.data.DamageImageURL2,
          params.data.DamageImageURL3,
          params.data.DamageImageURL4,
          params.data.DamageImageURL5
        ].filter(url => url);

        if (images.length === 0) return "No Images";

        return (
          <div style={{ display: "flex", gap: "5px" }}>
            {images.slice(0, 3).map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Damage ${index + 1}`}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  cursor: "pointer",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                }}
                onClick={() => window.open(url, "_blank")}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/50";
                }}
              />
            ))}
            {images.length > 3 && (
              <div style={{
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f0f0f0",
                borderRadius: "5px",
                border: "1px solid #ddd"
              }}>
                +{images.length - 3}
              </div>
            )}
          </div>
        );
      },
      sortable: false,
      filter: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: (params: { data: InsuranceClaimInterface }) => {
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
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchInsuranceClaimRecords(accessToken);
        setRowData(data);
      } catch (error: any) {
        if (error.message.includes("Unauthorized")) {
          toast.error("Your session has expired. Please login again.", {
            toastId: 'unauthorized-error', // Prevent duplicate toasts
            autoClose: 5000,
          });
        }
        setError(error.message || "Failed to fetch insurance claims");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteInsuranceClaimRecord(deleteId);
      setRowData((prevData) => prevData.filter((record) => record._id !== deleteId));
      toast.success("Insurance claim deleted successfully!");
    } catch (error: any) {
      toast.error("Error! Deleting the insurance claim");
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
            placeholder="Search insurance claims..."
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
        paginationPageSize={8}
        domLayout="autoHeight"
        rowModelType="clientSide"
        onGridReady={onGridReady}
      />

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this insurance claim?"
        title="Delete Confirmation"
      />

      {isViewModalOpen && selectedRecord && (
        <ViewInsuranceClaimModal
          recordId={selectedRecord._id ?? ""}
          onClose={handleCloseViewModal}
        />
      )}

      {isEditModalOpen && editRecord && (
        <EditInsuranceClaimModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          record={editRecord}
          onSave={handleSaveEditedRecord}
        />
      )}
    </div>
  );
};

export default InsuranceClaimGrid;