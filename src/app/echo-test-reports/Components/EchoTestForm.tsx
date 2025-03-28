import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { object, string, number, z } from "zod";
import { createEchoTestRecord } from "../services/EchoTest.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dtu0zojzx/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

interface FormValues {
  TestID: number;
  IssuedDate: string;
  ExpiryDate: string;
  TestingCenterName: string;
  TestingCenterBranch: string;
  CertificateFileURL: string;
}

const EchoTestRecordFormSchema = object({
  TestID: number({
    required_error: "Please enter the Test ID",
  }),
  IssuedDate: z.union([z.string(), z.date()]).refine((date) => {
    return new Date(date).toString() !== "Invalid Date";
  }, {
    message: "Invalid date format",
  }),
  ExpiryDate: z.union([z.string(), z.date()]).refine((date) => {
    return new Date(date).toString() !== "Invalid Date";
  }, {
    message: "Invalid date format",
  }),
  TestingCenterName: string({
    required_error: "Please enter the Echo Test center name",
  }),
  TestingCenterBranch: string({
    required_error: "Please enter the branch",
  }),
  CertificateFileURL: string({
    required_error: "Please upload the test certificate"
  }),
});

const EchoTestForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleClose = () => {
    setShowModal(false);
    setImageUrl("");
  };
  const handleShow = () => setShowModal(true);

  const uploadImageToCloudinary = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
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
    try {
      const formData = {
        ...values,
        TestID: Number(values.TestID),
        IssuedDate: new Date(values.IssuedDate),
        ExpiryDate: new Date(values.ExpiryDate),
        CertificateFileURL: imageUrl,
      };

      console.log("Submitting data:", formData);

      await createEchoTestRecord(formData);
      toast.success("Echo test record added successfully!");
      handleClose();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="mb-3">
        Add Echo Test Record
      </Button>

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Echo Test Record Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              TestID: 0,
              IssuedDate: "",
              ExpiryDate: "",
              TestingCenterName: "",
              TestingCenterBranch: "",
              CertificateFileURL: "",
            }}
            onSubmit={handleSubmit}
            validationSchema={toFormikValidationSchema(EchoTestRecordFormSchema)}
          >
            {({ errors, touched, values, setFieldValue, isSubmitting }) => (
              <Form>
                <div className="row">
                  <div className="form-group col-md-6">
                    <label>Test ID</label>
                    <Field
                      type="number"
                      name="TestID"
                      className="form-control"
                    />
                    {errors.TestID && touched.TestID && (
                      <div className="text-danger">{errors.TestID}</div>
                    )}
                  </div>

                  <div className="form-group col-md-6">
                    <label>Testing Center Name</label>
                    <Field
                      type="text"
                      name="TestingCenterName"
                      className="form-control"
                    />
                    {errors.TestingCenterName && touched.TestingCenterName && (
                      <div className="text-danger">{errors.TestingCenterName}</div>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6 mt-3">
                    <label className="mr-2">Issued Date</label>
                    <DatePicker
                      selected={values.IssuedDate ? new Date(values.IssuedDate) : null}
                      onChange={(date: Date | null) => {
                        setFieldValue("IssuedDate", date || "");
                      }}
                      className="form-control"
                      dateFormat="yyyy-MM-dd"
                    />
                    {errors.IssuedDate && touched.IssuedDate && (
                      <div className="text-danger">{errors.IssuedDate}</div>
                    )}
                  </div>

                  <div className="form-group col-md-6 mt-3">
                    <label className="mr-2">Expiry Date</label>
                    <DatePicker
                      selected={values.ExpiryDate ? new Date(values.ExpiryDate) : null}
                      onChange={(date: Date | null) => {
                        setFieldValue("ExpiryDate", date || "");
                      }}
                      className="form-control"
                      dateFormat="yyyy-MM-dd"
                    />
                    {errors.ExpiryDate && touched.ExpiryDate && (
                      <div className="text-danger">{errors.ExpiryDate}</div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Testing Center Branch</label>
                  <Field
                    type="text"
                    name="TestingCenterBranch"
                    className="form-control"
                  />
                  {errors.TestingCenterBranch && touched.TestingCenterBranch && (
                    <div className="text-danger">{errors.TestingCenterBranch}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Upload Test Certificate</label>
                  <div className="alert alert-warning mt-3" role="alert">
                    ⚠️ Once certificate is uploaded it can't be changed
                  </div>
                  <input
                    type="file"
                    className="form-control mb-2"
                    accept="image/*"
                    onChange={async (event) => {
                      if (event.currentTarget.files?.[0]) {
                        try {
                          const url = await uploadImageToCloudinary(event.currentTarget.files[0]);
                          setFieldValue("CertificateFileURL", url);
                        } catch (error) {
                          console.error("Upload failed:", error);
                        }
                      }
                    }}
                    disabled={uploading || isSubmitting}
                  />
                  {uploading && <p className="text-info">Uploading...</p>}

                  <div className="form-group mt-3">
                    <label>Certificate URL (automatically filled after upload)</label>
                    <Field
                      type="text"
                      name="CertificateFileURL"
                      className="form-control"
                      readOnly
                    />
                    {errors.CertificateFileURL && touched.CertificateFileURL && (
                      <div className="text-danger">{errors.CertificateFileURL}</div>
                    )}
                  </div>

                  {imageUrl && (
                    <div className="mt-2">
                      <p>Preview:</p>
                      <img
                        src={imageUrl}
                        alt="Certificate Preview"
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
                      setFieldValue("CertificateFileURL", "");
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
                      setFieldValue("CertificateFileURL", "");
                      setFieldValue("TestID", 0);
                      setFieldValue("IssuedDate", "");
                      setFieldValue("ExpiryDate", "");
                      setFieldValue("TestingCenterName", "");
                      setFieldValue("TestingCenterBranch", "");
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
    </>
  );
};

export default EchoTestForm;