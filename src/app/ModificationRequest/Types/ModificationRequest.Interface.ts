export interface ModificationRequestInterface {
    _id?:string;
    vehicleId: string;
    ownerId: string;
    modificationType: 'Engine' | 'Exterior' | 'Interior' | 'Suspension' | 'Performance' | 'Other';
    description: string;
    proposedChanges: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    images: string;
    
    // submissionDate: Date;
    // approvalDate: Date;
    // rejectionReason: string;
    // images: {
    //   url: string;
    //   filename: string;
    //   contentType: string;
    //   uploadDate: Date;
    // }[]
  }
  
  
  
  
    
  
    