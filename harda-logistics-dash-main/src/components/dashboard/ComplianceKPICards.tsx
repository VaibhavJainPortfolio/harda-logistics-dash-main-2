import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Shield,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar
} from 'lucide-react';

// Define ERP data interfaces
interface Vehicle {
  vehicleNo: string;
  pucExpiry?: string;
  insuranceExpiry?: string;
  greenTaxExpiry?: string;
}

interface Driver {
  driverName: string;
  licenseExpiryDate?: string;
}

interface RouteData {
  routeId: string;
  status?: string;
}

export interface ERPData {
  openingBalances: any;
  accounts: any;
  bankDetails: any;
  gstDetails: any;
  vehicles: Vehicle[];
  drivers: Driver[];
  routes: RouteData[];
}

interface ComplianceKPICardsProps {
  complianceData: ERPData;
}

const ComplianceKPICards: React.FC<ComplianceKPICardsProps> = ({ complianceData }) => {
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const isExpiringSoon = (dateString?: string) => {
    if (!dateString) return false;
    const expiryDate = new Date(dateString);
    return expiryDate <= thirtyDaysFromNow && expiryDate >= today;
  };

  const isExpired = (dateString?: string) => {
    if (!dateString) return false;
    return new Date(dateString) < today;
  };

  // Compute KPIs
  const pucExpiringSoon = complianceData.vehicles.filter(v => isExpiringSoon(v.pucExpiry)).length;
  const pucExpired = complianceData.vehicles.filter(v => isExpired(v.pucExpiry)).length;

  const insuranceExpiringSoon = complianceData.vehicles.filter(v => isExpiringSoon(v.insuranceExpiry)).length;
  const insuranceExpired = complianceData.vehicles.filter(v => isExpired(v.insuranceExpiry)).length;

  const greenTaxExpiringSoon = complianceData.vehicles.filter(v => isExpiringSoon(v.greenTaxExpiry)).length;
  const greenTaxExpired = complianceData.vehicles.filter(v => isExpired(v.greenTaxExpiry)).length;

  const licenseExpiringSoon = complianceData.drivers.filter(d => isExpiringSoon(d.licenseExpiryDate)).length;
  const licenseExpired = complianceData.drivers.filter(d => isExpired(d.licenseExpiryDate)).length;

  const fullyCompliantVehicles = complianceData.vehicles.filter(v =>
    !isExpired(v.pucExpiry) && !isExpired(v.insuranceExpiry) && !isExpired(v.greenTaxExpiry)
  ).length;

  const compliancePercentage = (fullyCompliantVehicles / complianceData.vehicles.length) * 100;

  const delayedRoutes = complianceData.routes.filter(r => r.status === 'Delayed').length;
  const totalActiveRoutes = complianceData.routes.filter(r => r.status !== 'Completed').length;
  const delayedPercentage = totalActiveRoutes > 0 ? (delayedRoutes / totalActiveRoutes) * 100 : 0;

  const kpis = [
    {
      title: "PUC Expiry Alerts",
      value: (pucExpiringSoon + pucExpired).toString(),
      subtitle: `${pucExpired} expired, ${pucExpiringSoon} expiring soon`,
      icon: AlertTriangle,
      color: pucExpired > 0
        ? "bg-gradient-to-br from-red-500 to-red-600"
        : "bg-gradient-to-br from-orange-500 to-orange-600",
      change: pucExpired > 0 ? "Critical" : "Warning"
    },
    {
      title: "Insurance Alerts",
      value: (insuranceExpiringSoon + insuranceExpired).toString(),
      subtitle: `${insuranceExpired} expired, ${insuranceExpiringSoon} expiring soon`,
      icon: Shield,
      color: insuranceExpired > 0
        ? "bg-gradient-to-br from-red-500 to-red-600"
        : "bg-gradient-to-br from-orange-500 to-orange-600",
      change: insuranceExpired > 0 ? "Critical" : "Warning"
    },
    {
      title: "Green Tax Alerts",
      value: (greenTaxExpiringSoon + greenTaxExpired).toString(),
      subtitle: `${greenTaxExpired} expired, ${greenTaxExpiringSoon} expiring soon`,
      icon: Calendar,
      color: greenTaxExpired > 0
        ? "bg-gradient-to-br from-red-500 to-red-600"
        : "bg-gradient-to-br from-green-500 to-green-600",
      change: greenTaxExpired > 0 ? "Critical" : "Good"
    },
    {
      title: "License Expiry",
      value: (licenseExpiringSoon + licenseExpired).toString(),
      subtitle: `${licenseExpired} expired, ${licenseExpiringSoon} expiring soon`,
      icon: Clock,
      color: licenseExpired > 0
        ? "bg-gradient-to-br from-red-500 to-red-600"
        : "bg-gradient-to-br from-yellow-500 to-yellow-600",
      change: licenseExpired > 0 ? "Critical" : "Monitor"
    },
    {
      title: "Vehicle Compliance",
      value: `${compliancePercentage.toFixed(1)}%`,
      subtitle: `${fullyCompliantVehicles} of ${complianceData.vehicles.length} fully compliant`,
      icon: CheckCircle2,
      color: compliancePercentage >= 80
        ? "bg-gradient-to-br from-green-500 to-green-600"
        : "bg-gradient-to-br from-red-500 to-red-600",
      change: compliancePercentage >= 80 ? "Good" : "Poor"
    },
    {
      title: "Route Delays",
      value: `${delayedPercentage.toFixed(1)}%`,
      subtitle: `${delayedRoutes} of ${totalActiveRoutes} routes delayed`,
      icon: XCircle,
      color: delayedPercentage <= 20
        ? "bg-gradient-to-br from-green-500 to-green-600"
        : "bg-gradient-to-br from-red-500 to-red-600",
      change: delayedPercentage <= 20 ? "Good" : "High"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {kpis.map((kpi, index) => (
        <Card
          key={index}
          className="relative overflow-hidden bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {kpi.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {kpi.value}
                </p>
                <p className="text-xs text-gray-500">
                  {kpi.subtitle}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${kpi.color} text-white shadow-lg`}>
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Badge
                variant={
                  kpi.change === 'Critical' || kpi.change === 'Poor' || kpi.change === 'High'
                    ? 'destructive'
                    : kpi.change === 'Warning' || kpi.change === 'Monitor'
                    ? 'default'
                    : 'secondary'
                }
                className="text-xs"
              >
                {kpi.change}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ComplianceKPICards;
