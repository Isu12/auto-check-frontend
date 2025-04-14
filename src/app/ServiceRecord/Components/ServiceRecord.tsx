import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Table, Alert, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchServiceRecordById } from "../../ServiceRecord/Services/ServiceRecord.service";
import { useAuthToken } from "@/app/auth/hooks/accessHook";
interface ViewServiceRecordModalProps {
  recordId: string;
  onClose: () => void;
}

const ViewServiceRecordModal = ({ recordId, onClose }: ViewServiceRecordModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const [serviceRecord, setServiceRecord] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const accessToken = useAuthToken();

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const getServiceRecord = async () => {
      if (!recordId) return;
      if (!accessToken) return;

      setLoading(true);
      try {
        const data = await fetchServiceRecordById(recordId, accessToken);
        setServiceRecord(data);
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
    <Modal show={showModal} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>🔧 Service Record Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Fetching service record...</p>
          </div>
        ) : serviceRecord ? (
          <div className="border rounded p-3 bg-light shadow-sm">
            <h5 className="text-primary">🚗 Odometer Reading: {serviceRecord.OdometerReading} km</h5>

            <Table striped bordered hover responsive className="mt-3">
              <tbody>
                <tr>
                  <td><strong>📅 Date of Service:</strong></td>
                  <td>{new Date(serviceRecord.DateOfService).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td><strong>🛠 Service Type:</strong></td>
                  <td>{serviceRecord.ServiceType}</td>
                </tr>
                <tr>
                  <td><strong>⚠️ Issue Description:</strong></td>
                  <td>{serviceRecord.DescriptionOfIssue}</td>
                </tr>
                <tr>
                  <td><strong>🔍 Diagnosis:</strong></td>
                  <td>{serviceRecord.Diagnosis}</td>
                </tr>
                <tr>
                  <td><strong>📝 Service Details:</strong></td>
                  <td>{serviceRecord.ServiceDetails}</td>
                </tr>
                <tr>
                  <td><strong>🔧 Parts Used:</strong></td>
                  <td>{serviceRecord.PartsUsed}</td>
                </tr>
                <tr>
                  <td><strong>💰 Service Cost:</strong></td>
                  <td>Rs. {serviceRecord.ServiceCost}</td>
                </tr>
                <tr>
                  <td><strong>🛡 Warranty Info:</strong></td>
                  <td>{serviceRecord.WarrantyInfo}</td>
                </tr>
                <tr>
                  <td><strong>📆 Next Service Date:</strong></td>
                  <td>{new Date(serviceRecord.NextServiceDate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td><strong>✅ Recommended Services:</strong></td>
                  <td>{serviceRecord.RecommendedServices}</td>
                </tr>
              </tbody>
            </Table>

            {serviceRecord.InvoiceImageURL && (
              <div className="mt-4">
                <h5 className="mb-3">📄 Invoice Image</h5>
                <div className="d-flex justify-content-center">
                  <img
                    src={serviceRecord.InvoiceImageURL}
                    alt="Invoice Preview"
                    style={{
                      maxHeight: '400px',
                      maxWidth: '100%',
                      borderRadius: '0.25rem',
                      border: '1px solid #dee2e6',
                      padding: '0.5rem',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
                <div className="text-center mt-2">
                  <Button
                    variant="link"
                    href={serviceRecord.InvoiceImageURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline"
                  >
                    View Full Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Alert variant="warning">⚠️ No service record found.</Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewServiceRecordModal;