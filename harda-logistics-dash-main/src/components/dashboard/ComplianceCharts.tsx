import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { AlertTriangle, PieChart as PieChartIcon, TrendingUp, Route } from 'lucide-react';
import { useERPData } from '@/hooks/useERPData';

interface Vehicle {
  vehicleNo: string;
  owner: string;
  pucExpiry: string;
  insuranceExpiry: string;
  greenTaxExpiry: string;
}

interface Driver {
  driverName: string;
  licenseExpiryDate: string;
}

interface RouteItem {
  routeId: string;
  vehicleNo: string;
  driverName: string;
}

interface ERPData {
  vehicles: Vehicle[];
  drivers: Driver[];
  routes: RouteItem[];
}

interface ComplianceChartsProps {
  complianceData: ERPData;
}

const ComplianceCharts: React.FC<ComplianceChartsProps> = ({ complianceData }) => {
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const isExpiringSoon = (dateString: string) => {
    const expiryDate = new Date(dateString);
    return expiryDate <= thirtyDaysFromNow && expiryDate >= today;
  };

  const isExpired = (dateString: string) => {
    return new Date(dateString) < today;
  };

  const routeComplianceData = useMemo(() => {
    const routeStats: { [key: string]: { compliant: number; nonCompliant: number; total: number } } = {};

    complianceData.routes.forEach(route => {
      const vehicle = complianceData.vehicles.find(v => v.vehicleNo === route.vehicleNo);
      const driver = complianceData.drivers.find(d => d.driverName === route.driverName);

      if (!routeStats[route.routeId]) {
        routeStats[route.routeId] = { compliant: 0, nonCompliant: 0, total: 0 };
      }

      routeStats[route.routeId].total++;

      const vehicleCompliant = vehicle &&
        !isExpired(vehicle.pucExpiry) &&
        !isExpired(vehicle.insuranceExpiry) &&
        !isExpired(vehicle.greenTaxExpiry);

      const driverCompliant = driver && !isExpired(driver.licenseExpiryDate);

      if (vehicleCompliant && driverCompliant) {
        routeStats[route.routeId].compliant++;
      } else {
        routeStats[route.routeId].nonCompliant++;
      }
    });

    return Object.entries(routeStats).map(([routeId, stats]) => ({
      route: routeId,
      compliant: stats.compliant,
      nonCompliant: stats.nonCompliant,
      complianceRate: ((stats.compliant / stats.total) * 100).toFixed(1)
    }));
  }, [complianceData]);

  const expiryData = useMemo(() => {
    const categories = [
      {
        name: 'PUC Expired',
        value: complianceData.vehicles.filter(v => isExpired(v.pucExpiry)).length,
        color: '#EF4444'
      },
      {
        name: 'Insurance Expired',
        value: complianceData.vehicles.filter(v => isExpired(v.insuranceExpiry)).length,
        color: '#F59E0B'
      },
      {
        name: 'Green Tax Expired',
        value: complianceData.vehicles.filter(v => isExpired(v.greenTaxExpiry)).length,
        color: '#8B5CF6'
      },
      {
        name: 'License Expired',
        value: complianceData.drivers.filter(d => isExpired(d.licenseExpiryDate)).length,
        color: '#06B6D4'
      },
      {
        name: 'PUC Expiring Soon',
        value: complianceData.vehicles.filter(v => isExpiringSoon(v.pucExpiry)).length,
        color: '#FCD34D'
      },
      {
        name: 'Insurance Expiring Soon',
        value: complianceData.vehicles.filter(v => isExpiringSoon(v.insuranceExpiry)).length,
        color: '#FBBF24'
      }
    ].filter(item => item.value > 0);

    return categories;
  }, [complianceData]);

  const vehicleIssuesData = useMemo(() => {
    return complianceData.vehicles.map(vehicle => {
      const issues = [];
      if (isExpired(vehicle.pucExpiry)) issues.push('PUC Expired');
      if (isExpired(vehicle.insuranceExpiry)) issues.push('Insurance Expired');
      if (isExpired(vehicle.greenTaxExpiry)) issues.push('Green Tax Expired');
      if (isExpiringSoon(vehicle.pucExpiry) && !isExpired(vehicle.pucExpiry)) issues.push('PUC Expiring');
      if (isExpiringSoon(vehicle.insuranceExpiry) && !isExpired(vehicle.insuranceExpiry)) issues.push('Insurance Expiring');

      return {
        vehicleNo: vehicle.vehicleNo,
        owner: vehicle.owner,
        issueCount: issues.length,
        issues: issues.join(', '),
        priority: issues.some(i => i.includes('Expired')) ? 'High' : issues.length > 0 ? 'Medium' : 'Low'
      };
    }).filter(v => v.issueCount > 0).sort((a, b) => b.issueCount - a.issueCount).slice(0, 10);
  }, [complianceData]);

  const monthlyTrendData = [
    { month: 'Jan', expired: 28, compliant: 72 },
    { month: 'Feb', expired: 25, compliant: 75 },
    { month: 'Mar', expired: 22, compliant: 78 },
    { month: 'Apr', expired: 18, compliant: 82 },
    { month: 'May', expired: 15, compliant: 85 },
    { month: 'Jun', expired: 12, compliant: 88 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Route Compliance Status */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Route className="h-5 w-5 text-blue-600" />
            <span>Compliance Status by Route</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={routeComplianceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="route" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any, name: string) => [value, name === 'compliant' ? 'Compliant' : 'Non-Compliant']} />
              <Bar dataKey="compliant" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="nonCompliant" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Expiry Categories */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChartIcon className="h-5 w-5 text-red-600" />
            <span>Document Expiry Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expiryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expiryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Compliance Trend */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Monthly Compliance Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any, name: string) => [`${value}%`, name === 'compliant' ? 'Compliant' : 'Expired']} />
              <Area type="monotone" dataKey="compliant" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="expired" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Vehicles with Multiple Issues */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Vehicles with Multiple Issues</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {vehicleIssuesData.map((vehicle, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">{vehicle.vehicleNo}</div>
                  <div className="text-xs text-gray-500">{vehicle.owner}</div>
                  <div className="text-xs text-red-600 mt-1">{vehicle.issues}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-red-600">{vehicle.issueCount}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    vehicle.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {vehicle.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceCharts;
