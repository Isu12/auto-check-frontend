import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { object, string, number, z } from "zod";
import { createInsuranceClaimRecord } from "../Services/insurance-claim.servie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useAuthToken } from "@/app/auth/hooks/accessHook";

interface FormValues {
  InsuranceID: string;
  ClaimDate: string | Date;
  ClaimType: string;
  ClaimAmountRequested: number;
  ClaimAmountApproved: number;
  DamageDescription: string;
  DamageImageURL1: string;
  DamageImageURL2: string;
  DamageImageURL3: string;
  DamageImageURL4: string;
  DamageImageURL5: string;
}

interface InsuranceClaimFormProps {
  showModal: boolean;
  handleClose: () => void;
  vehicleId?: string;
}

const InsuranceClaimFormSchema = object({
  InsuranceID: string({
    required_error: "Insurance ID is required",
  }).min(1, "Insurance ID cannot be empty"),
  ClaimDate: z.union([z.string(), z.date()]).refine((date) => {
    return new Date(date).toString() !== "Invalid Date";
  }, {
    message: "Invalid claim date format",
  }),
  ClaimType: string({
    required_error: "Claim type is required",
  }).min(1, "Claim type cannot be empty"),
  ClaimAmountRequested: number({
    required_error: "Requested amount is required",
  }).min(0, "Amount cannot be negative"),
  ClaimAmountApproved: number({
    required_error: "Approved amount is required",
  }).min(0, "Amount cannot be negative"),
  DamageDescription: string({
    required_error: "Damage description is required",
  }).min(10, "Description should be at least 10 characters"),
  DamageImageURL1: string().url("Invalid URL format").optional(),
  DamageImageURL2: string().url("Invalid URL format").optional(),
  DamageImageURL3: string().url("Invalid URL format").optional(),
  DamageImageURL4: string().url("Invalid URL format").optional(),
  DamageImageURL5: string().url("Invalid URL format").optional(),
});

const InsuranceClaimForm: React.FC<InsuranceClaimFormProps> = ({
  showModal,
  handleClose,
  vehicleId
}) => {
  const [uploading, setUploading] = useState<number | null>(null);
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
  const accessToken = useAuthToken();

  const uploadImageToCloudinary = async (file: File, index: number): Promise<string> => {
    setUploading(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUDINARY_URL}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      if (!data.secure_url) throw new Error("No URL returned from Cloudinary");

      return data.secure_url;
    } catch (error) {
      toast.error(`Error uploading image ${index + 1}`);
      console.error("Upload Error:", error);
      throw error;
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {

    if (!vehicleId) {
      toast.error("Vehicle ID is required to submit an echo test record.");
      return;
    }

    if (!accessToken) {
      toast.error("You must be logged in to submit an echo test");
      return;
    }
    try {
      const formData = {
        ...values,
        ClaimDate: new Date(values.ClaimDate),
      };

      console.log("Submitting data:", formData);
      await createInsuranceClaimRecord(formData,vehicleId ?? "", accessToken);
      toast.success("Insurance claim submitted successfully!");
      handleClose();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
    fieldName: keyof FormValues,
    index: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreviews(prev => ({
          ...prev,
          [fieldName]: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);

      try {
        const url = await uploadImageToCloudinary(file, index);
        setFieldValue(fieldName, url);
        toast.success(`Image ${index + 1} uploaded successfully!`);
      } catch (error) {
        console.error("Upload failed:", error);
        setImagePreviews(prev => {
          const newPreviews = { ...prev };
          delete newPreviews[fieldName];
          return newPreviews;
        });
      }
    }
  };

  const clearImage = (
    fieldName: keyof FormValues,
    setFieldValue: (field: string, value: any) => void
  ) => {
    setFieldValue(fieldName, "");
    setImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldName];
      return newPreviews;
    });
    toast.info(`Image ${fieldName.replace('DamageImageURL', '')} cleared`);
  };

  return (
    <Modal show={showModal} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Insurance Claim Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            InsuranceID: "",
            ClaimDate: "",
            ClaimType: "",
            ClaimAmountRequested: 0,
            ClaimAmountApproved: 0,
            DamageDescription: "",
            DamageImageURL1: "",
            DamageImageURL2: "",
            DamageImageURL3: "",
            DamageImageURL4: "",
            DamageImageURL5: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={toFormikValidationSchema(InsuranceClaimFormSchema)}
        >
          {({ errors, touched, values, setFieldValue, isSubmitting }) => (
            <Form>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Insurance ID</label>
                    <Field
                      name="InsuranceID"
                      type="text"
                      className={`form-control ${errors.InsuranceID && touched.InsuranceID ? "is-invalid" : ""}`}
                      placeholder="CL-2023-001"
                    />
                    {errors.InsuranceID && touched.InsuranceID && (
                      <div className="invalid-feedback">{errors.InsuranceID}</div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Claim Type</label>
                    <Field
                      as="select"
                      name="ClaimType"
                      className={`form-control ${errors.ClaimType && touched.ClaimType ? "is-invalid" : ""}`}
                    >
                      <option value="">Select claim type</option>
                      <option value="Accident">Accident</option>
                      <option value="Theft">Theft</option>
                      <option value="Natural Disaster">Natural Disaster</option>
                      <option value="Vandalism">Vandalism</option>
                      <option value="Other">Other</option>
                    </Field>
                    {errors.ClaimType && touched.ClaimType && (
                      <div className="invalid-feedback">{errors.ClaimType}</div>
                    )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Claim Date</label>
                    <DatePicker
                      selected={values.ClaimDate ? new Date(values.ClaimDate) : null}
                      onChange={(date: Date | null) => {
                        setFieldValue("ClaimDate", date || "");
                      }}
                      className={`form-control ${errors.ClaimDate && touched.ClaimDate ? "is-invalid" : ""}`}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select claim date"
                    />
                    {errors.ClaimDate && touched.ClaimDate && (
                      <div className="invalid-feedback">{errors.ClaimDate}</div>
                    )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Amount Requested (LKR)</label>
                    <Field
                      name="ClaimAmountRequested"
                      type="number"
                      className={`form-control ${errors.ClaimAmountRequested && touched.ClaimAmountRequested ? "is-invalid" : ""}`}
                      min="0"
                      step="0.01"
                    />
                    {errors.ClaimAmountRequested && touched.ClaimAmountRequested && (
                      <div className="invalid-feedback">{errors.ClaimAmountRequested}</div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Amount Approved (LKR)</label>
                    <Field
                      name="ClaimAmountApproved"
                      type="number"
                      className={`form-control ${errors.ClaimAmountApproved && touched.ClaimAmountApproved ? "is-invalid" : ""}`}
                      min="0"
                      step="0.01"
                    />
                    {errors.ClaimAmountApproved && touched.ClaimAmountApproved && (
                      <div className="invalid-feedback">{errors.ClaimAmountApproved}</div>
                    )}
                  </div>
                </Col>
              </Row>

              <div className="mb-3">
                <label className="form-label">Damage Description</label>
                <Field
                  as="textarea"
                  name="DamageDescription"
                  className={`form-control ${errors.DamageDescription && touched.DamageDescription ? "is-invalid" : ""}`}
                  rows={3}
                  placeholder="Describe the damage in detail..."
                />
                {errors.DamageDescription && touched.DamageDescription && (
                  <div className="invalid-feedback">{errors.DamageDescription}</div>
                )}
              </div>

              {/* Damage Images Upload Section */}
              <div className="mb-4">
                <label className="form-label">Damage Images (Max 5)</label>
                <div className="alert alert-warning mt-3" role="alert">
                  ⚠️ Once damage images are uploaded it can't be changed
                </div>
                <p className="text-red-500">Upload images of the damage (JPG, PNG)</p>
                {[1, 2, 3, 4, 5].map((index) => {
                  const fieldName = `DamageImageURL${index}` as keyof FormValues;
                  const fieldValue = values[fieldName];

                  return (
                    <div key={index} className="mb-3 border-bottom pb-3">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <input
                          type="file"
                          id={`damage-image-${index}`}
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, setFieldValue, fieldName, index)}
                          disabled={uploading === index || isSubmitting}
                        />
                        {fieldValue && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => clearImage(fieldName, setFieldValue)}
                            disabled={isSubmitting}
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {uploading === index && (
                        <div className="text-info">Uploading image {index}...</div>
                      )}

                      {imagePreviews[fieldName] && (
                        <div className="mt-2">
                          <img
                            src={imagePreviews[fieldName]}
                            alt={`Damage preview ${index}`}
                            className="img-thumbnail"
                            style={{ maxHeight: "150px" }}
                          />
                        </div>
                      )}

                      {/* Display the Cloudinary URL after upload */}
                      {fieldValue && (
                        <div className="mt-2">
                          <label className="form-label">Image URL {index}:</label>
                          <input
                            type="text"
                            className="form-control"
                            value={fieldValue as string}
                            readOnly
                            onClick={(e) => (e.target as HTMLInputElement).select()}
                          />
                          <small className="text-muted">This URL will be saved to the database</small>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setFieldValue("InsuranceID", "");
                    setFieldValue("ClaimDate", "");
                    setFieldValue("ClaimType", "");
                    setFieldValue("ClaimAmountRequested", 0);
                    setFieldValue("ClaimAmountApproved", 0);
                    setFieldValue("DamageDescription", "");
                    setFieldValue("DamageImageURL1", "");
                    setFieldValue("DamageImageURL2", "");
                    setFieldValue("DamageImageURL3", "");
                    setFieldValue("DamageImageURL4", "");
                    setFieldValue("DamageImageURL5", "");
                    setImagePreviews({});
                  }}
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || uploading !== null}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Claim"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default InsuranceClaimForm;