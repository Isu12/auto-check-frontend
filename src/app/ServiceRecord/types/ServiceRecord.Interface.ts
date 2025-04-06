export interface ServiceRecordInterface {
  _id?: string;
  OdometerReading: number;
  DateOfService: Date;
  ServiceType: string;
  DescriptionOfIssue: string;
  Diagnosis: string;
  ServiceDetails: string;
  PartsUsed: string;
  ServiceCost: number;
  WarrantyInfo: string;
  NextServiceDate: Date;
  RecommendedServices: string;
  InvoiceImageURL?: string;
  CreatedAt?: string;
  
}