export interface StationInfoInterface {
  _id?: string;
  user: string;
  name: string; // Business Name
  type: string; // Business Type
  registrationNumber: string; // Business Registration Number
  email: string;
  contactDetails: string;
  website: string;
  branches: BranchInterface[];
}

interface BranchInterface {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  contactDetails: string;
  servicesOffered?: string[]; // Optional for Service Centers
  createdAt?: Date; // Added during submission
}