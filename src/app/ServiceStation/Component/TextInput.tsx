import React from "react";
import { Field } from "formik";

interface TextInputProps {
  label: string;
  name: string;
  type?: string;
  error?: string;
}

const TextInput: React.FC<TextInputProps> = ({ label, name, type = "text", error }) => (
  <div className="form-group col-md-6">
    <label className="form-label">{label}</label>
    <Field type={type} name={name} className="form-control" />
    {error && <div className="text-danger">{error}</div>}
  </div>
);

export default TextInput;
