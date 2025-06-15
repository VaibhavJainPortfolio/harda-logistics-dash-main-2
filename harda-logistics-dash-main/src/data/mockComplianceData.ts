
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

export interface MockComplianceData {
  vehicles: VehicleMaster[];
  drivers: DriverMaster[];
  routes: RouteAssignment[];
}

const generateMockComplianceData = (): MockComplianceData => {
  const today = new Date();
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  };

  const vehicles: VehicleMaster[] = [
    { vehicleNo: 'HR55AB1234', owner: 'Transport Corp Ltd', insuranceExpiry: addDays(today, 45), pucExpiry: addDays(today, -5), greenTaxExpiry: addDays(today, 120), routeId: 'RT001' },
    { vehicleNo: 'MP09CD5678', owner: 'Logistics Plus', insuranceExpiry: addDays(today, 15), pucExpiry: addDays(today, 25), greenTaxExpiry: addDays(today, 180), routeId: 'RT002' },
    { vehicleNo: 'RJ14EF9012', owner: 'Highway Express', insuranceExpiry: addDays(today, -10), pucExpiry: addDays(today, 60), greenTaxExpiry: addDays(today, 90), routeId: 'RT003' },
    { vehicleNo: 'UP32GH3456', owner: 'Swift Cargo', insuranceExpiry: addDays(today, 75), pucExpiry: addDays(today, 10), greenTaxExpiry: addDays(today, 200), routeId: 'RT001' },
    { vehicleNo: 'MH12IJ7890', owner: 'Metro Logistics', insuranceExpiry: addDays(today, 120), pucExpiry: addDays(today, -15), greenTaxExpiry: addDays(today, 150), routeId: 'RT004' },
    { vehicleNo: 'DL01KL2345', owner: 'Capital Transport', insuranceExpiry: addDays(today, 8), pucExpiry: addDays(today, 40), greenTaxExpiry: addDays(today, 95), routeId: 'RT002' },
    { vehicleNo: 'KA03MN6789', owner: 'South Express', insuranceExpiry: addDays(today, 180), pucExpiry: addDays(today, -20), greenTaxExpiry: addDays(today, 160), routeId: 'RT005' },
    { vehicleNo: 'TN33OP0123', owner: 'Tamil Transport', insuranceExpiry: addDays(today, 25), pucExpiry: addDays(today, 5), greenTaxExpiry: addDays(today, 110), routeId: 'RT003' },
    { vehicleNo: 'GJ07QR4567', owner: 'Gujarat Cargo', insuranceExpiry: addDays(today, 90), pucExpiry: addDays(today, 35), greenTaxExpiry: addDays(today, 140), routeId: 'RT004' },
    { vehicleNo: 'PB65ST8901', owner: 'Punjab Lines', insuranceExpiry: addDays(today, 6), pucExpiry: addDays(today, 18), greenTaxExpiry: addDays(today, 85), routeId: 'RT005' }
  ];

  const drivers: DriverMaster[] = [
    { driverName: 'Rajesh Kumar', licenseExpiryDate: addDays(today, 12), aadhaar: '1234-5678-9012', routeAssigned: 'RT001', contactNo: '+91-9876543210' },
    { driverName: 'Sunil Sharma', licenseExpiryDate: addDays(today, 90), aadhaar: '2345-6789-0123', routeAssigned: 'RT002', contactNo: '+91-9876543211' },
    { driverName: 'Mahesh Singh', licenseExpiryDate: addDays(today, 12), aadhaar: '3456-7890-1234', routeAssigned: 'RT003', contactNo: '+91-9876543212' },
    { driverName: 'Vijay Patel', licenseExpiryDate: addDays(today, 150), aadhaar: '4567-8901-2345', routeAssigned: 'RT004', contactNo: '+91-9876543213' },
    { driverName: 'Amit Verma', licenseExpiryDate: addDays(today, -5), aadhaar: '5678-9012-3456', routeAssigned: 'RT005', contactNo: '+91-9876543214' },
    { driverName: 'Ravi Gupta', licenseExpiryDate: addDays(today, 45), aadhaar: '6789-0123-4567', routeAssigned: 'RT001', contactNo: '+91-9876543215' },
    { driverName: 'Sanjay Yadav', licenseExpiryDate: addDays(today, 30), aadhaar: '7890-1234-5678', routeAssigned: 'RT002', contactNo: '+91-9876543216' },
    { driverName: 'Deepak Joshi', licenseExpiryDate: addDays(today, 75), aadhaar: '8901-2345-6789', routeAssigned: 'RT003', contactNo: '+91-9876543217' }
  ];

  const routes: RouteAssignment[] = [
    { routeId: 'RT001', vehicleNo: 'HR55AB1234', driverName: 'Rajesh Kumar', assignedDate: addDays(today, -2), eta: addDays(today, 1), completionTime: addDays(today, 1), status: 'Delayed' },
    { routeId: 'RT002', vehicleNo: 'MP09CD5678', driverName: 'Sunil Sharma', assignedDate: addDays(today, -1), eta: addDays(today, 2), status: 'On Time' },
    { routeId: 'RT003', vehicleNo: 'RJ14EF9012', driverName: 'Mahesh Singh', assignedDate: addDays(today, 0), eta: addDays(today, 3), status: 'Pending' },
    { routeId: 'RT004', vehicleNo: 'UP32GH3456', driverName: 'Vijay Patel', assignedDate: addDays(today, -3), eta: addDays(today, 0), completionTime: addDays(today, 1), status: 'Delayed' },
    { routeId: 'RT005', vehicleNo: 'MH12IJ7890', driverName: 'Amit Verma', assignedDate: addDays(today, -1), eta: addDays(today, 2), status: 'On Time' },
    { routeId: 'RT001', vehicleNo: 'UP32GH3456', driverName: 'Ravi Gupta', assignedDate: addDays(today, -4), eta: addDays(today, -1), completionTime: addDays(today, -1), status: 'Completed' },
    { routeId: 'RT002', vehicleNo: 'DL01KL2345', driverName: 'Sanjay Yadav', assignedDate: addDays(today, -2), eta: addDays(today, 1), status: 'Delayed' },
    { routeId: 'RT003', vehicleNo: 'TN33OP0123', driverName: 'Deepak Joshi', assignedDate: addDays(today, 0), eta: addDays(today, 4), status: 'Pending' }
  ];

  return { vehicles, drivers, routes };
};

export const mockComplianceData = generateMockComplianceData();
