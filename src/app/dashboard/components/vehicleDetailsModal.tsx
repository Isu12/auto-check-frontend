import React, { useState } from 'react';
import { VehicleInterface } from '../types/vehicle.interface';
import {
  Car, Gauge, Calendar, Fuel, Palette, Users,
  Ruler, Scale, Flag, FileText, BadgeDollarSign,
  MapPin, X, Clipboard, Hash, CreditCard, AlertCircle,
  Wrench, Activity, Shield, List, TestTube2, FileSearch,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '../../auth/ui/button';
import EchoTestForm from '@/app/echo-test-reports/Components/EchoTestForm';
import InsuranceClaimForm from '@/app/isurance-claim/Components/InsuranceClaimForm';
import { useAuthToken } from "@/app/auth/hooks/accessHook";
import ServiceRecordForm from '@/app/ServiceRecord/Components/ServiceRecordForm';

interface VehicleDetailsModalProps {
  vehicle: VehicleInterface;
  isOpen: boolean;
  onClose: () => void;
  onAddServiceRecord: () => void;
  onAddEchoTest: () => void;
  onAddInsuranceClaim: () => void;
}

const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onAddServiceRecord,
  onAddEchoTest,
  onAddInsuranceClaim
}) => {
  const [showEchoTestForm, setShowEchoTestForm] = useState(false);
  const [showServiceRecordForm, setServiceRecordForm] = useState(false);
  const [showInsuranceClaimForm, setShowInsuranceClaimForm] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleAddEchoTest = () => {
    setShowEchoTestForm(true);
  };

  const handleAddServiceRecord = () => {
    setServiceRecordForm(true);
  }

  const handleAddInsuranceClaim = () => {
    setShowInsuranceClaimForm(true);
  };


  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!isOpen) return null;

  // Helper function to render detail items
  const renderDetailItem = (icon: React.ReactNode, label: string, value: string | undefined) => (
    <div className="flex items-start py-2">
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
        {icon}
      </span>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value || 'Not specified'}</p>
      </div>
    </div>
  );

  // Helper function to render records section
  const renderRecordsSection = (
    title: string,
    icon: React.ReactNode,
    records: any[],
    sectionKey: string,
    recordRenderer: (record: any, index: number) => React.ReactNode
  ) => (
    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex justify-between items-center text-lg font-semibold text-gray-800"
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-2">{title} ({records.length})</span>
        </div>
        {expandedSection === sectionKey ? <ChevronUp /> : <ChevronDown />}
      </button>

      {expandedSection === sectionKey && (
        <div className="mt-3 space-y-3">
          {records.length > 0 ? (
            records.map((record, index) => (
              <React.Fragment key={record._id || record.TestID || `record-${index}`}>
                {recordRenderer(record, index)}
              </React.Fragment>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No {title.toLowerCase()} found</p>
          )}
        </div>
      )}
    </div>
  );

  // Render functions for each record type
  const renderEchoTestRecord = (record: any) => {
    // Safely parse dates with fallbacks
    const issuedDate = record.IssuedDate
      ? new Date(record.IssuedDate).toLocaleDateString()
      : 'Not specified';

    const expiryDate = record.ExpiryDate
      ? new Date(record.ExpiryDate).toLocaleDateString()
      : 'Not specified';

    const createdAt = record.CreatedAt
      ? new Date(record.CreatedAt).toLocaleString()
      : 'Not specified';

    // Check if expired only if we have an expiry date
    const isExpired = record.ExpiryDate
      ? new Date(record.ExpiryDate) < new Date()
      : false;

    return (
      <div className="p-4 bg-white rounded-md shadow-sm border">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <span className="font-medium">
                Test ID: {record.TestID ? `#${record.TestID}` : 'Not assigned'}
              </span>
              {isExpired && record.ExpiryDate && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                  Expired
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {record.TestingCenterName || record.TestingCenterBranch
                ? `Testing Center: ${record.TestingCenterName || ''} ${record.TestingCenterBranch ? `(${record.TestingCenterBranch})` : ''}`
                : 'Testing center not specified'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm">Issued: {issuedDate}</div>
            {record.ExpiryDate && (
              <div className={`text-sm ${isExpired ? 'text-red-600' : 'text-gray-500'}`}>
                Expires: {expiryDate}
              </div>
            )}
          </div>
        </div>

        {record.CertificateFileURL ? (
          <div className="mt-3">
            <a
              href={record.CertificateFileURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              <FileSearch className="h-4 w-4 mr-1" />
              View Certificate
            </a>
          </div>
        ) : (
          <div className="mt-3 text-sm text-gray-500">
            No certificate available
          </div>
        )}

        <div className="mt-2 text-xs text-gray-500">
          Record created: {createdAt}
        </div>
      </div>
    );
  };

  const renderInsuranceClaimRecord = (record: any) => {
    const claimDate = record.ClaimDate
      ? new Date(record.ClaimDate).toLocaleDateString()
      : 'Not specified';

    const createdAt = record.CreatedAt
      ? new Date(record.CreatedAt).toLocaleString()
      : 'Not specified';

    return (
      <div className="p-4 bg-white rounded-md shadow-sm border">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <span className="font-medium">
                Claim ID: {record.InsuranceID || 'Not assigned'}
              </span>
              {record.status && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${record.status === 'approved' ? 'bg-green-100 text-green-800' :
                  record.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                  {record.status}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Type: {record.ClaimType || 'Not specified'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm">Filed: {claimDate}</div>
            {record.ClaimAmountRequested && (
              <div className="text-sm text-gray-500">
                Amount: ${record.ClaimAmountRequested.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {record.DamageDescription && (
          <div className="mt-3">
            <p className="text-sm font-medium">Damage Description:</p>
            <p className="text-sm text-gray-700">{record.DamageDescription}</p>
          </div>
        )}

        {/* Display damage images if available */}
        {(record.DamageImageURL1 || record.DamageImageURL2 ||
          record.DamageImageURL3 || record.DamageImageURL4 ||
          record.DamageImageURL5) && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-1">Damage Photos:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  record.DamageImageURL1,
                  record.DamageImageURL2,
                  record.DamageImageURL3,
                  record.DamageImageURL4,
                  record.DamageImageURL5
                ].filter(url => url).map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-20 h-20 border rounded-md overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Damage photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

        <div className="mt-2 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Record created: {createdAt}
          </div>
          {record.ClaimAmountApproved && (
            <div className="text-sm font-medium text-green-600">
              Approved: ${record.ClaimAmountApproved.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderServiceRecord = (record: any) => {
    const serviceDate = record.DateOfService
      ? new Date(record.DateOfService).toLocaleDateString()
      : 'Not specified';

    const nextServiceDate = record.NextServiceDate
      ? new Date(record.NextServiceDate).toLocaleDateString()
      : 'Not scheduled';

    const createdAt = record.CreatedAt
      ? new Date(record.CreatedAt).toLocaleString()
      : 'Not specified';

    return (
      <div className="p-4 bg-white rounded-md shadow-sm border">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <span className="font-medium">
                Service Type: {record.ServiceType || 'Not specified'}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Odometer: {record.OdometerReading || 'N/A'} km
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm">Performed: {serviceDate}</div>
            <div className="text-sm text-gray-500">
              Next Service: {nextServiceDate}
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {record.DescriptionOfIssue && (
            <div>
              <p className="text-sm font-medium">Issue:</p>
              <p className="text-sm text-gray-700">{record.DescriptionOfIssue}</p>
            </div>
          )}

          {record.ServiceDetails && (
            <div>
              <p className="text-sm font-medium">Service Performed:</p>
              <p className="text-sm text-gray-700">{record.ServiceDetails}</p>
            </div>
          )}

          {record.PartsUsed && (
            <div>
              <p className="text-sm font-medium">Parts Used:</p>
              <p className="text-sm text-gray-700">{record.PartsUsed}</p>
            </div>
          )}
        </div>

        {record.InvoiceImageURL ? (
          <div className="mt-3">
            <a
              href={record.InvoiceImageURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              <FileSearch className="h-4 w-4 mr-1" />
              View Service Invoice
            </a>
          </div>
        ) : (
          <div className="mt-3 text-sm text-gray-500">
            No invoice available
          </div>
        )}

        <div className="mt-2 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Record created: {createdAt}
          </div>
          <div className="text-sm font-medium">
            Cost: {record.ServiceCost ? `$${record.ServiceCost.toFixed(2)}` : 'Not specified'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {showEchoTestForm && (
        <EchoTestForm
          showModal={showEchoTestForm}
          handleClose={() => setShowEchoTestForm(false)}
          vehicleId={vehicle._id}
        />
      )}
      {showInsuranceClaimForm && (
        <InsuranceClaimForm
          showModal={showInsuranceClaimForm}
          handleClose={() => setShowInsuranceClaimForm(false)}
          vehicleId={vehicle._id}
        />
      )}
      {showServiceRecordForm && (
        <ServiceRecordForm
          showModal={showServiceRecordForm}
          handleClose={() => setServiceRecordForm(false)}
          vehicleId={vehicle._id}
        />
      )}
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal container */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {vehicle.Make} {vehicle.Model}
                </h2>
                <p className="text-lg text-blue-600 font-medium">
                  {vehicle.Registration_no}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Vehicle Images (if available) */}
            {(vehicle.Front_Photo || vehicle.Left_Photo ||
              vehicle.Right_Photo || vehicle.Rear_Photo) && (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {vehicle.Front_Photo && (
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={vehicle.Front_Photo}
                        alt="Front view"
                        className="w-full h-50 object-cover"
                      />
                      <p className="text-center text-xs py-1 bg-gray-50">Front View</p>
                    </div>
                  )}
                  {vehicle.Rear_Photo && (
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={vehicle.Rear_Photo}
                        alt="Rear view"
                        className="w-full h-50 object-cover"
                      />
                      <p className="text-center text-xs py-1 bg-gray-50">Rear View</p>
                    </div>
                  )}
                  {vehicle.Left_Photo && (
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={vehicle.Left_Photo}
                        alt="Left side view"
                        className="w-full h-50 object-cover"
                      />
                      <p className="text-center text-xs py-1 bg-gray-50">Left Side</p>
                    </div>
                  )}
                  {vehicle.Right_Photo && (
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={vehicle.Right_Photo}
                        alt="Right side view"
                        className="w-fill h-50 object-cover"
                      />
                      <p className="text-center text-xs py-1 bg-gray-50">Right Side</p>
                    </div>
                  )}
                </div>
              )}

            {/* Main content */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1 */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Car className="h-5 w-5 text-blue-600 mr-2" />
                    Vehicle Identification
                  </h3>
                  {renderDetailItem(<Hash className="h-4 w-4" />, "Chassis No", vehicle.Chasisis_No)}
                  {renderDetailItem(<Gauge className="h-4 w-4" />, "Engine No", vehicle.Engine_No)}
                  {renderDetailItem(<Clipboard className="h-4 w-4" />, "Class", vehicle.Class_of_Vehicle)}
                  {renderDetailItem(<Calendar className="h-4 w-4" />, "Year of Manufacture", vehicle.Year_of_Manufacture)}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Ruler className="h-5 w-5 text-blue-600 mr-2" />
                    Specifications
                  </h3>
                  {renderDetailItem(<Palette className="h-4 w-4" />, "Color", vehicle.Colour)}
                  {renderDetailItem(<Fuel className="h-4 w-4" />, "Fuel Type", vehicle.Fuel_Type)}
                  {renderDetailItem(<Users className="h-4 w-4" />, "Seating Capacity", vehicle.Seating_capacity)}
                  {renderDetailItem(<Scale className="h-4 w-4" />, "Weight", vehicle.Weight)}
                  {renderDetailItem(<Ruler className="h-4 w-4" />, "Dimensions",
                    vehicle.Length && vehicle.Width && vehicle.Height
                      ? `${vehicle.Length} (L) x ${vehicle.Width} (W) x ${vehicle.Height} (H)`
                      : undefined)}
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    Ownership Details
                  </h3>
                  {renderDetailItem(<Users className="h-4 w-4" />, "Current Owner", vehicle.Current_Owner)}
                  {renderDetailItem(<FileText className="h-4 w-4" />, "NIC", vehicle.NIC)}
                  {renderDetailItem(<MapPin className="h-4 w-4" />, "Address", vehicle.Address)}
                  {renderDetailItem(<Flag className="h-4 w-4" />, "Provincial Council", vehicle.Provincial_Council)}
                  {renderDetailItem(<Calendar className="h-4 w-4" />, "First Registration", vehicle.Date_of_First_Registration)}
                  {renderDetailItem(<BadgeDollarSign className="h-4 w-4" />, "Taxes Payable", vehicle.Taxes_Payable)}
                </div>

                {vehicle.Conditions_Special_note && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                      Special Notes
                    </h3>
                    <p className="text-gray-700 pl-11">{vehicle.Conditions_Special_note}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Records Sections */}
            <div className="mt-6">
              {renderRecordsSection(
                "Echo Tests",
                <TestTube2 className="h-5 w-5 text-blue-600 mr-2" />,
                vehicle.echoTests || [],
                "echoTests",
                renderEchoTestRecord
              )}

              {renderRecordsSection(
                "Insurance Claims",
                <Shield className="h-5 w-5 text-blue-600 mr-2" />,
                vehicle.insuranceClaims || [],
                "insuranceClaims",
                renderInsuranceClaimRecord
              )}

              {renderRecordsSection(
                "Service Records",
                <Wrench className="h-5 w-5 text-blue-600 mr-2" />,
                vehicle.serviceRecords || [],
                "serviceRecords",
                renderServiceRecord
              )}
            </div>
          </div>

          {/* Footer with action buttons */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <div className="w-full flex flex-col sm:flex-row justify-end gap-3">
              <Button
                type="button"
                onClick={handleAddServiceRecord}
                variant={"outline"}
              >
                <Wrench className="h-4 w-4 mr-2" />
                Add Service Record
              </Button>
              <Button
                type="button"
                onClick={handleAddEchoTest}
                variant={"outline"}
              >
                <Activity className="h-4 w-4 mr-2" />
                Add Echo Test
              </Button>
              <Button
                type="button"
                onClick={handleAddInsuranceClaim}
                variant={"outline"}
              >
                <Shield className="h-4 w-4 mr-2" />
                Add Insurance Claim
              </Button>
              <Button
                type="button"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsModal;