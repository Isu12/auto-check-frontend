import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Table, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

interface VehicleViewModalProps {
  recordId: string;
  onClose: () => void;
  show: boolean;
}

const VehicleViewModal: React.FC<VehicleViewModalProps> = ({ 
  recordId, 
  onClose,
  show
}) => {
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!recordId) return;
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5555/api/vehicle-record/${recordId}`);
        setVehicle(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch vehicle details");
        toast.error("Error fetching vehicle details");
      } finally {
        setLoading(false);
      }
    };

    if (show) {
      fetchVehicle();
    }
  }, [recordId, show]);

  if (!show) return null;

  return (
    <Modal show={show} onHide={onClose} size="xl" centered scrollable>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>
          <i className="fas fa-car me-2"></i> Vehicle Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="dark" />
            <p className="mt-3">Loading vehicle details...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : vehicle ? (
          <div>
            <div className="row mb-4">
              <div className="col-md-6">
                <h4 className="text-dark">
                  {vehicle.Make} {vehicle.Model} ({vehicle.Registration_no})
                </h4>
                <p className="text-muted">
                  <strong>Chassis No:</strong> {vehicle.Chasisis_No}
                </p>
              </div>
              <div className="col-md-6 text-end">
                <p>
                  <strong>Year:</strong> {vehicle.Year_of_Manufacture}
                </p>
                <p>
                  <strong>Color:</strong> {vehicle.Colour}
                </p>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <h5 className="text-dark mb-3">Owner Information</h5>
                <Table striped bordered>
                  <tbody>
                    <tr>
                      <td><strong>Current Owner</strong></td>
                      <td>{vehicle.Current_Owner}</td>
                    </tr>
                    <tr>
                      <td><strong>Absolute Owner</strong></td>
                      <td>{vehicle.Absolute_Owner}</td>
                    </tr>
                    <tr>
                      <td><strong>Address</strong></td>
                      <td>{vehicle.Address}</td>
                    </tr>
                    <tr>
                      <td><strong>NIC</strong></td>
                      <td>{vehicle.NIC}</td>
                    </tr>
                    <tr>
                      <td><strong>Previous Owners</strong></td>
                      <td>{vehicle.Previous_Owners || "N/A"}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              <div className="col-md-6">
                <h5 className="text-dark mb-3">Technical Details</h5>
                <Table striped bordered>
                  <tbody>
                    <tr>
                      <td><strong>Engine No</strong></td>
                      <td>{vehicle.Engine_No || "N/A"}</td>
                    </tr>
                    <tr>
                      <td><strong>Class of Vehicle</strong></td>
                      <td>{vehicle.Class_of_Vehicle}</td>
                    </tr>
                    <tr>
                      <td><strong>Fuel Type</strong></td>
                      <td>{vehicle.Fuel_Type || "N/A"}</td>
                    </tr>
                    <tr>
                      <td><strong>Cylinder Capacity</strong></td>
                      <td>{vehicle.Cylinder_Capacity || "N/A"}</td>
                    </tr>
                    <tr>
                      <td><strong>Seating Capacity</strong></td>
                      <td>{vehicle.Seating_capacity || "N/A"}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <h5 className="text-dark mb-3">Registration Details</h5>
                <Table striped bordered>
                  <tbody>
                    <tr>
                      <td><strong>Date of First Registration</strong></td>
                      <td>{vehicle.Date_of_First_Registration || "N/A"}</td>
                    </tr>
                    <tr>
                      <td><strong>Status When Registered</strong></td>
                      <td>{vehicle.Status_When_Registered || "N/A"}</td>
                    </tr>
                    <tr>
                      <td><strong>Taxation Class</strong></td>
                      <td>{vehicle.Taxation_Class || "N/A"}</td>
                    </tr>
                    <tr>
                      <td><strong>Provincial Council</strong></td>
                      <td>{vehicle.Provincial_Council || "N/A"}</td>
                    </tr>
                    <tr>
                      <td><strong>Taxes Payable</strong></td>
                      <td>{vehicle.Taxes_Payable || "N/A"}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              <div className="col-md-6">
                <h5 className="text-dark mb-3">Dimensions</h5>
                <Table striped bordered>
                  <tbody>
                    <tr>
                      <td><strong>Weight</strong></td>
                      <td>{vehicle.Weight || "N/A"}</td>
                    </tr>
                    <tr>
                      <td><strong>Length</strong></td>
                      <td>{vehicle.Length || "N/A"}</td>
                    </tr>
                    <tr>
                      <td><strong>Width</strong></td>
                      <td>{vehicle.Width || "N/A"}</td>
                    </tr>
                    <tr>
                      <td><strong>Height</strong></td>
                      <td>{vehicle.Height || "N/A"}</td>
                    </tr>
                    <tr>
                      <td><strong>Wheel Base</strong></td>
                      <td>{vehicle.Wheel_Base || "N/A"}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-dark mb-3">Additional Information</h5>
              <Table striped bordered>
                <tbody>
                  <tr>
                    <td><strong>Manufacturer's Description</strong></td>
                    <td>{vehicle.Manufactures_Description || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Conditions/Special Notes</strong></td>
                    <td>{vehicle.Conditions_Special_note || "N/A"}</td>
                  </tr>
                </tbody>
              </Table>
            </div>

            <div className="mb-4">
              <h5 className="text-dark mb-3">Vehicle Photos</h5>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <div className="card h-100">
                    <div className="card-header bg-light">
                      <strong>Front View</strong>
                    </div>
                    <div className="card-body text-center">
                      {vehicle.Front_Photo ? (
                        <Image 
                          src={vehicle.Front_Photo} 
                          thumbnail 
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <p className="text-muted">No image available</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card h-100">
                    <div className="card-header bg-light">
                      <strong>Left Side</strong>
                    </div>
                    <div className="card-body text-center">
                      {vehicle.Left_Photo ? (
                        <Image 
                          src={vehicle.Left_Photo} 
                          thumbnail 
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <p className="text-muted">No image available</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card h-100">
                    <div className="card-header bg-light">
                      <strong>Right Side</strong>
                    </div>
                    <div className="card-body text-center">
                      {vehicle.Right_Photo ? (
                        <Image 
                          src={vehicle.Right_Photo} 
                          thumbnail 
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <p className="text-muted">No image available</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card h-100">
                    <div className="card-header bg-light">
                      <strong>Rear View</strong>
                    </div>
                    <div className="card-body text-center">
                      {vehicle.Rear_Photo ? (
                        <Image 
                          src={vehicle.Rear_Photo} 
                          thumbnail 
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <p className="text-muted">No image available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-warning">No vehicle data found</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VehicleViewModal;