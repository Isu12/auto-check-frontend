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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    setIsViewModalOpen(true); 
  };

  const handleCloseViewModal = () => {
    setSelectedRecord(null); 
    setIsViewModalOpen(false); 
  };

  const handleSaveEditedRecord = async (updatedRecord: EchoTestInterface) => {
    try {
      const updatedValues = {
        IssuedDate: updatedRecord.IssuedDate,
        ExpiryDate: updatedRecord.ExpiryDate,
        TestingCenterName: updatedRecord.TestingCenterName,
        TestingCenterBranch: updatedRecord.TestingCenterBranch,
      };
      await updateEchoTestRecord(updatedRecord, updatedValues);
  
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
    { field: "TestID", headerName: "Test ID", filter: "agNumberColumnFilter", valueFormatter: (params) => `${params.value} Km` },
    {
      field: "IssuedDate",
      headerName: "Date of Issue",
      filter: "agDateColumnFilter",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: "ExpiryDate",
      headerName: "Date of Expire",
      filter: "agDateColumnFilter",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString();
      },
    },
    { field: "TestingCenterName", headerName: "Testing Center Name", filter: "agTextColumnFilter" },
    { field: "TestingCenterBranch", headerName: "Testing Center Branch", filter: "agTextColumnFilter" },
    {
      field: "CertificateFileURL",
      headerName: "Test Certificate",
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
              <Trash2 size={24} color="red" className="ml-3" />
            </button>

            <button onClick={() => handleEditClick(params.data)}>
              <Edit size={24} color="navy" className="ml-3" />
            </button>

            <button onClick={() => handleViewClick(params.data)}>
              <Eye size={24} color="green" className="ml-3" />
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
        const data = await fetchEchoTestRecords();
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
      await deleteEchoTestRecord(deleteId);
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
        <ViewEchoTestRecordModal
          recordId={selectedRecord._id ?? ""}
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