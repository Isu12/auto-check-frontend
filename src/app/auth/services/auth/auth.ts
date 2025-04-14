import axios from 'axios';
import { UserDetails } from '../../types/user/user-details.interface';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

export const authApi = {
  async login(email: string, password: string) {
    const { data } = await api.post('/api/auth/login', { email, password });

    if (!data.success) {
      throw new Error(data.message || 'Failed to sign in');
    }

    return data.data;
  },

  async getAllUsers(): Promise<UserDetails[]> {
    try {
      const { data }: { data: { data: any[] } } = await api.get('/api/auth/all/user');
  
      const users: UserDetails[] = data.data.map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        business: user.business
          ? {
              name: user.business.name || '',
              type: user.business.type || '',
              registrationNumber: user.business.registrationNumber || '',
              contactDetails: user.business.contactDetails || '',
              website: user.business.website || '',
              branches: Array.isArray(user.business.branches)
                ? user.business.branches.map((branch: any) => ({
                    name: branch.name,
                    address: branch.address,
                    city: branch.city,
                    postalCode: branch.postalCode,
                    contactDetails: branch.contactDetails,
                    servicesOffered: branch.servicesOffered,
                  }))
                : [],
            }
          : undefined,
      }));
  
      return users;
    } catch (error) {
      throw new Error("Failed to fetch users.");
    }
  },
  
  

  async register(businessData: any) {
    console.log(process.env.NEXT_PUBLIC_BACKEND_URL);

    const { data } = await api.post('/api/auth/register', businessData);

    return data;
  },

async getUserDetails(accessToken: string): Promise<UserDetails> {
    const { data } = await api.get('/api/auth/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    const { email, name, business } = data.data;
  
    const userDetails: UserDetails = {
      _id: data.data._id,
      name,
      email,
      role: data.data.role,
      business: {
        name: business.name,
        type: business.type,
        registrationNumber: business.registrationNumber,
        contactDetails: business.contactDetails,
        website: business.website,
        branches: business.branches.map((branch: any) => ({
          name: branch.name,
          address: branch.address,
          city: branch.city,
          postalCode: branch.postalCode,
          contactDetails: branch.contactDetails,
          servicesOffered: branch.servicesOffered,
        })),
      },
    };
  
    return userDetails;
  },
  

  async logout(accessToken: string): Promise<void> {
    await api.post('/api/auth/logout', null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  async deleteAccount(id:string, accessToken: string){

    try {
      await axios.delete(`/api/auth/delete-account/${id}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      throw new Error("Failed to delete service record.");
    }
  },


  async refreshToken(refreshToken: string) {
    const { data } = await api.post('/api/auth/refresh', { refreshToken });

    return data;
  },
};
