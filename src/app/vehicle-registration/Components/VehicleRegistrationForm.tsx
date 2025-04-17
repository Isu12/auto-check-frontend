import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { object, string } from "zod";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Cloudinary configuration
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dtu0zojzx/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

const vehicleFormSchema = object({
  Registration_no: string()
    .regex(
      /^(?:\d SRI \d{4}|\d{2} - \d{4}|\d{3}-\d{4}|[E-HJ-LN-PQTXY][A-Z] - \d{4}|[CDBA][A-Z]{2} - \d{4})$/,
      "Invalid Registration Number format"
    )
    .refine((val) => val.trim() !== "", {
      message: "Please enter Registration Number",
    }),
  Chasisis_No: string({ required_error: "Please enter Chassis Number" }),
  Current_Owner: string({ required_error: "Please enter Current Owner" }),
  Address: string({ required_error: "Please enter Address" }),
  NIC: string({ required_error: "Please enter NIC" }),
  Conditions_Special_note: string({
    required_error: "Please enter Conditions/Special Note",
  }),
  Absolute_Owner: string({ required_error: "Please enter Absolute Owner" }),
  Engine_No: string(),
  Cylinder_Capacity: string(),
  Class_of_Vehicle: string({ required_error: "Please enter Class of Vehicle" }),
  Taxation_Class: string({ required_error: "Please enter Taxation Class" }),
  Status_When_Registered: string(),
  Fuel_Type: string(),
  Make: string(),
  Country_of_Origin: string(),
  Model: string(),
  Manufactures_Description: string(),
  Wheel_Base: string(),
  Type_of_Body: string(),
  Year_of_Manufacture: string(),
  Colour: string(),
  Previous_Owners: string(),
  Seating_capacity: string(),
  Weight: string(),
  Length: string(),
  Width: string(),
  Height: string(),
  Provincial_Council: string(),
  Date_of_First_Registration: string(),
  Taxes_Payable: string(),
  Front_Photo: string().optional(),
  Left_Photo: string().optional(),
  Right_Photo: string().optional(),
  Rear_Photo: string().optional(),
  Completion_Status: string().optional(),
});

const VehicleForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const handleClose = () => {
    setShowModal(false);
    setUploadProgress({});
  };
  const handleShow = () => setShowModal(true);

  const checkDuplicateRegistration = async (Registration_no: string) => {
    try {
      setIsChecking(true);
      const response = await axios.get(
        `http://localhost:5555/api/vehicle-record/check-duplicate/${Registration_no}`
      );
      setIsChecking(false);
      return response.data.exists;
    } catch (error) {
      setIsChecking(false);
      console.error("Error checking registration number:", error);
      toast.error("Error checking registration number");
      return false;
    }
  };

  const uploadImageToCloudinary = async (file: File, fieldName: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        CLOUDINARY_URL,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(prev => ({
              ...prev,
              [fieldName]: percentCompleted
            }));
          },
        }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  };

  const handleImageUpload = async (
    file: File,
    fieldName: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload an image file (JPEG, JPG, PNG, GIF)");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file, fieldName);
      if (imageUrl) {
        setFieldValue(fieldName, imageUrl);
        toast.success(`${fieldName.replace('_', ' ')} uploaded successfully!`);
      }
    } catch (error) {
      toast.error(`Failed to upload ${fieldName.replace('_', ' ')}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(prev => ({
        ...prev,
        [fieldName]: 0
      }));
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="mb-3">
        Add Vehicle Details
      </Button>

      <Modal show={showModal} onHide={handleClose} size="xl" scrollable centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Vehicle Registration Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              Registration_no: "",
              Chasisis_No: "",
              Current_Owner: "",
              Address: "",
              NIC: "",
              Conditions_Special_note: "",
              Absolute_Owner: "",
              Engine_No: "",
              Cylinder_Capacity: "",
              Class_of_Vehicle: "",
              Taxation_Class: "",
              Status_When_Registered: "",
              Fuel_Type: "",
              Make: "",
              Country_of_Origin: "",
              Model: "",
              Manufactures_Description: "",
              Wheel_Base: "",
              Type_of_Body: "",
              Year_of_Manufacture: "",
              Colour: "",
              Previous_Owners: "",
              Seating_capacity: "",
              Weight: "",
              Length: "",
              Width: "",
              Height: "",
              Provincial_Council: "",
              Date_of_First_Registration: "",
              Taxes_Payable: "",
              Front_Photo: "",
              Left_Photo: "",
              Right_Photo: "",
              Rear_Photo: "",
              Completion_Status: "Pending Submission",
            }}
            onSubmit={async (values) => {
              try {
                const isDuplicate = await checkDuplicateRegistration(values.Registration_no);
                if (isDuplicate) {
                  toast.error("Registration number already exists");
                  return;
                }

                await axios.post("http://localhost:5555/api/vehicle-record", values);
                toast.success("Vehicle added successfully!");
                onSuccess();
                handleClose();
              } catch (error: any) {
                toast.error(`Error: ${error.message}`);
              }
            }}
            validationSchema={toFormikValidationSchema(vehicleFormSchema)}
          >
            {(formikProps) => (
              <Form className="card-body">
                <div className="row">
                  {/* Section 1: Registration and Identification */}
                  <div className="col-md-6">
                    <h5 className="mb-3 text-dark">Registration and Identification</h5>

                    <div className="form-group mb-3">
                      <label className="form-label">Registration No*</label>
                      <Field
                        type="text"
                        name="Registration_no"
                        className="form-control"
                      />
                      {formikProps.errors.Registration_no && formikProps.touched.Registration_no && (
                        <div className="text-danger small">
                          {formikProps.errors.Registration_no}
                        </div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Chassis No*</label>
                      <Field
                        type="text"
                        name="Chasisis_No"
                        className="form-control"
                      />
                      {formikProps.errors.Chasisis_No && formikProps.touched.Chasisis_No && (
                        <div className="text-danger small">
                          {formikProps.errors.Chasisis_No}
                        </div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Engine No</label>
                      <Field
                        type="text"
                        name="Engine_No"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Class of Vehicle*</label>
                      <Field
                        type="text"
                        name="Class_of_Vehicle"
                        className="form-control"
                      />
                      {formikProps.errors.Class_of_Vehicle && formikProps.touched.Class_of_Vehicle && (
                        <div className="text-danger small">
                          {formikProps.errors.Class_of_Vehicle}
                        </div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Taxation Class*</label>
                      <Field
                        type="text"
                        name="Taxation_Class"
                        className="form-control"
                      />
                      {formikProps.errors.Taxation_Class && formikProps.touched.Taxation_Class && (
                        <div className="text-danger small">
                          {formikProps.errors.Taxation_Class}
                        </div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Status When Registered</label>
                      <Field
                        type="text"
                        name="Status_When_Registered"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Completion Status</label>
                      <Field
                        as="select"
                        name="Completion_Status"
                        className="form-control"
                      >
                        <option value="Pending Submission">Pending Submission</option>
                        <option value="Document Verification">Document Verification</option>
                        <option value="Inspection Pending">Inspection Pending</option>
                        <option value="Ready for Completion">Ready for Completion</option>
                      </Field>
                    </div>
                  </div>

                  {/* Section 2: Owner Information */}
                  <div className="col-md-6">
                    <h5 className="mb-3 text-dark">Owner Information</h5>

                    <div className="form-group mb-3">
                      <label className="form-label">Current Owner*</label>
                      <Field
                        type="text"
                        name="Current_Owner"
                        className="form-control"
                      />
                      {formikProps.errors.Current_Owner && formikProps.touched.Current_Owner && (
                        <div className="text-danger small">
                          {formikProps.errors.Current_Owner}
                        </div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Address*</label>
                      <Field
                        type="text"
                        name="Address"
                        className="form-control"
                      />
                      {formikProps.errors.Address && formikProps.touched.Address && (
                        <div className="text-danger small">
                          {formikProps.errors.Address}
                        </div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">NIC*</label>
                      <Field
                        type="text"
                        name="NIC"
                        className="form-control"
                      />
                      {formikProps.errors.NIC && formikProps.touched.NIC && (
                        <div className="text-danger small">
                          {formikProps.errors.NIC}
                        </div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Absolute Owner*</label>
                      <Field
                        type="text"
                        name="Absolute_Owner"
                        className="form-control"
                      />
                      {formikProps.errors.Absolute_Owner && formikProps.touched.Absolute_Owner && (
                        <div className="text-danger small">
                          {formikProps.errors.Absolute_Owner}
                        </div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Previous Owners</label>
                      <Field
                        type="text"
                        name="Previous_Owners"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Provincial Council</label>
                      <Field
                        type="text"
                        name="Provincial_Council"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="row">
                  {/* Section 3: Vehicle Specifications */}
                  <div className="col-md-6">
                    <h5 className="mb-3 text-dark">Vehicle Specifications</h5>

                    <div className="form-group mb-3">
                      <label className="form-label">Make</label>
                      <Field
                        type="text"
                        name="Make"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Model</label>
                      <Field
                        type="text"
                        name="Model"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Country of Origin</label>
                      <Field
                        type="text"
                        name="Country_of_Origin"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Year of Manufacture</label>
                      <Field
                        type="text"
                        name="Year_of_Manufacture"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Colour</label>
                      <Field
                        type="text"
                        name="Colour"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Fuel Type</label>
                      <Field
                        type="text"
                        name="Fuel_Type"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Cylinder Capacity</label>
                      <Field
                        type="text"
                        name="Cylinder_Capacity"
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* Section 4: Dimensions and Capacity */}
                  <div className="col-md-6">
                    <h5 className="mb-3 text-dark">Dimensions and Capacity</h5>

                    <div className="form-group mb-3">
                      <label className="form-label">Seating Capacity</label>
                      <Field
                        type="text"
                        name="Seating_capacity"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Weight</label>
                      <Field
                        type="text"
                        name="Weight"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Length</label>
                      <Field
                        type="text"
                        name="Length"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Width</label>
                      <Field
                        type="text"
                        name="Width"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Height</label>
                      <Field
                        type="text"
                        name="Height"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Wheel Base</label>
                      <Field
                        type="text"
                        name="Wheel_Base"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Type of Body</label>
                      <Field
                        type="text"
                        name="Type_of_Body"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="row">
                  {/* Section 5: Additional Information */}
                  <div className="col-md-6">
                    <h5 className="mb-3 text-dark">Additional Information</h5>

                    <div className="form-group mb-3">
                      <label className="form-label">Manufacturer's Description</label>
                      <Field
                        type="text"
                        name="Manufactures_Description"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Conditions/Special Note*</label>
                      <Field
                        as="textarea"
                        name="Conditions_Special_note"
                        className="form-control"
                        rows={3}
                      />
                      {formikProps.errors.Conditions_Special_note && formikProps.touched.Conditions_Special_note && (
                        <div className="text-danger small">
                          {formikProps.errors.Conditions_Special_note}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 6: Registration and Taxes */}
                  <div className="col-md-6">
                    <h5 className="mb-3 text-dark">Registration and Taxes</h5>

                    <div className="form-group mb-3">
                      <label className="form-label">Date of First Registration</label>
                      <Field
                        type="date"
                        name="Date_of_First_Registration"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Taxes Payable</label>
                      <Field
                        type="text"
                        name="Taxes_Payable"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                {/* Section 7: Vehicle Photos */}
                <div className="row">
                  <h5 className="mb-3 text-dark">Vehicle Photos</h5>

                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">Front Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageUpload(
                              e.target.files[0],
                              "Front_Photo",
                              formikProps.setFieldValue
                            );
                          }
                        }}
                        disabled={isUploading}
                      />
                      {uploadProgress.Front_Photo > 0 && (
                        <div className="progress mt-2">
                          <div
                            className="progress-bar progress-bar-striped"
                            role="progressbar"
                            style={{ width: `${uploadProgress.Front_Photo}%` }}
                            aria-valuenow={uploadProgress.Front_Photo}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            {uploadProgress.Front_Photo}%
                          </div>
                        </div>
                      )}
                      {formikProps.values.Front_Photo && (
                        <div className="mt-2">
                          <img
                            src={formikProps.values.Front_Photo}
                            alt="Front view"
                            className="img-thumbnail"
                            style={{ maxWidth: "150px", maxHeight: "150px" }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger ms-2"
                            onClick={() => formikProps.setFieldValue("Front_Photo", "")}
                            disabled={isUploading}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Left Side Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageUpload(
                              e.target.files[0],
                              "Left_Photo",
                              formikProps.setFieldValue
                            );
                          }
                        }}
                        disabled={isUploading}
                      />
                      {uploadProgress.Left_Photo > 0 && (
                        <div className="progress mt-2">
                          <div
                            className="progress-bar progress-bar-striped"
                            role="progressbar"
                            style={{ width: `${uploadProgress.Left_Photo}%` }}
                            aria-valuenow={uploadProgress.Left_Photo}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            {uploadProgress.Left_Photo}%
                          </div>
                        </div>
                      )}
                      {formikProps.values.Left_Photo && (
                        <div className="mt-2">
                          <img
                            src={formikProps.values.Left_Photo}
                            alt="Left side view"
                            className="img-thumbnail"
                            style={{ maxWidth: "150px", maxHeight: "150px" }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger ms-2"
                            onClick={() => formikProps.setFieldValue("Left_Photo", "")}
                            disabled={isUploading}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">Right Side Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageUpload(
                              e.target.files[0],
                              "Right_Photo",
                              formikProps.setFieldValue
                            );
                          }
                        }}
                        disabled={isUploading}
                      />
                      {uploadProgress.Right_Photo > 0 && (
                        <div className="progress mt-2">
                          <div
                            className="progress-bar progress-bar-striped"
                            role="progressbar"
                            style={{ width: `${uploadProgress.Right_Photo}%` }}
                            aria-valuenow={uploadProgress.Right_Photo}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            {uploadProgress.Right_Photo}%
                          </div>
                        </div>
                      )}
                      {formikProps.values.Right_Photo && (
                        <div className="mt-2">
                          <img
                            src={formikProps.values.Right_Photo}
                            alt="Right side view"
                            className="img-thumbnail"
                            style={{ maxWidth: "150px", maxHeight: "150px" }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger ms-2"
                            onClick={() => formikProps.setFieldValue("Right_Photo", "")}
                            disabled={isUploading}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Rear Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageUpload(
                              e.target.files[0],
                              "Rear_Photo",
                              formikProps.setFieldValue
                            );
                          }
                        }}
                        disabled={isUploading}
                      />
                      {uploadProgress.Rear_Photo > 0 && (
                        <div className="progress mt-2">
                          <div
                            className="progress-bar progress-bar-striped"
                            role="progressbar"
                            style={{ width: `${uploadProgress.Rear_Photo}%` }}
                            aria-valuenow={uploadProgress.Rear_Photo}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            {uploadProgress.Rear_Photo}%
                          </div>
                        </div>
                      )}
                      {formikProps.values.Rear_Photo && (
                        <div className="mt-2">
                          <img
                            src={formikProps.values.Rear_Photo}
                            alt="Rear view"
                            className="img-thumbnail"
                            style={{ maxWidth: "150px", maxHeight: "150px" }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger ms-2"
                            onClick={() => formikProps.setFieldValue("Rear_Photo", "")}
                            disabled={isUploading}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => formikProps.resetForm()}
                    disabled={isUploading || formikProps.isSubmitting}
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    className="btn btn-dark"
                    disabled={isUploading || isChecking || formikProps.isSubmitting}
                  >
                    {isUploading ? "Uploading..." :
                      isChecking ? "Checking..." :
                        formikProps.isSubmitting ? "Submitting..." :
                          "Submit"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VehicleForm;