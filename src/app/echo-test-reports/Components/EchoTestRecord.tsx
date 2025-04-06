import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Table, Alert, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchEchoTestRecordById } from "../services/EchoTest.service";

interface ViewEchoTestRecordModalProps {
  recordId: string;
  onClose: () => void;
}

const ViewEchoTestRecordModal = ({ recordId, onClose }: ViewEchoTestRecordModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const [echoTestRecord, setEchoTestRecord] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const getEchoTestRecord = async () => {
      if (!recordId) return;
      setLoading(true);
      try {
        const data = await fetchEchoTestRecordById(recordId);
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
            <h5 className="text-primary">🆔 Test ID: {echoTestRecord.TestID}</h5>

            <Table striped bordered hover responsive className="mt-3">
              <tbody>
                <tr>
                  <td><strong>📅 Issued Date:</strong></td>
                  <td>{echoTestRecord.IssuedDate ? new Date(echoTestRecord.IssuedDate).toLocaleDateString() : 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>⏳ Expiry Date:</strong></td>
                  <td>{echoTestRecord.ExpiryDate ? new Date(echoTestRecord.ExpiryDate).toLocaleDateString() : 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>🏥 Testing Center:</strong></td>
                  <td>{echoTestRecord.TestingCenterName || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>🏢 Branch:</strong></td>
                  <td>{echoTestRecord.TestingCenterBranch || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>📝 Description:</strong></td>
                  <td>{echoTestRecord.DescriptionOfIssue || 'N/A'}</td>
                </tr>
              </tbody>
            </Table>

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