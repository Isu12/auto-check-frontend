import React from "react";
import { TypeOf, object, string } from "zod";
import { Formik, Field, Form } from "formik";
import axios from 'axios';
import { toFormikValidationSchema } from "zod-formik-adapter";

type StationInfoFormInputs = TypeOf<typeof stationInfoFormSchema>;

const stationInfoFormSchema = object({
  businessRegNo: string({ required_error: "Please enter Business Registration Number" }),
  businessName: string({ required_error: "Please enter Business Name" }),
  branch: string({ required_error: "Please enter Branch" }),
  address: string({ required_error: "Please enter Address" }),
  city: string({ required_error: "Please enter City" }),
  postalCode: string({ required_error: "Please enter Postal Code" }),
  email: string({ required_error: "Please enter Email" }).email("Invalid email format"),
  phoneNumber1: string({ required_error: "Please enter Phone Number 1" }),
  phoneNumber2: string().optional(),
  ownerName: string({ required_error: "Please enter Owner Name" }),
  contactNumber: string({ required_error: "Please enter Contact Number" }),
  email2: string().optional(),
  webUrl: string().url("Invalid URL format").optional(),
});

const StationInfoForm = () => {
  return (
    <Formik<StationInfoFormInputs>
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
        try {
          const response = await axios.post('http://localhost:5555/api/stations', values);
          console.log('Response:', response.data);
          if (response.status === 201) {
            alert('Business information submitted successfully!');
          } else {
            alert('Failed to submit business information');
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          alert('Error submitting form. Please try again later.');
        }
      }}
      validationSchema={toFormikValidationSchema(stationInfoFormSchema)}
    >
      {(formikProps) => {
        const errors = formikProps.errors;
        return (
          <div className="card shadow">
            <Form className="card-body">
              <div className="card-title h4 font-weight-bold">Station Information</div>

              <div className="row">
                {/* Business Registration Number */}
                <div className="form-group col-md-6">
                  <label className="form-label">Business Registration Number</label>
                  <Field type="text" name="businessRegNo" className="form-control" />
                  {errors.businessRegNo && <div className="form-text text-danger">{errors.businessRegNo}</div>}
                </div>

                {/* Business Name */}
                <div className="form-group col-md-6">
                  <label className="form-label">Business Name</label>
                  <Field type="text" name="businessName" className="form-control" />
                  {errors.businessName && <div className="form-text text-danger">{errors.businessName}</div>}
                </div>
              </div>

              <div className="row">
                {/* Branch */}
                <div className="form-group col-md-6">
                  <label className="form-label">Branch</label>
                  <Field type="text" name="branch" className="form-control" />
                  {errors.branch && <div className="form-text text-danger">{errors.branch}</div>}
                </div>

                {/* Address */}
                <div className="form-group col-md-6">
                  <label className="form-label">Address</label>
                  <Field type="text" name="address" className="form-control" />
                  {errors.address && <div className="form-text text-danger">{errors.address}</div>}
                </div>
              </div>

              <div className="row">
                {/* City */}
                <div className="form-group col-md-6">
                  <label className="form-label">City</label>
                  <Field type="text" name="city" className="form-control" />
                  {errors.city && <div className="form-text text-danger">{errors.city}</div>}
                </div>

                {/* Postal Code */}
                <div className="form-group col-md-6">
                  <label className="form-label">Postal Code</label>
                  <Field type="text" name="postalCode" className="form-control" />
                  {errors.postalCode && <div className="form-text text-danger">{errors.postalCode}</div>}
                </div>
              </div>

              <div className="row">
                {/* Email */}
                <div className="form-group col-md-6">
                  <label className="form-label">Email</label>
                  <Field type="email" name="email" className="form-control" />
                  {errors.email && <div className="form-text text-danger">{errors.email}</div>}
                </div>

                {/* Phone Number 1 */}
                <div className="form-group col-md-6">
                  <label className="form-label">Phone Number 1</label>
                  <Field type="text" name="phoneNumber1" className="form-control" />
                  {errors.phoneNumber1 && <div className="form-text text-danger">{errors.phoneNumber1}</div>}
                </div>
              </div>

              <div className="row">
                {/* Owner Name */}
                <div className="form-group col-md-6">
                  <label className="form-label">Owner Name</label>
                  <Field type="text" name="ownerName" className="form-control" />
                  {errors.ownerName && <div className="form-text text-danger">{errors.ownerName}</div>}
                </div>

                {/* Contact Number */}
                <div className="form-group col-md-6">
                  <label className="form-label">Contact Number</label>
                  <Field type="text" name="contactNumber" className="form-control" />
                  {errors.contactNumber && <div className="form-text text-danger">{errors.contactNumber}</div>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="card-actions justify-content-end mt-4">
                <button className="btn btn-primary" type="submit">Submit</button>
                <button type="button" className="btn btn-secondary m-4" onClick={() => formikProps.resetForm()}>Reset</button>
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};

export default StationInfoForm;