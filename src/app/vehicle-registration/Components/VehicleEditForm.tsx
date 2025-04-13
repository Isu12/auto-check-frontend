import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { Formik, Field, Form, FormikProps } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { object, string } from "zod";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface FormValues {
  Registration_no: string;
  Chasisis_No: string;
  Current_Owner: string;
  Address: string;
  NIC: string;
  Conditions_Special_note: string;
  Absolute_Owner: string;
  Engine_No: string;
  Cylinder_Capacity: string;
  Class_of_Vehicle: string;
  Taxation_Class: string;
  Status_When_Registered: string;
  Fuel_Type: string;
  Make: string;
  Country_of_Origin: string;
  Model: string;
  Manufactures_Description: string;
  Wheel_Base: string;
  Type_of_Body: string;
  Year_of_Manufacture: string;
  Colour: string;
  Previous_Owners: string;
  Seating_capacity: string;
  Weight: string;
  Length: string;
  Width: string;
  Height: string;
  Provincial_Council: string;
  Date_of_First_Registration: string;
  Taxes_Payable: string;
  Front_Photo: string;
  Left_Photo: string;
  Right_Photo: string;
  Rear_Photo: string;
}

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
});

interface VehicleEditFormProps {
  vehicleId: string;
  initialValues: FormValues;
  onSuccess: () => void;
  show: boolean;
  onHide: () => void;
}

const VehicleEditForm: React.FC<VehicleEditFormProps> = ({
  vehicleId,
  initialValues,
  onSuccess,
  show,
  onHide,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (vehicleId && show) {
      setLoading(false);
    }
  }, [vehicleId, show]);

  const handleSubmit = async (values: FormValues) => {
    try {
      await axios.put(`http://localhost:5555/api/vehicle-record/${vehicleId}`, values);
      toast.success("Vehicle updated successfully!");
      onSuccess();
      onHide();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(`Error: ${error.response?.data?.message || error.message}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  if (loading) {
    return (
      <Modal show={show} onHide={onHide} size="xl" scrollable centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Edit Vehicle</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading vehicle data...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" scrollable centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Edit Vehicle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={toFormikValidationSchema(vehicleFormSchema)}
          enableReinitialize
        >
          {(formikProps: FormikProps<FormValues>) => {
            const { errors, touched, isSubmitting } = formikProps;
            return (
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
                        className={`form-control ${errors.Registration_no && touched.Registration_no ? 'is-invalid' : ''}`}
                      />
                      {errors.Registration_no && touched.Registration_no && (
                        <div className="invalid-feedback">{errors.Registration_no}</div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Chassis No*</label>
                      <Field
                        type="text"
                        name="Chasisis_No"
                        className={`form-control ${errors.Chasisis_No && touched.Chasisis_No ? 'is-invalid' : ''}`}
                      />
                      {errors.Chasisis_No && touched.Chasisis_No && (
                        <div className="invalid-feedback">{errors.Chasisis_No}</div>
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
                      <label className="form-label">Cylinder Capacity</label>
                      <Field
                        type="text"
                        name="Cylinder_Capacity"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Class of Vehicle*</label>
                      <Field
                        type="text"
                        name="Class_of_Vehicle"
                        className={`form-control ${errors.Class_of_Vehicle && touched.Class_of_Vehicle ? 'is-invalid' : ''}`}
                      />
                      {errors.Class_of_Vehicle && touched.Class_of_Vehicle && (
                        <div className="invalid-feedback">{errors.Class_of_Vehicle}</div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Taxation Class*</label>
                      <Field
                        type="text"
                        name="Taxation_Class"
                        className={`form-control ${errors.Taxation_Class && touched.Taxation_Class ? 'is-invalid' : ''}`}
                      />
                      {errors.Taxation_Class && touched.Taxation_Class && (
                        <div className="invalid-feedback">{errors.Taxation_Class}</div>
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
                      <label className="form-label">Fuel Type</label>
                      <Field
                        type="text"
                        name="Fuel_Type"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Make</label>
                      <Field
                        type="text"
                        name="Make"
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
                  </div>

                  {/* Section 2: Owner Information */}
                  <div className="col-md-6">
                    <h5 className="mb-3 text-dark">Owner Information</h5>
                    
                    <div className="form-group mb-3">
                      <label className="form-label">Current Owner*</label>
                      <Field
                        type="text"
                        name="Current_Owner"
                        className={`form-control ${errors.Current_Owner && touched.Current_Owner ? 'is-invalid' : ''}`}
                      />
                      {errors.Current_Owner && touched.Current_Owner && (
                        <div className="invalid-feedback">{errors.Current_Owner}</div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Address*</label>
                      <Field
                        type="text"
                        name="Address"
                        className={`form-control ${errors.Address && touched.Address ? 'is-invalid' : ''}`}
                      />
                      {errors.Address && touched.Address && (
                        <div className="invalid-feedback">{errors.Address}</div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">NIC*</label>
                      <Field
                        type="text"
                        name="NIC"
                        className={`form-control ${errors.NIC && touched.NIC ? 'is-invalid' : ''}`}
                      />
                      {errors.NIC && touched.NIC && (
                        <div className="invalid-feedback">{errors.NIC}</div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Conditions/Special Note*</label>
                      <Field
                        type="text"
                        name="Conditions_Special_note"
                        className={`form-control ${errors.Conditions_Special_note && touched.Conditions_Special_note ? 'is-invalid' : ''}`}
                      />
                      {errors.Conditions_Special_note && touched.Conditions_Special_note && (
                        <div className="invalid-feedback">{errors.Conditions_Special_note}</div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Absolute Owner*</label>
                      <Field
                        type="text"
                        name="Absolute_Owner"
                        className={`form-control ${errors.Absolute_Owner && touched.Absolute_Owner ? 'is-invalid' : ''}`}
                      />
                      {errors.Absolute_Owner && touched.Absolute_Owner && (
                        <div className="invalid-feedback">{errors.Absolute_Owner}</div>
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

                {/* Section 3: Vehicle Details */}
                <div className="row mt-4">
                  <div className="col-md-6">
                    <h5 className="mb-3 text-dark">Vehicle Details</h5>
                    
                    <div className="form-group mb-3">
                      <label className="form-label">Model</label>
                      <Field
                        type="text"
                        name="Model"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Manufacturer's Description</label>
                      <Field
                        type="text"
                        name="Manufactures_Description"
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
                  </div>

                  <div className="col-md-6">
                    <h5 className="mb-3 text-dark">Dimensions & Specifications</h5>
                    
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
                      <label className="form-label">Date of First Registration</label>
                      <Field
                        type="text"
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

                <div className="d-flex justify-content-end mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={onHide}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default VehicleEditForm;