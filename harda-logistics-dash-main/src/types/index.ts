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
    status: string;
  }
  
  export interface ERPData {
    accounts: AccountMaster[];
    openingBalances: AcOpeningBalance[];
    bankDetails: AccountBankDetails[];
    gstDetails: AccountGSTDetails[];
    acSetup: AcSetup[];
    vehicles: VehicleMaster[];
    drivers: DriverMaster[];
    routes: RouteAssignment[];
  }

  // Generate realistic mock data
const states = [
  { name: 'Maharashtra', id: 27 },
  { name: 'Gujarat', id: 24 },
  { name: 'Karnataka', id: 29 },
  { name: 'Tamil Nadu', id: 33 },
  { name: 'Uttar Pradesh', id: 9 },
  { name: 'Delhi', id: 7 },
  { name: 'West Bengal', id: 19 },
  { name: 'Rajasthan', id: 8 },
  { name: 'Madhya Pradesh', id: 23 },
  { name: 'Haryana', id: 6 }
];

const banks = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'Kotak Mahindra Bank',
  'IndusInd Bank'
];

const companyTypes = ['Pvt Ltd', 'Ltd', 'LLP', 'Partnership', 'Proprietorship'];
const businessNames = [
  'Logistics Express', 'Cargo Solutions', 'Transport Hub', 'Supply Chain Pro',
  'Freight Forward', 'Delivery Plus', 'Speed Cargo', 'Metro Transport',
  'Global Logistics', 'Prime Freight', 'Swift Delivery', 'Ace Transport',
  'Fast Track Cargo', 'Elite Logistics', 'Blue Dart Express', 'Red Line Transport',
  'Green Logistics', 'Ocean Freight', 'Air Cargo Plus', 'Road King Transport'
];

// Generate accounts
const accounts: AccountMaster[] = [];
for (let i = 1; i <= 150; i++) {
  const businessName = businessNames[Math.floor(Math.random() * businessNames.length)];
  const companyType = companyTypes[Math.floor(Math.random() * companyTypes.length)];
  const hasPAN = Math.random() > 0.15; // 85% have PAN
  
  accounts.push({
    acCode: `AC${i.toString().padStart(4, '0')}`,
    name: `${businessName} ${companyType}`,
    shortName: businessName.split(' ').map(w => w[0]).join('') + companyType.replace(/[^A-Z]/g, ''),
    pan: hasPAN ? `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(1000 + Math.random() * 9000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}` : null,
    branchId: Math.floor(Math.random() * 5) + 1
  });
}

// Generate opening balances
const openingBalances: AcOpeningBalance[] = accounts.map(account => ({
  acCode: account.acCode,
  opBalance: Math.floor(Math.random() * 10000000) + 10000, // 10K to 10M
  branchId: account.branchId
}));

// Generate bank details (80% of accounts have bank details)
const bankDetails: AccountBankDetails[] = [];
accounts.slice(0, Math.floor(accounts.length * 0.8)).forEach(account => {
  const bank = banks[Math.floor(Math.random() * banks.length)];
  const cityIndex = Math.floor(Math.random() * states.length);
  
  bankDetails.push({
    accountNo: account.acCode,
    bank: bank,
    city: states[cityIndex].name,
    ifscCode: `${bank.replace(/[^A-Z]/g, '').substring(0, 4)}0${String(Math.floor(100000 + Math.random() * 900000))}`
  });
});

// Generate GST details (70% of accounts have GST)
const gstDetails: AccountGSTDetails[] = [];
accounts.slice(0, Math.floor(accounts.length * 0.7)).forEach(account => {
  const state = states[Math.floor(Math.random() * states.length)];
  
  gstDetails.push({
    acCode: account.acCode,
    gstNo: `${state.id}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(1000 + Math.random() * 9000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(1 + Math.random() * 9)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(1 + Math.random() * 9)}`,
    stateName: state.name,
    stateId: state.id
  });
});