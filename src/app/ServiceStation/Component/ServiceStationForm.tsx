"use client";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { object, string, array } from "zod";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthToken } from "@/app/auth/hooks/accessHook";
import { Button } from "@/components/ui/button";
import { UserDetails } from "@/app/auth/types/user/user-details.interface";
import { updateUserDetails } from "../services/api";

interface UserFormProps {
  user: UserDetails;
}

const branchSchema = object({
  name: string().min(1, { message: "Branch name is required" }),
  address: string().min(1, { message: "Address is required" }),
  city: string().min(1, { message: "City is required" }),
  postalCode: string().min(1, { message: "Postal code is required" }),
  contactDetails: string().min(1, { message: "Contact details are required" }),
});

const userFormSchema = object({
  name: string().min(1, { message: "Please enter your name" }),
  email: string().min(1, { message: "Please enter Email" }).email("Invalid email format"),
  business: object({
    contactDetails: string().min(1, { message: "Please enter Contact Details" }),
    name: string().min(1, { message: "Please enter Business Name" }),
    type: string().min(1, { message: "Please enter Business Type" }),
    registrationNumber: string().min(1, { message: "Please enter Registration Number" }),
    website: string().optional(),
    branches: array(branchSchema).optional(),
  }),
});



const BranchInput = ({
  index,
  remove,
}: {
  index: number;
  remove: (index: number) => void;
}) => (
  <div className="card mb-3">
    <div className="card-header d-flex justify-content-between align-items-center">
      <h6 className="mb-0">Branch #{index + 1}</h6>
      <button
        type="button"
        className="btn btn-danger btn-sm"
        onClick={() => remove(index)}
      >
        Remove
      </button>
    </div>
    <div className="card-body">
      <div className="form-group mb-3">
        <label className="form-label">Branch Name*</label>
        <Field type="text" name={`business.branches.${index}.name`} className="form-control" />
        <ErrorMessage name={`business.branches.${index}.name`} component="div" className="text-danger" />
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Address*</label>
        <Field type="text" name={`business.branches.${index}.address`} className="form-control" />
        <ErrorMessage name={`business.branches.${index}.address`} component="div" className="text-danger" />
      </div>
      <div className="form-group mb-3">
        <label className="form-label">City*</label>
        <Field type="text" name={`business.branches.${index}.city`} className="form-control" />
        <ErrorMessage name={`business.branches.${index}.city`} component="div" className="text-danger" />
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Postal Code*</label>
        <Field type="text" name={`business.branches.${index}.postalCode`} className="form-control" />
        <ErrorMessage name={`business.branches.${index}.postalCode`} component="div" className="text-danger" />
      </div>
      <div className="form-group">
        <label className="form-label">Contact Details*</label>
        <Field type="text" name={`business.branches.${index}.contactDetails`} className="form-control" />
        <ErrorMessage name={`business.branches.${index}.contactDetails`} component="div" className="text-danger" />
      </div>
    </div>
  </div>
);

const UserProfileForm = ({ user }: UserFormProps) => {
  const [showModal, setShowModal] = useState(false);
  const accessToken = useAuthToken();

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleSubmit = async (values: UserDetails) => {
    if (!accessToken || !user || !user._id) {
      toast.error("User information is incomplete");
      return;
    }

    try {
      const payload = {
        ...values,
        _id: user._id,
        updatedAt: new Date(),
      };

      const response = await updateUserDetails(user._id, payload, accessToken);
      toast.success("Profile updated successfully");
      handleClose();
    } catch (error: any) {
      console.error("Detailed error:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-end">
        <Button onClick={handleShow} variant="default">
          Edit Profile
        </Button>
      </div>

      <Modal show={showModal} onHide={handleClose} size="lg" scrollable>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              ...user,
              business: user.business || {
                name: "",
                type: "",
                registrationNumber: "",
                contactDetails: "",
                website: "",
                branches: [],
              },
            }}
            onSubmit={handleSubmit}
            validationSchema={toFormikValidationSchema(userFormSchema)}
            enableReinitialize
          >
            {({ values, errors, touched, isSubmitting }) => (
              <Form className="card-body">
                <h5>Personal Information</h5>
                <hr />
                <div className="row">
                  <div className="form-group col-md-6">
                    <label className="form-label">Full Name*</label>
                    <Field type="text" name="name" className="form-control" />
                    {errors.name && touched.name && (
                      <div className="text-danger">{errors.name}</div>
                    )}
                  </div>
                  <div className="form-group col-md-6">
                    <label className="form-label">Email*</label>
                    <Field type="email" name="email" className="form-control" disabled />
                    {errors.email && touched.email && (
                      <div className="text-danger">{errors.email}</div>
                    )}
                  </div>
                </div>

                <h5 className="mt-4">Business Information</h5>
                <hr />
                <div className="row">
                  <div className="form-group col-md-6">
                    <label className="form-label">Business Name*</label>
                    <Field type="text" name="business.name" className="form-control" />
                    <ErrorMessage name="business.name" component="div" className="text-danger" />
                  </div>
                  <div className="form-group col-md-6">
                    <label className="form-label">Business Type*</label>
                    <Field type="text" name="business.type" className="form-control" />
                    <ErrorMessage name="business.type" component="div" className="text-danger" />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="form-group col-md-6">
                    <label className="form-label">Business Registration Number*</label>
                    <Field type="text" name="business.registrationNumber" className="form-control" />
                    <ErrorMessage name="business.registrationNumber" component="div" className="text-danger" />
                  </div>
                  <div className="form-group col-md-6">
                    <label className="form-label">Contact Details*</label>
                    <Field type="text" name="business.contactDetails" className="form-control" />
                    <ErrorMessage name="business.contactDetails" component="div" className="text-danger" />
                  </div>
                </div>

                <div className="form-group mt-3">
                  <label className="form-label">Website</label>
                  <Field type="text" name="business.website" className="form-control" />
                </div>

                <div className="mt-4">
                  <h5>Branches</h5>
                  <FieldArray name="business.branches">
                    {({ push, remove }) => (
                      <div className="mt-3">
                        {values.business.branches?.map((_, index) => (
                          <BranchInput key={index} index={index} remove={remove} />
                        ))}
                        <button
                          type="button"
                          className="btn btn-primary btn-sm mt-3"
                          onClick={() =>
                            push({
                              name: "",
                              address: "",
                              city: "",
                              postalCode: "",
                              contactDetails: "",
                            })
                          }
                        >
                          Add Branch
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                <div className="d-flex justify-content-end mt-4 gap-2">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserProfileForm;
