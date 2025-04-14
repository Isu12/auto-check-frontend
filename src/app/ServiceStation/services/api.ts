import axios from "axios";
import { UserDetails } from "../../auth/types/user/user-details.interface";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/`;

export const fetchUser = async (): Promise<UserDetails[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/all/user`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch User records.");
  }
};

export const fetchUserById = async (id: string, accessToken: string): Promise<UserDetails> => {
  try {
    const response = await axios.get(`${BASE_URL}${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch service User by ID.");
  }
};


export const updateUserDetails = async (
  id: string,
  user: Partial<UserDetails>,
  token: string
) => {
  if (!id) {
    throw new Error("User ID is required");
  }
  
  const response = await axios.put(`${BASE_URL}user/${id}`, user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};



export const deleteUser = async (id: string, accessToken: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}delete-account/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    throw new Error("Failed to delete User record.");
  }
};

