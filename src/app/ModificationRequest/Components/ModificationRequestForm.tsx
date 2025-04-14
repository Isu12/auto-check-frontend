import React, { useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { object, string, date } from "zod";
import { createModificationRequest } from "../../ModificationRequest/ModificationControl/ModificationRequest";
import { ModificationRequestInterface } from "../Types/ModificationRequest.Interface";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthToken } from "@/app/auth/hooks/accessHook";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dtu0zojzx/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

export type ModificationType =
  | "Engine"
  | "Exterior"
  | "Interior"
  | "Suspension"
  | "Performance"
  | "Other";

export interface FormValues {
  vehicleId: string;
  ownerId: string;
  modificationType: ModificationType;
  description: string;
  proposedChanges: string;
  status: "Pending";
  images: string;
}



const modificationRequestSchema = object({
  vehicleId: string().nonempty("Vehicle ID is required"),
  ownerId: string().nonempty("Owner ID is required"),
  modificationType: string().nonempty("Modification type is required"),
  description: string().nonempty("Description is required"),
  proposedChanges: string().nonempty("Proposed changes are required"),
  status: string().default("Pending"),
  images: string().nonempty(),
  // rejectionReason: string().optional(),
});

const ModificationRequestForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const accessToken = useAuthToken();

  //   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  //   const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setShowModal(false);
    setImageUrl("");
    // setSelectedFiles([]);
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

  const handleSubmit = async (
    values: FormValues,
    { resetForm, setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      if (!accessToken) return;

      const formData = {
        ...values,
        images: imageUrl,
      };

      console.log("Submitting data:", formData);
      await createModificationRequest(formData, accessToken);
      toast.success("Modification request added successfully!");
      resetForm();
      handleClose();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };
  
  //     const response = await axios.post(
  //       "http://localhost:5555/api/modification-request",
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );
      
  //     console.log("Response:", response.data);
  //     toast.success("Modification request added successfully!");
  //     resetForm();
  //     setImageUrl("");
  //     handleClose();
  //   } catch (error: any) {
  //     console.error("Error:", error);
  //     if (error.response) {
  //       // The request was made and the server responded with a status code
  //       // that falls out of the range of 2xx
  //       toast.error(`Error: ${error.response.data.message || 'Server error occurred'}`);
  //     } else if (error.request) {
  //       // The request was made but no response was received
  //       toast.error("No response received from server. Please try again.");
  //     } else {
  //       // Something happened in setting up the request that triggered an Error
  //       toast.error(`Error: ${error.message}`);
  //     }
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

      

    //   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const files = event.target.files;
    //     if (files) {
    //       setSelectedFiles(Array.from(files));
    //     }
    //   };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="mb-3">
        Add Modification Request
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modification Request Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              vehicleId: "",
              ownerId: "",
              modificationType: "" as ModificationType,
              description: "",
              proposedChanges: "",
              status: "Pending",
              images: "",
            //   rejectionReason: "",
            }}
            onSubmit={handleSubmit}
            validationSchema={toFormikValidationSchema(modificationRequestSchema)}
            // onSubmit={async (values, { resetForm }) => {
            //   try {
            //     const formData = new FormData();
                
                // // Append form fields
                // Object.keys(values).forEach((key) => {
                //   formData.append(key, values[key as keyof typeof values]);
                // });

                // Append files
                // selectedFiles.forEach((file, index) => {
                //   formData.append(`images`, file);
                // });

            

              //   console.log("Response:", response.data);
              //   toast.success("Modification request added successfully!");
              //   resetForm();
              //   // setSelectedFiles([]);
              //   // handleClose();
              // } catch (error: unknown) {
              //   if (error instanceof Error) {
              //     console.error("Error:", error);
              //     toast.error(`Error: ${error.message}`);
              //   } else {
              //     console.error("Unexpected error:", error);
              //     toast.error("An unexpected error occurred.");
              //   }
              // }
            // }}
            // validationSchema={toFormikValidationSchema(modificationRequestSchema)}
          >
            {({ errors, touched, values, setFieldValue, isSubmitting, resetForm }) => (
              <Form className="card-body">
                {/* Vehicle ID */}
                <div className="form-group">
                  <label>Vehicle ID</label>
                  <Field type="text" name="vehicleId" className="form-control" />
                  {errors.vehicleId && touched.vehicleId && (<div className="text-danger">{errors.vehicleId}</div>)}
                </div>

                {/* Owner ID */}
                <div className="form-group">
                  <label>Owner ID</label>
                  <Field type="text" name="ownerId" className="form-control" />
                  {errors.ownerId && touched.ownerId && (<div className="text-danger">{errors.ownerId}</div>)}
                </div>

                {/* Modification Type */}
                <div className="form-group">
                  <label>Modification Type</label>
                  <Field as="select" name="modificationType" className="form-control">
                    <option value="">Select Modification Type</option>
                    <option value="Engine">Engine</option>
                    <option value="Exterior">Exterior</option>
                    <option value="Interior">Interior</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Performance">Performance</option>
                    <option value="Other">Other</option>
                  </Field>
                  {errors.modificationType && touched.modificationType && (<div className="text-danger">{errors.modificationType}</div>)}
                </div>

                {/* Description */}
                <div className="form-group">
                  <label>Description</label>
                  <Field as="textarea" name="description" className="form-control" />
                  {errors.description && touched.description && (<div className="text-danger">{errors.description}</div>)}
                </div>

                {/* Proposed Changes */}
                <div className="form-group">
                  <label>Proposed Changes</label>
                  <Field as="textarea" name="proposedChanges" className="form-control" />
                  {errors.proposedChanges && touched.proposedChanges && (<div className="text-danger">{errors.proposedChanges}</div>)}
                </div>

                {/* Status */}
                <div className="form-group">
                  <label>Status</label>
                  <Field as="select" name="status" className="form-control">
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </Field>
                </div>

                {/* Rejection Reason
                <div className="form-group">
                  <label>Rejection Reason</label>
                  <Field as="textarea" name="rejectionReason" className="form-control" />
                </div> */}

                <div className="form-group">
                  <label>Upload Image</label>
                  <div className="alert alert-warning mt-3" role="alert">
                    ⚠ Once image is uploaded, it cannot be changed!
                  </div>
                  <input
                    type="file"
                    className="form-control mb-2"
                    accept="image/*"
                    onChange={async (event) => {
                      if (event.currentTarget.files?.[0]) {
                        try {
                          const url = await uploadImageToCloudinary(event.currentTarget.files[0]);
                          setFieldValue("images", url);
                        } catch (error) {
                          console.error("Upload failed:", error);
                        }
                      }
                    }}
                    disabled={uploading || isSubmitting}
                  />
                  {uploading && <p className="text-info">Uploading...</p>}

                  {/* New field to display and confirm the image URL */}
                  <div className="form-group mt-3">
                    <label>Image URL (automatically filled after upload)</label>
                    <Field
                      type="text"
                      name="images"
                      className="form-control"
                      readOnly
                    />
                    {errors.images && touched.images && (
                      <div className="text-danger">{errors.images}</div>
                    )}
                  </div>

                  {imageUrl && (
                    <div className="mt-2">
                      <p>Preview:</p>
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="img-thumbnail"
                        width={200}
                      />
                      <p className="text-muted mt-1">
                        <small>Image uploaded successfully!</small>
                      </p>
                    </div>
                  )}
                </div>


                {/* Image Upload */}
                {/* <div className="form-group">
                  <label>Upload Images</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="form-control"
                    multiple
                    accept="image/*"
                  />
                  {selectedFiles.length > 0 && (
                    <div className="mt-2">
                      <p>Selected files:</p>
                      <ul>
                        {selectedFiles.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div> */}

                {/* Submit & Reset Buttons */}
                <div className="card-actions justify-content-end mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary m-4"
                    onClick={() => {
                      setImageUrl("");
                      setFieldValue("images", "");
                    }}
                    disabled={!imageUrl}
                  >
                    Clear Image
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => {
                      resetForm();
                      setImageUrl("");
                    }}
                  >
                    Reset
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

export default ModificationRequestForm;


