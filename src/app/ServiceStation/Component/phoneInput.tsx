import React from "react";
import { Field } from "formik";

interface PhoneInputProps {
  label: string;
  name: string;
  error?: string;
  countryCode: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ label, name, error, countryCode }) => (
  <div className="form-group col-md-6">
    <label className="form-label">{label}</label>
    <div className="d-flex">
      <select className="form-control" value={countryCode} disabled>
        <option value={countryCode}>({countryCode})</option>
      </select>
      <Field
        type="text"
        name={name}
        className="form-control ml-2"
        maxLength={10}
      />
    </div>
    {error && <div className="text-danger">{error}</div>}
  </div>
);

export default PhoneInput;
