import React from "react";
import { TypeOf, object, string, number } from "zod";
import { Formik, Form, Field } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";

type ServiceRecordFormInputs = TypeOf<typeof serviceRecordFormSchema>;

const serviceRecordFormSchema = object({
  OdometerReading: number({
    required_error: "Please enter your Odometer Reading",
  }),
  DateOfService: string({
    required_error: "Please enter the date of service",
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
  ServiceRepairDetails: string({
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
  NextServiceDate: string({
    required_error: "Please enter the next service date",
  }),
  RecommendedServices: string({
    required_error: "Please enter recommended services",
  }),
});

const ServiceRecordForm = () => {
  return (
    <Formik<ServiceRecordFormInputs>
      initialValues={{
        OdometerReading: 0,
        DateOfService: "",
        ServiceType: "",
        DescriptionOfIssue: "",
        Diagnosis: "",
        ServiceRepairDetails: "",
        PartsUsed: "",
        ServiceCost: 0,
        WarrantyInfo: "",
        NextServiceDate: "",
        RecommendedServices: "",
      }}
      onSubmit={(values) => {
        alert("Form is submitted");
        console.log("Form is submitted", values);
      }}
      validationSchema={toFormikValidationSchema(serviceRecordFormSchema)}
    >
      {(formikProps) => {
        const errors = formikProps.errors;
        return (
          <div className="card shadow">
            <Form className="card-body">
              <div className="card-title h4 font-weight-bold">Service Record</div>

              <div className="row">
                {/* Odometer Reading */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Odometer Reading</span>
                  </label>
                  <Field
                    type="number"
                    name="OdometerReading"
                    className="form-control"
                  />
                  {errors.OdometerReading && (
                    <div className="form-text text-danger">
                      {errors.OdometerReading}
                    </div>
                  )}
                </div>

                {/* Date of Service */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Date of Service</span>
                  </label>
                  <Field
                    type="date"
                    name="DateOfService"
                    className="form-control"
                  />
                  {errors.DateOfService && (
                    <div className="form-text text-danger">
                      {errors.DateOfService}
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                {/* Service Type */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Service Type</span>
                  </label>
                  <Field
                    type="text"
                    name="ServiceType"
                    className="form-control"
                    placeholder="e.g., Oil Change"
                  />
                  {errors.ServiceType && (
                    <div className="form-text text-danger">
                      {errors.ServiceType}
                    </div>
                  )}
                </div>

                {/* Service Cost */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Service Cost</span>
                  </label>
                  <Field
                    type="number"
                    name="ServiceCost"
                    className="form-control"
                    placeholder="e.g., 150"
                  />
                  {errors.ServiceCost && (
                    <div className="form-text text-danger">
                      {errors.ServiceCost}
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                {/* Description of Issue */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Description of Issue</span>
                  </label>
                  <Field
                    as="textarea"
                    name="DescriptionOfIssue"
                    className="form-control"
                    placeholder="e.g., Engine not starting"
                  />
                  {errors.DescriptionOfIssue && (
                    <div className="form-text text-danger">
                      {errors.DescriptionOfIssue}
                    </div>
                  )}
                </div>

                {/* Diagnosis */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Diagnosis</span>
                  </label>
                  <Field
                    as="textarea"
                    name="Diagnosis"
                    className="form-control"
                    placeholder="e.g., Faulty starter motor"
                  />
                  {errors.Diagnosis && (
                    <div className="form-text text-danger">
                      {errors.Diagnosis}
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                {/* Service/Repair Details */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Service / Repair Details</span>
                  </label>
                  <Field
                    as="textarea"
                    name="ServiceRepairDetails"
                    className="form-control"
                    placeholder="e.g., Replaced starter motor"
                  />
                  {errors.ServiceRepairDetails && (
                    <div className="form-text text-danger">
                      {errors.ServiceRepairDetails}
                    </div>
                  )}
                </div>

                {/* Parts Used */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Parts Used</span>
                  </label>
                  <Field
                    as="textarea"
                    name="PartsUsed"
                    className="form-control"
                    placeholder="e.g., Starter Motor"
                  />
                  {errors.PartsUsed && (
                    <div className="form-text text-danger">
                      {errors.PartsUsed}
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                {/* Warranty Info */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Warranty Information</span>
                  </label>
                  <Field
                    type="text"
                    name="WarrantyInfo"
                    className="form-control"
                    placeholder="e.g., 1-year warranty"
                  />
                  {errors.WarrantyInfo && (
                    <div className="form-text text-danger">
                      {errors.WarrantyInfo}
                    </div>
                  )}
                </div>

                {/* Next Service Date */}
                <div className="form-group col-md-6">
                  <label className="form-label">
                    <span className="label-text">Next Service Date</span>
                  </label>
                  <Field
                    type="date"
                    name="NextServiceDate"
                    className="form-control"
                  />
                  {errors.NextServiceDate && (
                    <div className="form-text text-danger">
                      {errors.NextServiceDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Recommended Services */}
              <div className="form-group">
                <label className="form-label">
                  <span className="label-text">Recommended Services</span>
                </label>
                <Field
                  as="textarea"
                  name="RecommendedServices"
                  className="form-control"
                  placeholder="e.g., Air filter replacement"
                />
                {errors.RecommendedServices && (
                  <div className="form-text text-danger">
                    {errors.RecommendedServices}
                  </div>
                )}
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

export default ServiceRecordForm;
