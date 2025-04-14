import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { object, string, number, z } from "zod";
import { createServiceRecord } from "../../ServiceRecord/Services/ServiceRecord.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useAuthToken } from "@/app/auth/hooks/accessHook";

interface FormValues {
  OdometerReading: number;
  DateOfService: string;
  ServiceType: string;
  DescriptionOfIssue: string;
  Diagnosis: string;
  ServiceDetails: string;
  PartsUsed: string;
  ServiceCost: number;
  WarrantyInfo: string;
  NextServiceDate: string;
  RecommendedServices: string;
  InvoiceImageUrl: string;
}

interface ServiceRecordFormProps {
  showModal: boolean;
  handleClose: () => void;
  vehicleId?: string;
}

const serviceRecordFormSchema = object({
  OdometerReading: number({
    required_error: "Please enter your Odometer Reading",
  })
    .min(1, "Odometer Reading must be at least 1 km")
    .max(999999, "Odometer Reading is too high"),
  DateOfService: z.union([z.string(), z.date()]).refine((date) => {
    return new Date(date).toString() !== "Invalid Date";
  }, {
    message: "Invalid date format",
  }),
  ServiceType: string({
    required_error: "Please Enter the Service Type",
  }),
  DescriptionOfIssue: string({
    required_error: "Please describe the issue",
  }),
  Diagnosis: string({
    required_error: "Please enter the diagnosis",
  }),
  ServiceDetails: string({
    required_error: "Please enter service/repair details",
  }),
  PartsUsed: string({
    required_error: "Please enter the parts used",
  }),
  ServiceCost: number({
    required_error: "Please enter the service cost",
  }),
  WarrantyInfo: string({
    required_error: "Please enter warranty information",
  }),
  NextServiceDate: z.union([z.string(), z.date()]).refine((date) => {
    return new Date(date).toString() !== "Invalid Date";
  }, {
    message: "Invalid date format",
  }),
  RecommendedServices: string({
    required_error: "Please enter recommended services",
  }),
  InvoiceImageUrl: string().optional(),
});

const ServiceRecordForm: React.FC<ServiceRecordFormProps> = ({
  showModal,
  handleClose,
  vehicleId
}) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const accessToken = useAuthToken();

  const uploadImageToCloudinary = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUDINARY_URL}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        toast.success("Image uploaded successfully!");
        return data.secure_url;
      }
      throw new Error("No URL returned from Cloudinary");
    } catch (error) {
      toast.error("Error uploading image");
      console.error("Upload Error:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    if (!accessToken || !vehicleId) return;

    try {
      const formData = {
        ...values,
        vehicleId,
        OdometerReading: Number(values.OdometerReading),
        ServiceCost: Number(values.ServiceCost),
        DateOfService: new Date(values.DateOfService),
        NextServiceDate: new Date(values.NextServiceDate),
        InvoiceImageUrl: imageUrl,
      };

      console.log("Submitting data:", formData);

      await createServiceRecord(formData,vehicleId ?? "", accessToken);
      toast.success("Service record added successfully!");
      handleClose();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} size="lg">
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Service Record Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            OdometerReading: 0,
            DateOfService: "",
            ServiceType: "",
            DescriptionOfIssue: "",
            Diagnosis: "",
            ServiceDetails: "",
            PartsUsed: "",
            ServiceCost: 0,
            WarrantyInfo: "",
            NextServiceDate: "",
            RecommendedServices: "",
            InvoiceImageUrl: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={toFormikValidationSchema(serviceRecordFormSchema)}
        >
          {({ errors, touched, values, setFieldValue, isSubmitting }) => (
            <Form>
              <div className="row">
                <div className="form-group col-md-6">
                  <label>Odometer Reading (km)</label>
                  <Field
                    type="number"
                    name="OdometerReading"
                    className="form-control"
                  />
                  {errors.OdometerReading && touched.OdometerReading && (
                    <div className="text-danger">{errors.OdometerReading}</div>
                  )}
                </div>

                <div className="form-group col-md-6 mt-3">
                  <label className="mr-2">Date of Service</label>
                  <DatePicker
                    selected={values.DateOfService ? new Date(values.DateOfService) : null}
                    onChange={(date: Date | null) => {
                      setFieldValue("DateOfService", date || "");
                    }}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                  />
                  {errors.DateOfService && touched.DateOfService && (
                    <div className="text-danger">{errors.DateOfService}</div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-6">
                  <label>Service Type</label>
                  <Field
                    type="text"
                    name="ServiceType"
                    className="form-control"
                  />
                  {errors.ServiceType && touched.ServiceType && (
                    <div className="text-danger">{errors.ServiceType}</div>
                  )}
                </div>

                <div className="form-group col-md-6">
                  <label>Service Cost</label>
                  <Field
                    type="number"
                    name="ServiceCost"
                    className="form-control"
                  />
                  {errors.ServiceCost && touched.ServiceCost && (
                    <div className="text-danger">{errors.ServiceCost}</div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-6">
                  <label>Description of Issue</label>
                  <Field
                    as="textarea"
                    name="DescriptionOfIssue"
                    className="form-control"
                  />
                  {errors.DescriptionOfIssue && touched.DescriptionOfIssue && (
                    <div className="text-danger">{errors.DescriptionOfIssue}</div>
                  )}
                </div>

                <div className="form-group col-md-6">
                  <label>Diagnosis</label>
                  <Field
                    as="textarea"
                    name="Diagnosis"
                    className="form-control"
                  />
                  {errors.Diagnosis && touched.Diagnosis && (
                    <div className="text-danger">{errors.Diagnosis}</div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-6">
                  <label>Service / Repair Details</label>
                  <Field
                    as="textarea"
                    name="ServiceDetails"
                    className="form-control"
                  />
                  {errors.ServiceDetails && touched.ServiceDetails && (
                    <div className="text-danger">{errors.ServiceDetails}</div>
                  )}
                </div>

                <div className="form-group col-md-6">
                  <label>Parts Used</label>
                  <Field
                    as="textarea"
                    name="PartsUsed"
                    className="form-control"
                  />
                  {errors.PartsUsed && touched.PartsUsed && (
                    <div className="text-danger">{errors.PartsUsed}</div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-6">
                  <label>Warranty Information</label>
                  <Field
                    type="text"
                    name="WarrantyInfo"
                    className="form-control"
                  />
                  {errors.WarrantyInfo && touched.WarrantyInfo && (
                    <div className="text-danger">{errors.WarrantyInfo}</div>
                  )}
                </div>

                <div className="form-group col-md-6 mt-3">
                  <label className="mr-2">Next Service Date</label>
                  <DatePicker
                    selected={values.NextServiceDate ? new Date(values.NextServiceDate) : null}
                    onChange={(date: Date | null) => {
                      setFieldValue("NextServiceDate", date || "");
                    }}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                  />
                  {errors.NextServiceDate && touched.NextServiceDate && (
                    <div className="text-danger">{errors.NextServiceDate}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Recommended Services</label>
                <Field
                  as="textarea"
                  name="RecommendedServices"
                  className="form-control"
                />
                {errors.RecommendedServices && touched.RecommendedServices && (
                  <div className="text-danger">{errors.RecommendedServices}</div>
                )}
              </div>

              <div className="form-group">
                <label>Upload Invoice Image</label>
                <div className="alert alert-warning mt-3" role="alert">
                  ⚠️ Once invoice is uploaded it can't be changed
                </div>
                <input
                  type="file"
                  className="form-control mb-2"
                  accept="image/*"
                  onChange={async (event) => {
                    if (event.currentTarget.files?.[0]) {
                      try {
                        const url = await uploadImageToCloudinary(event.currentTarget.files[0]);
                        setFieldValue("InvoiceImageUrl", url);
                      } catch (error) {
                        console.error("Upload failed:", error);
                      }
                    }
                  }}
                  disabled={uploading || isSubmitting}
                />
                {uploading && <p className="text-info">Uploading...</p>}

                <div className="form-group mt-3">
                  <label>Image URL (automatically filled after upload)</label>
                  <Field
                    type="text"
                    name="InvoiceImageUrl"
                    className="form-control"
                    readOnly
                  />
                  {errors.InvoiceImageUrl && touched.InvoiceImageUrl && (
                    <div className="text-danger">{errors.InvoiceImageUrl}</div>
                  )}
                </div>

                {imageUrl && (
                  <div className="mt-2">
                    <p>Preview:</p>
                    <img
                      src={imageUrl}
                      alt="Invoice Preview"
                      className="img-thumbnail"
                      width={200}
                    />
                    <p className="text-muted mt-1">
                      <small>Image uploaded successfully!</small>
                    </p>
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={() => {
                    setImageUrl("");
                    setFieldValue("InvoiceImageUrl", "");
                  }}
                  disabled={!imageUrl}
                >
                  Clear Image
                </button>
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={() => {
                    setImageUrl("");
                    setFieldValue("InvoiceImageUrl", "");
                    setFieldValue("OdometerReading", 0);
                    setFieldValue("DateOfService", "");
                    setFieldValue("ServiceType", "");
                    setFieldValue("DescriptionOfIssue", "");
                    setFieldValue("Diagnosis", "");
                    setFieldValue("ServiceDetails", "");
                    setFieldValue("PartsUsed", "");
                    setFieldValue("ServiceCost", 0);
                    setFieldValue("WarrantyInfo", "");
                    setFieldValue("NextServiceDate", "");
                    setFieldValue("RecommendedServices", "");
                  }}
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || uploading}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ServiceRecordForm;