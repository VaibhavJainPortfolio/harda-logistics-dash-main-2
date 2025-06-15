
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  TrendingDown, 
  Route, 
  User, 
  Calendar,
  Bell
} from 'lucide-react';
import { MockComplianceData } from '@/data/mockComplianceData';

interface ComplianceInsightsProps {
  complianceData: MockComplianceData;
}

const ComplianceInsights: React.FC<ComplianceInsightsProps> = ({ complianceData }) => {
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const isExpiringSoon = (dateString: string) => {
    const expiryDate = new Date(dateString);
    return expiryDate <= thirtyDaysFromNow && expiryDate >= today;
  };

  const isExpired = (dateString: string) => {
    return new Date(dateString) < today;
  };

  const getDaysUntilExpiry = (dateString: string) => {
    const expiryDate = new Date(dateString);
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Generate insights
  const insights = [];

  // PUC expired vehicles
  const expiredPUCVehicles = complianceData.vehicles.filter(v => isExpired(v.pucExpiry));
  if (expiredPUCVehicles.length > 0) {
    insights.push({
      type: 'critical',
      icon: AlertTriangle,
      title: `⚠️ ${expiredPUCVehicles.length} vehicles have expired PUC certificates`,
      description: 'Stop assignments immediately and renew documents.',
      action: 'View Vehicles',
      vehicles: expiredPUCVehicles.map(v => v.vehicleNo).join(', ')
    });
  }

  // Driver license expiring soon
  const expiringSoonLicenses = complianceData.drivers.filter(d => isExpiringSoon(d.licenseExpiryDate));
  expiringSoonLicenses.forEach(driver => {
    const daysLeft = getDaysUntilExpiry(driver.licenseExpiryDate);
    insights.push({
      type: 'warning',
      icon: User,
      title: `📉 Driver ${driver.driverName}'s license expires in ${daysLeft} days`,
      description: 'Schedule renewal to avoid route disruptions.',
      action: 'Contact Driver',
      contact: driver.contactNo
    });
  });

  // Routes with repeated delays
  const routeDelays: { [key: string]: number } = {};
  complianceData.routes.forEach(route => {
    if (route.status === 'Delayed') {
      routeDelays[route.routeId] = (routeDelays[route.routeId] || 0) + 1;
    }
  });

  Object.entries(routeDelays).forEach(([routeId, delays]) => {
    if (delays >= 2) {
      insights.push({
        type: 'warning',
        icon: Route,
        title: `🛣️ Route ${routeId} has ${delays} repeated delays`,
        description: 'Investigate scheduling and optimize route planning.',
        action: 'Analyze Route'
      });
    }
  });

  // Insurance expiring vehicles
  const insuranceExpiring = complianceData.vehicles.filter(v => isExpiringSoon(v.insuranceExpiry));
  if (insuranceExpiring.length > 0) {
    insights.push({
      type: 'info',
      icon: Calendar,
      title: `📅 ${insuranceExpiring.length} vehicles need insurance renewal within 30 days`,
      description: 'Plan renewals to maintain compliance.',
      action: 'Schedule Renewals'
    });
  }

  // Monthly trend insight
  insights.push({
    type: 'positive',
    icon: TrendingDown,
    title: '📈 Monthly compliance improved by 12%',
    description: 'Fewer expired documents compared to last month.',
    action: 'View Trends'
  });

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-l-red-500 bg-red-50/50';
      case 'warning': return 'border-l-orange-500 bg-orange-50/50';
      case 'info': return 'border-l-blue-500 bg-blue-50/50';
      case 'positive': return 'border-l-green-500 bg-green-50/50';
      default: return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  const getInsightBadge = (type: string) => {
    switch (type) {
      case 'critical': return <Badge variant="destructive" className="text-xs">Critical</Badge>;
      case 'warning': return <Badge variant="default" className="text-xs bg-orange-100 text-orange-800">Warning</Badge>;
      case 'info': return <Badge variant="secondary" className="text-xs">Info</Badge>;
      case 'positive': return <Badge variant="default" className="text-xs bg-green-100 text-green-800">Good</Badge>;
      default: return <Badge variant="outline" className="text-xs">General</Badge>;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-blue-600" />
          <span>Smart Compliance Insights</span>
          <Badge variant="secondary" className="ml-2">{insights.length} insights</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg border-l-4 ${getInsightColor(insight.type)} transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="mt-1">
                  <insight.icon className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {insight.description}
                  </p>
                  {insight.vehicles && (
                    <p className="text-xs text-gray-500 mb-2">
                      Vehicles: {insight.vehicles}
                    </p>
                  )}
                  {insight.contact && (
                    <p className="text-xs text-gray-500 mb-2">
                      Contact: {insight.contact}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getInsightBadge(insight.type)}
                <Button variant="outline" size="sm" className="text-xs">
                  {insight.action}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ComplianceInsights;
