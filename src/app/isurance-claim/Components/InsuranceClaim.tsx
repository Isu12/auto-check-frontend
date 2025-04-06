import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Table, Alert, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchInsuranceClaimRecordById } from "../Services/insurance-claim.servie";
import { InsuranceClaimInterface } from "../types/insurance-claim.interface";

interface ViewInsuranceClaimModalProps {
  recordId: string;
  onClose: () => void;
}

const ViewInsuranceClaimModal = ({ recordId, onClose }: ViewInsuranceClaimModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const [insuranceClaim, setInsuranceClaim] = useState<InsuranceClaimInterface | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const getInsuranceClaim = async () => {
      if (!recordId) return;
      setLoading(true);
      try {
        const data = await fetchInsuranceClaimRecordById(recordId);
        setInsuranceClaim(data);
        handleShow();
      } catch (error) {
        toast.error("Error fetching insurance claim.");
      } finally {
        setLoading(false);
      }
    };

    getInsuranceClaim();
  }, [recordId]);

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount: number | undefined): string => {
    if (amount === undefined) return 'N/A';
    return `LKR ${amount.toFixed(2)}`;
  };

  const renderDamageImages = () => {
    if (!insuranceClaim) return null;
    
    const images = [
      insuranceClaim.DamageImageURL1,
      insuranceClaim.DamageImageURL2,
      insuranceClaim.DamageImageURL3,
      insuranceClaim.DamageImageURL4,
      insuranceClaim.DamageImageURL5
    ].filter(url => url);

    if (images.length === 0) return <p>No damage images available</p>;

    return (
      <div className="mt-4">
        <h5 className="mb-3">🖼️ Damage Images</h5>
        <div className="d-flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div key={index} className="position-relative">
              <Image
                src={url}
                alt={`Damage ${index + 1}`}
                thumbnail
                style={{
                  height: '150px',
                  width: 'auto',
                  cursor: 'pointer'
                }}
                onClick={() => window.open(url, '_blank')}
              />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Modal show={showModal} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>🏥 Insurance Claim Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Fetching insurance claim details...</p>
          </div>
        ) : insuranceClaim ? (
          <div className="border rounded p-3 bg-light shadow-sm">
            <h5 className="text-primary">📋 Claim ID: {insuranceClaim.InsuranceID || 'N/A'}</h5>

            <Table striped bordered hover responsive className="mt-3">
              <tbody>
                <tr>
                  <td><strong>📅 Claim Date:</strong></td>
                  <td>{formatDate(insuranceClaim.ClaimDate)}</td>
                </tr>
                <tr>
                  <td><strong>🔖 Claim Type:</strong></td>
                  <td>{insuranceClaim.ClaimType || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>💵 Amount Requested:</strong></td>
                  <td>{formatCurrency(insuranceClaim.ClaimAmountRequested)}</td>
                </tr>
                <tr>
                  <td><strong>✅ Amount Approved:</strong></td>
                  <td>{formatCurrency(insuranceClaim.ClaimAmountApproved)}</td>
                </tr>
                <tr>
                  <td><strong>📝 Damage Description:</strong></td>
                  <td>{insuranceClaim.DamageDescription || 'N/A'}</td>
                </tr>
              </tbody>
            </Table>

            {renderDamageImages()}
          </div>
        ) : (
          <Alert variant="warning">⚠️ No insurance claim found.</Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewInsuranceClaimModal;