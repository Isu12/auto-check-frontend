import { Types } from "mongoose";

export interface VehicleInterface {
  _id: string;
  Registration_no: string;
  Chasisis_No: string;
  Current_Owner: string;
  Address: string;
  NIC: string;
  Conditions_Special_note: string;
  Absolute_Owner: string;
  Engine_No?: string;
  Cylinder_Capacity?: string;
  Class_of_Vehicle: string;
  Taxation_Class: string;
  Status_When_Registered?: string;
  Fuel_Type?: string;
  Make?: string;
  Country_of_Origin?: string;
  Model?: string;
  Manufactures_Description?: string;
  Wheel_Base?: string;
  Type_of_Body?: string;
  Year_of_Manufacture?: string;
  Colour?: string;
  Previous_Owners?: string;
  Seating_capacity?: string;
  Weight?: string;
  Length?: string;
  Width?: string;
  Height?: string;
  Provincial_Council?: string;
  Date_of_First_Registration?: string;
  Taxes_Payable?: string;
  Front_Photo?: string;
  Left_Photo?: string;
  Right_Photo?: string;
  Rear_Photo?: string;

  // Relationships
  echoTests?: Types.ObjectId[];
  insuranceClaims?: Types.ObjectId[]; 
  serviceRecords?: Types.ObjectId[]; 
}
