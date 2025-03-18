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
import { Trash2, FilePen, Download, Search, Edit } from "lucide-react";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchServiceRecords,
  deleteServiceRecord,
} from "../../ServiceRecord/Services/ServiceRecord.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Optional: Install and import a spinner library
import { ClipLoader } from "react-spinners";

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

  const onGridReady = (params: any) => {
    setGridApi(params.api);
  };

  const exportToExcel = () => {
    gridApi!.exportDataAsCsv();
  };

  const handleEditClick = (record: ServiceRecordInterface) => {
    setEditRecord(record);
    setIsDialogOpen(true); // Open the form in edit mode
  };

  const filteredRowData = rowData.filter((record) =>
    Object.values(record).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
      cellRenderer: (params: { data: ServiceRecordInterface }) => {
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => params.data._id && handleDeleteClick(params.data._id)}>
              <Trash2 size={24} color="red" className="ml-3" />
            </button>

            <button onClick={() => handleEditClick(params.data)}>
              <Edit size={24} color="navy" className="ml-3" />
            </button>
          </div>
        );
      },
      sortable: false,
      filter: false,
    }
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
    </div>
  );
};

export default ServiceRecordGrid;
