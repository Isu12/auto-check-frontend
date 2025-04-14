import React, { useState, useEffect } from "react";
import { Button } from "../../auth/ui/button";
import { Input } from "../../auth/ui/input";
import { ModificationRequestInterface } from "../Types/ModificationRequest.Interface";
import { Modal } from "react-bootstrap";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { updateModificationRequest } from "../../ModificationRequest/ModificationControl/ModificationRequest";
import { useAuthToken } from "@/app/auth/hooks/accessHook";

interface ModificationEditFormProps {
    isOpen: boolean;
    onClose: () => void;
    record: ModificationRequestInterface | null;
    onSave: (updatedRecord: ModificationRequestInterface) => void;
}

// interface ModificationFormValues {
//     vehicleId: string;
//     ownerId: string;
//     modificationType: string;
//     description: string;
//     proposedChanges: string;
//     status?: string;
//     images: string;
// }

// const modificationFormSchema = object({
//     vehicleId: string().nonempty("Vehicle ID is required"),
//     ownerId: string().nonempty("Owner ID is required"),
//     modificationType: string().nonempty("Modification type is required"),
//     description: string().nonempty("Description is required"),
//     proposedChanges: string().nonempty("Proposed changes are required"),
//     status: string().default("Pending"),
//     images: string().nonempty(),
// });

// interface ModificationEditFormProps {
//     requestId: string;
//     onSuccess: () => void;
//     initialValues: ModificationFormValues;
//     show: boolean;
//     onHide: () => void;
// }

const ModificationEditForm: React.FC<ModificationEditFormProps> = ({
    isOpen,
    onClose,
    record,
    onSave,
}) => {
    const [editedRecord, setEditedRecord] = useState<ModificationRequestInterface | null>(null);
    const accessToken = useAuthToken();

    // Set the edited record when the modal opens
    useEffect(() => {
        if (isOpen && record) {
            setEditedRecord(record);
        }
    }, [isOpen, record]);

    // Handle input changes for text and number fields
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        field: keyof ModificationRequestInterface
    ) => {
        if (editedRecord) {
            setEditedRecord({
                ...editedRecord,
                [field]: e.target.value,
            });
        }
    };

    const handleSave = async () => {
        if (!accessToken) return;

        if (editedRecord) {
            const updatedValues = {
                // For example, you might want to only send a few fields.
                VehicleId: editedRecord.vehicleId,
                OwnerId: editedRecord.ownerId,
                ModificationType: editedRecord.modificationType,
                Description: editedRecord.description,
                ProposedChanges: editedRecord.proposedChanges,
            };

            try {
                await updateModificationRequest(editedRecord, updatedValues, accessToken);
                onSave(editedRecord);
                onClose();
            } catch (error) {
                console.error("Error saving service record:", error);
            }
        }
    };

    // If the modal is not open or there is no record, return null
    if (!isOpen || !editedRecord) return null;

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton className="bg-dark text-white">
                <Modal.Title>Edit Modification Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={toFormikValidationSchema(modificationFormSchema)}
                    enableReinitialize
                >
                    {({ errors, touched }) => ( */}
                <div className="row">
                    {/* Vehicle ID */}
                    <div className="form-group col-md-6">
                        <label className="form-label">Vehicle ID</label>
                        <Input
                            type="text"
                            name="vehicleId"
                            value={editedRecord.vehicleId}
                            onChange={(e) => handleInputChange(e, "vehicleId")}
                            className="form-control"
                        // disabled
                        />
                    </div>

                    {/* Owner ID */}
                    <div className="form-group col-md-6">
                        <label className="form-label">Owner ID</label>
                        <Input
                            type="text"
                            name="ownerId"
                            value={editedRecord.ownerId}
                            onChange={(e) => handleInputChange(e, "ownerId")}
                            className="form-control"
                        //disabled
                        />
                    </div>

                    {/* Modification Type */}
                    <div className="form-group col-md-6">
                        <label className="form-label">Modification Type</label>
                        <select
                            name="modificationType"
                            value={editedRecord.modificationType}
                            onChange={(e) => handleInputChange(e, "modificationType")}
                            className="form-control"
                        >
                            <option value="">Select type</option>
                            <option value="Engine">Engine</option>
                            <option value="Exterior">Exterior</option>
                            <option value="Interior">Interior</option>
                            <option value="Suspension">Suspension</option>
                            <option value="Performance">Performance</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className="form-group col-md-6">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            value={editedRecord.description}
                            onChange={(e) => handleInputChange(e, "description")}
                            className="form-control"
                            rows={3}
                        />
                    </div>

                    {/* Proposed Changes */}
                    <div className="form-group col-md-6">
                        <label className="form-label">Proposed Changes</label>
                        <textarea
                            name="proposedChanges"
                            value={editedRecord.proposedChanges}
                            onChange={(e) => handleInputChange(e, "proposedChanges")}
                            className="form-control"
                            rows={3}
                        />
                    </div>

                    {/* Status */}
                    <div className="form-group col-md-6">
                        <label className="form-label">Status</label>
                        <select
                            name="status"
                            className="form-control"
                            defaultValue="Pending"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    {/* Images */}
                    {editedRecord.images && (
                        <div className="form-group">
                            <label className="form-label">Image URL</label>
                            <div className="alert alert-info p-2">
                                <a
                                    href={editedRecord.images}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-decoration-none"
                                >
                                    View Image
                                </a>
                            </div>
                        </div>)}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModificationEditForm;