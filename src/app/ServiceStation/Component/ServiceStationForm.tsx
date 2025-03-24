import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { object, string } from "zod";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const validCountryCodes = [
  { code: "+94", label: "(+94)" }
];

// Define the Zod schema for validation
const businessFormSchema = object({
  businessRegNo: string().min(1, { message: "Please enter Business Registration Number" }),
  businessName: string().min(1, { message: "Please enter Business Name" }),
  branch: string().optional(),
  address: string().min(1, { message: "Please enter Address" }),
  city: string().min(1, { message: "Please enter City" }),
  postalCode: string()
    .min(5, { message: "Postal Code must be 5 digits" })
    .max(5, { message: "Postal Code must be 5 digits" })
    .regex(/^\d{5}$/, { message: "Postal Code must be 5 digits" }),
  email: string().min(1, { message: "Please enter Email" }).email("Invalid email format"),
  phoneNumber1: string()
    .optional()
    .refine(value => !value || /^\d{10}$/.test(value), {
      message: "Primary Phone Number must be 10 digits",
    }),
  phoneNumber2: string()
    .optional()
    .refine(value => !value || /^\d{10}$/.test(value), {
      message: "Secondary Phone Number must be 10 digits",
    }),
  ownerName: string().min(1, { message: "Please enter Owner Name" }),
  contactNumber: string()
    .optional()
    .refine(value => !value || /^\d{10}$/.test(value), {
      message: "Contact Number must be 10 digits",
    }),
  email2: string().min(1, { message: "Please enter Email" }).email("Invalid email format"),
  webUrl: string().optional(),
});

const BusinessForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [countryCode1, setCountryCode1] = useState("+94"); // Default to Sri Lanka
  const [countryCode2, setCountryCode2] = useState("+94"); // Default to Sri Lanka
  const [countryCode3, setCountryCode3] = useState("+94"); // Default to Sri Lanka for contactNumber

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="mb-3">
        Add Business Details
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Business Details Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              businessRegNo: "",
              businessName: "",
              branch: "",
              address: "",
              city: "",
              postalCode: "",
              email: "",
              phoneNumber1: "",
              phoneNumber2: "",
              ownerName: "",
              contactNumber: "",
              email2: "",
              webUrl: "",
            }}
            onSubmit={async (values) => {
              console.log("Submitted values:", values);
              try {
                const response = await axios.post("http://localhost:5555/api/stations", values);
                console.log("Response:", response.data);
                toast.success("Service record added successfully!");
                handleClose();
              } catch (error: any) {
                toast.error(`Error: ${error.message}`);
              }
            }}
            validationSchema={toFormikValidationSchema(businessFormSchema)}
          >
            {(formikProps: { errors: any; }) => {
              const errors = formikProps.errors;
              return (
                <Form className="card-body">
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label className="form-label">Business Registration Number</label>
                      <Field type="text" name="businessRegNo" className="form-control" />
                      {errors.businessRegNo && <div className="text-danger">{errors.businessRegNo}</div>}
                    </div>
                    <div className="form-group col-md-6">
                      <label className="form-label">Business Name</label>
                      <Field type="text" name="businessName" className="form-control" />
                      {errors.businessName && <div className="text-danger">{errors.businessName}</div>}
                    </div>
                  </div>

                  <div className="row">
                    <div className="form-group col-md-6">
                      <label className="form-label">Branch</label>
                      <Field type="text" name="branch" className="form-control" />
                    </div>
                    <div className="form-group col-md-6">
                      <label className="form-label">Address</label>
                      <Field type="text" name="address" className="form-control" />
                      {errors.address && <div className="text-danger">{errors.address}</div>}
                    </div>
                  </div>

                  <div className="row">
                    <div className="form-group col-md-6">
                      <label className="form-label">City</label>
                      <Field type="text" name="city" className="form-control" />
                      {errors.city && <div className="text-danger">{errors.city}</div>}
                    </div>
                    <div className="form-group col-md-6">
                      <label className="form-label">Postal Code</label>
                      <Field type="text" name="postalCode" className="form-control" />
                      {errors.postalCode && <div className="text-danger">{errors.postalCode}</div>}
                    </div>
                  </div>

                  <div className="row">
                    <div className="form-group col-md-6">
                      <label className="form-label">Email</label>
                      <Field type="email" name="email" className="form-control" />
                      {errors.email && <div className="text-danger">{errors.email}</div>}
                    </div>
                    <div className="form-group col-md-6">
                      <label className="form-label">Primary Phone Number</label>
                      <div className="d-flex">
                        <select
                          className="form-control"
                          value={countryCode1}
                          onChange={(e) => setCountryCode1(e.target.value)}
                          disabled
                        >
                          {validCountryCodes.map((code) => (
                            <option key={code.code} value={code.code}>
                              {code.label}
                            </option>
                          ))}
                        </select>
                        <Field
                          type="text"
                          name="phoneNumber1"
                          className="form-control ml-2"
                          maxLength={10} // Changed to 10 digits
                        />
                      </div>
                      {errors.phoneNumber1 && <div className="text-danger">{errors.phoneNumber1}</div>}
                    </div>
                  </div>

                  <div className="row">
                    <div className="form-group col-md-6">
                      <label className="form-label">Secondary Phone Number</label>
                      <div className="d-flex">
                        <select
                          className="form-control"
                          value={countryCode2}
                          onChange={(e) => setCountryCode2(e.target.value)}
                          disabled
                        >
                          {validCountryCodes.map((code) => (
                            <option key={code.code} value={code.code}>
                              {code.label}
                            </option>
                          ))}
                        </select>
                        <Field
                          type="text"
                          name="phoneNumber2"
                          className="form-control ml-2"
                          maxLength={10} // Changed to 10 digits
                        />
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <label className="form-label">Owner Name</label>
                      <Field type="text" name="ownerName" className="form-control" />
                      {errors.ownerName && <div className="text-danger">{errors.ownerName}</div>}
                    </div>
                  </div>

                  <div className="row">
                    <div className="form-group col-md-6">
                      <label className="form-label">Contact Number</label>
                      <div className="d-flex">
                        <select
                          className="form-control"
                          value={countryCode3}
                          onChange={(e) => setCountryCode3(e.target.value)}
                          disabled
                        >
                          {validCountryCodes.map((code) => (
                            <option key={code.code} value={code.code}>
                              {code.label}
                            </option>
                          ))}
                        </select>
                        <Field
                          type="text"
                          name="contactNumber"
                          className="form-control ml-2"
                          maxLength={10} // Changed to 10 digits
                        />
                      </div>
                      {errors.contactNumber && <div className="text-danger">{errors.contactNumber}</div>}
                    </div>
                    <div className="form-group col-md-6">
                      <label className="form-label">Alternate Email</label>
                      <Field type="email" name="email2" className="form-control" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Website URL</label>
                    <Field type="text" name="webUrl" className="form-control" />
                  </div>

                  <div className="card-actions justify-content-end mt-4">
                    <button className="btn btn-primary" type="submit">Submit</button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BusinessForm;
