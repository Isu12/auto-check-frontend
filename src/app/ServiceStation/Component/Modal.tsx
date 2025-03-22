import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Table, Alert } from "react-bootstrap";
import { toast } from "react-toastify";

interface ViewServiceRecordModalProps {
  recordId: string;
}

const ViewServiceRecordModal= ({ recordId, onClose }: { recordId: string, onClose: () => void }) => {  
  const [showModal, setShowModal] = useState(false);
  const [serviceRecord, setServiceRecord] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const getServiceRecord = async () => {
      if (!recordId) return;
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5555/api/stations/${recordId}`);
        setServiceRecord(response.data);
        handleShow();
      } catch (error) {
        toast.error("Error fetching service record.");
      } finally {
        setLoading(false);
      }
    };
  
    getServiceRecord();
  }, [recordId]);

  return (
    <>
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>🔧 Service Record Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {loading ? (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Fetching business information...</p>
            </div>
          ) : serviceRecord ? (
            <div className="border rounded p-3 bg-light shadow-sm">
              <h5 className="text-primary">🔧 Business Information</h5>

              <Table striped bordered hover responsive className="mt-3">
                <tbody>
                  <tr>
                    <td><strong>🏢 Business Registration No:</strong></td>
                    <td>{serviceRecord.businessRegNo}</td>
                  </tr>
                  <tr>
                    <td><strong>🏢 Business Name:</strong></td>
                    <td>{serviceRecord.businessName}</td>
                  </tr>
                  <tr>
                    <td><strong>🏢 Branch:</strong></td>
                    <td>{serviceRecord.branch}</td>
                  </tr>
                  <tr>
                    <td><strong>🏠 Address:</strong></td>
                    <td>{serviceRecord.address}</td>
                  </tr>
                  <tr>
                    <td><strong>🏙 City:</strong></td>
                    <td>{serviceRecord.city}</td>
                  </tr>
                  <tr>
                    <td><strong>📍 Postal Code:</strong></td>
                    <td>{serviceRecord.postalCode}</td>
                  </tr>
                  <tr>
                    <td><strong>📧 Email:</strong></td>
                    <td>{serviceRecord.email}</td>
                  </tr>
                  <tr>
                    <td><strong>📞 Phone Number 1:</strong></td>
                    <td>{serviceRecord.phoneNumber1}</td>
                  </tr>
                  <tr>
                    <td><strong>📞 Phone Number 2:</strong></td>
                    <td>{serviceRecord.phoneNumber2}</td>
                  </tr>
                  <tr>
                    <td><strong>👤 Owner Name:</strong></td>
                    <td>{serviceRecord.ownerName}</td>
                  </tr>
                  <tr>
                    <td><strong>📞 Contact Number:</strong></td>
                    <td>{serviceRecord.contactNumber}</td>
                  </tr>
                  <tr>
                    <td><strong>📧 Email 2:</strong></td>
                    <td>{serviceRecord.email2}</td>
                  </tr>
                  <tr>
                    <td><strong>🌐 Web URL:</strong></td>
                    <td>{serviceRecord.webUrl}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          ) : (
            <Alert variant="warning">⚠️ No service record found.</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewServiceRecordModal;
