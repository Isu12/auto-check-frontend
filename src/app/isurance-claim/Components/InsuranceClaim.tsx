import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Table, Alert, Image, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchInsuranceClaimRecordById } from "../Services/insurance-claim.servie";
import { InsuranceClaimInterface } from "../types/insurance-claim.interface";
import { VehicleInterface } from "../../dashboard/types/vehicle.interface";
import { useAuthToken } from "@/app/auth/hooks/accessHook";

interface ViewInsuranceClaimModalProps {
  recordId: string;
  onClose: () => void;
}

const ViewInsuranceClaimModal = ({ recordId, onClose }: ViewInsuranceClaimModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const [insuranceClaim, setInsuranceClaim] = useState<InsuranceClaimInterface | null>(null);
  const [vehicleDetails, setVehicleDetails] = useState<VehicleInterface | null>(null);
  const [loading, setLoading] = useState(false);
  const accessToken = useAuthToken();

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const getInsuranceClaim = async () => {
      if (!accessToken || !recordId) return;
      
      setLoading(true);
      try {
        const data = await fetchInsuranceClaimRecordById(recordId, accessToken);
        setInsuranceClaim(data);
        
        // Check if vehicle data is populated
        if (data.vehicle && typeof data.vehicle === 'object') {
          setVehicleDetails(data.vehicle as VehicleInterface);
        }
        
        handleShow();
      } catch (error) {
        toast.error("Error fetching insurance claim.");
      } finally {
        setLoading(false);
      }
    };

    getInsuranceClaim();
  }, [recordId, accessToken]);

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

  const renderVehicleDetails = () => {
    if (!vehicleDetails) return null;

    return (
      <Card className="mt-4">
        <Card.Header className="bg-secondary text-white">
          <h5>Vehicle Details</h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <tbody>
              <tr>
                <td><strong>Registration No:</strong></td>
                <td>{vehicleDetails.Registration_no || 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Chassis No:</strong></td>
                <td>{vehicleDetails.Chasisis_No || 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Owner:</strong></td>
                <td>{vehicleDetails.Current_Owner || 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Address:</strong></td>
                <td>{vehicleDetails.Address || 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>NIC:</strong></td>
                <td>{vehicleDetails.NIC || 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Make:</strong></td>
                <td>{vehicleDetails.Make || 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Model:</strong></td>
                <td>{vehicleDetails.Model || 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Color:</strong></td>
                <td>{vehicleDetails.Colour || 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Year of Manufacture:</strong></td>
                <td>{vehicleDetails.Year_of_Manufacture || 'N/A'}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Modal show={showModal} onHide={handleClose} size="lg" centered scrollable>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Insurance Claim Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Fetching insurance claim details...</p>
          </div>
        ) : insuranceClaim ? (
          <>
            <div className="border rounded p-3 bg-light shadow-sm">
              <h5 className="text-primary">Claim ID: {insuranceClaim.InsuranceID || 'N/A'}</h5>

              <Table striped bordered hover responsive className="mt-3">
                <tbody>
                  <tr>
                    <td><strong>Claim Date:</strong></td>
                    <td>{formatDate(insuranceClaim.ClaimDate)}</td>
                  </tr>
                  <tr>
                    <td><strong>Claim Type:</strong></td>
                    <td>{insuranceClaim.ClaimType || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Amount Requested:</strong></td>
                    <td>{formatCurrency(insuranceClaim.ClaimAmountRequested)}</td>
                  </tr>
                  <tr>
                    <td><strong> Amount Approved:</strong></td>
                    <td>{formatCurrency(insuranceClaim.ClaimAmountApproved)}</td>
                  </tr>
                  <tr>
                    <td><strong>Damage Description:</strong></td>
                    <td>{insuranceClaim.DamageDescription || 'N/A'}</td>
                  </tr>
                </tbody>
              </Table>

              {renderDamageImages()}
            </div>

            {renderVehicleDetails()}
          </>
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