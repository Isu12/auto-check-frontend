import axios from "axios";
import { InsuranceClaimInterface } from "../types/insurance-claim.interface";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/insurance-claim/`;

export const fetchInsuranceClaimRecords = async (accessToken: string): Promise<InsuranceClaimInterface[]> => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized - Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch insurance claims");
    }
    throw new Error("Failed to fetch insurance claims");
  }
};

export const fetchInsuranceClaimRecordById = async (id: string, accessToken: string): Promise<InsuranceClaimInterface> => {
  try {
    const response = await axios.get(`${BASE_URL}${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch insurance claim record by ID.");
  }
};



export const createInsuranceClaimRecord = async (
  record: InsuranceClaimInterface,
  vehicleId: string,
  accessToken: string
): Promise<InsuranceClaimInterface> => {
  try {
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
    throw new Error("Failed to create insurance claim record.");
  }
};




export const updateInsuranceClaimRecord = async (record: InsuranceClaimInterface, updatedValues: {}, accessToken: string) => {
  try {
    const response = await axios.put(`${BASE_URL}${record._id}`, record, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
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

