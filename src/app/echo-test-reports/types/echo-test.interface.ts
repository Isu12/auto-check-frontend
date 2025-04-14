import { VehicleInterface } from "@/app/dashboard/types/vehicle.interface";

export interface EchoTestInterface {
  _id?: string;
  TestID?: number;
  IssuedDate?: Date;
  ExpiryDate?: Date;
  TestingCenterName?: string;
  TestingCenterBranch?: string;
  CertificateFileURL?: string;
  CreatedAt?: string;
  vehicle?: VehicleInterface; 
}