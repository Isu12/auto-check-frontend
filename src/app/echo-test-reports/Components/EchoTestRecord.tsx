import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Table, Alert, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchEchoTestRecordById } from "../services/EchoTest.service";
import { useAuthToken } from "@/app/auth/hooks/accessHook";

interface ViewEchoTestRecordModalProps {
  recordId: string;
  onClose: () => void;
}

const ViewEchoTestRecordModal = ({ recordId, onClose }: ViewEchoTestRecordModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const [echoTestRecord, setEchoTestRecord] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const accessToken = useAuthToken();
  

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const getEchoTestRecord = async () => {
      if (!accessToken) return;
      if (!recordId) return;
      setLoading(true);
      try {
        const data = await fetchEchoTestRecordById(recordId,accessToken);
        setEchoTestRecord(data);
        handleShow();
      } catch (error) {
        toast.error("Error fetching echo test record.");
      } finally {
        setLoading(false);
      }
    };

    getEchoTestRecord();
  }, [recordId]);

  return (
    <Modal show={showModal} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>🩺 Echo Test Report Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Fetching echo test report...</p>
          </div>
        ) : echoTestRecord ? (
          <div className="border rounded p-3 bg-light shadow-sm">
            <div className="row">
              <div className="col-md-6">
                <h5 className="text-primary mb-3">🚗 Vehicle Details</h5>
                <Table striped bordered hover size="sm">
                  <tbody>
                    <tr>
                      <td><strong>Registration No:</strong></td>
                      <td>{echoTestRecord.vehicle?.Registration_no || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Chassis No:</strong></td>
                      <td>{echoTestRecord.vehicle?.Chasisis_No || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Make/Model:</strong></td>
                      <td>
                        {echoTestRecord.vehicle?.Make || 'N/A'} / 
                        {echoTestRecord.vehicle?.Model || 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Year:</strong></td>
                      <td>{echoTestRecord.vehicle?.Year_of_Manufacture || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Owner:</strong></td>
                      <td>{echoTestRecord.vehicle?.Current_Owner || 'N/A'}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              
              <div className="col-md-6">
                <h5 className="text-primary mb-3">🩺 Test Details</h5>
                <Table striped bordered hover size="sm">
                  <tbody>
                    <tr>
                      <td><strong>Test ID:</strong></td>
                      <td>{echoTestRecord.TestID || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Issued Date:</strong></td>
                      <td>{echoTestRecord.IssuedDate ? new Date(echoTestRecord.IssuedDate).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Expiry Date:</strong></td>
                      <td>{echoTestRecord.ExpiryDate ? new Date(echoTestRecord.ExpiryDate).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Testing Center:</strong></td>
                      <td>{echoTestRecord.TestingCenterName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Branch:</strong></td>
                      <td>{echoTestRecord.TestingCenterBranch || 'N/A'}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>

            {/* Additional details and certificate display */}
            <div className="mt-4">
              <h5 className="text-primary">📝 Additional Information</h5>
              <p>{echoTestRecord.DescriptionOfIssue || 'No additional information provided.'}</p>
            </div>

            {echoTestRecord.CertificateFileURL && (
              <div className="mt-4">
                <h5 className="mb-3">📄 Test Certificate</h5>
                <div className="d-flex justify-content-center">
                  <Image
                    src={echoTestRecord.CertificateFileURL}
                    alt="Test Certificate Preview"
                    thumbnail
                    style={{
                      maxHeight: '400px',
                      maxWidth: '100%',
                    }}
                  />
                </div>
                <div className="text-center mt-2">
                  <Button
                    variant="link"
                    href={echoTestRecord.CertificateFileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    View Full Certificate
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Alert variant="warning">⚠️ No echo test record found.</Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewEchoTestRecordModal;