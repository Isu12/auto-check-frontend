export interface Branch {
  _id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  contactDetails: string;
  servicesOffered: string[];
}

export interface Business {
  name: string;
  type: string;
  registrationNumber: string;
  contactDetails: string;
  website: string;
  branches: Branch[];
}

export interface UserDetails {
  _id: string;
  name: string;
  email: string;
  role: string;
  business?: Business; // Add business property to store business details
}
