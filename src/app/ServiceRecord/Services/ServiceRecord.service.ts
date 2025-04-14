import axios from "axios";
import { ServiceRecordInterface } from "../../ServiceRecord/types/ServiceRecord.Interface";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/service-record/`;


export const fetchServiceRecords = async (accessToken: string): Promise<ServiceRecordInterface[]> => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data || response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized - Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch service records");
    }
    throw new Error("Failed to fetch service records");
  }
};

export const fetchServiceRecordById = async (id: string, accessToken:string): Promise<ServiceRecordInterface> => {
  try {
    const response = await axios.get(`${BASE_URL}${id}`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch service record by ID.");
  }
};


export const createServiceRecord = async (
  record: ServiceRecordInterface,
  vehicleId: string,
  accessToken: string
): Promise<ServiceRecordInterface> => {
  try {
    // Validate vehicleId is not empty
    if (!vehicleId) {
      throw new Error("Vehicle ID is required");
    }

    const response = await axios.post(
      BASE_URL,
      { vehicleId, ...record },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to create service record");
    }
    throw new Error("Failed to create service record");
  }
};


export const updateServiceRecord = async (record: ServiceRecordInterface, updatedValues: { ServiceCost: number; }, accessToken:string) => {
  try {
    const response = await axios.put(`${BASE_URL}${record._id}`, record,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to update service record.");
  }
};



export const deleteServiceRecord = async (id: string, accessToken: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}${id}`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    throw new Error("Failed to delete service record.");
  }
};

