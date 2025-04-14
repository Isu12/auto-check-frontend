import axios from "axios";
import { EchoTestInterface } from "../types/echo-test.interface";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/echo-test/`;

export const fetchEchoTestRecords = async (accessToken: string): Promise<EchoTestInterface[]> => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error("Unauthorized - Please login again");
    }
    throw new Error("Failed to fetch echo test records.");
  }
};

export const fetchEchoTestRecordById = async (id: string, accessToken: string): Promise<EchoTestInterface> => {
  try {
    const response = await axios.get(`${BASE_URL}${id}`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch echo test record by ID.");
  }
};

export const createEchoTestRecord = async (record: EchoTestInterface, vehicleId:string,  accessToken: string): Promise<EchoTestInterface> => {
  try {
    const response = await axios.post(BASE_URL,{vehicleId,...record}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }); // Accepts the full record object
    return response.data;
  } catch (error) {
    throw new Error("Failed to create echo test record.");
  }
};

// EchoTest.service.ts
export const updateEchoTestRecord = async (record: EchoTestInterface, updatedValues: any, token: string) => {
  const response = await fetch(`${BASE_URL}/${record._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // ✅ This is crucial
    },
    body: JSON.stringify(updatedValues),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update record');
  }

  return data;
};




export const deleteEchoTestRecord = async (id: string, accessToken: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}${id}`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    throw new Error("Failed to delete echo test record.");
  }
};

