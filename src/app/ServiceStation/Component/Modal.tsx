import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Table, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchServiceStationById } from "../services/api";
import { useAuthToken } from "@/app/auth/hooks/accessHook";

interface ViewServiceRecordModalProps {
  recordId: string | null;
  onClose: () => void;
}

const ViewServiceRecordModal: React.FC<ViewServiceRecordModalProps> = ({ recordId, onClose }) => {
  const [serviceRecord, setServiceRecord] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAuthToken();

  useEffect(() => {
    const fetchUserStation = async () => {
      if (!recordId || !accessToken) return;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchServiceStationById(recordId, accessToken);
        setServiceRecord(data);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUserStation();
  }, [recordId, accessToken]);

  return (
    <Modal show={!!recordId} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>🔧 Service Record Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Fetching business information...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">❌ {error}</Alert>
        ) : serviceRecord ? (
          <div className="border rounded p-3 bg-light shadow-sm">
            <h5 className="text-primary">🔧 Business Information</h5>
            <Table striped bordered hover responsive className="mt-3">
              <tbody>
                <tr><td><strong>🏢 Business Registration No:</strong></td><td>{serviceRecord.businessRegNo}</td></tr>
                <tr><td><strong>🏢 Business Type:</strong></td><td>{serviceRecord.businessType}</td></tr>
                <tr><td><strong>🏢 Business Name:</strong></td><td>{serviceRecord.businessName}</td></tr>
                <tr><td><strong>🏢 Branch:</strong></td><td>{serviceRecord.branch}</td></tr>
                <tr><td><strong>🏠 Address:</strong></td><td>{serviceRecord.address}</td></tr>
                <tr><td><strong>🏙 City:</strong></td><td>{serviceRecord.city}</td></tr>
                <tr><td><strong>📍 Postal Code:</strong></td><td>{serviceRecord.postalCode}</td></tr>
                <tr><td><strong>📧 Email:</strong></td><td>{serviceRecord.email}</td></tr>
                <tr><td><strong>📞 Phone Number 1:</strong></td><td>{serviceRecord.phoneNumber1}</td></tr>
                <tr><td><strong>📞 Phone Number 2:</strong></td><td>{serviceRecord.phoneNumber2 || "N/A"}</td></tr>
                <tr><td><strong>👤 Owner Name:</strong></td><td>{serviceRecord.ownerName}</td></tr>
                <tr><td><strong>📞 Contact Number:</strong></td><td>{serviceRecord.contactNumber}</td></tr>
                <tr><td><strong>📧 Email 2:</strong></td><td>{serviceRecord.email2 || "N/A"}</td></tr>
                <tr><td><strong>🌐 Web URL:</strong></td><td><a href={serviceRecord.webUrl} target="_blank" rel="noopener noreferrer">{serviceRecord.webUrl || "N/A"}</a></td></tr>
              </tbody>
            </Table>
          </div>
        ) : (
          <Alert variant="warning">⚠️ No service record found.</Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewServiceRecordModal;
