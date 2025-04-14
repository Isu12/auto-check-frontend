import axios from "axios";
import { ModificationRequestInterface } from "../Types/ModificationRequest.Interface"; // Adjust path as needed

// Ensure this environment variable points to your backend URL
// const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/modification-request/`;

const BASE_URL = 'http://localhost:5555/api/modification-request/'


/**
 * Fetches all modification requests.
 */
export const fetchModificationRequest = async (accessToken: string): Promise<ModificationRequestInterface[]> => {
  try {
    console.log("ENV:", process.env.NEXT_PUBLIC_BACKEND_URL);
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch modification requests.");
  }
};

/**
 * Fetches a single modification request by its ID.
 * @param id - The ID of the modification request to fetch.
 */
export const fetchModificationRequestById = async (id: string, accessToken:string): Promise<ModificationRequestInterface> => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch modification request by ID.");
  }
};

export const createModificationRequest = async (record: ModificationRequestInterface, accessToken:string): Promise<ModificationRequestInterface> => {
    try {
      const response = await axios.post(BASE_URL, record, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }); // Accepts the full record object
      return response.data;
    } catch (error) {
      throw new Error("Failed to create modification request.");
    }
  };

export const updateModificationRequest = async (record: ModificationRequestInterface, updatedValues: { VehicleId: string; OwnerId: string; ModificationType: string; Description: string; ProposedChanges: string; }, accessToken:string) => {
    try {
      const response = await axios.put(`${BASE_URL}/${record._id}`, record, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to update modification request.");
    }
  };

// /**
//  * Updates an existing modification request.
//  * This function does NOT update the 'images' field.
//  * @param id - The ID of the modification request to update.
//  * @param updatedData - An object containing the fields to update, excluding 'images'.
//  */
// export const updateModificationRequest = async (
//     id: string,
//     // Use Omit to exclude 'images' and database-generated fields from the update payload type
//     updatedData: Omit<Partial<ModificationRequestInterface>, '_id' | 'createdAt' | 'updatedAt' | 'images'>
// ): Promise<ModificationRequestInterface> => {
//   try {
//     // Images are explicitly not updated here.
//     const response = await axios.put(`${BASE_URL}${id}`, updatedData, {
//         headers: {
//             'Content-Type': 'application/json',
//         }
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating modification request with ID ${id}:`, error);
//     throw new Error("Failed to update modification request.");
//   }
// };

// ... (other functions remain the same) ...

/**
 * Deletes a modification request by its ID.
 * @param id - The ID of the modification request to delete.
 */
export const deleteModificationRequest = async (id: string, accessToken:string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    throw new Error("Failed to delete modification request.");
  }
};
