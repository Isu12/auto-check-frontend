"use client";

// EditModal.tsx
import React, { useState, useEffect } from "react";
import { Button } from "../../../Components/ui/button";
import { Input } from "../../../Components/ui/input";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { StationInfoInterface } from "./Types/ServiceStation.Interface";

const businessTypes = [
  "Service Station",
  "Vehicle Repair Center",
  "Auto Electrical Service",
  "Tire Service Center",
  "Car Wash",
  "Other"
];

interface EditServiceStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: StationInfoInterface | null;
  onSave: (updatedStation: StationInfoInterface) => void;
}

const EditModal: React.FC<EditServiceStationModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave,
}) => {
  const [editedStation, setEditedStation] = useState<StationInfoInterface | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEditedStation(record ? { ...record } : null);
    }
  }, [isOpen, record]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    field: keyof StationInfoInterface
  ) => {
    if (editedStation) {
      setEditedStation((prev) => ({
        ...prev!,
        [field]: e.target.value || "",
      }));
    }
  };

  const handleSave = async () => {
    if (editedStation) {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/stations/${editedStation._id}`,
          editedStation
        );
        const updatedStation = response.data;
        onSave(updatedStation);
        onClose();
      } catch (error) {
        console.error("Error saving service record:", error);
      }
    }
  };

  if (!isOpen || !editedStation) return null;

  return (
    <Modal show={isOpen} onHide={onClose} size="lg">
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Edit Business Record</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          {/* Business Registration No. */}
          <div className="form-group col-md-6">
            <label className="form-label">Business Registration No.</label>
            <Input
              type="text"
              value={editedStation.businessRegNo}
              onChange={(e) => handleInputChange(e, "businessRegNo")}
              className="form-control"
            />
          </div>

          {/* Business Name */}
          <div className="form-group col-md-6">
            <label className="form-label">Business Name</label>
            <Input
              type="text"
              value={editedStation.businessName}
              onChange={(e) => handleInputChange(e, "businessName")}
              className="form-control"
            />
          </div>

          {/* Business Type */}
          <div className="form-group col-md-6">
            <label className="form-label">Business Type</label>
            <select
              value={editedStation.businessType}
              onChange={(e) => handleInputChange(e, "businessType")}
              className="form-control"
            >
              <option value="">Select Business Type</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Branch */}
          <div className="form-group col-md-6">
            <label className="form-label">Branch (Optional)</label>
            <Input
              type="text"
              value={editedStation.branch || ""}
              onChange={(e) => handleInputChange(e, "branch")}
              className="form-control"
            />
          </div>

          {/* Address */}
          <div className="form-group col-12">
            <label className="form-label">Address</label>
            <Input
              type="text"
              value={editedStation.address}
              onChange={(e) => handleInputChange(e, "address")}
              className="form-control"
            />
          </div>

          {/* City */}
          <div className="form-group col-md-4">
            <label className="form-label">City</label>
            <Input
              type="text"
              value={editedStation.city}
              onChange={(e) => handleInputChange(e, "city")}
              className="form-control"
            />
          </div>

          {/* Postal Code */}
          <div className="form-group col-md-4">
            <label className="form-label">Postal Code</label>
            <Input
              type="text"
              value={editedStation.postalCode}
              onChange={(e) => handleInputChange(e, "postalCode")}
              className="form-control"
            />
          </div>

          {/* Email */}
          <div className="form-group col-md-4">
            <label className="form-label">Email</label>
            <Input
              type="email"
              value={editedStation.email}
              onChange={(e) => handleInputChange(e, "email")}
              className="form-control"
            />
          </div>

          {/* Primary Phone Number */}
          <div className="form-group col-md-6">
            <label className="form-label">Primary Phone Number</label>
            <Input
              type="text"
              value={editedStation.phoneNumber1}
              onChange={(e) => handleInputChange(e, "phoneNumber1")}
              className="form-control"
            />
          </div>

          {/* Secondary Phone Number (Optional) */}
          <div className="form-group col-md-6">
            <label className="form-label">Secondary Phone Number (Optional)</label>
            <Input
              type="text"
              value={editedStation.phoneNumber2 || ""}
              onChange={(e) => handleInputChange(e, "phoneNumber2")}
              className="form-control"
            />
          </div>

          {/* Owner Name */}
          <div className="form-group col-md-6">
            <label className="form-label">Owner Name</label>
            <Input
              type="text"
              value={editedStation.ownerName}
              onChange={(e) => handleInputChange(e, "ownerName")}
              className="form-control"
            />
          </div>

          {/* Contact Number */}
          <div className="form-group col-md-6">
            <label className="form-label">Contact Number</label>
            <Input
              type="text"
              value={editedStation.contactNumber}
              onChange={(e) => handleInputChange(e, "contactNumber")}
              className="form-control"
            />
          </div>

          {/* Secondary Email (Optional) */}
          <div className="form-group col-md-6">
            <label className="form-label">Secondary Email (Optional)</label>
            <Input
              type="email"
              value={editedStation.email2 || ""}
              onChange={(e) => handleInputChange(e, "email2")}
              className="form-control"
            />
          </div>

          {/* Website URL (Optional) */}
          <div className="form-group col-md-6">
            <label className="form-label">Website URL (Optional)</label>
            <Input
              type="url"
              value={editedStation.webUrl || ""}
              onChange={(e) => handleInputChange(e, "webUrl")}
              className="form-control"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;