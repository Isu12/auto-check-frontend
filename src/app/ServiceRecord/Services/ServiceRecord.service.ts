import axios from "axios";
import { ServiceRecordInterface } from "../../ServiceRecord/types/ServiceRecord.Interface";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/service-record/`;

export const fetchServiceRecords = async (): Promise<ServiceRecordInterface[]> => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to fetch service records.");
  }
};

export const fetchServiceRecordById = async (id: string): Promise<ServiceRecordInterface> => {
  try {
    const response = await axios.get(`${BASE_URL}${id}`);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to fetch service record by ID.");
  }
};

export const createServiceRecord = async (record: ServiceRecordInterface): Promise<ServiceRecordInterface> => {
  try {
    const response = await axios.post(BASE_URL, record); // Accepts the full record object
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to create service record.");
  }
};

export const updateServiceRecord = async (record: ServiceRecordInterface) => {
  try {
    const response = await axios.put(`${BASE_URL}${record._id}`, record);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to update service record.");
  }
};



export const deleteServiceRecord = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}${id}`);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to delete service record.");
  }
};

