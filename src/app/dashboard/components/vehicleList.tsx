import React from 'react';
import { Types } from "mongoose";
import { fetchAllVehicles } from '../services/dashboard.api';
import { EyeIcon, MapPin, Search, Filter, X, Car, Gauge, Calendar, Fuel, Palette, Users, Ruler, Scale, Flag, FileText, BadgeDollarSign } from 'lucide-react';
import VehicleDetailsModal from './vehicleDetailsModal';

export interface VehicleInterface {
  _id: string;
  Registration_no: string;
  Chasisis_No: string;
  Current_Owner: string;
  Address: string;
  NIC: string;
  Conditions_Special_note: string;
  Absolute_Owner: string;
  Engine_No?: string;
  Cylinder_Capacity?: string;
  Class_of_Vehicle: string;
  Taxation_Class: string;
  Status_When_Registered?: string;
  Fuel_Type?: string;
  Make?: string;
  Country_of_Origin?: string;
  Model?: string;
  Manufactures_Description?: string;
  Wheel_Base?: string;
  Type_of_Body?: string;
  Year_of_Manufacture?: string;
  Colour?: string;
  Previous_Owners?: string;
  Seating_capacity?: string;
  Weight?: string;
  Length?: string;
  Width?: string;
  Height?: string;
  Provincial_Council?: string;
  Date_of_First_Registration?: string;
  Taxes_Payable?: string;
  vehicle_front_img_url?: string;
  vehicle_left_img_url?: string;
  vehicle_right_img_url?: string;
  vehicle_rear_img_url?: string;

  // Relationships
  echoTests?: Types.ObjectId[];
  insuranceClaims?: Types.ObjectId[];
  serviceRecords?: Types.ObjectId[];
}

const VehicleCardsDisplay: React.FC = () => {
  const [vehicles, setVehicles] = React.useState<VehicleInterface[]>([]);
  const [filteredVehicles, setFilteredVehicles] = React.useState<VehicleInterface[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [vehiclesPerPage] = React.useState(9);
  const [expandedVehicleId, setExpandedVehicleId] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({
    make: '',
    model: '',
    classOfVehicle: '',
    fuelType: '',
    yearFrom: '',
    yearTo: '',
  });
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState<VehicleInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchVehiclesData = async () => {
      try {
        setLoading(true);
        const response = await fetchAllVehicles();
        
        if (Array.isArray(response)) {
          setVehicles(response);
          setFilteredVehicles(response);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch vehicles');
      } finally {
        setLoading(false);
      }
    };
  
    fetchVehiclesData();
  }, []);
  // Extract unique values for filter options
  const makes = Array.from(new Set(
    vehicles
      .map(vehicle => vehicle.Make)
      .filter(Boolean) as string[]
  )).sort();

  const models = Array.from(new Set(
    vehicles
      .map(vehicle => vehicle.Model)
      .filter(Boolean) as string[]
  )).sort();

  const classes = Array.from(new Set(
    vehicles.map(vehicle => vehicle.Class_of_Vehicle)
  )).sort();

  const fuelTypes = Array.from(new Set(
    vehicles
      .map(vehicle => vehicle.Fuel_Type)
      .filter(Boolean) as string[]
  )).sort();

  const handleVehicleClick = (vehicle: VehicleInterface) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  // Apply search and filters whenever they change
  React.useEffect(() => {
    let result = [...vehicles];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(vehicle =>
        vehicle.Registration_no.toLowerCase().includes(term) ||
        vehicle.Chasisis_No.toLowerCase().includes(term) ||
        (vehicle.Make?.toLowerCase().includes(term) ?? false) ||
        (vehicle.Model?.toLowerCase().includes(term) ?? false
        ));
    }

    // Apply filters
    if (filters.make) {
      result = result.filter(vehicle =>
        vehicle.Make?.toLowerCase() === filters.make.toLowerCase()
      );
    }

    if (filters.model) {
      result = result.filter(vehicle =>
        vehicle.Model?.toLowerCase() === filters.model.toLowerCase()
      );
    }

    if (filters.classOfVehicle) {
      result = result.filter(vehicle =>
        vehicle.Class_of_Vehicle.toLowerCase() === filters.classOfVehicle.toLowerCase()
      );
    }

    if (filters.fuelType) {
      result = result.filter(vehicle =>
        vehicle.Fuel_Type?.toLowerCase() === filters.fuelType.toLowerCase()
      );
    }

    if (filters.yearFrom) {
      const yearFrom = parseInt(filters.yearFrom);
      result = result.filter(vehicle =>
        vehicle.Year_of_Manufacture && parseInt(vehicle.Year_of_Manufacture) >= yearFrom
      );
    }

    if (filters.yearTo) {
      const yearTo = parseInt(filters.yearTo);
      result = result.filter(vehicle =>
        vehicle.Year_of_Manufacture && parseInt(vehicle.Year_of_Manufacture) <= yearTo
      );
    }

    setFilteredVehicles(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [vehicles, searchTerm, filters]);

  // Get current vehicles for pagination
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);

  const toggleVehicleExpand = (vehicleId: string) => {
    setExpandedVehicleId(expandedVehicleId === vehicleId ? null : vehicleId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      make: '',
      model: '',
      classOfVehicle: '',
      fuelType: '',
      yearFrom: '',
      yearTo: '',
    });
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        <p className="text-gray-600">Loading vehicles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-500 text-lg font-medium">{error}</p>
        <p className="text-gray-600 mt-1">Please try again later</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-500 mb-3">
          <Car className="h-6 w-6" />
        </div>
        <p className="text-gray-700 text-lg font-medium">No vehicles found</p>
        <p className="text-gray-500">Register a vehicle to get started</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Vehicle Registry</h1>
        <p className="text-lg text-gray-600">View and manage registered vehicles</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by registration, chassis, make, or model..."
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filter Vehicles</h3>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Reset all filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
                  Make
                </label>
                <select
                  id="make"
                  name="make"
                  value={filters.make}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Makes</option>
                  {makes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <select
                  id="model"
                  name="model"
                  value={filters.model}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Models</option>
                  {models.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="classOfVehicle" className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <select
                  id="classOfVehicle"
                  name="classOfVehicle"
                  value={filters.classOfVehicle}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  id="fuelType"
                  name="fuelType"
                  value={filters.fuelType}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Fuel Types</option>
                  {fuelTypes.map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="yearFrom" className="block text-sm font-medium text-gray-700 mb-1">
                  Year From
                </label>
                <input
                  type="number"
                  id="yearFrom"
                  name="yearFrom"
                  value={filters.yearFrom}
                  onChange={handleFilterChange}
                  placeholder="e.g. 2000"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                />
              </div>

              <div>
                <label htmlFor="yearTo" className="block text-sm font-medium text-gray-700 mb-1">
                  Year To
                </label>
                <input
                  type="number"
                  id="yearTo"
                  name="yearTo"
                  value={filters.yearTo}
                  onChange={handleFilterChange}
                  placeholder="e.g. 2023"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="text-sm text-gray-500 mb-2">
          Showing {filteredVehicles.length} of {vehicles.length} vehicles
          {(searchTerm || Object.values(filters).some(Boolean)) && (
            <button
              onClick={resetFilters}
              className="ml-2 text-blue-600 hover:text-blue-800 inline-flex items-center"
            >
              Clear filters
              <X className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 text-gray-600 mb-3">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No vehicles found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentVehicles.map((vehicle) => (
              // Modify your VehicleCard component to use the click handler
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                isExpanded={expandedVehicleId === vehicle._id}
                onToggleExpand={() => handleVehicleClick(vehicle)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-l-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border-t border-b border-gray-300 ${currentPage === i + 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-r-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {selectedVehicle && (
        <VehicleDetailsModal
          vehicle={selectedVehicle}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddServiceRecord={function (): void {
            throw new Error('Function not implemented.');
          }}
          onAddEchoTest={function (): void {
            throw new Error('Function not implemented.');
          }}
          onAddInsuranceClaim={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      )}
    </div>
  );
};

const VehicleCard: React.FC<{
  vehicle: VehicleInterface,
  isExpanded: boolean,
  onToggleExpand: () => void
}> = ({ vehicle, isExpanded, onToggleExpand }) => {
  const cardColor = 'bg-blue-50';
  const textColor = 'text-blue-600';

  return (


    <div className={`rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 ${isExpanded ? 'ring-2 ring-blue-500' : ''}`}>
      {/* Header with blue accent */}

      <div className={`${cardColor} px-6 py-4`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{vehicle.Registration_no}</h2>
            <p className="text-gray-600">{vehicle.Make} {vehicle.Model}</p>
          </div>
          <button
            onClick={onToggleExpand}
            className={`p-2 rounded-full ${isExpanded ? 'bg-white text-blue-600 shadow-md' : 'bg-white/80 text-gray-600 hover:bg-white'}`}
            aria-label={isExpanded ? "Show less" : "Show more"}
          >
            <EyeIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Basic details */}
      <div className="p-6">
        <div className="space-y-3">
          <div className="flex items-center">
            <span className={`w-8 h-8 rounded-full ${cardColor} flex items-center justify-center mr-3`}>
              <Car className={`h-4 w-4 ${textColor}`} />
            </span>
            <div>
              <p className="text-sm text-gray-500">Class</p>
              <p className="font-medium">{vehicle.Class_of_Vehicle}</p>
            </div>
          </div>

          <div className="flex items-center">
            <span className={`w-8 h-8 rounded-full ${cardColor} flex items-center justify-center mr-3`}>
              <Calendar className={`h-4 w-4 ${textColor}`} />
            </span>
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="font-medium">{vehicle.Year_of_Manufacture || 'Not specified'}</p>
            </div>
          </div>

          <div className="flex items-center">
            <span className={`w-8 h-8 rounded-full ${cardColor} flex items-center justify-center mr-3`}>
              <Fuel className={`h-4 w-4 ${textColor}`} />
            </span>
            <div>
              <p className="text-sm text-gray-500">Fuel Type</p>
              <p className="font-medium">{vehicle.Fuel_Type || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div className="mt-6 space-y-5">
            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className={`w-8 h-8 rounded-full ${cardColor} flex items-center justify-center mr-3`}>
                  <FileText className={`h-4 w-4 ${textColor}`} />
                </span>
                Vehicle Details
              </h3>

              <div className="space-y-3 pl-11">
                <div className="flex items-start">
                  <Car className={`h-5 w-5 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm text-gray-500">Chassis No</p>
                    <p className="font-medium">{vehicle.Chasisis_No}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Gauge className={`h-5 w-5 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm text-gray-500">Engine No</p>
                    <p className="font-medium">{vehicle.Engine_No || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Palette className={`h-5 w-5 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="font-medium">{vehicle.Colour || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className={`h-5 w-5 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm text-gray-500">Seating Capacity</p>
                    <p className="font-medium">{vehicle.Seating_capacity || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className={`w-8 h-8 rounded-full ${cardColor} flex items-center justify-center mr-3`}>
                  <Ruler className={`h-4 w-4 ${textColor}`} />
                </span>
                Dimensions
              </h3>

              <div className="space-y-3 pl-11">
                <div className="flex items-start">
                  <Ruler className={`h-5 w-5 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm text-gray-500">Length</p>
                    <p className="font-medium">{vehicle.Length || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Ruler className={`h-5 w-5 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm text-gray-500">Width</p>
                    <p className="font-medium">{vehicle.Width || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Ruler className={`h-5 w-5 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm text-gray-500">Height</p>
                    <p className="font-medium">{vehicle.Height || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Scale className={`h-5 w-5 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{vehicle.Weight || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className={`w-8 h-8 rounded-full ${cardColor} flex items-center justify-center mr-3`}>
                  <Users className={`h-4 w-4 ${textColor}`} />
                </span>
                Ownership
              </h3>

              <div className="space-y-3 pl-11">
                <div className="flex items-start">
                  <Users className={`h-5 w-5 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm text-gray-500">Current Owner</p>
                    <p className="font-medium">{vehicle.Current_Owner}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FileText className={`h-5 w-5 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm text-gray-500">NIC</p>
                    <p className="font-medium">{vehicle.NIC}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className={`h-5 w-5 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{vehicle.Address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Flag className={`h-5 w-5 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm text-gray-500">Provincial Council</p>
                    <p className="font-medium">{vehicle.Provincial_Council || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <BadgeDollarSign className={`h-5 w-5 ${textColor} mr-2 mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm text-gray-500">Taxes Payable</p>
                    <p className="font-medium">{vehicle.Taxes_Payable || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {vehicle.Conditions_Special_note && (
              <div className="border-t border-gray-200 pt-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className={`w-8 h-8 rounded-full ${cardColor} flex items-center justify-center mr-3`}>
                    <FileText className={`h-4 w-4 ${textColor}`} />
                  </span>
                  Special Notes
                </h3>

                <div className="pl-11">
                  <p className="text-gray-700">{vehicle.Conditions_Special_note}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>


    </div>
  );
};

export default VehicleCardsDisplay;