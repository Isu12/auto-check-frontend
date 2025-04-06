import axios from "axios";
import { InsuranceClaimInterface } from "../types/insurance-claim.interface";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/insurance-claim/`;

export const fetchInsuranceClaimRecords = async (): Promise<InsuranceClaimInterface[]> => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch insurance claim records.");
  }
};

export const fetchInsuranceClaimRecordById = async (id: string): Promise<InsuranceClaimInterface> => {
  try {
    const response = await axios.get(`${BASE_URL}${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch insurance claim record by ID.");
  }
};

export const createInsuranceClaimRecord = async (record: InsuranceClaimInterface): Promise<InsuranceClaimInterface> => {
  try {
    const response = await axios.post(BASE_URL, record); 
    return response.data;
  } catch (error) {
    throw new Error("Failed to create insurance claim record.");
  }
};

export const updateInsuranceClaimRecord = async (record: InsuranceClaimInterface, updatedValues: {}) => {
  try {
    const response = await axios.put(`${BASE_URL}${record._id}`, record);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update insurance claim record.");
  }
};



export const deleteInsuranceClaimRecord = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}${id}`);
  } catch (error) {
    throw new Error("Failed to delete insurance claim record.");
  }
};

