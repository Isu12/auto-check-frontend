import React, { useState, useEffect } from "react";
import { Modal, Button, ProgressBar, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";

interface VehicleRegistration {
  _id: string;
  Registration_no: string;
  Current_Owner: string;
  Contact_Number: string;
  status: {
    applicationSubmitted: boolean;
    documentsVerified: boolean;
    inspectionCompleted: boolean;
    taxesPaid: boolean;
    registrationCompleted: boolean;
  };
}

const IncompleteRegistrations = ({ show, onHide }: { show: boolean; onHide: () => void }) => {
  const [incompleteRegistrations, setIncompleteRegistrations] = useState<VehicleRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (show) {
      fetchIncompleteRegistrations();
    }
  }, [show]);

  const fetchIncompleteRegistrations = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5555/api/vehicle-record/incomplete");
      setIncompleteRegistrations(response.data);
    } catch (error) {
      toast.error("Failed to fetch incomplete registrations");
      console.error("Error fetching incomplete registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateRegistrationStatus = async (id: string, statusField: string) => {
    try {
      setUpdatingStatus(`${id}-${statusField}`);
      await axios.patch(`http://localhost:5555/api/vehicle-record/${id}/status`, {
        [statusField]: true
      });
      toast.success("Status updated successfully");
      fetchIncompleteRegistrations();
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      application: 0,
      documents: 0,
      inspection: 0,
      taxes: 0,
      registration: 0
    };

    incompleteRegistrations.forEach(reg => {
      if (!reg.status.applicationSubmitted) counts.application++;
      if (reg.status.applicationSubmitted && !reg.status.documentsVerified) counts.documents++;
      if (reg.status.documentsVerified && !reg.status.inspectionCompleted) counts.inspection++;
      if (reg.status.inspectionCompleted && !reg.status.taxesPaid) counts.taxes++;
      if (reg.status.taxesPaid && !reg.status.registrationCompleted) counts.registration++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  const getStatusIcon = (completed: boolean) => {
    return completed ? (
      <CheckCircle className="text-success" size={20} />
    ) : (
      <Clock className="text-warning" size={20} />
    );
  };

  const getStatusBadge = (step: string, count: number) => {
    let variant = "secondary";
    if (count > 0) variant = "primary";
    if (step === "registration" && count > 0) variant = "success";

    return (
      <Badge bg={variant} className="me-2">
        {count}
      </Badge>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" scrollable centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Incomplete Registrations</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading incomplete registrations...</p>
          </div>
        ) : (
          <>
            {/* Status Summary */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Registration Status Summary</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        {getStatusBadge("application", statusCounts.application)}
                        <span>Application Submission</span>
                      </div>
                      <ChevronRight size={20} className="text-muted" />
                      
                      <div className="d-flex align-items-center">
                        {getStatusBadge("documents", statusCounts.documents)}
                        <span>Document Verification</span>
                      </div>
                      <ChevronRight size={20} className="text-muted" />
                      
                      <div className="d-flex align-items-center">
                        {getStatusBadge("inspection", statusCounts.inspection)}
                        <span>Vehicle Inspection</span>
                      </div>
                      <ChevronRight size={20} className="text-muted" />
                      
                      <div className="d-flex align-items-center">
                        {getStatusBadge("taxes", statusCounts.taxes)}
                        <span>Tax Payment</span>
                      </div>
                      <ChevronRight size={20} className="text-muted" />
                      
                      <div className="d-flex align-items-center">
                        {getStatusBadge("registration", statusCounts.registration)}
                        <span>Registration</span>
                      </div>
                    </div>
                    
                    <ProgressBar className="mb-3">
                      <ProgressBar
                        variant="primary"
                        now={(statusCounts.application / incompleteRegistrations.length) * 100}
                        key={1}
                      />
                      <ProgressBar
                        variant="info"
                        now={(statusCounts.documents / incompleteRegistrations.length) * 100}
                        key={2}
                      />
                      <ProgressBar
                        variant="warning"
                        now={(statusCounts.inspection / incompleteRegistrations.length) * 100}
                        key={3}
                      />
                      <ProgressBar
                        variant="danger"
                        now={(statusCounts.taxes / incompleteRegistrations.length) * 100}
                        key={4}
                      />
                      <ProgressBar
                        variant="success"
                        now={(statusCounts.registration / incompleteRegistrations.length) * 100}
                        key={5}
                      />
                    </ProgressBar>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-3">
                    <div className="card border-primary mb-3">
                      <div className="card-body text-center">
                        <h5 className="card-title">Pending Submission</h5>
                        <h2 className="text-primary">{statusCounts.application}</h2>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-3">
                    <div className="card border-info mb-3">
                      <div className="card-body text-center">
                        <h5 className="card-title">Document Verification</h5>
                        <h2 className="text-info">{statusCounts.documents}</h2>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-3">
                    <div className="card border-warning mb-3">
                      <div className="card-body text-center">
                        <h5 className="card-title">Inspection Pending</h5>
                        <h2 className="text-warning">{statusCounts.inspection}</h2>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-3">
                    <div className="card border-success mb-3">
                      <div className="card-body text-center">
                        <h5 className="card-title">Ready for Completion</h5>
                        <h2 className="text-success">{statusCounts.taxes + statusCounts.registration}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Incomplete Registrations List */}
            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">Pending Registrations</h5>
              </div>
              <div className="card-body">
                {incompleteRegistrations.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No incomplete registrations found</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Reg No</th>
                          <th>Owner</th>
                          <th>Contact</th>
                          <th>Status Journey</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {incompleteRegistrations.map((registration) => (
                          <tr key={registration._id}>
                            <td>{registration.Registration_no || "N/A"}</td>
                            <td>{registration.Current_Owner}</td>
                            <td>{registration.Contact_Number || "N/A"}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="me-2">
                                  <Button
                                    variant={registration.status.applicationSubmitted ? "success" : "outline-primary"}
                                    size="sm"
                                    onClick={() => !registration.status.applicationSubmitted && 
                                      updateRegistrationStatus(registration._id, "applicationSubmitted")}
                                    disabled={registration.status.applicationSubmitted || 
                                      updatingStatus === `${registration._id}-applicationSubmitted`}
                                  >
                                    {updatingStatus === `${registration._id}-applicationSubmitted` ? (
                                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                      getStatusIcon(registration.status.applicationSubmitted)
                                    )}
                                    <span className="ms-1">1</span>
                                  </Button>
                                </div>
                                
                                <ChevronRight size={20} className="text-muted mx-1" />
                                
                                <div className="me-2">
                                  <Button
                                    variant={registration.status.documentsVerified ? "success" : 
                                      (registration.status.applicationSubmitted ? "outline-primary" : "outline-secondary")}
                                    size="sm"
                                    onClick={() => registration.status.applicationSubmitted && !registration.status.documentsVerified && 
                                      updateRegistrationStatus(registration._id, "documentsVerified")}
                                    disabled={!registration.status.applicationSubmitted || 
                                      registration.status.documentsVerified || 
                                      updatingStatus === `${registration._id}-documentsVerified`}
                                  >
                                    {updatingStatus === `${registration._id}-documentsVerified` ? (
                                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                      getStatusIcon(registration.status.documentsVerified)
                                    )}
                                    <span className="ms-1">2</span>
                                  </Button>
                                </div>
                                
                                <ChevronRight size={20} className="text-muted mx-1" />
                                
                                <div className="me-2">
                                  <Button
                                    variant={registration.status.inspectionCompleted ? "success" : 
                                      (registration.status.documentsVerified ? "outline-primary" : "outline-secondary")}
                                    size="sm"
                                    onClick={() => registration.status.documentsVerified && !registration.status.inspectionCompleted && 
                                      updateRegistrationStatus(registration._id, "inspectionCompleted")}
                                    disabled={!registration.status.documentsVerified || 
                                      registration.status.inspectionCompleted || 
                                      updatingStatus === `${registration._id}-inspectionCompleted`}
                                  >
                                    {updatingStatus === `${registration._id}-inspectionCompleted` ? (
                                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                      getStatusIcon(registration.status.inspectionCompleted)
                                    )}
                                    <span className="ms-1">3</span>
                                  </Button>
                                </div>
                                
                                <ChevronRight size={20} className="text-muted mx-1" />
                                
                                <div className="me-2">
                                  <Button
                                    variant={registration.status.taxesPaid ? "success" : 
                                      (registration.status.inspectionCompleted ? "outline-primary" : "outline-secondary")}
                                    size="sm"
                                    onClick={() => registration.status.inspectionCompleted && !registration.status.taxesPaid && 
                                      updateRegistrationStatus(registration._id, "taxesPaid")}
                                    disabled={!registration.status.inspectionCompleted || 
                                      registration.status.taxesPaid || 
                                      updatingStatus === `${registration._id}-taxesPaid`}
                                  >
                                    {updatingStatus === `${registration._id}-taxesPaid` ? (
                                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                      getStatusIcon(registration.status.taxesPaid)
                                    )}
                                    <span className="ms-1">4</span>
                                  </Button>
                                </div>
                                
                                <ChevronRight size={20} className="text-muted mx-1" />
                                
                                <div>
                                  <Button
                                    variant={registration.status.registrationCompleted ? "success" : 
                                      (registration.status.taxesPaid ? "outline-primary" : "outline-secondary")}
                                    size="sm"
                                    onClick={() => registration.status.taxesPaid && !registration.status.registrationCompleted && 
                                      updateRegistrationStatus(registration._id, "registrationCompleted")}
                                    disabled={!registration.status.taxesPaid || 
                                      registration.status.registrationCompleted || 
                                      updatingStatus === `${registration._id}-registrationCompleted`}
                                  >
                                    {updatingStatus === `${registration._id}-registrationCompleted` ? (
                                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                      getStatusIcon(registration.status.registrationCompleted)
                                    )}
                                    <span className="ms-1">5</span>
                                  </Button>
                                </div>
                              </div>
                            </td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => {
                                  // Implement view details functionality
                                  toast.info("View details clicked");
                                }}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={fetchIncompleteRegistrations}>
          Refresh
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default IncompleteRegistrations;