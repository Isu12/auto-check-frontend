import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Table, Alert, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchModificationRequestById } from "../../ModificationRequest/ModificationControl/ModificationRequest";
// import axios from "axios";

interface ViewModificationRequestModalProps {
  recordId: string;
  onClose: () => void;
}

const ViewModificationRequestModal = ({ recordId, onClose }: ViewModificationRequestModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const [modificationRequest, setModificationRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const getModificationRequest = async () => {
      if (!recordId) return;
      setLoading(true);
      try {
        const data = await fetchModificationRequestById(recordId);
        setModificationRequest(data);
        handleShow();
      } catch (error) {
        toast.error("Error fetching service record.");
      } finally {
        setLoading(false);
      }
    };

    getModificationRequest();
  }, [recordId]);

  return (
    <>
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>🔧 Modification Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {loading ? (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Fetching modification request...</p>
            </div>
          ) : modificationRequest ? (
            <div className="border rounded p-3 bg-light shadow-sm">

              <Table striped bordered hover responsive className="mt-3">
                <tbody>
                  <tr>
                    <td><strong>🚙 Vehicle ID:</strong></td>
                    <td>{modificationRequest.vehicleId}</td>
                  </tr>
                  <tr>
                    <td><strong>👤 Owner ID:</strong></td>
                    <td>{modificationRequest.ownerId}</td>
                  </tr>
                  <tr>
                    <td><strong>🛠 Modification Type:</strong></td>
                    <td>{modificationRequest.modificationType}</td>
                  </tr>
                  <tr>
                    <td><strong>💬 Description:</strong></td>
                    <td>{modificationRequest.description}</td>
                  </tr>
                  <tr>
                    <td><strong>📝 Proposed Changes:</strong></td>
                    <td>{modificationRequest.proposedChanges}</td>
                  </tr>
                  <tr>
                    <td><strong>📊 Status:</strong></td>
                    <td>{modificationRequest.status}</td>
                  </tr>
                </tbody>
              </Table>
              {modificationRequest.images && (
              <div className="mt-4">
                <h5 className="mb-3">📸 Image</h5>
                <div className="d-flex justify-content-center">
                  <img
                    src={modificationRequest.images}
                    alt="Preview"
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
                    href={modificationRequest.images}
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
            <Alert variant="warning">⚠ No modification request found.</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewModificationRequestModal;