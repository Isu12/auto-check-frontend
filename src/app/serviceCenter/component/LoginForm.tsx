import React from "react";
import { TypeOf, object, string } from "zod";
import { Formik, Field, Form } from "formik";
import axios from 'axios';
import { toFormikValidationSchema } from "zod-formik-adapter";

type BusinessRecordFormInputs = TypeOf<typeof businessRecordFormSchema>;

const businessRecordFormSchema = object({
  businessRegNo: string({
    required_error: "Please enter the business registration number",
  }),
  businessName: string({
    required_error: "Please enter the business name",
  }),
  branch: string({
    required_error: "Please enter the branch name",
  }).optional(),
  address: string({
    required_error: "Please enter the address",
  }),
  city: string({
    required_error: "Please enter the address",
  }),
  postalCode: string({
    required_error: "Please enter the address",
  }),
  email: string({
    required_error: "Please enter the primary email address",
  }),
  phoneNumber1: string({
    required_error: "Please enter the first phone number",
  }),
  phoneNumber2: string({
    required_error: "Please enter the second phone number",
  }).optional(),
  ownerName: string({
    required_error: "Please enter the owner's name",
  }),
  contactNumber: string({
    required_error: "Please enter the contact number",
  }),
  email2: string({
    required_error: "Please enter the secondary email address",
  }).optional(),
  webUrl: string({
    required_error: "Please enter the website URL",
  }).optional(),
});

const BusinessRecordForm = () => {
  return (
    <Formik<BusinessRecordFormInputs>
      initialValues={{
        businessRegNo: "",
        businessName: "",
        branch: "",
        address: "",
        city:"",
        postalCode:"",
        email: "",
        phoneNumber1: "",
        phoneNumber2: "",
        ownerName: "",
        contactNumber: "",
        email2: "",
        webUrl: "",
      }}
      onSubmit={async (values) => {
        console.log('Submitted values:', values);
        try {
          const response = await axios.post('http://localhost:5001/api/stations/', values);
          console.log('Response:', response.data);
          if (response.status === 201) {
            alert('Business record submitted successfully!');
          } else {
            alert('Failed to submit the business record');
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          alert('Error submitting form. Please try again later.');
        }
      }}
      validationSchema={toFormikValidationSchema(businessRecordFormSchema)}
    >
      {(formikProps) => {
        const errors = formikProps.errors;
        return (
          <div className="card shadow">
            <Form className="card-body">
              <div className="card-title h4 font-weight-bold">Business Record</div>

              <div className="row">
                {/* Business Registration Number */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Business Registration Number</span>
                  </label>
                  <Field
                    type="text"
                    name="businessRegNo"
                    className="form-control"
                  />
                  {errors.businessRegNo && (
                    <div className="form-text text-danger">
                      {errors.businessRegNo}
                    </div>
                  )}
                </div>

                {/* Business Name */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Business Name</span>
                  </label>
                  <Field
                    type="text"
                    name="businessName"
                    className="form-control"
                  />
                  {errors.businessName && (
                    <div className="form-text text-danger">
                      {errors.businessName}
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                {/* Branch */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Branch</span>
                  </label>
                  <Field
                    type="text"
                    name="branch"
                    className="form-control"
                    placeholder="e.g., Main Branch"
                  />
                  {errors.branch && (
                    <div className="form-text text-danger">
                      {errors.branch}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Address</span>
                  </label>
                  <Field
                    type="text"
                    name="address"
                    className="form-control"
                  />
                  {errors.address && (
                    <div className="form-text text-danger">
                      {errors.address}
                    </div>
                  )}
                </div>
              </div>

              <div className="row">

                {/* city */}
                  <div className="form-group col-md-6">
                    <label className="form-label">
                      <span className="label-text">city</span>
                  </label>
                  <Field
                    type="text"
                    name="city"
                    className="form-control"
                  />
                  {errors.city && (
                    <div className="form-text text-danger">
                      {errors.city}
                    </div>
                  )}
                </div>
              </div>

              <div className="row">


                {/* postalCode */}
                  <div className="form-group col-md-6">
                    <label className="form-label">
                      <span className="label-text">postalCode</span>
                  </label>
                  <Field
                    type="text"
                    name="postalCode"
                    className="form-control"
                  />
                  {errors.postalCode && (
                    <div className="form-text text-danger">
                      {errors.postalCode}
                    </div>
                  )}
                </div>
              </div>

              <div className="row">

                {/* Email */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Primary Email</span>
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="form-control"
                  />
                  {errors.email && (
                    <div className="form-text text-danger">
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Phone Number 1 */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Phone Number 1</span>
                  </label>
                  <Field
                    type="text"
                    name="phoneNumber1"
                    className="form-control"
                  />
                  {errors.phoneNumber1 && (
                    <div className="form-text text-danger">
                      {errors.phoneNumber1}
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                {/* Phone Number 2 */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Phone Number 2</span>
                  </label>
                  <Field
                    type="text"
                    name="phoneNumber2"
                    className="form-control"
                  />
                  {errors.phoneNumber2 && (
                    <div className="form-text text-danger">
                      {errors.phoneNumber2}
                    </div>
                  )}
                </div>

                {/* Owner Name */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Owner Name</span>
                  </label>
                  <Field
                    type="text"
                    name="ownerName"
                    className="form-control"
                  />
                  {errors.ownerName && (
                    <div className="form-text text-danger">
                      {errors.ownerName}
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                {/* Contact Number */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Contact Number</span>
                  </label>
                  <Field
                    type="text"
                    name="contactNumber"
                    className="form-control"
                  />
                  {errors.contactNumber && (
                    <div className="form-text text-danger">
                      {errors.contactNumber}
                    </div>
                  )}
                </div>

                {/* Email 2 */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Secondary Email</span>
                  </label>
                  <Field
                    type="email"
                    name="email2"
                    className="form-control"
                  />
                  {errors.email2 && (
                    <div className="form-text text-danger">
                      {errors.email2}
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                {/* Website URL */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Website URL</span>
                  </label>
                  <Field
                    type="text"
                    name="webUrl"
                    className="form-control"
                  />
                  {errors.webUrl && (
                    <div className="form-text text-danger">
                      {errors.webUrl}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="card-actions justify-content-end mt-4">
                <button className="btn btn-primary" type="submit">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary m-4"
                  onClick={() => formikProps.resetForm()}
                >
                  Reset
                </button>
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};

export default BusinessRecordForm;
