import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EchoTestInterface } from "../types/echo-test.interface";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateEchoTestRecord } from "../services/EchoTest.service";

interface EditEchoTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: EchoTestInterface | null;
  onSave: (updatedRecord: EchoTestInterface) => void;
}

const EditEchoTestModal: React.FC<EditEchoTestModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave,
}) => {
  const [editedRecord, setEditedRecord] = useState<EchoTestInterface | null>(null);

  useEffect(() => {
    if (isOpen && record) {
      setEditedRecord(record);
    }
  }, [isOpen, record]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof EchoTestInterface
  ) => {
    if (editedRecord) {
      setEditedRecord({
        ...editedRecord,
        [field]: e.target.value,
      });
    }
  };

  const handleDateChange = (date: Date | null, field: "IssuedDate" | "ExpiryDate") => {
    if (editedRecord && date) {
      setEditedRecord({
        ...editedRecord,
        [field]: date,
      });
    }
  };

  const handleSave = async () => {
    if (editedRecord && editedRecord._id) {
      try {
        const updatedValues = {
          TestID: editedRecord.TestID ? Number(editedRecord.TestID) : undefined,
          IssuedDate: editedRecord.IssuedDate,
          ExpiryDate: editedRecord.ExpiryDate,
          TestingCenterName: editedRecord.TestingCenterName,
          TestingCenterBranch: editedRecord.TestingCenterBranch,
        };

        const filteredValues = Object.fromEntries(
          Object.entries(updatedValues).filter(([_, v]) => v !== undefined)
        );

        await updateEchoTestRecord(editedRecord, filteredValues);
        onSave(editedRecord);
        onClose();
      } catch (error) {
        console.error("Error saving echo test record:", error);
      }
    }
  };

  if (!isOpen || !editedRecord) return null;

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Edit Echo Test Record</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="form-group col-md-6">
            <label className="form-label">Test ID</label>
            <Input
              type="number"
              value={editedRecord.TestID || ''}
              onChange={(e) => handleInputChange(e, "TestID")}
              className="form-control"
            />
          </div>

          <div className="form-group col-md-6">
            <label className="form-label">Issued Date</label>
            <DatePicker
              selected={editedRecord.IssuedDate ? new Date(editedRecord.IssuedDate) : null}
              onChange={(date) => handleDateChange(date, "IssuedDate")}
              className="form-control"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-6">
            <label className="form-label">Expiry Date</label>
            <DatePicker
              selected={editedRecord.ExpiryDate ? new Date(editedRecord.ExpiryDate) : null}
              onChange={(date) => handleDateChange(date, "ExpiryDate")}
              className="form-control"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div className="form-group col-md-6">
            <label className="form-label">Testing Center Name</label>
            <Input
              type="text"
              value={editedRecord.TestingCenterName || ''}
              onChange={(e) => handleInputChange(e, "TestingCenterName")}
              className="form-control"
              placeholder="e.g., National Testing Center"
            />
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-6">
            <label className="form-label">Testing Center Branch</label>
            <Input
              type="text"
              value={editedRecord.TestingCenterBranch || ''}
              onChange={(e) => handleInputChange(e, "TestingCenterBranch")}
              className="form-control"
              placeholder="e.g., Downtown Branch"
            />
          </div>
        </div>

        {editedRecord.CertificateFileURL && (
          <div className="form-group mt-3">
            <label className="form-label">Certificate File</label>
            <div className="alert alert-info p-2">
              <a 
                href={editedRecord.CertificateFileURL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                View Current Certificate
              </a>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditEchoTestModal;