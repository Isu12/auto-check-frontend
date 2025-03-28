import axios from "axios";
import { EchoTestInterface } from "../types/echo-test.interface";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/echo-test/`;

export const fetchEchoTestRecords = async (): Promise<EchoTestInterface[]> => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch echo test records.");
  }
};

export const fetchEchoTestRecordById = async (id: string): Promise<EchoTestInterface> => {
  try {
    const response = await axios.get(`${BASE_URL}${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch echo test record by ID.");
  }
};

export const createEchoTestRecord = async (record: EchoTestInterface): Promise<EchoTestInterface> => {
  try {
    const response = await axios.post(BASE_URL, record); // Accepts the full record object
    return response.data;
  } catch (error) {
    throw new Error("Failed to create echo test record.");
  }
};

export const updateEchoTestRecord = async (record: EchoTestInterface, updatedValues: {}) => {
  try {
    const response = await axios.put(`${BASE_URL}${record._id}`, record);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update echo test record.");
  }
};



export const deleteEchoTestRecord = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}${id}`);
  } catch (error) {
    throw new Error("Failed to delete echo test record.");
  }
};

