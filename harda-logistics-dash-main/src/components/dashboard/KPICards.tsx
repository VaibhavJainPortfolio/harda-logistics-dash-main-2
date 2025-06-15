
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building, 
  IndianRupee, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { MockERPData, AccountMaster } from '@/data/mockERPData';

interface KPICardsProps {
  filteredData: AccountMaster[];
  allData: MockERPData;
}

const KPICards: React.FC<KPICardsProps> = ({ filteredData, allData }) => {
  const totalBalance = filteredData.reduce((sum, account) => {
    const balance = allData.openingBalances.find(b => b.acCode === account.acCode)?.opBalance || 0;
    return sum + balance;
  }, 0);

  const avgBalance = filteredData.length > 0 ? totalBalance / filteredData.length : 0;

  const accountsWithGST = filteredData.filter(account => 
    allData.gstDetails.some(gst => gst.acCode === account.acCode)
  ).length;

  const accountsWithoutPAN = filteredData.filter(account => !account.pan).length;

  const uniqueBranches = new Set(filteredData.map(account => account.branchId)).size;

  // Count total distinct accounts from AccountMaster table (unfiltered)
  const totalDistinctAccounts = new Set(allData.accounts.map(account => account.acCode)).size;

  const kpis = [
    {
      title: "Total Accounts",
      value: totalDistinctAccounts.toLocaleString(),
      subtitle: `${filteredData.length} shown with filters`,
      icon: Users,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      change: "+12%"
    },
    {
      title: "Active Branches",
      value: uniqueBranches.toString(),
      subtitle: "across regions",
      icon: Building,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      change: "+5%"
    },
    {
      title: "Total Balance",
      value: `₹${(totalBalance / 10000000).toFixed(1)}Cr`,
      subtitle: `Avg: ₹${(avgBalance / 100000).toFixed(1)}L`,
      icon: IndianRupee,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      change: "+8%"
    },
    {
      title: "GST Registered",
      value: accountsWithGST.toString(),
      subtitle: `${((accountsWithGST / filteredData.length) * 100).toFixed(1)}% coverage`,
      icon: CheckCircle,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      change: "+15%"
    },
    {
      title: "Missing PAN",
      value: accountsWithoutPAN.toString(),
      subtitle: "require attention",
      icon: AlertTriangle,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      change: "-3%"
    },
    {
      title: "Compliance Rate",
      value: `${(((filteredData.length - accountsWithoutPAN) / filteredData.length) * 100).toFixed(1)}%`,
      subtitle: "PAN compliance",
      icon: TrendingUp,
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      change: "+7%"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index} className="relative overflow-hidden bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
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
                variant={kpi.change.startsWith('+') ? 'default' : 'destructive'} 
                className="text-xs"
              >
                {kpi.change} from last month
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KPICards;
