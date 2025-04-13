import { AgGridReact } from "ag-grid-react";
import { useState, useEffect, useCallback, useMemo } from "react";
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
import { VehicleRegistrationInterface } from "../../vehicle-registration/Types/VehicleRegistration.interface";
import { Trash2, FilePen, Download, Search, Edit, Eye, Image as ImageIcon, Plus } from "lucide-react";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import ViewServiceRecordModal from "./VehicalViewModal";
import VehicleEditForm from "./VehicleEditForm";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    Filler,
} from 'chart.js';
import IncompleteRegistrations from "../Components/IncomRegistration";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    ChartTooltip,
    Legend,
    Filler
);

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    PaginationModule,
    TextFilterModule,
    NumberFilterModule,
    DateFilterModule,
    CsvExportModule,
]);

const ServiceRecordGrid = () => {
    const [rowData, setRowData] = useState<VehicleRegistrationInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editRecord, setEditRecord] = useState<VehicleRegistrationInterface | null>(null);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<VehicleRegistrationInterface | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [monthlyRegistrationData, setMonthlyRegistrationData] = useState<{month: string, count: number}[]>([]);
    const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
    const [showIncompleteRegistrations, setShowIncompleteRegistrations] = useState(false);

    const onGridReady = (params: { api: GridApi }) => {
        setGridApi(params.api);
    };

    const exportToExcel = useCallback(() => {
        if (gridApi) {
            gridApi.exportDataAsCsv();
        }
    }, [gridApi]);

    const handleViewClick = useCallback((record: VehicleRegistrationInterface) => {
        setSelectedRecord(record);
        setIsViewModalOpen(true);
    }, []);

    const handleEditClick = useCallback((record: VehicleRegistrationInterface) => {
        setEditRecord(record);
        setIsEditModalOpen(true);
    }, []);

    const handleSaveEditedRecord = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:5555/api/vehicle-record");
            if (!response.ok) {
                throw new Error("Failed to fetch vehicle records");
            }
            const data = await response.json();
            setRowData(data);
            processMonthlyRegistrationData(data);
            toast.success("Vehicle record updated successfully");
        } catch (error: unknown) {
            const err = error as Error;
            toast.error(`Error refreshing data: ${err.message}`);
        } finally {
            setIsEditModalOpen(false);
        }
    }, []);

    const filteredRowData = useMemo(() => {
        if (!rowData) return [];
        return rowData.filter((record) =>
            record && Object.values(record).some((value) =>
                value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [rowData, searchQuery]);

    const processMonthlyRegistrationData = (data: VehicleRegistrationInterface[]) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentYear = new Date().getFullYear();
        
        const monthlyData = monthNames.map(month => ({
            month,
            count: 0
        }));

        data.forEach(record => {
            if (record.Date_of_First_Registration) {
                const date = new Date(record.Date_of_First_Registration);
                if (date.getFullYear() === currentYear) {
                    const monthIndex = date.getMonth();
                    monthlyData[monthIndex].count++;
                }
            }
        });

        setMonthlyRegistrationData(monthlyData);
    };

    const registrationChartData = {
        labels: monthlyRegistrationData.map(item => item.month),
        datasets: [
            {
                label: 'Registrations',
                data: monthlyRegistrationData.map(item => item.count),
                borderColor: 'rgba(59, 130, 246, 0.8)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                tension: 0.3,
                fill: true,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: '#fff',
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointHoverBorderColor: '#fff',
                pointHitRadius: 10,
                pointBorderWidth: 2,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: `Monthly Vehicle Registrations (${new Date().getFullYear()})`,
                font: {
                    size: 16
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        },
        maintainAspectRatio: false
    };

    const imageCellRenderer = useCallback((params: { value: string }) => {
        if (!params.value) {
            return (
                <div className="flex justify-center items-center h-full">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="text-gray-400">
                                    <ImageIcon size={24} />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>No image uploaded</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            );
        }
        
        const imageUrl = params.value.startsWith('http') ? params.value : 
                        params.value.startsWith('data:image') ? params.value : 
                        `http://localhost:5555/${params.value.replace(/^\/+/g, '')}`;

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <div className="flex justify-center items-center h-full">
                            <img 
                                src={imageUrl} 
                                alt="Vehicle" 
                                className="cursor-pointer hover:opacity-75 transition-opacity"
                                style={{ 
                                    width: '50px', 
                                    height: '50px', 
                                    objectFit: 'cover',
                                    borderRadius: '4px'
                                }} 
                                onClick={() => window.open(imageUrl, '_blank')}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '';
                                    target.alt = 'Image failed to load';
                                }}
                            />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="p-2">
                            <img 
                                src={imageUrl} 
                                alt="Vehicle preview" 
                                style={{ 
                                    width: '200px', 
                                    height: 'auto',
                                    maxHeight: '200px',
                                    objectFit: 'contain'
                                }} 
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '';
                                    target.alt = 'Image failed to load';
                                }}
                            />
                            <p className="text-center mt-2 text-sm">Click to view full size</p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }, []);

    const columnDefs: ColDef[] = useMemo(() => [
        { 
            field: "Registration_no", 
            headerName: "Reg No", 
            filter: "agTextColumnFilter", 
            width: 120,
            headerClass: 'font-bold'
        },
        { 
            field: "Current_Owner", 
            headerName: "Owner", 
            filter: "agTextColumnFilter", 
            width: 150,
            tooltipField: "Current_Owner"
        },
        { 
            field: "Class_of_Vehicle", 
            headerName: "Class", 
            filter: "agTextColumnFilter", 
            width: 120 
        },
        { 
            field: "Make", 
            headerName: "Make", 
            filter: "agTextColumnFilter", 
            width: 100 
        },
        { 
            field: "Model", 
            headerName: "Model", 
            filter: "agTextColumnFilter", 
            width: 100 
        },
        { 
            field: "Year_of_Manufacture", 
            headerName: "Year", 
            filter: "agNumberColumnFilter", 
            width: 80 
        },
        { 
            field: "Colour", 
            headerName: "Color", 
            filter: "agTextColumnFilter", 
            width: 100 
        },
        {
            field: "Date_of_First_Registration",
            headerName: "Reg Date",
            filter: "agDateColumnFilter",
            valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : "",
            width: 100
        },
        {
            field: "Front_Photo",
            headerName: "Photo",
            cellRenderer: imageCellRenderer,
            filter: false,
            sortable: false,
            width: 100,
            cellClass: "grid-cell-center",
            valueGetter: (params) => params.data?.Front_Photo
        },
        {
            field: "actions",
            headerName: "Actions",
            cellRenderer: (params: { data: VehicleRegistrationInterface }) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={() => handleViewClick(params.data)}>
                                    <Eye size={20} color="orange" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>View details</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={() => params.data._id && handleDeleteClick(params.data._id)}>
                                    <Trash2 size={20} color="red" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Delete record</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={() => handleEditClick(params.data)}>
                                    <Edit size={20} color="navy" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit record</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
            sortable: false,
            filter: false,
            width: 120,
            cellClass: "grid-cell-center"
        },
    ], [handleViewClick, handleEditClick, imageCellRenderer]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5555/api/vehicle-record");
                if (!response.ok) {
                    throw new Error("Failed to fetch vehicle records");
                }
                const data = await response.json();
                
                const processedData = data.map((record: VehicleRegistrationInterface) => ({
                    ...record,
                    Front_Photo: record.Front_Photo || '',
                    Left_Photo: record.Left_Photo || '',
                    Right_Photo: record.Right_Photo || '',
                    Rear_Photo: record.Rear_Photo || '',
                    Date_of_First_Registration: record.Date_of_First_Registration || null
                }));
                
                setRowData(processedData);
                processMonthlyRegistrationData(processedData);
            } catch (error: unknown) {
                const err = error as Error;
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteClick = useCallback((id: string) => {
        setDeleteId(id);
        setIsDialogOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteId) return;

        try {
            const response = await fetch(`http://localhost:5555/api/vehicle-record/${deleteId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete vehicle record");
            }

            setRowData((prevData) => prevData.filter((record) => record._id !== deleteId));
            processMonthlyRegistrationData(rowData.filter((record) => record._id !== deleteId));
            toast.success("Vehicle record deleted successfully");
        } catch (error: unknown) {
            const err = error as Error;
            toast.error("Error deleting record: " + err.message);
        } finally {
            setIsDialogOpen(false);
            setDeleteId(null);
        }
    }, [deleteId, rowData]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader size={50} color={"#3498db"} />
            </div>
        );
    }

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="ag-theme-quartz" style={{ width: "100%" }}>
            <style>{`
                .ag-theme-quartz {
                    --ag-grid-size: 5px;
                    --ag-list-item-height: 30px;
                    --ag-font-size: 14px;
                }
                .ag-theme-quartz .ag-header-cell {
                    font-weight: 600;
                }
                .grid-cell-center {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                }
                .ag-theme-quartz .ag-cell {
                    display: flex;
                    align-items: center;
                }
                .vehicle-count-card {
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    border-radius: 12px;
                    padding: 20px;
                    color: white;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .vehicle-count-number {
                    font-size: 2.5rem;
                    font-weight: bold;
                    line-height: 1;
                }
                .vehicle-count-label {
                    font-size: 1rem;
                    opacity: 0.9;
                    margin-top: 4px;
                }
                .vehicle-count-icon {
                    background-color: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .chart-container {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    margin-bottom: 20px;
                    height: 300px;
                }
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    position: sticky;
                    top: 0;
                    background: white;
                    padding: 15px 0;
                    z-index: 100;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .dashboard-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #1e3a8a;
                }
                .ag-header-cell-label {
                    font-weight: 600 !important;
                }
                .action-buttons {
                    display: flex;
                    gap: 10px;
                }
                .main-content {
                    padding-top: 20px;
                }
            `}</style>

            {/* Fixed Header */}
            <div className="dashboard-header">
                <h1 className="dashboard-title">Vehicle Registration Dashboard</h1>
                <div className="action-buttons">
                    <Button 
                        onClick={() => setShowIncompleteRegistrations(true)} 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Incomplete Registrations
                    </Button>
                    
                    <Button onClick={exportToExcel} variant={"outline"}>
                        <Download size={20} className="mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="main-content">
                {/* Vehicle Count Card */}
                <div className="vehicle-count-card">
                    <div>
                        <div className="vehicle-count-number">{rowData.length}</div>
                        <div className="vehicle-count-label">Total Registered Vehicles</div>
                    </div>
                    <div className="vehicle-count-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                            <circle cx="7" cy="17" r="2"/>
                            <path d="M9 17h6"/>
                            <circle cx="17" cy="17" r="2"/>
                        </svg>
                    </div>
                </div>

                {/* Registration Chart */}
                <div className="chart-container">
                    <Line data={registrationChartData} options={chartOptions} />
                </div>
                
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
                </div>
                
                <AgGridReact
                    rowData={filteredRowData}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationPageSize={15}
                    domLayout="autoHeight"
                    rowModelType="clientSide"
                    onGridReady={onGridReady}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: true,
                        flex: 1,
                        minWidth: 80,
                        wrapText: true,
                        autoHeight: true,
                        cellStyle: { 
                            display: 'flex', 
                            alignItems: 'center',
                            padding: '8px'
                        },
                    }}
                    getRowHeight={() => 60}
                    suppressCellFocus={true}
                />
            </div>

            <ConfirmationDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                message="Are you sure you want to delete this vehicle record?"
                title="Delete Confirmation"
            />

            {isViewModalOpen && selectedRecord && (
                <ViewServiceRecordModal
                    recordId={selectedRecord._id ?? ""}
                    onClose={() => setIsViewModalOpen(false)}
                    show={isViewModalOpen}
                />
            )}

            {isEditModalOpen && editRecord && (
                <VehicleEditForm
                    vehicleId={editRecord._id ?? ""}
                    initialValues={editRecord}
                    onSuccess={handleSaveEditedRecord}
                    show={isEditModalOpen}
                    onHide={() => setIsEditModalOpen(false)}
                />
            )}

            {showAddVehicleModal && (
                <VehicleEditForm
                    vehicleId=""
                    initialValues={{
                        Registration_no: "",
                        Chasisis_No: "",
                        Current_Owner: "",
                        Address: "",
                        NIC: "",
                        Conditions_Special_note: "",
                        Absolute_Owner: "",
                        Engine_No: "",
                        Cylinder_Capacity: "",
                        Class_of_Vehicle: "",
                        Taxation_Class: "",
                        Status_When_Registered: "",
                        Fuel_Type: "",
                        Make: "",
                        Country_of_Origin: "",
                        Model: "",
                        Manufactures_Description: "",
                        Wheel_Base: "",
                        Type_of_Body: "",
                        Year_of_Manufacture: "",
                        Colour: "",
                        Previous_Owners: "",
                        Seating_capacity: "",
                        Weight: "",
                        Length: "",
                        Width: "",
                        Height: "",
                        Provincial_Council: "",
                        Date_of_First_Registration: "",
                        Taxes_Payable: "",
                        Front_Photo: "",
                        Left_Photo: "",
                        Right_Photo: "",
                        Rear_Photo: "",
                    }}
                    onSuccess={() => {
                        setShowAddVehicleModal(false);
                        handleSaveEditedRecord();
                    }}
                    show={showAddVehicleModal}
                    onHide={() => setShowAddVehicleModal(false)}
                />
            )}

            <IncompleteRegistrations 
                show={showIncompleteRegistrations} 
                onHide={() => setShowIncompleteRegistrations(false)} 
            />
        </div>
    );
};

export default ServiceRecordGrid;