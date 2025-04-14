import axios from "axios";
import { VehicleInterface } from "../types/vehicle.interface";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicle-record/`;

export const fetchAllVehicles = async (): Promise<VehicleInterface[]> => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch service records.");
  }
};

export const fetchVehicleById = async (id: string): Promise<VehicleInterface> => {
  try {
    const response = await axios.get(`${BASE_URL}${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch echo test record by ID.");
  }
};