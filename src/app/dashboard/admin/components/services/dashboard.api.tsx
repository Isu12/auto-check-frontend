// src/services/analytics.service.ts
import axios from "axios";

const BASE_URL_VEHICLE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicle-record/get/analytics`;
const BASE_URL_USERE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analytics/`;


export const fetchMonthlyVehicleRegistrations = async (): Promise<{
  class: string;
  month: string;
  count: number;
}[]> => {
  try {
    const response = await axios.get(`${BASE_URL_VEHICLE}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch monthly vehicle registrations.");
  }
};

export const fetchMonthlyUserRegistrations = async (): Promise<{
  month: string;
  userType: string;
  count: number;
}[]> => {
  try {
    const response = await axios.get(`${BASE_URL_USERE}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch monthly user registrations.");
  }
};