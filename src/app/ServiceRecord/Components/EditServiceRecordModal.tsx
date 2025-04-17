import React, { useState, useEffect } from "react";
import { Button } from "../../../Components/ui/button";
import { Input } from "../../../Components/ui/input";
import { ServiceRecordInterface } from "../types/ServiceRecord.Interface";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateServiceRecord } from "../Services/ServiceRecord.service";

interface EditServiceRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ServiceRecordInterface | null;
  onSave: (updatedRecord: ServiceRecordInterface) => void;
}

const EditServiceRecordModal: React.FC<EditServiceRecordModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave,
}) => {
  const [editedRecord, setEditedRecord] = useState<ServiceRecordInterface | null>(null);

  // Set the edited record when the modal opens
  useEffect(() => {
    if (isOpen && record) {
      setEditedRecord(record);
    }
  }, [isOpen, record]);

  // Handle input changes for text and number fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof ServiceRecordInterface
  ) => {
    if (editedRecord) {
      setEditedRecord({
        ...editedRecord,
        [field]: e.target.value,
      });
    }
  };

  // Handle date changes for DateOfService and NextServiceDate fields
  const handleDateChange = (date: Date | null, field: "DateOfService" | "NextServiceDate") => {
    if (editedRecord && date) {
      setEditedRecord({
        ...editedRecord,
        [field]: date,
      });
    }
  };

  const handleSave = async () => {
    if (editedRecord) {
      const updatedValues = {
        ServiceCost: editedRecord.ServiceCost,  // For example, you might want to only send a few fields.
      };
  
      try {
        await updateServiceRecord(editedRecord, updatedValues);
        onSave(editedRecord);
        onClose();
      } catch (error) {
        console.error("Error saving service record:", error);
      }
    }
  };

  // If the modal is not open or there is no record, return null
  if (!isOpen || !editedRecord) return null;

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Edit Service Record</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          {/* Odometer Reading */}
          <div className="form-group col-md-6">
            <label className="form-label">Odometer Reading (km)</label>
            <Input
              type="number"
              value={editedRecord.OdometerReading}
              onChange={(e) => handleInputChange(e, "OdometerReading")}
              className="form-control"
            />
          </div>

          {/* Date of Service */}
          <div className="form-group col-md-6">
            <label className="form-label">Date of Service</label>
            <DatePicker
              selected={editedRecord.DateOfService ? new Date(editedRecord.DateOfService) : null}
              onChange={(date) => handleDateChange(date as Date, "DateOfService")}
              className="form-control"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>

        <div className="row">
          {/* Service Type */}
          <div className="form-group col-md-6">
            <label className="form-label">Service Type</label>
            <Input
              type="text"
              value={editedRecord.ServiceType}
              onChange={(e) => handleInputChange(e, "ServiceType")}
              className="form-control"
              placeholder="e.g., Oil Change"
            />
          </div>

          {/* Service Cost */}
          <div className="form-group col-md-6">
            <label className="form-label">Service Cost</label>
            <Input
              type="number"
              value={editedRecord.ServiceCost}
              onChange={(e) => handleInputChange(e, "ServiceCost")}
              className="form-control"
              placeholder="e.g., 150"
            />
          </div>
        </div>

        <div className="row">
          {/* Description of Issue */}
          <div className="form-group col-md-6">
            <label className="form-label">Description of Issue</label>
            <Input
              type="text"
              value={editedRecord.DescriptionOfIssue}
              onChange={(e) => handleInputChange(e, "DescriptionOfIssue")}
              className="form-control"
              placeholder="e.g., Engine not starting"
            />
          </div>

          {/* Diagnosis */}
          <div className="form-group col-md-6">
            <label className="form-label">Diagnosis</label>
            <Input
              type="text"
              value={editedRecord.Diagnosis}
              onChange={(e) => handleInputChange(e, "Diagnosis")}
              className="form-control"
              placeholder="e.g., Faulty starter motor"
            />
          </div>
        </div>

        <div className="row">
          {/* Service/Repair Details */}
          <div className="form-group col-md-6">
            <label className="form-label">Service / Repair Details</label>
            <textarea
              value={editedRecord.ServiceDetails}
              onChange={(e) => handleInputChange(e, "ServiceDetails")}
              className="form-control"
              placeholder="e.g., Replaced starter motor"
            />
          </div>

          {/* Parts Used */}
          <div className="form-group col-md-6">
            <label className="form-label">Parts Used</label>
            <textarea
              value={editedRecord.PartsUsed}
              onChange={(e) => handleInputChange(e, "PartsUsed")}
              className="form-control"
              placeholder="e.g., Starter Motor"
            />
          </div>
        </div>

        <div className="row">
          {/* Warranty Info */}
          <div className="form-group col-md-6">
            <label className="form-label">Warranty Information</label>
            <Input
              type="text"
              value={editedRecord.WarrantyInfo}
              onChange={(e) => handleInputChange(e, "WarrantyInfo")}
              className="form-control"
              placeholder="e.g., 1-year warranty"
            />
          </div>

          {/* Next Service Date */}
          <div className="form-group col-md-6">
            <label className="form-label">Next Service Date</label>
            <DatePicker
              selected={editedRecord.NextServiceDate ? new Date(editedRecord.NextServiceDate) : null}
              onChange={(date) => handleDateChange(date as Date, "NextServiceDate")}
              className="form-control"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>

        {/* Recommended Services */}
        <div className="form-group">
          <label className="form-label">Recommended Services</label>
          <textarea
            value={editedRecord.RecommendedServices}
            onChange={(e) => handleInputChange(e, "RecommendedServices")}
            className="form-control"
            placeholder="e.g., Air filter replacement"
          />
        </div>

        {editedRecord.InvoiceImageURL && (
          <div className="form-group mt-3">
            <label className="form-label">Invoice File</label>
            <div className="alert alert-info p-2">
              <a 
                href={editedRecord.InvoiceImageURL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                View Current Invoice
              </a>
            </div>
          </div>)}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditServiceRecordModal;