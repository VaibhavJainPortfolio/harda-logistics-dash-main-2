export interface AccountMaster {
    acCode: string;
    name: string;
    shortName: string;
    pan: string | null;
    branchId: number;
  }
  
  export interface AcOpeningBalance {
    acCode: string;
    opBalance: number;
    branchId: number;
  }
  
  export interface AccountBankDetails {
    accountNo: string;
    bank: string;
    city: string;
    ifscCode: string;
  }
  
  export interface AccountGSTDetails {
    acCode: string;
    gstNo: string;
    stateName: string;
    stateId: number;
  }
  
  export interface AcSetup {
    branchId: number;
    sessionId: string;
    paidGrp: string;
  }

  export interface VehicleMaster {
    vehicleNo: string;
    owner: string;
    insuranceExpiry: string;
    pucExpiry: string;
    greenTaxExpiry: string;
    routeId?: string;
  }
  
  export interface DriverMaster {
    driverName: string;
    licenseExpiryDate: string;
    aadhaar: string;
    routeAssigned: string;
    contactNo: string;
  }
  
  export interface RouteAssignment {
    routeId: string;
    vehicleNo: string;
    driverName: string;
    assignedDate: string;
    eta: string;
    completionTime?: string;
    status: 'On Time' | 'Delayed' | 'Completed' | 'Pending';
  }
  
  export interface MockERPData {
    accounts: AccountMaster[];
    openingBalances: AcOpeningBalance[];
    bankDetails: AccountBankDetails[];
    gstDetails: AccountGSTDetails[];
    acSetup: AcSetup[];
    vehicles: VehicleMaster[];
    drivers: DriverMaster[];
    routes: RouteAssignment[];
  }
