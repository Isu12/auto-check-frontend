export interface InsuranceClaimInterface {
  _id?: string;
  InsuranceID?: string;
  ClaimDate?: Date;
  ClaimType?: string;
  ClaimAmountRequested?: number;
  ClaimAmountApproved?: number;
  DamageDescription?:string;
  DamageImageURL1?: string;
  DamageImageURL2?: string;
  DamageImageURL3?: string;
  DamageImageURL4?: string;
  DamageImageURL5?: string;
}