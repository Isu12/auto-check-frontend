// vehicleService.ts
import axios from "axios";


const API_BASE_URL = "http://localhost:5555/api/vehicle-record";

export interface FormValues {
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

// Cloudinary configuration
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dtu0zojzx/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

export const checkDuplicateRegistration = async (Registration_no: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5555/api/vehicle-record/check-duplicate/${Registration_no}`
    );
    return response.data.exists;
  } catch (error) {
    console.error("Error checking registration number:", error);
    throw error;
  }
};

export const uploadImageToCloudinary = async (file: File, onUploadProgress: (progressEvent: ProgressEvent) => void) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  
  const response = await axios.post(
    CLOUDINARY_URL,
    formData,
    {
      
    }
  );
  return response.data.secure_url;
};



  
export const fetchVehicleRecords = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch vehicle records');
    }
};

export const deleteVehicleRecord = async (id: string) => {
    try {
        await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        throw new Error('Failed to delete vehicle record');
    }
};

export const updateVehicleRecord = async (id: string, data: any) => {
    try {
        await axios.put(`${API_BASE_URL}/${id}`, data);
    } catch (error) {
        throw new Error('Failed to update vehicle record');
    }
};

export const createVehicleRecord = async (data: any) => {
    try {
        await axios.post(API_BASE_URL, data);
    } catch (error) {
        throw new Error('Failed to create vehicle record');
    }
};



export const fetchVehicleRecord = async (recordId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vehicle-record/${recordId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// You can add more vehicle-related API calls here as needed
// Example:
/*
export const updateVehicleRecord = async (recordId: string, data: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/vehicle-record/${recordId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
*/
// vehicleRegistrationAPI.ts

interface StatusUpdateData {
  [key: string]: boolean;
}

export const fetchIncompleteRegistrations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/incomplete`);
    return response.data;
  } catch (error) {
    console.error("Error fetching incomplete registrations:", error);
    throw error;
  }
};

export const updateRegistrationStatus = async (id: string, statusField: string) => {
  try {
    const updateData: StatusUpdateData = { [statusField]: true };
    await axios.patch(`${API_BASE_URL}/${id}/status`, updateData);
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};
// vehicleService.ts


// ... (keep all your existing interfaces)

export const fetchmVehicleRecord = async (recordId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${recordId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicle record:", error);
    throw error;
  }
};

