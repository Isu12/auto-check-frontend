import React, { useState, useEffect } from "react";
import { Button } from "../../auth/ui/button";
import { Input } from "../../auth/ui/input";
import { InsuranceClaimInterface } from "../types/insurance-claim.interface";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateInsuranceClaimRecord } from "../Services/insurance-claim.servie";
import { useAuthToken } from "@/app/auth/hooks/accessHook";
interface EditInsuranceClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: InsuranceClaimInterface | null;
  onSave: (updatedRecord: InsuranceClaimInterface) => void;
}

const EditInsuranceClaimModal: React.FC<EditInsuranceClaimModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave,
}) => {
  const [editedRecord, setEditedRecord] = useState<InsuranceClaimInterface | null>(null);
  const accessToken = useAuthToken();

  useEffect(() => {
    if (isOpen && record) {
      setEditedRecord(record);
    }
  }, [isOpen, record]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    field: keyof InsuranceClaimInterface
  ) => {
    if (editedRecord) {
      setEditedRecord({
        ...editedRecord,
        [field]: e.target.value,
      });
    }
  };

  const handleDateChange = (date: Date | null, field: "ClaimDate") => {
    if (editedRecord && date) {
      setEditedRecord({
        ...editedRecord,
        [field]: date,
      });
    }
  };

  const handleAmountChange = (value: string, field: "ClaimAmountRequested" | "ClaimAmountApproved") => {
    if (editedRecord) {
      setEditedRecord({
        ...editedRecord,
        [field]: parseFloat(value) || 0,
      });
    }
  };

  const handleSave = async () => {
    if (!accessToken) return;
    if (editedRecord && editedRecord._id) {
      try {
        const updatedValues = {
          InsuranceID: editedRecord.InsuranceID,
          ClaimDate: editedRecord.ClaimDate,
          ClaimType: editedRecord.ClaimType,
          ClaimAmountRequested: editedRecord.ClaimAmountRequested,
          ClaimAmountApproved: editedRecord.ClaimAmountApproved,
          DamageDescription: editedRecord.DamageDescription,
          DamageImageURL1: editedRecord.DamageImageURL1,
          DamageImageURL2: editedRecord.DamageImageURL2,
          DamageImageURL3: editedRecord.DamageImageURL3,
          DamageImageURL4: editedRecord.DamageImageURL4,
          DamageImageURL5: editedRecord.DamageImageURL5,
        };

        await updateInsuranceClaimRecord(editedRecord, updatedValues, accessToken);
        onSave(editedRecord);
        onClose();
      } catch (error) {
        console.error("Error saving insurance claim record:", error);
      }
    }
  };

  if (!isOpen || !editedRecord) return null;

  return (
    <Modal show={isOpen} onHide={onClose} size="lg">
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Edit Insurance Claim Record</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="form-group col-md-6">
            <label className="form-label">Insurance ID</label>
            <Input
              type="text"
              value={editedRecord.InsuranceID || ''}
              onChange={(e) => handleInputChange(e, "InsuranceID")}
              className="form-control"
              placeholder="CL-2023-001"
            />
          </div>

          <div className="form-group col-md-6">
            <label className="form-label">Claim Type</label>
            <select
              value={editedRecord.ClaimType || ''}
              onChange={(e) => handleInputChange(e, "ClaimType")}
              className="form-control"
            >
              <option value="">Select claim type</option>
              <option value="Accident">Accident</option>
              <option value="Theft">Theft</option>
              <option value="Natural Disaster">Natural Disaster</option>
              <option value="Vandalism">Vandalism</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-6">
            <label className="form-label">Claim Date</label>
            <DatePicker
              selected={editedRecord.ClaimDate ? new Date(editedRecord.ClaimDate) : null}
              onChange={(date) => handleDateChange(date, "ClaimDate")}
              className="form-control"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-6">
            <label className="form-label">Amount Requested (LKR)</label>
            <Input
              type="number"
              value={editedRecord.ClaimAmountRequested || 0}
              onChange={(e) => handleAmountChange(e.target.value, "ClaimAmountRequested")}
              className="form-control"
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group col-md-6">
            <label className="form-label">Amount Approved (LKR)</label>
            <Input
              type="number"
              value={editedRecord.ClaimAmountApproved || 0}
              onChange={(e) => handleAmountChange(e.target.value, "ClaimAmountApproved")}
              className="form-control"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Damage Description</label>
          <textarea
            value={editedRecord.DamageDescription || ''}
            onChange={(e) => handleInputChange(e, "DamageDescription")}
            className="form-control"
            rows={3}
            placeholder="Describe the damage in detail..."
          />
        </div>

        <div className="form-group mt-3">
          <label className="form-label">Damage Images</label>
          <div className="row">
            {[1, 2, 3, 4, 5].map((index) => {
              const fieldName = `DamageImageURL${index}` as keyof InsuranceClaimInterface;
              const imageUrl = editedRecord[fieldName];
              return imageUrl ? (
                <div key={index} className="col-md-4 mb-3">
                  <div className="card">
                    <img 
                      src={imageUrl as string} 
                      alt={`Damage ${index}`} 
                      className="card-img-top"
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                    <div className="card-body p-2">
                      <a 
                        href={imageUrl as string} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary w-100"
                      >
                        View Full Image
                      </a>
                    </div>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditInsuranceClaimModal;