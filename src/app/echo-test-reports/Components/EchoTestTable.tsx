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
import { EchoTestInterface } from "../types/echo-test.interface";
import { Trash2, Download, Search, Eye, Edit } from "lucide-react";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { Button } from "../../auth/ui/button";
import { Input } from "../../auth/ui/input";
import {
  fetchEchoTestRecords,
  deleteEchoTestRecord,
  updateEchoTestRecord
} from "../services/EchoTest.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import ViewEchoTestRecordModal from "./EchoTestRecord";
import EditEchoTestModal from "./EditEchoTestModal";
import { useAuthToken } from "@/app/auth/hooks/accessHook";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  CsvExportModule,
]);

const EchoTestRecordGrid = () => {
  const [rowData, setRowData] = useState<EchoTestInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editRecord, setEditRecord] = useState<EchoTestInterface | null>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<EchoTestInterface | null>(null);
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
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleEditClick = (record: EchoTestInterface) => {
    setEditRecord(record);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (record: EchoTestInterface) => {
    setSelectedRecord(record);
    setTimeout(() => {
      setIsViewModalOpen(true);
    }, 50); // small delay to ensure state is updated
  };

  const handleCloseViewModal = () => {
    setSelectedRecord(null);
    setIsViewModalOpen(false);
  };

  const handleSaveEditedRecord = async (updatedRecord: EchoTestInterface) => {
    if (!accessToken) return;

    try {
      const updatedValues = {
        IssuedDate: updatedRecord.IssuedDate,
        ExpiryDate: updatedRecord.ExpiryDate,
        TestingCenterName: updatedRecord.TestingCenterName,
        TestingCenterBranch: updatedRecord.TestingCenterBranch,
      };
      await updateEchoTestRecord(updatedRecord, updatedValues, accessToken);

      setRowData((prevData) =>
        prevData.map((record) =>
          record._id === updatedRecord._id ? updatedRecord : record
        )
      );
      toast.success("Echo Test record updated successfully!");
    } catch (error) {
      toast.error("Error updating echo test record");
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
    {
      field: "TestID",
      headerName: "Test ID",
      filter: "agNumberColumnFilter",
      valueFormatter: (params) => `${params.value}`
    },
    {
      field: "IssuedDate",
      headerName: "Issue Date",
      filter: "agDateColumnFilter",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: "ExpiryDate",
      headerName: "Expiry Date",
      filter: "agDateColumnFilter",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: "TestingCenterName",
      headerName: "Center",
      filter: "agTextColumnFilter",
      width: 150
    },
    {
      field: "CertificateFileURL",
      headerName: "Certificate",
      cellRenderer: (params: { value: string }) => {
        if (!params.value) return "No Image";
        return (
          <img
            src={params.value}
            alt="Test Certificate"
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
      cellRenderer: (params: { data: EchoTestInterface }) => {
        return (
          <div style={{ display: "flex", gap: "10px" }} className="action-buttons">
            <button onClick={() => params.data._id && handleDeleteClick(params.data._id)}>
              <Trash2 size={20} color="red" className="ml-3" />
            </button>
            <button onClick={() => handleEditClick(params.data)}>
              <Edit size={20} color="navy" className="ml-3" />
            </button>
            <button onClick={() => {
              console.log("Viewing record:", params.data);
              handleViewClick(params.data);
            }}>
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
      if (!accessToken) return;
      try {
        const data = await fetchEchoTestRecords(accessToken);
        setRowData(data);
      } catch (error: any) {
        setError(error.message);
        if (error.message.includes("Unauthorized")) {
          toast.error("Session expired. Please login again.", {
            autoClose: 5000,
          });
        } else {
          toast.error("Error fetching data: " + error.message);
        }
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
    if (!accessToken) return;

    try {
      await deleteEchoTestRecord(deleteId, accessToken);
      // Remove the deleted record from state
      setRowData((prevData) => prevData.filter((record) => record._id !== deleteId));
      toast.success("Echo Test record deleted successfully!");
    } catch (error: any) {
      toast.error("Error! Deleting the echo test record");
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
            placeholder="Search echo test reports..."
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
        message="Are you sure you want to delete this service record?"
        title="Delete Confirmation"
      />

      {isViewModalOpen && selectedRecord && selectedRecord._id && (
        <ViewEchoTestRecordModal
          recordId={selectedRecord._id}
          onClose={handleCloseViewModal}
        />
      )}


      {isEditModalOpen && editRecord && (
        <EditEchoTestModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          record={editRecord}
          onSave={handleSaveEditedRecord}
        />
      )}

    </div>
  );
};

export default EchoTestRecordGrid;
function saveServiceRecord(updatedRecord: EchoTestInterface) {
  throw new Error("Function not implemented.");
}